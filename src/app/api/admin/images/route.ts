import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    return NextResponse.json({ images: [], message: 'BLOB_READ_WRITE_TOKEN not configured' })
  }

  try {
    const { list } = await import('@vercel/blob')
    const { blobs } = await list({ prefix: 'blog/', token })
    const images = blobs.map((b) => ({
      url: b.url,
      pathname: b.pathname,
      size: b.size,
      uploadedAt: b.uploadedAt,
    }))
    return NextResponse.json({ images })
  } catch {
    return NextResponse.json({ images: [], message: 'Failed to list images' })
  }
}
