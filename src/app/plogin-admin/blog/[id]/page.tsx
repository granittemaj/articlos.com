'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import PostEditor from '../PostEditor'

interface PostData {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  featuredImage: string | null
  tags: string | null
  published: boolean
  publishedAt: string | null
  metaTitle: string | null
  metaDescription: string | null
}

export default function EditPostPage() {
  const params = useParams()
  const id = params.id as string
  const [post, setPost] = useState<PostData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/posts/${id}`)
        if (!res.ok) throw new Error('Post not found')
        const data = await res.json()
        setPost(data.post)
      } catch {
        setError('Failed to load post.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="skeleton" style={{ height: 40, width: '60%', borderRadius: 8 }} />
        <div className="skeleton" style={{ height: 400, borderRadius: 8 }} />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div style={{ padding: 32, color: '#dc2626' }}>
        {error || 'Post not found.'}
      </div>
    )
  }

  return (
    <PostEditor
      initialData={{
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || '',
        content: post.content,
        featuredImage: post.featuredImage || '',
        tags: post.tags || '',
        published: post.published,
        publishedAt: post.publishedAt || new Date().toISOString().split('T')[0],
        metaTitle: post.metaTitle || '',
        metaDescription: post.metaDescription || '',
      }}
      postId={id}
    />
  )
}
