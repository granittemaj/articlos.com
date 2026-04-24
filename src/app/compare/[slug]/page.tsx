import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ScrollAnimations from '@/app/ScrollAnimations'
import { comparisons, getComparison } from '@/lib/comparisons'

export function generateStaticParams() {
  return comparisons.map((c) => ({ slug: `vs-${c.slug}` }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const c = getComparison(slug)
  if (!c) return {}
  const url = `https://articlos.com/compare/vs-${c.slug}`
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: { canonical: `/compare/vs-${c.slug}` },
    openGraph: {
      title: c.metaTitle,
      description: c.metaDescription,
      url,
      type: 'article',
    },
  }
}

function Cell({ value }: { value: boolean | string }) {
  if (value === true) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#16a34a', fontWeight: 600, fontSize: 14 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Yes
      </span>
    )
  }
  if (value === false) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 14 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
        No
      </span>
    )
  }
  return <span style={{ fontSize: 14, color: 'var(--text)' }}>{value}</span>
}

export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params
  // Accept either `/compare/vs-frase` (via rewrites) or `/compare/frase`
  const slug = rawSlug.startsWith('vs-') ? rawSlug.slice(3) : rawSlug
  const c = getComparison(slug)
  if (!c) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: c.metaTitle,
    description: c.metaDescription,
    author: { '@type': 'Organization', name: 'articlos' },
    publisher: { '@type': 'Organization', name: 'articlos', url: 'https://articlos.com' },
    mainEntityOfPage: `https://articlos.com/compare/vs-${c.slug}`,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav />
      <ScrollAnimations />

      <main style={{ background: 'var(--bg)' }}>
        {/* Hero */}
        <section style={{ padding: '96px 24px 56px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
            <div className="fade-up" style={{ marginBottom: 20 }}>
              <Link
                href="/compare"
                style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                ← All comparisons
              </Link>
            </div>
            <h1
              className="fade-up fade-up-delay-1"
              style={{
                fontSize: 'clamp(36px, 5vw, 56px)',
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                fontWeight: 700,
                marginBottom: 20,
                color: 'var(--text)',
              }}
            >
              {c.tagline}
            </h1>
            <p className="fade-up fade-up-delay-2" style={{ fontSize: 18, color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 720, margin: '0 auto' }}>
              {c.heroIntro}
            </p>
            <div className="fade-up fade-up-delay-3" style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 36, flexWrap: 'wrap' }}>
              <Link href="/pricing" className="btn btn-primary btn-lg">Start free trial</Link>
              <Link href="/features" className="btn btn-ghost btn-lg">See all features</Link>
            </div>
          </div>
        </section>

        {/* Why articlos */}
        <section style={{ padding: '72px 24px' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <h2 className="fade-up" style={{ fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 700, marginBottom: 14, letterSpacing: '-0.02em', color: 'var(--text)' }}>
              Why content teams pick articlos over {c.competitor}
            </h2>
            <p className="fade-up fade-up-delay-1" style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 32, maxWidth: 640 }}>
              articlos is the only tool that closes the loop from Search Console opportunity to published WordPress post to decay-triggered rewrite.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              {c.whyArticlos.map((item, i) => (
                <li
                  key={i}
                  className={`fade-up fade-up-delay-${Math.min(i + 1, 6)}`}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    padding: '18px 20px',
                    display: 'flex',
                    gap: 12,
                    alignItems: 'flex-start',
                  }}
                >
                  <span style={{ color: '#16a34a', marginTop: 2, flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--text)' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Feature comparison table */}
        <section style={{ padding: '72px 24px', background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <h2 className="fade-up" style={{ fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 700, marginBottom: 32, letterSpacing: '-0.02em', color: 'var(--text)' }}>
              Feature-by-feature
            </h2>
            <div className="fade-up fade-up-delay-1" style={{ overflowX: 'auto', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>Feature</th>
                    <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>articlos</th>
                    <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{c.competitor}</th>
                  </tr>
                </thead>
                <tbody>
                  {c.features.map((row, i) => (
                    <tr key={i} style={{ borderBottom: i === c.features.length - 1 ? 'none' : '1px solid var(--border)' }}>
                      <td style={{ padding: '14px 20px', fontSize: 14, color: 'var(--text)' }}>{row.feature}</td>
                      <td style={{ padding: '14px 20px' }}><Cell value={row.articlos} /></td>
                      <td style={{ padding: '14px 20px' }}><Cell value={row.competitor} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Where competitor wins */}
        <section style={{ padding: '72px 24px' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <h2 className="fade-up" style={{ fontSize: 'clamp(24px, 2.6vw, 32px)', fontWeight: 700, marginBottom: 14, letterSpacing: '-0.02em', color: 'var(--text)' }}>
              Where {c.competitor} is stronger
            </h2>
            <p className="fade-up fade-up-delay-1" style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 28, maxWidth: 640 }}>
              We believe honest comparisons beat marketing pages. {c.competitor} does a few things better than we do — here is where they win.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {c.competitorStrengths.map((item, i) => (
                <li
                  key={i}
                  className={`fade-up fade-up-delay-${Math.min(i + 1, 6)}`}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    padding: '16px 20px',
                    fontSize: 15,
                    lineHeight: 1.55,
                    color: 'var(--text)',
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Who should pick which */}
        <section style={{ padding: '72px 24px', borderTop: '1px solid var(--border)' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <h2 className="fade-up" style={{ fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 700, marginBottom: 32, letterSpacing: '-0.02em', color: 'var(--text)' }}>
              Which one should you pick?
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              <div className="fade-up fade-up-delay-1" style={{ border: '1.5px solid var(--text)', borderRadius: 12, padding: 24, background: 'var(--bg)' }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#16a34a', marginBottom: 12 }}>Pick articlos if</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {c.pickArticlos.map((item, i) => (
                    <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, lineHeight: 1.5, color: 'var(--text)' }}>
                      <span style={{ color: '#16a34a', marginTop: 3, flexShrink: 0 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/pricing" className="btn btn-primary" style={{ marginTop: 20, width: '100%', justifyContent: 'center' }}>
                  Start free trial
                </Link>
              </div>
              <div className="fade-up fade-up-delay-2" style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 24, background: 'var(--surface)' }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 12 }}>Pick {c.competitor} if</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {c.pickCompetitor.map((item, i) => (
                    <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, lineHeight: 1.5, color: 'var(--text)' }}>
                      <span style={{ color: 'var(--text-muted)', marginTop: 3, flexShrink: 0 }}>•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: '80px 24px', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
          <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 700, marginBottom: 14, letterSpacing: '-0.02em', color: 'var(--text)' }}>
              See the loop in action
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.6 }}>
              Start the 7-day free trial. No credit card. Cancel anytime.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/pricing" className="btn btn-primary btn-lg">Start free trial</Link>
              <Link href="/compare" className="btn btn-ghost btn-lg">Compare other tools</Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
