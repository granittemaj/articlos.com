import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'for', 'of', 'to', 'in', 'on', 'at', 'by',
  'with', 'how', 'why', 'what', 'when', 'is', 'are', 'do', 'does', 'your',
  'you', 'we', 'our', 'its', 'it', 'this', 'that', 'vs', 'vs.', 'from',
  'using', 'get', 'best', 'top', 'most', 'more', 'less', 'into', 'about',
])

/** Extract the 1-2 most meaningful words from a keyword/title for Pexels. */
function distillQuery(raw: string): string {
  const words = raw
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w))

  // Return first 2 meaningful words joined — Pexels handles short phrases well
  return words.slice(0, 2).join(' ') || raw.split(/\s+/)[0]
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const query = req.nextUrl.searchParams.get('query')
  if (!query) return NextResponse.json({ error: 'query required' }, { status: 400 })

  const apiKey = process.env.PEXELS_API_KEY
  if (!apiKey) return NextResponse.json({ url: null, message: 'PEXELS_API_KEY not configured' })

  const pexelsQuery = distillQuery(query)

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(pexelsQuery)}&per_page=3&orientation=landscape`,
      { headers: { Authorization: apiKey } }
    )
    const data = await res.json()
    const photo = data.photos?.[0]
    if (!photo) return NextResponse.json({ url: null })
    return NextResponse.json({
      url: photo.src.large2x || photo.src.large || photo.src.original,
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
    })
  } catch {
    return NextResponse.json({ url: null })
  }
}
