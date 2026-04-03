import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false },
}

export default function NotFound() {
  return (
    <>
      <Nav />
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
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: '-0.05em',
            color: '#e8e8e6',
            lineHeight: 1,
            marginBottom: 16,
          }}>404</div>
          <h1 style={{
            fontSize: 'clamp(24px, 4vw, 32px)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: '#0f0f0e',
            marginBottom: 12,
          }}>
            Page not found
          </h1>
          <p style={{
            fontSize: 16,
            color: '#6b6b67',
            lineHeight: 1.65,
            marginBottom: 32,
          }}>
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '11px 22px', borderRadius: 7,
                background: '#0f0f0e', color: '#ffffff',
                fontWeight: 600, fontSize: 14, textDecoration: 'none',
              }}
            >
              ← Back to home
            </Link>
            <Link
              href="/blog"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '11px 22px', borderRadius: 7,
                border: '1px solid #e8e8e6', background: '#ffffff',
                color: '#3d3d3a', fontWeight: 500, fontSize: 14, textDecoration: 'none',
              }}
            >
              Browse the blog
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
