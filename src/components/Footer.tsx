'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer
      style={{
        background: '#ffffff',
        borderTop: '1px solid #e8e8e6',
        padding: '64px 0 32px',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
        }}
      >
        {/* 4-column grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 48,
            marginBottom: 56,
          }}
          className="footer-grid"
        >
          {/* Col 1: Brand */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Link
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                textDecoration: 'none',
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 7,
                  background: '#0f0f0e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 16,
                  flexShrink: 0,
                }}
              >
                a
              </div>
              <span
                style={{
                  fontWeight: 600,
                  fontSize: 16,
                  color: '#0f0f0e',
                  letterSpacing: '-0.02em',
                }}
              >
                articlos
              </span>
            </Link>
            <p
              style={{
                fontSize: 13,
                color: '#6b6b67',
                lineHeight: 1.6,
                maxWidth: 200,
              }}
            >
              AI-powered article generation for content teams that want to rank.
            </p>
            <p style={{ fontSize: 12, color: '#a0a09c', marginTop: 4 }}>
              © 2026 PAPINGU L.L.C.
            </p>
          </div>

          {/* Col 2: Product */}
          <div>
            <h4
              style={{
                fontSize: 12,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#6b6b67',
                marginBottom: 16,
              }}
            >
              Product
            </h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Features', href: '/#features' },
                { label: 'Pricing', href: '/pricing' },
                { label: 'Blog', href: '/blog' },
                { label: 'Changelog', href: 'https://app.articlos.com/changelog' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  style={{
                    fontSize: 14,
                    color: '#6b6b67',
                    textDecoration: 'none',
                    transition: 'color 0.15s ease',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#0f0f0e' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#6b6b67' }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3: Company */}
          <div>
            <h4
              style={{
                fontSize: 12,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#6b6b67',
                marginBottom: 16,
              }}
            >
              Company
            </h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'About', href: '/about' },
                { label: 'Terms', href: '/terms' },
                { label: 'Privacy', href: '/privacy' },
                { label: 'Contact', href: 'mailto:hello@articlos.com' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  style={{
                    fontSize: 14,
                    color: '#6b6b67',
                    textDecoration: 'none',
                    transition: 'color 0.15s ease',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#0f0f0e' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#6b6b67' }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 4: Connect */}
          <div>
            <h4
              style={{
                fontSize: 12,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#6b6b67',
                marginBottom: 16,
              }}
            >
              Connect
            </h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a
                href="https://twitter.com/articlos"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 14,
                  color: '#6b6b67',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#0f0f0e' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#6b6b67' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.733-8.835L2.25 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Twitter / X
              </a>
              <a
                href="https://linkedin.com/company/articlos"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 14,
                  color: '#6b6b67',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#0f0f0e' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#6b6b67' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid #e8e8e6',
            paddingTop: 24,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <p style={{ fontSize: 13, color: '#a0a09c' }}>
            Built with ❤️ for content creators
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  )
}
