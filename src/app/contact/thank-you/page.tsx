import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Message received',
  robots: { index: false },
}

export default function ThankYouPage() {
  return (
    <>
      <Nav />
      <main style={{ paddingTop: 60 }}>
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
              Message received!
            </h1>
            <p style={{ fontSize: 17, color: '#6b6b67', lineHeight: 1.6, marginBottom: 32 }}>
              Thanks for reaching out. We&apos;ll get back to you within one business day.
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
              <Link
                href="/blog"
                style={{
                  padding: '10px 22px',
                  background: '#ffffff',
                  color: '#0f0f0e',
                  borderRadius: 6,
                  fontWeight: 500,
                  fontSize: 14,
                  textDecoration: 'none',
                  border: '1px solid #e8e8e6',
                }}
              >
                Browse the blog
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
