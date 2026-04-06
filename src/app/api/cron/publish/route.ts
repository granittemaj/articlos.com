import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Called by Vercel Cron — secured by CRON_SECRET env var
export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const now = new Date()
    const posts = await prisma.post.updateMany({
      where: {
        published: false,
        publishedAt: { lte: now, not: null },
      },
      data: { published: true },
    })

    return NextResponse.json({
      published: posts.count,
      timestamp: now.toISOString(),
    })
  } catch (error) {
    console.error('[Cron publish]', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
