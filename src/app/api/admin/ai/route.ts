import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SchemaType } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getGeminiClient, MODELS } from '@/lib/llm/client'
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: any | null
  latencyMs: number
  success: boolean
  error?: string
}) {
  try {
    const usage = params.result?.response?.usageMetadata
    await prisma.aiGenerationLog.create({
      data: {
        action: params.action,
        model: params.model,
        promptTokens: usage?.promptTokenCount ?? null,
        outputTokens: usage?.candidatesTokenCount ?? null,
        totalTokens: usage?.totalTokenCount ?? null,
        latencyMs: params.latencyMs,
        success: params.success,
        error: params.error ?? null,
      },
    })
  } catch { /* logging must never break the main flow */ }
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
    const genAI = getGeminiClient()

    // ------------------------------------------------------------------ topics
    if (action === 'topics') {
      const angles = shuffle(ALL_TOPIC_ANGLES).slice(0, 8)
      const today = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      const isTechnical = topicStyle === 'technical'
      const keywordContext = selectedKeywords && selectedKeywords.length > 0
        ? `\nFOCUS KEYWORDS: The user has selected these specific keywords to target — every topic MUST be built around one of these keywords:\n${selectedKeywords.map(k => `- ${k}`).join('\n')}\nDistribute the 8 topics across these keywords as evenly as possible.`
        : ''

      const prompt = buildTopicsPrompt(niche, today, angles, isTechnical, keywordContext)
      const model = genAI.getGenerativeModel({ model: MODELS.flashLite })
      const t0 = Date.now()
      let result: Awaited<ReturnType<typeof model.generateContent>> | null = null
      try {
        result = await withRetry(() => model.generateContent(prompt))
        const text = result.response.text().trim()
        const cleaned = text.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '')
        const parsed = JSON.parse(cleaned)
        await logGeneration({ action, model: MODELS.flashLite, result, latencyMs: Date.now() - t0, success: true })
        return NextResponse.json(parsed)
      } catch (err) {
        await logGeneration({ action, model: MODELS.flashLite, result, latencyMs: Date.now() - t0, success: false, error: String(err) })
        throw err
      }
    }

    // ---------------------------------------------------------------- keywords
    if (action === 'keywords') {
      const prompt = buildKeywordsPrompt(niche)
      const model = genAI.getGenerativeModel({ model: MODELS.flashLite })
      const t0 = Date.now()
      let result: Awaited<ReturnType<typeof model.generateContent>> | null = null
      try {
        result = await withRetry(() => model.generateContent(prompt))
        const text = result.response.text().trim()
        const cleaned = text.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '')
        const parsed = JSON.parse(cleaned)
        await logGeneration({ action, model: MODELS.flashLite, result, latencyMs: Date.now() - t0, success: true })
        return NextResponse.json(parsed)
      } catch (err) {
        await logGeneration({ action, model: MODELS.flashLite, result, latencyMs: Date.now() - t0, success: false, error: String(err) })
        throw err
      }
    }

    // ----------------------------------------------------------------- suggest
    if (action === 'suggest') {
      const prompt = buildSuggestPrompt(niche, context)
      const model = genAI.getGenerativeModel({ model: MODELS.flashLite })
      const t0 = Date.now()
      let result: Awaited<ReturnType<typeof model.generateContent>> | null = null
      try {
        result = await withRetry(() => model.generateContent(prompt))
        const text = result.response.text().trim()
        const cleaned = text.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '')
        const parsed = JSON.parse(cleaned)
        await logGeneration({ action, model: MODELS.flashLite, result, latencyMs: Date.now() - t0, success: true })
        return NextResponse.json(parsed)
      } catch (err) {
        await logGeneration({ action, model: MODELS.flashLite, result, latencyMs: Date.now() - t0, success: false, error: String(err) })
        throw err
      }
    }

    // ---------------------------------------------------------------- generate
    if (action === 'generate') {
      if (!topic) {
        return NextResponse.json({ error: 'topic is required' }, { status: 400 })
      }

      // Fetch published posts for cross-linking (same as relink action)
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

      // Use Flash (better model) for the actual article content
      const generateModel = genAI.getGenerativeModel({
        model: MODELS.flash,
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
              content: { type: SchemaType.STRING },
            },
            required: ['title', 'excerpt', 'metaTitle', 'metaDescription', 'tags', 'content'],
          },
        },
      })

      const t0 = Date.now()
      let result: Awaited<ReturnType<typeof generateModel.generateContent>> | null = null
      try {
        result = await withRetry(() => generateModel.generateContent(prompt))
        const parsed = JSON.parse(result.response.text())
        await logGeneration({ action, model: MODELS.flash, result, latencyMs: Date.now() - t0, success: true })
        return NextResponse.json(parsed)
      } catch (err) {
        await logGeneration({ action, model: MODELS.flash, result, latencyMs: Date.now() - t0, success: false, error: String(err) })
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

      const relinkModel = genAI.getGenerativeModel({
        model: MODELS.flashLite,
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: { content: { type: SchemaType.STRING } },
            required: ['content'],
          },
        },
      })

      const t0 = Date.now()
      let result: Awaited<ReturnType<typeof relinkModel.generateContent>> | null = null
      try {
        result = await withRetry(() => relinkModel.generateContent(prompt))
        const parsed = JSON.parse(result.response.text())
        await logGeneration({ action, model: MODELS.flashLite, result, latencyMs: Date.now() - t0, success: true })
        return NextResponse.json(parsed)
      } catch (err) {
        await logGeneration({ action, model: MODELS.flashLite, result, latencyMs: Date.now() - t0, success: false, error: String(err) })
        throw err
      }
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI request failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
