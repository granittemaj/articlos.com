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

const POSTS_PER_PAGE = 15

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkLoading, setBulkLoading] = useState(false)

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

  // Reset page when search changes
  useEffect(() => {
    setPage(1)
  }, [search])

  // Clear selection when page changes
  useEffect(() => {
    setSelectedIds(new Set())
  }, [page])

  // Filtered and paginated posts
  const filteredPosts = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const paginatedPosts = filteredPosts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  )

  function handleSelectAll(checked: boolean) {
    if (checked) {
      setSelectedIds(new Set(paginatedPosts.map((p) => p.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  function handleSelectOne(id: string, checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) {
        next.add(id)
      } else {
        next.delete(id)
      }
      return next
    })
  }

  async function handleBulkPublish(publish: boolean) {
    setBulkLoading(true)
    try {
      for (const id of selectedIds) {
        await fetch(`/api/admin/posts/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ published: publish }),
        })
      }
      setSelectedIds(new Set())
      await fetchPosts()
    } catch {
      alert(`Failed to ${publish ? 'publish' : 'unpublish'} posts.`)
    } finally {
      setBulkLoading(false)
    }
  }

  async function handleBulkDelete() {
    if (!confirm(`Delete ${selectedIds.size} post(s)? This cannot be undone.`)) return
    setBulkLoading(true)
    try {
      for (const id of selectedIds) {
        await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' })
      }
      setSelectedIds(new Set())
      await fetchPosts()
    } catch {
      alert('Failed to delete posts.')
    } finally {
      setBulkLoading(false)
    }
  }

  async function handleBulkRelink() {
    if (!confirm(`Add SEO links to ${selectedIds.size} post(s)? This will update their content.`)) return
    setBulkLoading(true)
    let done = 0
    let failed = 0
    for (const id of selectedIds) {
      try {
        // Fetch current post content
        const res = await fetch(`/api/admin/posts/${id}`)
        const data = await res.json()
        const post = data.post
        if (!post?.content) { done++; continue }

        // Ask AI to add links
        const aiRes = await fetch('/api/admin/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'relink', content: post.content, title: post.title }),
        })
        const aiData = await aiRes.json()
        if (!aiData.content) { failed++; continue }

        // Save updated content
        await fetch(`/api/admin/posts/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: aiData.content }),
        })
        done++
      } catch {
        failed++
      }
    }
    setSelectedIds(new Set())
    await fetchPosts()
    setBulkLoading(false)
    alert(`Done. ${done} updated${failed > 0 ? `, ${failed} failed` : ''}.`)
  }

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
          <>
            {/* Search bar */}
            <div style={{ marginBottom: 12 }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ maxWidth: 320 }}
              />
            </div>

            {/* Bulk actions toolbar */}
            {selectedIds.size > 0 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  marginBottom: 12,
                  background: '#f5f5f3',
                  border: '1px solid #e8e8e6',
                  borderRadius: 8,
                  fontSize: 13,
                }}
              >
                <span style={{ fontWeight: 500 }}>{selectedIds.size} selected</span>
                <button
                  onClick={() => handleBulkPublish(true)}
                  disabled={bulkLoading}
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: 12 }}
                >
                  Publish
                </button>
                <button
                  onClick={() => handleBulkPublish(false)}
                  disabled={bulkLoading}
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: 12 }}
                >
                  Unpublish
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={bulkLoading}
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: 12, color: '#dc2626' }}
                >
                  Delete
                </button>
                <button
                  onClick={handleBulkRelink}
                  disabled={bulkLoading}
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: 12 }}
                  title="Use AI to add internal and external SEO links"
                >
                  Add SEO links
                </button>
                <button
                  onClick={() => setSelectedIds(new Set())}
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: 12 }}
                >
                  Clear selection
                </button>
              </div>
            )}

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
                    <th style={{ width: 36 }}>
                      <input
                        type="checkbox"
                        checked={
                          paginatedPosts.length > 0 &&
                          paginatedPosts.every((p) => selectedIds.has(p.id))
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </th>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Tags</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPosts.map((post) => (
                    <tr key={post.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.has(post.id)}
                          onChange={(e) => handleSelectOne(post.id, e.target.checked)}
                        />
                      </td>
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

            {/* Pagination */}
            {filteredPosts.length > POSTS_PER_PAGE && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  marginTop: 16,
                  fontSize: 13,
                }}
              >
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn btn-ghost btn-sm"
                >
                  Previous
                </button>
                <span style={{ color: '#6b6b67' }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn btn-ghost btn-sm"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
