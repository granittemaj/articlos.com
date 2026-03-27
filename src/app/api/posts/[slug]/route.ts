import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface Params {
  params: { slug: string }
}

export async function GET(_req: Request, { params }: Params) {
  try {
    const post = await prisma.post.findFirst({
      where: { slug: params.slug, published: true },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}
