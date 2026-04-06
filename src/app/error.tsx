'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main style={{
      minHeight: '70vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '120px 24px 80px',
      background: '#f9f9f8',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: '#fef2f2', border: '1px solid #fca5a5',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h1 style={{
          fontSize: 'clamp(22px, 4vw, 28px)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          color: '#0f0f0e',
          marginBottom: 12,
        }}>
          Something went wrong
        </h1>
        <p style={{
          fontSize: 15,
          color: '#6b6b67',
          lineHeight: 1.65,
          marginBottom: 28,
        }}>
          An unexpected error occurred. Please try again or go back to the homepage.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={reset}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '11px 22px', borderRadius: 7,
              background: '#0f0f0e', color: '#ffffff',
              fontWeight: 600, fontSize: 14,
              border: 'none', cursor: 'pointer',
              fontFamily: 'Geist, sans-serif',
            }}
          >
            Try again
          </button>
          <a
            href="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '11px 22px', borderRadius: 7,
              border: '1px solid #e8e8e6', background: '#ffffff',
              color: '#3d3d3a', fontWeight: 500, fontSize: 14, textDecoration: 'none',
            }}
          >
            Back to home
          </a>
        </div>
      </div>
    </main>
  )
}
