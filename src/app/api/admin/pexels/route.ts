import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { getOpenAIClient, MODELS } from '@/lib/llm/client'
import { buildPexelsQueryPrompt } from '@/lib/llm/prompts'

async function getVisualSearchTerm(topic: string): Promise<string> {
  try {
    const completion = await getOpenAIClient().chat.completions.create({
      model: MODELS.small,
      messages: [{ role: 'user', content: buildPexelsQueryPrompt(topic) }],
    })
    const raw = completion.choices[0]?.message?.content ?? ''
    const term = raw.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '').trim()
    return term || topic.split(' ').slice(0, 2).join(' ')
  } catch {
    return topic.split(' ').slice(0, 2).join(' ')
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const query = req.nextUrl.searchParams.get('query')
  if (!query) return NextResponse.json({ error: 'query required' }, { status: 400 })

  const apiKey = process.env.PEXELS_API_KEY
  if (!apiKey) return NextResponse.json({ url: null, message: 'PEXELS_API_KEY not configured' })

  const pexelsQuery = await getVisualSearchTerm(query)

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(pexelsQuery)}&per_page=5&orientation=landscape`,
      { headers: { Authorization: apiKey } }
    )
    const data = await res.json()
    const photo = data.photos?.[0]
    if (!photo) return NextResponse.json({ url: null })
    return NextResponse.json({
      url: photo.src.large2x || photo.src.large || photo.src.original,
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
      searchTerm: pexelsQuery,
    })
  } catch {
    return NextResponse.json({ url: null })
  }
}
