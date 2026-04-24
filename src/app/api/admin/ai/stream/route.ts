import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getOpenAIClient, MODELS } from '@/lib/llm/client'
import { withRetry } from '@/lib/llm/retry'
import { buildMetadataPrompt, buildContentPrompt } from '@/lib/llm/prompts'

// POST /api/admin/ai/stream
// Streams article generation as SSE events:
//   {type:'metadata', title, excerpt, metaTitle, metaDescription, tags}
//   {type:'chunk', html: string}
//   {type:'done', promptTokens?, outputTokens?}
//   {type:'error', message: string}
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  let body: { topic?: string; keywords?: string; writingStyle?: string }
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 })
  }

  const { topic, keywords, writingStyle } = body
  if (!topic) {
    return new Response(JSON.stringify({ error: 'topic is required' }), { status: 400 })
  }

  const encoder = new TextEncoder()
  function encode(data: object) {
    return encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
  }

  const stream = new ReadableStream({
    async start(controller) {
      const client = getOpenAIClient()

      // ── Phase 1: Metadata (gpt-4o-mini JSON, ~1-2s) ─────────────────────
      let metadata: { title: string; excerpt: string; metaTitle: string; metaDescription: string; tags: string }
      const t0 = Date.now()
      try {
        const metaResult = await withRetry(() =>
          client.chat.completions.create({
            model: MODELS.small,
            messages: [{ role: 'user', content: buildMetadataPrompt(topic, keywords, writingStyle) }],
            response_format: { type: 'json_object' },
          })
        )
        metadata = JSON.parse(metaResult.choices[0]?.message?.content ?? '')
        controller.enqueue(encode({ type: 'metadata', ...metadata }))

        prisma.aiGenerationLog.create({
          data: {
            action: 'generate:metadata',
            model: MODELS.small,
            promptTokens: metaResult.usage?.prompt_tokens ?? null,
            outputTokens: metaResult.usage?.completion_tokens ?? null,
            totalTokens: metaResult.usage?.total_tokens ?? null,
            latencyMs: Date.now() - t0,
            success: true,
          },
        }).catch(() => {})
      } catch (err) {
        controller.enqueue(encode({ type: 'error', message: 'Failed to generate metadata' }))
        controller.close()

        prisma.aiGenerationLog.create({
          data: {
            action: 'generate:metadata',
            model: MODELS.small,
            promptTokens: null,
            outputTokens: null,
            totalTokens: null,
            latencyMs: Date.now() - t0,
            success: false,
            error: String(err),
          },
        }).catch(() => {})
        return
      }

      // ── Phase 2: Content (gpt-4o streaming HTML) ────────────────────────
      let publishedPosts: { title: string; slug: string }[] = []
      try {
        publishedPosts = await prisma.post.findMany({
          where: { published: true },
          take: 5,
          select: { title: true, slug: true },
          orderBy: { publishedAt: 'desc' },
        })
      } catch { /* proceed without cross-links */ }

      const contentPrompt = buildContentPrompt(topic, metadata.title, keywords, writingStyle, publishedPosts)

      const t1 = Date.now()
      let promptTokens: number | null = null
      let outputTokens: number | null = null
      let contentError: unknown = null

      try {
        const contentStream = await withRetry(() =>
          client.chat.completions.create({
            model: MODELS.large,
            messages: [{ role: 'user', content: contentPrompt }],
            stream: true,
            stream_options: { include_usage: true },
          })
        )

        for await (const chunk of contentStream) {
          const text = chunk.choices[0]?.delta?.content
          if (text) {
            controller.enqueue(encode({ type: 'chunk', html: text }))
          }
          if (chunk.usage) {
            promptTokens = chunk.usage.prompt_tokens ?? null
            outputTokens = chunk.usage.completion_tokens ?? null
          }
        }

        controller.enqueue(encode({ type: 'done', promptTokens, outputTokens }))
      } catch (err) {
        contentError = err
        controller.enqueue(encode({ type: 'error', message: 'Failed to generate content' }))
      } finally {
        prisma.aiGenerationLog.create({
          data: {
            action: 'generate:content',
            model: MODELS.large,
            promptTokens,
            outputTokens,
            totalTokens: promptTokens != null && outputTokens != null ? promptTokens + outputTokens : null,
            latencyMs: Date.now() - t1,
            success: contentError === null,
            error: contentError != null ? String(contentError) : null,
          },
        }).catch(() => {})

        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
