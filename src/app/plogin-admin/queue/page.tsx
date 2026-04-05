'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface QueueItem {
  id: string
  title: string
  keyword: string
  intent: string | null
  difficulty: string | null
  why: string | null
  niche: string | null
  status: string
  createdAt: string
}

type FilterTab = 'all' | 'queued' | 'done' | 'failed'

const ITEMS_PER_PAGE = 20

async function fetchPexelsImage(query: string): Promise<string> {
  try {
    const res = await fetch(`/api/admin/pexels?query=${encodeURIComponent(query)}`)
    const data = await res.json()
    return data.url || ''
  } catch {
    return ''
  }
}

async function generateAndSave(
  topic: { title: string; keyword: string },
  publish: boolean
): Promise<{ postId: string }> {
  const genRes = await fetch('/api/admin/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'generate', topic: topic.title, keywords: topic.keyword }),
  })
  const genData = await genRes.json()
  if (!genRes.ok) throw new Error(genData.error || 'Generation failed')

  const featuredImage = await fetchPexelsImage(topic.keyword || topic.title)

  const slug = genData.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)

  const saveRes = await fetch('/api/admin/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: genData.title,
      slug,
      excerpt: genData.excerpt,
      content: genData.content,
      tags: genData.tags,
      metaTitle: genData.metaTitle,
      metaDescription: genData.metaDescription,
      published: publish,
      publishedAt: publish ? new Date().toISOString().split('T')[0] : null,
      featuredImage: featuredImage || null,
    }),
  })
  const saveData = await saveRes.json()
  if (!saveRes.ok) throw new Error(saveData.error || 'Save failed')
  return { postId: saveData.post.id }
}

