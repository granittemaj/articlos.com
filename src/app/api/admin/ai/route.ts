import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import type OpenAI from 'openai'
import { prisma } from '@/lib/prisma'
import { getOpenAIClient, MODELS } from '@/lib/llm/client'
import { withRetry } from '@/lib/llm/retry'
import {
  shuffle,
  ALL_TOPIC_ANGLES,
  buildTopicsPrompt,
  buildKeywordsPrompt,
  buildSuggestPrompt,
  buildGeneratePrompt,
  buildRelinkPrompt,
} from '@/lib/llm/prompts'

async function logGeneration(params: {
  action: string
  model: string
  result: OpenAI.Chat.Completions.ChatCompletion | null
  latencyMs: number
  success: boolean
  error?: string
}) {
  try {
    const usage = params.result?.usage
    await prisma.aiGenerationLog.create({
      data: {
        action: params.action,
        model: params.model,
        promptTokens: usage?.prompt_tokens ?? null,
        outputTokens: usage?.completion_tokens ?? null,
        totalTokens: usage?.total_tokens ?? null,
        latencyMs: params.latencyMs,
        success: params.success,
        error: params.error ?? null,
      },
    })
  } catch { /* logging must never break the main flow */ }
}

async function runJson(
  client: OpenAI,
  model: string,
  prompt: string,
): Promise<{ completion: OpenAI.Chat.Completions.ChatCompletion; parsed: unknown }> {
  const completion = await client.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  })
  const text = completion.choices[0]?.message?.content ?? ''
  const parsed = JSON.parse(text)
  return { completion, parsed }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: {
    action: string
    niche?: string
    topic?: string
    keywords?: string
    selectedKeywords?: string[]
    context?: string
    content?: string
    title?: string
    topicStyle?: string
    writingStyle?: string
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { action, niche, topic, keywords, selectedKeywords, context, content, title, topicStyle, writingStyle } = body

  try {
    const client = getOpenAIClient()

    // ------------------------------------------------------------------ topics
    if (action === 'topics') {
      const angles = shuffle(ALL_TOPIC_ANGLES).slice(0, 8)
      const today = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      const isTechnical = topicStyle === 'technical'
      const keywordContext = selectedKeywords && selectedKeywords.length > 0
        ? `\nFOCUS KEYWORDS: The user has selected these specific keywords to target — every topic MUST be built around one of these keywords:\n${selectedKeywords.map(k => `- ${k}`).join('\n')}\nDistribute the 8 topics across these keywords as evenly as possible.`
        : ''

      const prompt = buildTopicsPrompt(niche, today, angles, isTechnical, keywordContext)
      const t0 = Date.now()
      let completion: OpenAI.Chat.Completions.ChatCompletion | null = null
      try {
        const res = await withRetry(() => runJson(client, MODELS.small, prompt))
        completion = res.completion
        await logGeneration({ action, model: MODELS.small, result: completion, latencyMs: Date.now() - t0, success: true })
        return NextResponse.json(res.parsed)
      } catch (err) {
        await logGeneration({ action, model: MODELS.small, result: completion, latencyMs: Date.now() - t0, success: false, error: String(err) })
        throw err
      }
    }

    // ---------------------------------------------------------------- keywords
    if (action === 'keywords') {
      const prompt = buildKeywordsPrompt(niche)
      const t0 = Date.now()
      let completion: OpenAI.Chat.Completions.ChatCompletion | null = null
      try {
        const res = await withRetry(() => runJson(client, MODELS.small, prompt))
        completion = res.completion
        await logGeneration({ action, model: MODELS.small, result: completion, latencyMs: Date.now() - t0, success: true })
        return NextResponse.json(res.parsed)
      } catch (err) {
        await logGeneration({ action, model: MODELS.small, result: completion, latencyMs: Date.now() - t0, success: false, error: String(err) })
        throw err
      }
    }

    // ----------------------------------------------------------------- suggest
    if (action === 'suggest') {
      const prompt = buildSuggestPrompt(niche, context)
      const t0 = Date.now()
      let completion: OpenAI.Chat.Completions.ChatCompletion | null = null
      try {
        const res = await withRetry(() => runJson(client, MODELS.small, prompt))
        completion = res.completion
        await logGeneration({ action, model: MODELS.small, result: completion, latencyMs: Date.now() - t0, success: true })
        return NextResponse.json(res.parsed)
      } catch (err) {
        await logGeneration({ action, model: MODELS.small, result: completion, latencyMs: Date.now() - t0, success: false, error: String(err) })
        throw err
      }
    }

    // ---------------------------------------------------------------- generate
    if (action === 'generate') {
      if (!topic) {
        return NextResponse.json({ error: 'topic is required' }, { status: 400 })
      }

      let publishedPosts: { title: string; slug: string }[] = []
      try {
        publishedPosts = await prisma.post.findMany({
          where: { published: true },
          take: 5,
          select: { title: true, slug: true },
          orderBy: { publishedAt: 'desc' },
        })
      } catch { /* DB unavailable — proceed without cross-links */ }

      const prompt = buildGeneratePrompt(topic, keywords, writingStyle, publishedPosts)

      const t0 = Date.now()
      let completion: OpenAI.Chat.Completions.ChatCompletion | null = null
      try {
        const res = await withRetry(() => runJson(client, MODELS.large, prompt))
        completion = res.completion
        await logGeneration({ action, model: MODELS.large, result: completion, latencyMs: Date.now() - t0, success: true })
        return NextResponse.json(res.parsed)
      } catch (err) {
        await logGeneration({ action, model: MODELS.large, result: completion, latencyMs: Date.now() - t0, success: false, error: String(err) })
        throw err
      }
    }

    // ------------------------------------------------------------------ relink
    if (action === 'relink') {
      if (!content) return NextResponse.json({ error: 'content is required' }, { status: 400 })

      let otherPosts: { title: string; slug: string }[] = []
      try {
        otherPosts = await prisma.post.findMany({
          where: { published: true, ...(title ? { title: { not: title } } : {}) },
          take: 20,
          select: { title: true, slug: true },
          orderBy: { publishedAt: 'desc' },
        })
      } catch { /* DB unavailable */ }

      const prompt = buildRelinkPrompt(title, content, otherPosts)
      const t0 = Date.now()
      let completion: OpenAI.Chat.Completions.ChatCompletion | null = null
      try {
        const res = await withRetry(() => runJson(client, MODELS.small, prompt))
        completion = res.completion
        await logGeneration({ action, model: MODELS.small, result: completion, latencyMs: Date.now() - t0, success: true })
        return NextResponse.json(res.parsed)
      } catch (err) {
        await logGeneration({ action, model: MODELS.small, result: completion, latencyMs: Date.now() - t0, success: false, error: String(err) })
        throw err
      }
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI request failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
