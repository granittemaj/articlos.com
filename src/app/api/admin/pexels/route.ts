import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

/** Ask Gemini for a concrete, visual Pexels search term for the given topic. */
async function getVisualSearchTerm(topic: string): Promise<string> {
  const geminiKey = process.env.GEMINI_API_KEY
  if (!geminiKey) return topic.split(' ').slice(0, 2).join(' ')

  try {
    const genAI = new GoogleGenerativeAI(geminiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })
    const result = await model.generateContent(
      `Given this blog post topic: "${topic}"

Suggest ONE simple 1-2 word search term to find a relevant, high-quality stock photo on Pexels.
The term must be:
- Visually concrete (something a photographer would photograph)
- Specific enough to return relevant images
- NOT abstract concepts like "seo", "algorithm", "strategy", "marketing"

Good examples: "laptop workspace", "team meeting", "analytics dashboard", "writing desk", "coffee notebook", "server room", "social media phone"

Return ONLY the 1-2 word search term, nothing else.`
    )
    const term = result.response.text().trim().toLowerCase().replace(/[^a-z0-9\s]/g, '').trim()
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