async function updateQueueStatus(id: string, status: string) {
  await fetch(`/api/admin/queue/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
}

export default function QueuePage() {
  const [items, setItems] = useState<QueueItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<FilterTab>('all')
  const [page, setPage] = useState(1)
  const [publishStatus, setPublishStatus] = useState<'draft' | 'publish'>('draft')
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState<{ current: number; total: number; title: string } | null>(null)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)

  // Track postIds for items generated this session
  const [postIdMap, setPostIdMap] = useState<Record<string, string>>({})

  async function fetchQueue() {
    try {
      const res = await fetch('/api/admin/queue')
      const data = await res.json()
      setItems(data.topics || [])
    } catch {
      setError('Failed to fetch queue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQueue()
  }, [])

  // Reset page when filter changes
  useEffect(() => {
    setPage(1)
    setSelectedIds(new Set())
  }, [filter])

  // Clear selection on page change
  useEffect(() => {
    setSelectedIds(new Set())
  }, [page])

  // Filtered items
  const filtered = items.filter((item) => {
    if (filter === 'all') return true
    return item.status === filter
  })

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  // Select helpers
  const allOnPageSelected = paginated.length > 0 && paginated.every((item) => selectedIds.has(item.id))

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleSelectAll() {
    if (allOnPageSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(paginated.map((item) => item.id)))
    }
  }

  // Bulk generate
  async function handleBulkGenerate() {
    const selected = items.filter((item) => selectedIds.has(item.id) && item.status === 'queued')
    if (selected.length === 0) return

    setGenerating(true)
    setError('')
    const publish = publishStatus === 'publish'

    for (let i = 0; i < selected.length; i++) {
      const item = selected[i]
      setProgress({ current: i + 1, total: selected.length, title: item.title })

      // Mark as generating
      await updateQueueStatus(item.id, 'generating')
      setItems((prev) => prev.map((t) => (t.id === item.id ? { ...t, status: 'generating' } : t)))

      try {
        const { postId } = await generateAndSave(
          { title: item.title, keyword: item.keyword },
          publish
        )
        await updateQueueStatus(item.id, 'done')
        setItems((prev) => prev.map((t) => (t.id === item.id ? { ...t, status: 'done' } : t)))
        setPostIdMap((prev) => ({ ...prev, [item.id]: postId }))
      } catch (e) {
        await updateQueueStatus(item.id, 'failed')
        setItems((prev) => prev.map((t) => (t.id === item.id ? { ...t, status: 'failed' } : t)))
      }
    }

    setProgress(null)
    setGenerating(false)
    setSelectedIds(new Set())
  }

  // Bulk delete
  async function handleBulkDelete() {
    const ids = Array.from(selectedIds)
    if (ids.length === 0) return

    setDeleting(true)
    setError('')
    try {
      const res = await fetch('/api/admin/queue', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      })
      if (!res.ok) throw new Error('Delete failed')
      setItems((prev) => prev.filter((item) => !selectedIds.has(item.id)))
      setSelectedIds(new Set())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete')
    } finally {
      setDeleting(false)
    }
  }

  const difficultyColor: Record<string, string> = {
    low: '#16a34a',
    medium: '#d97706',
    high: '#dc2626',
  }

  const statusConfig: Record<string, { bg: string; color: string; border: string; label: string }> = {
    queued: { bg: '#f4f4f3', color: '#6b6b67', border: '#e8e8e6', label: 'Queued' },
    generating: { bg: '#fffbeb', color: '#d97706', border: '#fcd34d', label: 'Generating' },
    done: { bg: '#f0fdf4', color: '#16a34a', border: '#86efac', label: 'Done' },
    failed: { bg: '#fef2f2', color: '#dc2626', border: '#fca5a5', label: 'Failed' },
  }

  const filterTabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: items.length },
    { key: 'queued', label: 'Queued', count: items.filter((i) => i.status === 'queued').length },
    { key: 'done', label: 'Done', count: items.filter((i) => i.status === 'done').length },
    { key: 'failed', label: 'Failed', count: items.filter((i) => i.status === 'failed').length },
  ]

  const selectedCount = selectedIds.size
  const selectedQueuedCount = items.filter((i) => selectedIds.has(i.id) && i.status === 'queued').length

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Topic Queue</h1>
          <p className="page-header-desc">Manage saved topics and generate articles in bulk.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link
            href="/plogin-admin/blog/generate"
            className="btn btn-ghost"
            style={{ textDecoration: 'none' }}
          >
            + Add topics
          </Link>
        </div>
      </div>

      <div className="page-body">
        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8,
            padding: '12px 16px', marginBottom: 20, fontSize: 14, color: '#dc2626',
          }}>
            {error}
          </div>
        )}

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: filter === tab.key ? 600 : 400,
                background: filter === tab.key ? '#0f0f0e' : 'transparent',
                color: filter === tab.key ? '#ffffff' : '#6b6b67',
                border: `1px solid ${filter === tab.key ? '#0f0f0e' : '#e8e8e6'}`,
                cursor: 'pointer',
                fontFamily: 'Geist, sans-serif',
                transition: 'all 0.15s',
              }}
            >
              {tab.label} <span style={{ opacity: 0.6, fontSize: 11, marginLeft: 4 }}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Bulk action bar */}
        {selectedCount > 0 && (
          <div style={{
            background: '#f8f8f7', border: '1px solid #e8e8e6',
            borderRadius: 8, padding: '10px 16px', marginBottom: 16,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#0f0f0e' }}>
              {selectedCount} selected
            </span>

            {/* Draft/Publish selector */}
            <div style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
              <label style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '4px 10px', borderRadius: 4, cursor: 'pointer',
                border: `1.5px solid ${publishStatus === 'draft' ? '#0f0f0e' : '#e8e8e6'}`,
                background: publishStatus === 'draft' ? '#f4f4f3' : '#ffffff',
                fontSize: 12, fontWeight: 500,
                transition: 'all 0.15s',
              }}>
                <input
                  type="radio"
                  name="queuePublish"
                  checked={publishStatus === 'draft'}
                  onChange={() => setPublishStatus('draft')}
                  style={{ accentColor: '#0f0f0e', width: 12, height: 12 }}
                />
                Draft
              </label>
              <label style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '4px 10px', borderRadius: 4, cursor: 'pointer',
                border: `1.5px solid ${publishStatus === 'publish' ? '#0f0f0e' : '#e8e8e6'}`,
                background: publishStatus === 'publish' ? '#f4f4f3' : '#ffffff',
                fontSize: 12, fontWeight: 500,
                transition: 'all 0.15s',
              }}>
                <input
                  type="radio"
                  name="queuePublish"
                  checked={publishStatus === 'publish'}
                  onChange={() => setPublishStatus('publish')}
                  style={{ accentColor: '#0f0f0e', width: 12, height: 12 }}
                />
                Publish
              </label>
            </div>

            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              {selectedQueuedCount > 0 && (
                <button
                  onClick={handleBulkGenerate}
                  disabled={generating}
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: 12, gap: 6 }}
                >
                  {generating ? (
                    <><span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>&#9676;</span> Generating...</>
                  ) : (
                    <>Generate {selectedQueuedCount} article{selectedQueuedCount === 1 ? '' : 's'}</>
                  )}
                </button>
              )}
              <button
                onClick={handleBulkDelete}
                disabled={deleting || generating}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: 12, color: '#dc2626' }}
              >
                {deleting ? 'Deleting...' : `Delete selected`}
              </button>
            </div>
          </div>
        )}

        {/* Progress indicator */}
        {progress && (
          <div style={{
            background: '#fffbeb', border: '1px solid #fcd34d',
            borderRadius: 8, padding: '12px 16px', marginBottom: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', fontSize: 14 }}>&#9676;</span>
              <span style={{ fontSize: 13, color: '#92400e' }}>
                Generating {progress.current} of {progress.total}: <strong>{progress.title}</strong>
              </span>
            </div>
            <div style={{ height: 4, background: '#fef3c7', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%', background: '#d97706', borderRadius: 2,
                width: `${(progress.current / progress.total) * 100}%`,
                transition: 'width 0.3s ease',
              }} />
            </div>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton" style={{ height: 52, borderRadius: 8 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '48px 20px',
            color: '#9b9b96', fontSize: 14,
          }}>
            {filter === 'all'
              ? 'No topics in queue. Add some from the Generate page.'
              : `No ${filter} topics.`}
          </div>
        ) : (
          <>
            <div className="data-table" style={{ border: '1px solid #e8e8e6', borderRadius: 10, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9f9f8', borderBottom: '1px solid #e8e8e6' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left', width: 40 }}>
                      <input
                        type="checkbox"
                        checked={allOnPageSelected}
                        onChange={toggleSelectAll}
                        style={{ accentColor: '#0f0f0e' }}
                      />
                    </th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b6b67' }}>
                      Title
                    </th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b6b67', width: 140 }}>
                      Keyword
                    </th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b6b67', width: 100 }}>
                      Difficulty
                    </th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b6b67', width: 110 }}>
                      Status
                    </th>
                    <th style={{ padding: '10px 14px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#6b6b67', width: 100 }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((item) => {
                    const sc = statusConfig[item.status] || statusConfig.queued
                    return (
                      <tr key={item.id} style={{ borderBottom: '1px solid #f0f0ee' }}>
                        <td style={{ padding: '10px 14px' }}>
                          <input
                            type="checkbox"
                            checked={selectedIds.has(item.id)}
                            onChange={() => toggleSelect(item.id)}
                            style={{ accentColor: '#0f0f0e' }}
                          />
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <div style={{ fontSize: 14, fontWeight: 500, color: '#0f0f0e', marginBottom: 2 }}>
                            {item.title}
                          </div>
                          {item.why && (
                            <div style={{ fontSize: 12, color: '#9b9b96', lineHeight: 1.4 }}>
                              {item.why.length > 80 ? item.why.slice(0, 80) + '...' : item.why}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{
                            fontSize: 12, fontWeight: 500, padding: '2px 8px', borderRadius: 20,
                            background: '#f4f4f3', color: '#6b6b67',
                          }}>
                            {item.keyword}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          {item.difficulty && (
                            <span style={{
                              fontSize: 12, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                              color: difficultyColor[item.difficulty] || '#6b6b67',
                              border: `1px solid ${(difficultyColor[item.difficulty] || '#6b6b67') + '40'}`,
                            }}>
                              {item.difficulty}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            fontSize: 12, fontWeight: 600, padding: '2px 10px', borderRadius: 20,
                            background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                          }}>
                            {item.status === 'generating' && (
                              <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', fontSize: 10 }}>&#9676;</span>
                            )}
                            {sc.label}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                          {item.status === 'done' && postIdMap[item.id] && (
                            <Link
                              href={`/plogin-admin/blog/${postIdMap[item.id]}`}
                              style={{
                                fontSize: 12, fontWeight: 500, color: '#16a34a',
                                textDecoration: 'none', marginRight: 8,
                              }}
                            >
                              View post
                            </Link>
                          )}
                          <button
                            onClick={async () => {
                              try {
                                await fetch(`/api/admin/queue/${item.id}`, { method: 'DELETE' })
                                setItems((prev) => prev.filter((t) => t.id !== item.id))
                              } catch {}
                            }}
                            disabled={generating}
                            style={{
                              background: 'none', border: 'none', cursor: 'pointer',
                              fontSize: 12, color: '#9b9b96', padding: '4px 6px',
                              fontFamily: 'Geist, sans-serif',
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 8, marginTop: 20,
              }}>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: 12 }}
                >
                  Previous
                </button>
                <span style={{ fontSize: 13, color: '#6b6b67' }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: 12 }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
