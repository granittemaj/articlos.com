import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Careers — Join the Team Building What\'s Next',
  description: 'We\'re building the content intelligence system that never stops. If that excites you, we\'d love to meet you.',
  alternates: { canonical: '/careers' },
}

export default function CareersPage() {
  return (
    <>
      <Nav />

      {/* Hero */}
      <section style={{
        paddingTop: 128, paddingBottom: 80,
        paddingLeft: 24, paddingRight: 24,
        background: '#f9f9f8',
        borderBottom: '1px solid #e4e4e2',
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-block', fontSize: 11, fontWeight: 600,
            color: '#9b9b96', textTransform: 'uppercase',
            letterSpacing: '0.12em', marginBottom: 20,
          }}>
            Careers
          </div>
          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 700, letterSpacing: '-0.045em',
            lineHeight: 1.06, color: '#0f0f0e', marginBottom: 20,
          }}>
            Build the future of<br />content intelligence
          </h1>
          <p style={{
            fontSize: 18, color: '#6b6b67',
            lineHeight: 1.65, maxWidth: 520, margin: '0 auto',
          }}>
            We&apos;re a small, ambitious team building AI systems that help content teams win at organic search.
            We move fast, care deeply about craft, and love what we do.
          </p>
        </div>
      </section>

      {/* No openings */}
      <section style={{ padding: '96px 24px', background: '#ffffff' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{
            background: '#f9f9f8',
            border: '1px solid #e4e4e2',
            borderRadius: 12,
            padding: '64px 48px',
            textAlign: 'center',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: '#f4f4f3', border: '1px solid #e4e4e2',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a0a09c" strokeWidth="1.75">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              </svg>
            </div>
            <h2 style={{
              fontSize: 22, fontWeight: 700,
              letterSpacing: '-0.03em', color: '#0f0f0e', marginBottom: 12,
            }}>
              No open positions right now
            </h2>
            <p style={{
              fontSize: 15, color: '#6b6b67',
              lineHeight: 1.65, maxWidth: 400, margin: '0 auto 28px',
            }}>
              We don&apos;t have any open roles at the moment, but we&apos;re always interested in hearing from
              talented people who are passionate about AI and content.
            </p>
            <a
              href="mailto:hello@articlos.com"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#0f0f0e', color: '#ffffff',
                padding: '11px 22px', borderRadius: 7,
                fontSize: 14, fontWeight: 500, textDecoration: 'none',
                transition: 'opacity 0.15s ease',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              Send us a message
            </a>
          </div>

          {/* Values */}
          <div style={{ marginTop: 72 }}>
            <h2 style={{
              fontSize: 24, fontWeight: 700,
              letterSpacing: '-0.03em', marginBottom: 32,
            }}>
              How we work
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="careers-grid">
              {[
                {
                  icon: '⟳',
                  title: 'Move fast',
                  desc: 'We ship weekly, learn from users, and iterate. Bureaucracy slows us down — we avoid it.',
                },
                {
                  icon: '✦',
                  title: 'Craft matters',
                  desc: 'We care about the details — in code, design, and writing. Good enough is rarely good enough.',
                },
                {
                  icon: '▦',
                  title: 'Remote-first',
                  desc: 'Work from wherever you do your best thinking. We coordinate asynchronously and meet when it matters.',
                },
                {
                  icon: '◈',
                  title: 'Customer obsessed',
                  desc: 'Every decision starts with the customer. We build what solves real problems, not what sounds impressive.',
                },
              ].map((v) => (
                <div key={v.title} style={{
                  background: '#f9f9f8',
                  border: '1px solid #e4e4e2',
                  borderRadius: 10, padding: '24px',
                }}>
                  <div style={{
                    fontSize: 20, marginBottom: 12, color: '#0f0f0e',
                  }}>
                    {v.icon}
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{v.title}</h3>
                  <p style={{ fontSize: 14, color: '#6b6b67', lineHeight: 1.6 }}>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 600px) {
          .careers-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
