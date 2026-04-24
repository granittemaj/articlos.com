import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ScrollAnimations from '@/app/ScrollAnimations'
import { groupedComparisons, Comparison } from '@/lib/comparisons'

export const metadata: Metadata = {
  title: 'Compare articlos — Honest Comparisons vs Every Content Tool',
  description: 'See how articlos compares to Frase, Surfer SEO, Clearscope, MarketMuse, Writesonic, Jasper, Copy.ai, Rytr, ChatGPT, Claude, and Gemini. Side-by-side feature tables and who-should-pick-what.',
  alternates: { canonical: '/compare' },
  openGraph: {
    title: 'Compare articlos vs every content tool',
    description: 'Honest side-by-side comparisons. See how articlos stacks up against SEO platforms, AI writers, and raw LLMs.',
    url: 'https://articlos.com/compare',
  },
}

function CompareCard({ c }: { c: Comparison }) {
  return (
    <Link
      href={`/compare/vs-${c.slug}`}
      style={{
        display: 'block',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: 24,
        textDecoration: 'none',
        transition: 'all 0.15s ease',
      }}
      className="compare-card"
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em', margin: 0 }}>
          vs {c.competitor}
        </h3>
        <span style={{ fontSize: 18, color: 'var(--text-muted)' }}>→</span>
      </div>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
        {c.hubBlurb}
      </p>
    </Link>
  )
}

function Group({ title, subtitle, items }: { title: string; subtitle: string; items: Comparison[] }) {
  return (
    <div style={{ marginBottom: 56 }}>
      <div className="fade-up" style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text)', marginBottom: 6 }}>
          {title}
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>{subtitle}</p>
      </div>
      <div className="fade-up fade-up-delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {items.map((c) => <CompareCard key={c.slug} c={c} />)}
      </div>
    </div>
  )
}

export default function ComparePage() {
  const { contentPlatforms, aiWriters, llms } = groupedComparisons()

  return (
    <>
      <Nav />
      <ScrollAnimations />

      <main style={{ background: 'var(--bg)' }}>
        {/* Hero */}
        <section style={{ padding: '96px 24px 56px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
            <h1
              className="fade-up"
              style={{
                fontSize: 'clamp(36px, 5vw, 56px)',
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                fontWeight: 700,
                marginBottom: 20,
                color: 'var(--text)',
              }}
            >
              See how articlos compares.
            </h1>
            <p className="fade-up fade-up-delay-1" style={{ fontSize: 18, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Honest, side-by-side comparisons with every content tool we get asked about — SEO platforms, AI writers, and raw LLMs. We show where we win and where the other side is stronger.
            </p>
          </div>
        </section>

        {/* Groups */}
        <section style={{ padding: '72px 24px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <Group
              title="Content & SEO platforms"
              subtitle="Tools teams use to research, brief, and optimize long-form SEO content."
              items={contentPlatforms}
            />
            <Group
              title="AI writing assistants"
              subtitle="General-purpose AI writers with templates and chat interfaces."
              items={aiWriters}
            />
            <Group
              title="Raw LLMs"
              subtitle="What you get if you pipe ChatGPT, Claude, or Gemini into your content workflow manually."
              items={llms}
            />
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: '80px 24px', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
          <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 700, marginBottom: 14, letterSpacing: '-0.02em', color: 'var(--text)' }}>
              Ready to see the loop?
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.6 }}>
              Start the 7-day free trial. No credit card. Cancel anytime.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/pricing" className="btn btn-primary btn-lg">Start free trial</Link>
              <Link href="/#features" className="btn btn-ghost btn-lg">See how it works</Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style>{`
        .compare-card:hover {
          border-color: var(--text) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </>
  )
}
