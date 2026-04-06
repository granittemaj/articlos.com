'use client'

import { useState } from 'react'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'loading') return
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong.')
      setStatus('success')
      setEmail('')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
      setStatus('error')
    }
  }

  return (
    <section style={{
      background: 'var(--cta-bg)',
      padding: '72px 24px',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        {/* Icon */}
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: 'var(--cta-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cta-text-muted)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>

        <h2 style={{
          fontSize: 'clamp(22px, 4vw, 30px)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          color: 'var(--cta-text)',
          marginBottom: 10,
        }}>
          Stay ahead of the content curve
        </h2>
        <p style={{
          fontSize: 15,
          color: 'var(--cta-text-muted)',
          lineHeight: 1.65,
          marginBottom: 28,
        }}>
          Weekly insights on SEO, AI content, and what&apos;s actually working in content marketing — straight to your inbox. No fluff.
        </p>

        {status === 'success' ? (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '12px 20px', borderRadius: 8,
            background: 'rgba(22,163,74,0.15)',
            border: '1px solid rgba(22,163,74,0.3)',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span style={{ fontSize: 14, color: '#4ade80', fontWeight: 500 }}>
              You&apos;re subscribed! We&apos;ll be in touch soon.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, maxWidth: 420, margin: '0 auto' }} className="newsletter-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              style={{
                flex: 1,
                padding: '11px 14px',
                borderRadius: 7,
                border: '1px solid var(--cta-border)',
                background: 'var(--cta-border)',
                color: 'var(--cta-text)',
                fontSize: 14,
                outline: 'none',
                fontFamily: 'Geist, sans-serif',
                minWidth: 0,
              }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--cta-text-muted)' }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--cta-border)' }}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              style={{
                padding: '11px 20px',
                borderRadius: 7,
                background: 'var(--cta-text)',
                color: 'var(--cta-bg)',
                fontSize: 14,
                fontWeight: 600,
                border: 'none',
                cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                fontFamily: 'Geist, sans-serif',
                whiteSpace: 'nowrap',
                transition: 'background 0.15s ease',
                opacity: status === 'loading' ? 0.7 : 1,
              }}
            >
              {status === 'loading' ? 'Subscribing…' : 'Subscribe →'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p style={{ fontSize: 13, color: '#fca5a5', marginTop: 10 }}>{errorMsg}</p>
        )}

        <p style={{ fontSize: 12, color: 'var(--cta-text-muted)', marginTop: 14 }}>
          No spam. Unsubscribe any time.
        </p>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .newsletter-form { flex-direction: column !important; }
        }
      `}</style>
    </section>
  )
}
