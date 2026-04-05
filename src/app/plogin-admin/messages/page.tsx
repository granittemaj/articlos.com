'use client'

import { useState, useEffect, useCallback } from 'react'
import AdminLayout from '@/components/AdminLayout'

interface Message {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  read: boolean
  createdAt: string
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const MESSAGES_PER_PAGE = 20

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Message | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [page, setPage] = useState(1)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/messages')
      const data = await res.json()
      setMessages(data.messages || [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function openMessage(msg: Message) {
    setSelected(msg)
    if (!msg.read) {
      await fetch(`/api/admin/messages/${msg.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      })
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m))
    }
  }

  async function deleteMessage(id: string) {
    setDeleting(id)
    await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' })
    setMessages(prev => prev.filter(m => m.id !== id))
    if (selected?.id === id) setSelected(null)
    setDeleting(null)
  }

  async function deleteAll() {
    if (!confirm('Delete all messages? This cannot be undone.')) return
    await Promise.all(messages.map(m => fetch(`/api/admin/messages/${m.id}`, { method: 'DELETE' })))
    setMessages([])
    setSelected(null)
  }

  const filtered = filter === 'unread' ? messages.filter(m => !m.read) : messages
  const unreadCount = messages.filter(m => !m.read).length
  const totalPages = Math.ceil(filtered.length / MESSAGES_PER_PAGE)
  const paginatedMessages = filtered.slice((page - 1) * MESSAGES_PER_PAGE, page * MESSAGES_PER_PAGE)

  return (
    <AdminLayout>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Messages</h1>
          {unreadCount > 0 && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              marginLeft: 8, minWidth: 20, height: 20, borderRadius: 10,
              background: '#0f0f0e', color: '#fff', fontSize: 11, fontWeight: 700,
              padding: '0 6px',
            }}>
              {unreadCount}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {messages.length > 0 && (
            <button onClick={deleteAll} className="btn btn-ghost btn-sm" style={{ color: '#dc2626' }}>
              Delete all
            </button>
          )}
        </div>
      </div>

      <div className="page-body">
        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
          {(['all', 'unread'] as const).map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1) }}
              style={{
                padding: '5px 14px', borderRadius: 6, fontSize: 13, fontWeight: 500,
                border: '1px solid',
                borderColor: filter === f ? '#0f0f0e' : '#e8e8e6',
                background: filter === f ? '#0f0f0e' : '#ffffff',
                color: filter === f ? '#ffffff' : '#6b6b67',
                cursor: 'pointer', fontFamily: 'Geist, sans-serif',
              }}
            >
              {f === 'all' ? `All (${messages.length})` : `Unread (${unreadCount})`}
            </button>
          ))}
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
              {filter === 'unread' ? 'No unread messages.' : 'No messages yet.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1.4fr' : '1fr', gap: 16, alignItems: 'start' }} className="messages-layout">
            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {paginatedMessages.map(msg => (
                <div
                  key={msg.id}
                  onClick={() => openMessage(msg)}
                  style={{
                    background: '#ffffff',
                    border: `1px solid ${selected?.id === msg.id ? '#0f0f0e' : '#e8e8e6'}`,
                    borderRadius: 8, padding: '14px 16px',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s ease',
                    position: 'relative',
                  }}
                >
                  {!msg.read && (
                    <div style={{
                      position: 'absolute', top: 16, right: 16,
                      width: 7, height: 7, borderRadius: '50%', background: '#0f0f0e',
                    }} />
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: msg.read ? 500 : 700, color: '#0f0f0e' }}>
                      {msg.name}
                    </span>
                    <span style={{ fontSize: 11, color: '#a0a09c' }}>{formatDate(msg.createdAt)}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#6b6b67', marginBottom: 4 }}>{msg.email}</div>
                  {msg.subject && (
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#3d3d3a', marginBottom: 4 }}>{msg.subject}</div>
                  )}
                  <div style={{
                    fontSize: 13, color: '#9b9b96',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {msg.message}
                  </div>
                </div>
              ))}

              {totalPages > 1 && (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 12, padding: '12px 0', fontSize: 13, color: '#6b6b67',
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
            </div>

            {/* Detail panel */}
            {selected && (
              <div style={{
                background: '#ffffff', border: '1px solid #e8e8e6',
                borderRadius: 8, padding: 24, position: 'sticky', top: 80,
              }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#0f0f0e', marginBottom: 4 }}>
                      {selected.name}
                    </div>
                    <a
                      href={`mailto:${selected.email}`}
                      style={{ fontSize: 13, color: '#6b6b67', textDecoration: 'none' }}
                    >
                      {selected.email}
                    </a>
                    <div style={{ fontSize: 11, color: '#a0a09c', marginTop: 4 }}>
                      {formatDate(selected.createdAt)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <a
                      href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your message'}`}
                      className="btn btn-primary btn-sm"
                    >
                      Reply
                    </a>
                    <button
                      onClick={() => deleteMessage(selected.id)}
                      disabled={deleting === selected.id}
                      className="btn btn-ghost btn-sm"
                      style={{ color: '#dc2626' }}
                    >
                      {deleting === selected.id ? '…' : 'Delete'}
                    </button>
                  </div>
                </div>

                {selected.subject && (
                  <div style={{
                    fontSize: 14, fontWeight: 600, color: '#0f0f0e',
                    marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #e8e8e6',
                  }}>
                    {selected.subject}
                  </div>
                )}

                <p style={{ fontSize: 14, color: '#3d3d3a', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
                  {selected.message}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .messages-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </AdminLayout>
  )
}
