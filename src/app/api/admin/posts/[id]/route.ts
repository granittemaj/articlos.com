import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface Params {
  params: { id: string }
}

async function checkAdmin() {
  const session = await getServerSession(authOptions)
  return !!session?.user
}

export async function GET(_req: Request, { params }: Params) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const post = await prisma.post.findUnique({ where: { id: params.id } })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: Params) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      tags,
      published,
      publishedAt,
      metaTitle,
      metaDescription,
    } = body

    // Check slug uniqueness (excluding this post)
    if (slug) {
      const existing = await prisma.post.findFirst({
        where: { slug, id: { not: params.id } },
      })
      if (existing) {
        return NextResponse.json({ error: 'Slug already in use by another post' }, { status: 409 })
      }
    }

    const currentPost = await prisma.post.findUnique({ where: { id: params.id } })
    if (!currentPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // If publishing for the first time, set publishedAt
    let resolvedPublishedAt = currentPost.publishedAt
    if (published && !currentPost.published) {
      resolvedPublishedAt = publishedAt ? new Date(publishedAt) : new Date()
    } else if (publishedAt) {
      resolvedPublishedAt = new Date(publishedAt)
    } else if (!published) {
      resolvedPublishedAt = null
    }

    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        excerpt: excerpt ?? currentPost.excerpt,
        ...(content !== undefined && { content }),
        featuredImage: featuredImage ?? currentPost.featuredImage,
        tags: tags ?? currentPost.tags,
        published: published ?? currentPost.published,
        publishedAt: resolvedPublishedAt,
        metaTitle: metaTitle ?? currentPost.metaTitle,
        metaDescription: metaDescription ?? currentPost.metaDescription,
      },
    })

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await prisma.post.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
