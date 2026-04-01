'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(to bottom, #d4d0c8, #b8b4a8)',
      borderTop: '2px solid #fff',
    }}>
      {/* Win2k "taskbar" style footer bar */}
      <div style={{
        background: 'linear-gradient(to bottom, #d4d0c8, #c4c0b8)',
        borderBottom: '1px solid #808080',
        padding: '6px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        {/* Logo / brand as a program button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '2px 10px',
          borderTop: '2px solid #fff',
          borderLeft: '2px solid #fff',
          borderBottom: '2px solid #404040',
          borderRight: '2px solid #404040',
          background: '#ece9d8',
          fontWeight: 'bold',
          fontSize: 11,
          fontFamily: 'Tahoma, sans-serif',
        }}>
          <span style={{
            display: 'inline-grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 1,
            width: 12,
            height: 12,
          }}>
            <span style={{ background: '#cc0000', display: 'block' }} />
            <span style={{ background: '#006600', display: 'block' }} />
            <span style={{ background: '#0000cc', display: 'block' }} />
            <span style={{ background: '#cc6600', display: 'block' }} />
          </span>
          articlos — Content Intelligence
        </div>
      </div>

      {/* Main footer content as a Win2k window */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px 16px' }}>
        <div style={{
          background: '#ece9d8',
          borderTop: '0',
          borderLeft: '2px solid #fff',
          borderRight: '2px solid #404040',
          borderBottom: '2px solid #404040',
        }}>
          {/* Title bar */}
          <div style={{
            background: 'linear-gradient(to right, #808080, #b0a8a0)',
            color: '#fff',
            fontSize: 11,
            fontWeight: 'bold',
            padding: '3px 6px',
            fontFamily: 'Tahoma, sans-serif',
          }}>
            articlos.com — Inactive
          </div>

          {/* Footer grid content */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 0,
            padding: 0,
          }} className="footer-grid">

            {/* Col 1: Brand */}
            <div style={{
              padding: 16,
              borderRight: '1px solid #d4d0c8',
            }}>
              <div style={{
                fontSize: 10,
                fontWeight: 'bold',
                textTransform: 'uppercase',
                color: '#808080',
                marginBottom: 8,
                letterSpacing: '0.06em',
                borderBottom: '2px solid #808080',
                paddingBottom: 4,
              }}>
                About
              </div>
              <Link
                href="/"
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  textDecoration: 'none', marginBottom: 8,
                }}
              >
                <span style={{
                  display: 'inline-grid', gridTemplateColumns: '1fr 1fr', gap: 1,
                  width: 16, height: 16, flexShrink: 0,
                }}>
                  <span style={{ background: '#cc0000', display: 'block' }} />
                  <span style={{ background: '#006600', display: 'block' }} />
                  <span style={{ background: '#0000cc', display: 'block' }} />
                  <span style={{ background: '#cc6600', display: 'block' }} />
                </span>
                <span style={{ fontWeight: 'bold', fontSize: 12, color: '#000', fontFamily: 'Tahoma, sans-serif' }}>
                  articlos
                </span>
              </Link>
              <p style={{ fontSize: 11, color: '#404040', lineHeight: 1.5, maxWidth: 180 }}>
                AI-powered article generation for content teams that want to rank.
              </p>
              <p style={{ fontSize: 10, color: '#808080', marginTop: 8 }}>
                © 2026 PAPINGU L.L.C.
              </p>
            </div>

            {/* Col 2: Product */}
            <div style={{ padding: 16, borderRight: '1px solid #d4d0c8' }}>
              <div style={{
                fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase',
                color: '#808080', marginBottom: 8, letterSpacing: '0.06em',
                borderBottom: '2px solid #808080', paddingBottom: 4,
              }}>
                Product
              </div>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { label: 'Features', href: '/#features' },
                  { label: 'Contact', href: '/#contact' },
                  { label: 'Blog', href: '/blog' },
                  { label: 'Changelog', href: 'https://app.articlos.com/changelog' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    style={{
                      fontSize: 11, color: '#0000ee',
                      textDecoration: 'underline', padding: '2px 0',
                      display: 'flex', alignItems: 'center', gap: 4,
                    }}
                  >
                    <span style={{ color: '#808080', fontSize: 10 }}>▸</span>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Col 3: Company */}
            <div style={{ padding: 16, borderRight: '1px solid #d4d0c8' }}>
              <div style={{
                fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase',
                color: '#808080', marginBottom: 8, letterSpacing: '0.06em',
                borderBottom: '2px solid #808080', paddingBottom: 4,
              }}>
                Company
              </div>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { label: 'About', href: '/about' },
                  { label: 'FAQ', href: '/faq' },
                  { label: 'Terms', href: '/terms' },
                  { label: 'Privacy', href: '/privacy' },
                  { label: 'Contact', href: 'mailto:hello@articlos.com' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    style={{
                      fontSize: 11, color: '#0000ee',
                      textDecoration: 'underline', padding: '2px 0',
                      display: 'flex', alignItems: 'center', gap: 4,
                    }}
                  >
                    <span style={{ color: '#808080', fontSize: 10 }}>▸</span>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Col 4: Connect */}
            <div style={{ padding: 16 }}>
              <div style={{
                fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase',
                color: '#808080', marginBottom: 8, letterSpacing: '0.06em',
                borderBottom: '2px solid #808080', paddingBottom: 4,
              }}>
                Connect
              </div>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <a
                  href="https://twitter.com/articlos"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 11, color: '#0000ee', textDecoration: 'underline', padding: '2px 0', display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <span style={{ color: '#808080', fontSize: 10 }}>▸</span>
                  Twitter / X
                </a>
                <a
                  href="https://linkedin.com/company/articlos"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 11, color: '#0000ee', textDecoration: 'underline', padding: '2px 0', display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <span style={{ color: '#808080', fontSize: 10 }}>▸</span>
                  LinkedIn
                </a>
              </nav>

              {/* System info box */}
              <div style={{
                marginTop: 16,
                border: '1px inset #808080',
                background: '#fff',
                padding: '6px 8px',
                fontSize: 10,
                color: '#404040',
                lineHeight: 1.5,
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: 2 }}>System Info</div>
                <div>OS: articlos v2.6.0</div>
                <div>Status: ● Running</div>
                <div>Uptime: 99.9%</div>
              </div>
            </div>
          </div>

          {/* Status bar */}
          <div style={{
            padding: '3px 8px',
            borderTop: '2px solid #808080',
            background: '#d4d0c8',
            fontSize: 10,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span>Built for content creators</span>
            <span style={{ color: '#808080' }}>articlos.com — Internet Zone</span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
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
