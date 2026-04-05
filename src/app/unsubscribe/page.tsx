'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Link from 'next/link'

function UnsubscribeContent() {
  const params = useSearchParams()
  const rawEmail = params.get('email') || ''
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  useEffect(() => {
    if (rawEmail) {
      try {
        setEmail(atob(rawEmail))
      } catch {
        setEmail(rawEmail)
      }
    }
  }, [rawEmail])

  async function handleUnsubscribe() {
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section
      style={{
        minHeight: 'calc(100vh - 200px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
        background: '#fafaf9',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        {status === 'done' ? (
          <>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: '#f0fdf4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1
              style={{
                fontSize: 'clamp(28px, 5vw, 40px)',
                fontWeight: 700,
                letterSpacing: '-0.04em',
                marginBottom: 12,
                color: '#0f0f0e',
              }}
            >
              You&apos;ve been unsubscribed
            </h1>
            <p style={{ fontSize: 17, color: '#6b6b67', lineHeight: 1.6, marginBottom: 32 }}>
              {email} has been removed from our newsletter. You won&apos;t receive any more emails from us.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/"
                style={{
                  padding: '10px 22px',
                  background: '#0f0f0e',
                  color: '#ffffff',
                  borderRadius: 6,
                  fontWeight: 600,
                  fontSize: 14,
                  textDecoration: 'none',
                }}
              >
                Back to home
              </Link>
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: '#f9f9f8',
                border: '1px solid #e8e8e6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#6b6b67" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>

            <h1
              style={{
                fontSize: 'clamp(28px, 5vw, 40px)',
                fontWeight: 700,
                letterSpacing: '-0.04em',
                marginBottom: 12,
                color: '#0f0f0e',
              }}
            >
              Unsubscribe
            </h1>
            <p style={{ fontSize: 17, color: '#6b6b67', lineHeight: 1.6, marginBottom: 28 }}>
              {email
                ? <>Are you sure you want to remove <strong style={{ color: '#0f0f0e', fontWeight: 500 }}>{email}</strong> from the articlos newsletter?</>
                : 'Enter your email address to unsubscribe from the articlos newsletter.'}
            </p>

            {!email && (
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 7,
                  border: '1px solid #e8e8e6',
                  fontSize: 14,
                  color: '#0f0f0e',
                  outline: 'none',
                  marginBottom: 20,
                  boxSizing: 'border-box',
                  background: '#ffffff',
                  fontFamily: 'inherit',
                }}
              />
            )}

            {status === 'error' && (
              <p style={{ fontSize: 13, color: '#dc2626', marginBottom: 16 }}>
                Something went wrong. Please try again.
              </p>
            )}

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={handleUnsubscribe}
                disabled={status === 'loading' || !email}
                style={{
                  padding: '10px 22px',
                  background: '#0f0f0e',
                  color: '#ffffff',
                  borderRadius: 6,
                  fontWeight: 600,
                  fontSize: 14,
                  border: 'none',
                  cursor: status === 'loading' || !email ? 'not-allowed' : 'pointer',
                  opacity: status === 'loading' || !email ? 0.5 : 1,
                  fontFamily: 'inherit',
                }}
              >
                {status === 'loading' ? 'Unsubscribing…' : 'Unsubscribe'}
              </button>
              <Link
                href="/"
                style={{
                  padding: '10px 22px',
                  background: '#ffffff',
                  color: '#0f0f0e',
                  borderRadius: 6,
                  fontWeight: 500,
                  fontSize: 14,
                  border: '1px solid #e8e8e6',
                  textDecoration: 'none',
                }}
              >
                Cancel
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default function UnsubscribePage() {
  return (
    <>
      <Nav />
      <main style={{ paddingTop: 60 }}>
        <Suspense fallback={<div style={{ minHeight: 'calc(100vh - 200px)', background: '#fafaf9' }} />}>
          <UnsubscribeContent />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
