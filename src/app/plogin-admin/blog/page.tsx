'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface Post {
  id: string
  title: string
  slug: string
  published: boolean
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  tags: string | null
  excerpt: string | null
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  async function fetchPosts() {
    try {
      const res = await fetch('/api/admin/posts')
      const data = await res.json()
      setPosts(data.posts || [])
    } catch {
      console.error('Failed to fetch posts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeletingId(id)
    try {
      await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' })
      setPosts((prev) => prev.filter((p) => p.id !== id))
    } catch {
      alert('Failed to delete post.')
    } finally {
      setDeletingId(null)
    }
  }

  async function handleTogglePublish(post: Post) {
    setTogglingId(post.id)
    try {
      const res = await fetch(`/api/admin/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !post.published }),
      })
      const data = await res.json()
      setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, ...data.post } : p)))
    } catch {
      alert('Failed to update post.')
    } finally {
      setTogglingId(null)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-header-title">Blog Posts</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/plogin-admin/blog/generate" className="btn btn-ghost btn-sm" style={{ gap: 6 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
            Generate with AI
          </Link>
          <Link href="/plogin-admin/blog/new" className="btn btn-primary btn-sm">
            + New post
          </Link>
        </div>
      </div>

      <div className="page-body">
        {loading ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="skeleton"
                style={{ height: 56, borderRadius: 8 }}
              />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 24px',
              background: '#ffffff',
              border: '1px solid #e8e8e6',
              borderRadius: 8,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: '#f5f5f3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a0a09c" strokeWidth="1.75">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No posts yet</h3>
            <p style={{ fontSize: 14, color: '#6b6b67', marginBottom: 16 }}>
              Create your first blog post to get started.
            </p>
            <Link href="/plogin-admin/blog/new" className="btn btn-primary btn-sm">
              Create post
            </Link>
          </div>
        ) : (
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e8e8e6',
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Tags</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td>
                      <Link
                        href={`/plogin-admin/blog/${post.id}`}
                        style={{
                          fontWeight: 500,
                          fontSize: 14,
                          color: '#0f0f0e',
                          textDecoration: 'none',
                        }}
                      >
                        {post.title}
                      </Link>
                      <div style={{ fontSize: 12, color: '#a0a09c', marginTop: 2 }}>
                        /{post.slug}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${post.published ? 'published' : 'draft'}`}
                      >
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: '50%',
                            background: post.published ? '#16a34a' : '#a0a09c',
                            display: 'inline-block',
                          }}
                        />
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td style={{ fontSize: 13, color: '#6b6b67' }}>
                      {formatDate(post.publishedAt || post.createdAt)}
                    </td>
                    <td>
                      {post.tags ? (
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {post.tags
                            .split(',')
                            .slice(0, 2)
                            .map((t) => (
                              <span key={t.trim()} className="tag-chip" style={{ fontSize: 11 }}>
                                {t.trim()}
                              </span>
                            ))}
                        </div>
                      ) : (
                        <span style={{ fontSize: 12, color: '#d4d4d0' }}>—</span>
                      )}
                    </td>
                    <td>
                      <div
                        style={{
                          display: 'flex',
                          gap: 6,
                          justifyContent: 'flex-end',
                        }}
                      >
                        <button
                          onClick={() => handleTogglePublish(post)}
                          disabled={togglingId === post.id}
                          className="btn btn-ghost btn-sm"
                          style={{ fontSize: 12 }}
                        >
                          {togglingId === post.id
                            ? '...'
                            : post.published
                            ? 'Unpublish'
                            : 'Publish'}
                        </button>
                        <Link
                          href={`/plogin-admin/blog/${post.id}`}
                          className="btn btn-ghost btn-sm"
                          style={{ fontSize: 12 }}
                        >
                          Edit
                        </Link>
                        {post.published && (
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-ghost btn-sm"
                            style={{ fontSize: 12 }}
                          >
                            View ↗
                          </a>
                        )}
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          disabled={deletingId === post.id}
                          className="btn btn-ghost btn-sm"
                          style={{ fontSize: 12, color: '#dc2626' }}
                        >
                          {deletingId === post.id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
