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

interface PostVersion {
  id: string
  title: string
  content: string
  excerpt: string | null
  createdAt: string
}

function formatVersionDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function EditPostPage() {
  const params = useParams()
  const id = params.id as string
  const [post, setPost] = useState<PostData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [versions, setVersions] = useState<PostVersion[]>([])
  const [versionsOpen, setVersionsOpen] = useState(false)
  const [restoring, setRestoring] = useState<string | null>(null)

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

  useEffect(() => {
    async function loadVersions() {
      try {
        const res = await fetch(`/api/admin/posts/${id}/versions`)
        if (res.ok) {
          const data = await res.json()
          setVersions(data.versions || [])
        }
      } catch {
        // silently ignore version fetch errors
      }
    }
    if (post) {
      loadVersions()
    }
  }, [id, post])

  async function restoreVersion(version: PostVersion) {
    if (!confirm('Restore this version? Current content will be replaced.')) return
    setRestoring(version.id)
    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: version.title,
          content: version.content,
          excerpt: version.excerpt || '',
        }),
      })
      if (!res.ok) throw new Error('Failed to restore version')
      window.location.reload()
    } catch {
      alert('Failed to restore version. Please try again.')
      setRestoring(null)
    }
  }

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
    <>
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

      {versions.length > 0 && (
        <div style={{
          margin: '24px 32px 32px',
          background: '#ffffff',
          border: '1px solid #e8e8e6',
          borderRadius: 10,
          overflow: 'hidden',
        }}>
          <button
            onClick={() => setVersionsOpen(!versionsOpen)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 20px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              color: '#0f0f0e',
              fontFamily: 'Geist, sans-serif',
            }}
          >
            <span>Version History ({versions.length} version{versions.length !== 1 ? 's' : ''})</span>
            <span style={{
              transform: versionsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
              fontSize: 12,
              color: '#6b6b67',
            }}>
              &#9660;
            </span>
          </button>

          {versionsOpen && (
            <div style={{ borderTop: '1px solid #e8e8e6' }}>
              {versions.map((version) => (
                <div
                  key={version.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 20px',
                    borderBottom: '1px solid #f0f0ee',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, color: '#0f0f0e', fontWeight: 500 }}>
                      {version.title}
                    </div>
                    <div style={{ fontSize: 12, color: '#a0a09c', marginTop: 2 }}>
                      {formatVersionDate(version.createdAt)}
                    </div>
                  </div>
                  <button
                    onClick={() => restoreVersion(version)}
                    disabled={restoring === version.id}
                    className="btn btn-ghost btn-sm"
                    style={{ opacity: restoring === version.id ? 0.5 : 1 }}
                  >
                    {restoring === version.id ? 'Restoring…' : 'Restore'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
