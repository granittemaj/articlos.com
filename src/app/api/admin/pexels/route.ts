import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const query = req.nextUrl.searchParams.get('query')
  if (!query) return NextResponse.json({ error: 'query required' }, { status: 400 })

  const apiKey = process.env.PEXELS_API_KEY
  if (!apiKey) return NextResponse.json({ url: null, message: 'PEXELS_API_KEY not configured' })

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape`,
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
