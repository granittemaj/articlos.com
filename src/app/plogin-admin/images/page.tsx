'use client'

import { useState, useEffect, useCallback } from 'react'
import AdminLayout from '@/components/AdminLayout'

interface ImageItem {
  url: string
  pathname: string
  size: number
  uploadedAt: string
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function ImagesPage() {
  const [images, setImages] = useState<ImageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/images')
      const data = await res.json()
      setImages(data.images || [])
      if (data.message) setMessage(data.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function copyUrl(url: string) {
    await navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <AdminLayout>
      <div className="page-header">
        <h1 className="page-header-title">Image Library</h1>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{
            fontSize: 13, color: '#6b6b67', background: '#f0f0ee',
            padding: '4px 10px', borderRadius: 6, fontWeight: 500,
          }}>
            {images.length} image{images.length !== 1 ? 's' : ''}
          </span>
          <a href="/plogin-admin/blog/new" className="btn btn-primary btn-sm">
            + New post
          </a>
        </div>
      </div>

      <div className="page-body">
        {message && (
          <div style={{
            background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8,
            padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#92400e',
          }}>
            {message}
          </div>
        )}

        {loading ? (
          <div style={{ padding: '48px 0', textAlign: 'center', color: '#a0a09c', fontSize: 14 }}>Loading…</div>
        ) : images.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '64px 24px',
            background: '#ffffff', border: '1px solid #e8e8e6', borderRadius: 10,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%', background: '#f0f0ee',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a0a09c" strokeWidth="1.75">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
            <p style={{ fontSize: 14, color: '#6b6b67' }}>No images uploaded yet.</p>
            <p style={{ fontSize: 13, color: '#a0a09c', marginTop: 4 }}>
              Upload images when editing or creating a post.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 16,
          }}>
            {images.map((img) => (
              <div
                key={img.url}
                style={{
                  background: '#ffffff', border: '1px solid #e8e8e6',
                  borderRadius: 10, overflow: 'hidden',
                }}
              >
                <div style={{ position: 'relative', paddingTop: '60%', background: '#f4f4f3' }}>
                  <img
                    src={img.url}
                    alt={img.pathname}
                    style={{
                      position: 'absolute', inset: 0,
                      width: '100%', height: '100%',
                      objectFit: 'cover',
                    }}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                  />
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <p style={{
                    fontSize: 12, color: '#0f0f0e', fontWeight: 500,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    marginBottom: 4,
                  }}>
                    {img.pathname.split('/').pop()}
                  </p>
                  <p style={{ fontSize: 11, color: '#a0a09c', marginBottom: 8 }}>
                    {formatSize(img.size)} · {formatDate(img.uploadedAt)}
                  </p>
                  <button
                    onClick={() => copyUrl(img.url)}
                    style={{
                      width: '100%', padding: '6px 10px', borderRadius: 5,
                      border: '1px solid #e8e8e6',
                      background: copied === img.url ? '#f0fdf4' : '#ffffff',
                      color: copied === img.url ? '#16a34a' : '#3d3d3a',
                      fontSize: 12, fontWeight: 500, cursor: 'pointer',
                      fontFamily: 'Geist, sans-serif',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {copied === img.url ? '✓ Copied!' : 'Copy URL'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
