import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SchemaType } from '@google/generative-ai'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getGeminiClient, MODELS } from '@/lib/llm/client'
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
      const genAI = getGeminiClient()

      // ── Phase 1: Metadata (Flash Lite, fast JSON, ~1-2s) ─────────────────
      const metadataModel = genAI.getGenerativeModel({
        model: MODELS.flashLite,
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              title: { type: SchemaType.STRING },
              excerpt: { type: SchemaType.STRING },
              metaTitle: { type: SchemaType.STRING },
              metaDescription: { type: SchemaType.STRING },
              tags: { type: SchemaType.STRING },
            },
            required: ['title', 'excerpt', 'metaTitle', 'metaDescription', 'tags'],
          },
        },
      })

      let metadata: { title: string; excerpt: string; metaTitle: string; metaDescription: string; tags: string }
      const t0 = Date.now()
      try {
        const metaResult = await withRetry(() =>
          metadataModel.generateContent(buildMetadataPrompt(topic, keywords, writingStyle))
        )
        metadata = JSON.parse(metaResult.response.text())
        controller.enqueue(encode({ type: 'metadata', ...metadata }))

        // Log metadata call
        prisma.aiGenerationLog.create({
          data: {
            action: 'generate:metadata',
            model: MODELS.flashLite,
            promptTokens: metaResult.response.usageMetadata?.promptTokenCount ?? null,
            outputTokens: metaResult.response.usageMetadata?.candidatesTokenCount ?? null,
            totalTokens: metaResult.response.usageMetadata?.totalTokenCount ?? null,
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
            model: MODELS.flashLite,
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

      // ── Phase 2: Content (Flash, streaming HTML, ~8-12s) ─────────────────
      // Fetch published posts for cross-linking
      let publishedPosts: { title: string; slug: string }[] = []
      try {
        publishedPosts = await prisma.post.findMany({
          where: { published: true },
          take: 5,
          select: { title: true, slug: true },
          orderBy: { publishedAt: 'desc' },
        })
      } catch { /* proceed without cross-links */ }

      const contentModel = genAI.getGenerativeModel({ model: MODELS.flash })
      const contentPrompt = buildContentPrompt(topic, metadata.title, keywords, writingStyle, publishedPosts)

      const t1 = Date.now()
      let promptTokens: number | null = null
      let outputTokens: number | null = null
      let contentError: unknown = null

      try {
        const contentStream = await withRetry(() => contentModel.generateContentStream(contentPrompt))

        for await (const chunk of contentStream.stream) {
          const text = chunk.text()
          if (text) {
            controller.enqueue(encode({ type: 'chunk', html: text }))
          }
        }

        const response = await contentStream.response
        promptTokens = response.usageMetadata?.promptTokenCount ?? null
        outputTokens = response.usageMetadata?.candidatesTokenCount ?? null

        controller.enqueue(encode({ type: 'done', promptTokens, outputTokens }))
      } catch (err) {
        contentError = err
        controller.enqueue(encode({ type: 'error', message: 'Failed to generate content' }))
      } finally {
        prisma.aiGenerationLog.create({
          data: {
            action: 'generate:content',
            model: MODELS.flash,
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
