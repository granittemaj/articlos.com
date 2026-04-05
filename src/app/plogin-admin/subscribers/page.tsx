'use client'

import { useState, useEffect, useCallback } from 'react'
import AdminLayout from '@/components/AdminLayout'

interface Subscriber {
  id: string
  email: string
  createdAt: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

const SUBSCRIBERS_PER_PAGE = 20

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/subscribers')
      const data = await res.json()
      setSubscribers(data.subscribers || [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function deleteSubscriber(id: string) {
    setDeleting(id)
    await fetch('/api/admin/subscribers', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setSubscribers((prev) => prev.filter((s) => s.id !== id))
    setDeleting(null)
  }

  const filtered = search.trim()
    ? subscribers.filter((s) => s.email.toLowerCase().includes(search.toLowerCase()))
    : subscribers
  const totalPages = Math.ceil(filtered.length / SUBSCRIBERS_PER_PAGE)
  const paginatedSubscribers = filtered.slice((page - 1) * SUBSCRIBERS_PER_PAGE, page * SUBSCRIBERS_PER_PAGE)

  return (
    <AdminLayout>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Newsletter Subscribers</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontSize: 13, color: '#6b6b67', fontWeight: 500,
            background: '#f0f0ee', padding: '4px 10px', borderRadius: 6,
          }}>
            {subscribers.length} total
          </span>
        </div>
      </div>

      <div className="page-body">
        {/* Search */}
        <div style={{ marginBottom: 16 }}>
          <input
            type="search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search by email…"
            className="form-input"
            style={{ maxWidth: 320 }}
          />
        </div>

        {loading ? (
          <div style={{ padding: '48px 0', textAlign: 'center', color: '#a0a09c', fontSize: 14 }}>
            Loading…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '64px 24px',
            background: '#ffffff', border: '1px solid #e8e8e6', borderRadius: 10,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%', background: '#f0f0ee',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a0a09c" strokeWidth="1.75">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <p style={{ fontSize: 14, color: '#6b6b67' }}>
              {search ? 'No subscribers match your search.' : 'No subscribers yet.'}
            </p>
          </div>
        ) : (
          <>
            <div style={{
              background: '#ffffff', border: '1px solid #e8e8e6', borderRadius: 10, overflow: 'hidden',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e8e8e6', background: '#f9f9f8' }}>
                    <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b6b67' }}>
                      Email
                    </th>
                    <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b6b67', width: 140 }}>
                      Subscribed
                    </th>
                    <th style={{ padding: '10px 16px', width: 60 }} />
                  </tr>
                </thead>
                <tbody>
                  {paginatedSubscribers.map((s, i) => (
                    <tr
                      key={s.id}
                      style={{ borderBottom: i < paginatedSubscribers.length - 1 ? '1px solid #f0f0ee' : 'none' }}
                    >
                      <td style={{ padding: '12px 16px', fontSize: 14, color: '#0f0f0e' }}>
                        <a href={`mailto:${s.email}`} style={{ color: '#0f0f0e', textDecoration: 'none' }}>
                          {s.email}
                        </a>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#a0a09c' }}>
                        {formatDate(s.createdAt)}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <button
                          onClick={() => deleteSubscriber(s.id)}
                          disabled={deleting === s.id}
                          style={{
                            fontSize: 12, color: '#dc2626', background: 'none',
                            border: 'none', cursor: 'pointer', padding: '4px 8px',
                            borderRadius: 4, opacity: deleting === s.id ? 0.5 : 1,
                            fontFamily: 'Geist, sans-serif',
                          }}
                        >
                          {deleting === s.id ? '…' : 'Remove'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 12, padding: '16px 0', fontSize: 13, color: '#6b6b67',
              }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn btn-ghost btn-sm"
                  style={{ opacity: page === 1 ? 0.4 : 1 }}
                >
                  Previous
                </button>
                <span>Page {page} of {totalPages}</span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn btn-ghost btn-sm"
                  style={{ opacity: page === totalPages ? 0.4 : 1 }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  )
}
