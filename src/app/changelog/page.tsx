import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ScrollAnimations from '../ScrollAnimations'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Changelog — What\'s New in articlos',
  description: 'Every feature, improvement, and fix shipped to articlos. Grouped by month, newest first.',
  alternates: { canonical: '/changelog' },
  openGraph: {
    title: 'articlos changelog',
    description: 'Every feature, improvement, and fix shipped to articlos.',
    url: 'https://articlos.com/changelog',
  },
}

export const dynamic = 'force-dynamic'

interface Entry {
  title: string
  description: string
}

interface Section {
  month: string
  entries: Entry[]
}

async function getChangelog(): Promise<Section[]> {
  try {
    const record = await prisma.siteContent.findUnique({ where: { key: 'changelog' } })
    if (!record) return []
    const parsed = JSON.parse(record.value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default async function ChangelogPage() {
  const sections = await getChangelog()

  return (
    <>
      <Nav />
      <ScrollAnimations />

      <main style={{ background: 'var(--bg)' }}>
        {/* Hero */}
        <section style={{ padding: '96px 24px 48px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
            <div
              className="fade-up"
              style={{
                fontSize: 12, fontWeight: 600, color: 'var(--text-muted)',
                textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 18,
              }}
            >
              Changelog
            </div>
            <h1
              className="fade-up fade-up-delay-1"
              style={{
                fontSize: 'clamp(36px, 5vw, 56px)',
                lineHeight: 1.1, letterSpacing: '-0.03em',
                fontWeight: 700, marginBottom: 20, color: 'var(--text)',
              }}
            >
              What&apos;s shipped.
            </h1>
            <p className="fade-up fade-up-delay-2" style={{ fontSize: 18, color: 'var(--text-muted)', lineHeight: 1.65 }}>
              Every feature, improvement, and fix we&apos;ve shipped to articlos — grouped by month, newest first.
            </p>
          </div>
        </section>

        {/* Entries */}
        <section style={{ padding: '72px 24px' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            {sections.length === 0 ? (
              <div
                className="fade-up"
                style={{
                  textAlign: 'center',
                  padding: '60px 24px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                }}
              >
                <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                  Nothing published here yet. We ship weekly — check back soon, or subscribe to the <Link href="/blog" style={{ color: 'var(--text)', textDecoration: 'underline' }}>blog</Link> for weekly summaries.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
                {sections.map((section, si) => (
                  <div key={`${section.month}-${si}`} className={`fade-up fade-up-delay-${Math.min(si + 1, 6)}`}>
                    <h2 style={{
                      fontSize: 13, fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.12em',
                      color: 'var(--text-muted)', marginBottom: 18,
                    }}>
                      {section.month}
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {section.entries.map((entry, ei) => (
                        <article
                          key={`${section.month}-${ei}`}
                          style={{
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 12,
                            padding: '22px 26px',
                          }}
                        >
                          <h3 style={{
                            fontSize: 17, fontWeight: 700, letterSpacing: '-0.015em',
                            color: 'var(--text)', margin: 0, marginBottom: 8,
                          }}>
                            {entry.title}
                          </h3>
                          <p style={{
                            fontSize: 15, color: 'var(--text-muted)',
                            lineHeight: 1.6, margin: 0,
                          }}>
                            {entry.description}
                          </p>
                        </article>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: '72px 24px', borderTop: '1px solid var(--border)' }}>
          <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 20 }}>
              Something you want to see next? Tell us what would move the needle on your content operation.
            </p>
            <Link href="/contact" className="btn btn-primary btn-lg">Contact us</Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
