import { prisma } from '@/lib/prisma'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import BlogCard from '@/components/BlogCard'
import ScrollAnimations from './ScrollAnimations'
import CountUp from '@/components/CountUp'
import NewsletterSection from '@/components/NewsletterSection'

export const dynamic = 'force-dynamic'

async function getSiteContent() {
  try {
    const records = await prisma.siteContent.findMany()
    const map: Record<string, string> = {}
    for (const r of records) map[r.key] = r.value
    return map
  } catch { return {} }
}

async function getLatestPosts() {
  try {
    return await prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
      select: { id: true, title: true, slug: true, excerpt: true, featuredImage: true, tags: true, publishedAt: true, createdAt: true },
    })
  } catch { return [] }
}

const defaults = {
  hero_title: 'The content intelligence\nsystem that never stops.',
  hero_subtitle: 'articlos discovers what to write, plans what matters, generates high-quality articles, measures performance, and continuously improves content — automatically.',
  cta_title: 'Start generating content today',
  cta_subtitle: 'Join 2,400+ websites already using articlos to build organic traffic on autopilot.',
}

const logoNames = ['TechCrunch', 'ContentOps', 'GrowthLab', 'DigitalMint', 'SeedRound', 'Blogaroo', 'RankFast', 'ContentHive']

export default async function HomePage() {
  const [content, posts] = await Promise.all([getSiteContent(), getLatestPosts()])
  const c = (key: keyof typeof defaults) => content[key] || defaults[key]

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://articlos.com/#organization',
        name: 'articlos',
        url: 'https://articlos.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://articlos.com/favicon.svg',
        },
        sameAs: [],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://articlos.com/#website',
        url: 'https://articlos.com',
        name: 'articlos',
        description: 'The content intelligence system that never stops.',
        publisher: { '@id': 'https://articlos.com/#organization' },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://articlos.com/blog?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://articlos.com/#software',
        name: 'articlos',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        description: 'AI-powered content intelligence system that discovers topics, generates articles, and grows organic traffic automatically.',
        url: 'https://articlos.com',
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'USD',
          lowPrice: '24',
          highPrice: '199',
          offerCount: '3',
        },
        publisher: { '@id': 'https://articlos.com/#organization' },
      },
    ],
  }

  return (
    <>
      <Nav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <ScrollAnimations />

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '128px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--bg)',
      }}>
        {/* Dot grid */}
        <div className="hero-grid" />

        {/* Gradient blobs */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 80% 50% at 50% -5%, rgba(15,15,14,0.05) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 85% 75%, rgba(37,99,235,0.05) 0%, transparent 55%), radial-gradient(ellipse 40% 35% at 15% 70%, rgba(124,58,237,0.04) 0%, transparent 55%)',
        }} />

        <div style={{ maxWidth: 820, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div className="hero-badge" style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 100, padding: '5px 16px 5px 8px',
              fontSize: 12, fontWeight: 500, color: 'var(--text-muted)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.25)',
                borderRadius: 100, padding: '2px 8px',
                fontSize: 11, color: '#16a34a', fontWeight: 600,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a', animation: 'pulse-dot 2s infinite', display: 'inline-block' }} />
                Live
              </span>
              Content Intelligence System
            </div>
          </div>

          {/* Headline */}
          <h1 className="hero-title" style={{
            fontSize: 'clamp(44px, 7.5vw, 80px)',
            fontWeight: 700,
            letterSpacing: '-0.045em',
            lineHeight: 1.04,
            color: 'var(--text)',
            marginBottom: 24,
            whiteSpace: 'pre-line',
          }}>
            {c('hero_title')}
          </h1>

          {/* Subtitle */}
          <p className="hero-sub" style={{
            fontSize: 'clamp(16px, 2vw, 19px)',
            color: 'var(--text-muted)',
            lineHeight: 1.65,
            maxWidth: 580,
            margin: '0 auto 40px',
          }}>
            {c('hero_subtitle')}
          </p>

          {/* CTAs */}
          <div className="hero-ctas" style={{
            display: 'flex', gap: 10, justifyContent: 'center',
            flexWrap: 'wrap', marginBottom: 72,
          }}>
            <a href="https://app.articlos.com/login" className="btn btn-primary btn-lg" style={{ gap: 8 }}>
              Log in
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
            <a href="/contact" className="btn btn-ghost btn-lg">Contact the articlos team</a>
          </div>
        </div>

        {/* Dashboard mockup */}
        <div className="hero-visual hero-mockup-wrap" aria-hidden="true" style={{
          width: '100%', maxWidth: 940,
          position: 'relative', zIndex: 1,
          animation: 'float 7s ease-in-out infinite',
        }}>
          <div style={{
            background: '#ffffff',
            border: '1px solid #e4e4e2',
            borderRadius: 14,
            boxShadow: '0 48px 120px rgba(0,0,0,0.12), 0 12px 32px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.03)',
            overflow: 'hidden',
          }}>
            {/* Browser bar */}
            <div style={{
              padding: '11px 16px', background: '#f4f4f3',
              borderBottom: '1px solid #e4e4e2',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {['#ff5f57', '#febc2e', '#28c840'].map(col => (
                  <div key={col} style={{ width: 11, height: 11, borderRadius: '50%', background: col }} />
                ))}
              </div>
              <div style={{
                flex: 1, background: '#ebebea', borderRadius: 6, height: 24,
                display: 'flex', alignItems: 'center', paddingLeft: 10,
                fontSize: 11, color: '#9b9b96', maxWidth: 260, margin: '0 auto',
              }}>
                app.articlos.com/queue
              </div>
            </div>

            {/* App shell */}
            <div style={{ display: 'flex', flexDirection: 'column', height: 490 }}>

              {/* ── Topbar ── */}
              <div style={{ height: 44, background: '#fff', borderBottom: '1px solid #e4e4e2', display: 'flex', alignItems: 'center', padding: '0 14px', gap: 8, flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
                  <div style={{ width: 26, height: 26, background: '#0f0f0e', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>a</div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0f0f0e', letterSpacing: '-0.3px' }}>articlos</span>
                  <span style={{ fontSize: 12, color: '#c0c0bc', margin: '0 1px' }}>/</span>
                  <span style={{ fontSize: 13, color: '#6b6b67' }}>ContentHub</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#f4f4f3', border: '1px solid #e4e4e2', borderRadius: 6, padding: '0 8px', height: 28, minWidth: 140 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9b9b96" strokeWidth="1.7" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                  <span style={{ fontSize: 11.5, color: '#9b9b96', flex: 1 }}>Search…</span>
                  <span style={{ fontSize: 10, color: '#b0b0aa', background: '#ebebea', border: '1px solid #e4e4e2', borderRadius: 4, padding: '1px 5px' }}>⌘K</span>
                </div>
                <div style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9b9b96' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                </div>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>A</div>
              </div>

              {/* ── Body ── */}
              <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                {/* Sidebar */}
                <div className="mockup-sidebar" style={{ width: 196, flexShrink: 0, background: '#fff', borderRight: '1px solid #e4e4e2', overflowY: 'auto', padding: '10px 8px' }}>
                  {/* Dashboard active */}
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 6, background: '#f4f4f3', color: '#0f0f0e', fontWeight: 600, fontSize: 13, marginBottom: 1 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                      Dashboard
                    </div>
                  </div>
                  {[
                    { label: 'Discover',  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
                    { label: 'Plan',      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><circle cx="3" cy="6" r="2"/><circle cx="21" cy="6" r="2"/><circle cx="3" cy="18" r="2"/><circle cx="21" cy="18" r="2"/><line x1="12" y1="9" x2="4.8" y2="7.2"/><line x1="12" y1="9" x2="19.2" y2="7.2"/><line x1="12" y1="15" x2="4.8" y2="16.8"/><line x1="12" y1="15" x2="19.2" y2="16.8"/></svg> },
                    { label: 'Create',   icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> },
                    { label: 'Optimize', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 6, cursor: 'default', fontSize: 13, fontWeight: 400, color: '#4b4b48', marginBottom: 1 }}>
                      <span style={{ color: '#9b9b96', display: 'flex', flexShrink: 0 }}>{item.icon}</span>{item.label}
                    </div>
                  ))}
                </div>

                {/* ── Main content ── */}
                <div style={{ flex: 1, background: '#fafaf9', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div style={{ padding: '16px 20px 0', background: '#fafaf9', flexShrink: 0 }}>
                    {/* Greeting */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                      <div>
                        <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.3px', color: '#0f0f0e', marginBottom: 2 }}>Good afternoon, Alex.</div>
                        <div style={{ fontSize: 11, color: '#c0c0bc', marginBottom: 4 }}>Thursday 10 April</div>
                        <div style={{ fontSize: 12, color: '#6b6b67', lineHeight: 1.5 }}>Organic clicks up 22% this month · 8 articles gaining traffic · 3 decaying.</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#6b6b67', border: '1px solid #e4e4e2', borderRadius: 6, padding: '5px 10px', background: '#fff', flexShrink: 0 }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
                        Refresh
                      </div>
                    </div>

                    {/* KPI cards with real sparkline paths */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 12 }}>
                      <div style={{ background: '#fff', border: '1px solid #e4e4e2', borderRadius: 8, padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 7, color: '#9b9b96' }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                          <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Organic clicks</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginBottom: 7 }}>
                          <span style={{ fontSize: 22, fontWeight: 700, color: '#0f0f0e', letterSpacing: '-0.5px', lineHeight: 1 }}>2,847</span>
                          <span style={{ fontSize: 11, fontWeight: 600, color: '#16a34a', display: 'flex', alignItems: 'center', gap: 1 }}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="18 15 12 9 6 15"/></svg>22%</span>
                        </div>
                        <svg width="100%" height="34" viewBox="0 0 100 38" preserveAspectRatio="none" style={{ display: 'block' }}>
                          <path d="M 0,28.6 C 2.3,24.5 5.7,29.9 6.9,29.9 C 8,30.1 9.2,27.3 10.3,26 C 11.5,24.8 12.6,22.6 13.8,22.2 C 14.9,21.8 16.1,22.4 17.2,23.5 C 18.4,24.5 19.5,28.4 20.7,28.6 C 21.8,28.8 23,24.8 24.1,24.8 C 25.3,24.8 26.4,28 27.6,28.6 C 28.7,29.2 29.9,27.5 31,28.6 C 32.2,29.7 33.3,35.6 34.5,35 C 35.6,34.4 36.8,25.8 37.9,24.8 C 39.1,23.7 40.2,31.2 41.4,28.6 C 42.5,26 43.7,10.9 44.8,9.4 C 46,7.9 47.1,17.9 48.3,19.6 C 49.4,21.3 50.6,17.1 51.7,19.6 C 52.9,22.2 54,33.3 55.2,35 C 56.3,36.7 57.5,31.2 58.6,29.9 C 59.8,28.6 60.9,29 62.1,27.3 C 63.2,25.6 64.4,20.5 65.5,19.6 C 66.7,18.8 67.8,20.3 69,22.2 C 70.1,24.1 71.3,30.5 72.4,31.2 C 73.6,31.8 74.7,28.6 75.9,26 C 77,23.5 78.2,17.7 79.3,15.8 C 80.5,13.9 81.6,16.4 82.8,14.5 C 83.9,12.6 85.1,4.3 86.2,4.3 C 87.4,4.3 88.5,14.7 89.7,14.5 C 90.8,14.3 92,1.3 93.1,3 C 94.3,4.7 95.4,22.6 96.6,24.8 C 97.7,26.9 99.4,17.3 100,15.8" fill="none" stroke="#16a34a" strokeOpacity="0.7" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"/>
                        </svg>
                      </div>
                      <div style={{ background: '#fff', border: '1px solid #e4e4e2', borderRadius: 8, padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 7, color: '#9b9b96' }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                          <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Page-1 keywords</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginBottom: 7 }}>
                          <span style={{ fontSize: 22, fontWeight: 700, color: '#0f0f0e', letterSpacing: '-0.5px', lineHeight: 1 }}>143</span>
                          <span style={{ fontSize: 11, fontWeight: 600, color: '#16a34a', display: 'flex', alignItems: 'center', gap: 1 }}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="18 15 12 9 6 15"/></svg>18%</span>
                        </div>
                        <svg width="100%" height="34" viewBox="0 0 100 38" preserveAspectRatio="none" style={{ display: 'block' }}>
                          <path d="M 0,30 C 5,28 10,25 15,23 C 20,21 25,22 30,19 C 35,17 40,18 45,15 C 50,13 55,14 60,11 C 65,9 70,10 75,8 C 80,6 85,7 90,5 C 93,4 97,3 100,2" fill="none" stroke="#16a34a" strokeOpacity="0.7" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"/>
                        </svg>
                      </div>
                      <div style={{ background: '#fff', border: '1px solid #e4e4e2', borderRadius: 8, padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 7, color: '#9b9b96' }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                          <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Avg position</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginBottom: 7 }}>
                          <span style={{ fontSize: 22, fontWeight: 700, color: '#0f0f0e', letterSpacing: '-0.5px', lineHeight: 1 }}>#6.4</span>
                          <span style={{ fontSize: 11, fontWeight: 600, color: '#16a34a', display: 'flex', alignItems: 'center', gap: 1 }}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="18 15 12 9 6 15"/></svg>8%</span>
                        </div>
                        <svg width="100%" height="34" viewBox="0 0 100 38" preserveAspectRatio="none" style={{ display: 'block' }}>
                          <path d="M 0,8 C 5,10 10,12 15,14 C 20,16 25,15 30,17 C 35,19 40,18 45,20 C 50,22 55,21 60,23 C 65,25 70,24 75,26 C 80,27 85,26 90,28 C 93,29 97,30 100,31" fill="none" stroke="#16a34a" strokeOpacity="0.7" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"/>
                        </svg>
                      </div>
                    </div>

                    {/* Critical alert */}
                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 9.5, fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Critical</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#0f0f0e', letterSpacing: '-0.2px', marginBottom: 1 }}>Refresh a decaying article</div>
                        <div style={{ fontSize: 11.5, color: '#6b6b67' }}>WordPress SEO Plugin Comparison lost 38% of its clicks vs last period.</div>
                      </div>
                      <div style={{ background: '#0f0f0e', color: '#fff', borderRadius: 6, padding: '5px 11px', fontSize: 11.5, fontWeight: 500, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5 }}>
                        Refresh now <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                      </div>
                    </div>

                    {/* Quick actions */}
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: '#b0b0aa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 7 }}>Quick actions</div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'nowrap', overflow: 'hidden' }}>
                        {[
                          { label: 'New article',   icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> },
                          { label: 'Open queue',    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> },
                          { label: 'Opportunities', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
                          { label: 'Competitors',   icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><circle cx="9" cy="12" r="7"/><circle cx="15" cy="12" r="7"/></svg> },
                          { label: 'Autopilot',     icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M12 2v5"/><circle cx="8" cy="13" r="1"/><circle cx="16" cy="13" r="1"/><line x1="9" y1="17" x2="15" y2="17"/></svg> },
                          { label: 'Analytics',     icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
                        ].map(a => (
                          <div key={a.label} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 11px', background: '#fff', border: '1px solid #e4e4e2', borderRadius: 8, fontSize: 11.5, fontWeight: 500, color: '#4b4b48', whiteSpace: 'nowrap', flexShrink: 0 }}>
                            <span style={{ color: '#9b9b96', display: 'flex' }}>{a.icon}</span>{a.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ── INTELLIGENCE LOOP ─────────────────────────────────────── */}
      <section style={{ padding: '96px 24px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: 72 }}>
            <div style={{
              display: 'inline-block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14,
            }}>
              Five-Stage System
            </div>
            <h2 style={{
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.08,
              color: 'var(--text)', marginBottom: 16,
            }}>
              Every stage. Automated.
            </h2>
            <p style={{
              fontSize: 18, color: 'var(--text-muted)', maxWidth: 480,
              margin: '0 auto', lineHeight: 1.65,
            }}>
              A closed-loop intelligence system that continuously optimizes your entire content strategy.
            </p>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 0, position: 'relative',
          }} className="stages-grid">
            <div className="stages-line" style={{
              position: 'absolute', top: 28,
              left: '10%', right: '10%',
              height: 1,
              background: 'linear-gradient(to right, transparent, var(--border) 20%, var(--border) 80%, transparent)',
              zIndex: 0,
            }} />
            {[
              { n: '01', label: 'Discover', desc: 'Surfaces high-intent, low-competition keyword opportunities', col: 'var(--text)', icon: '✦', bd: 'var(--border)' },
              { n: '02', label: 'Plan', desc: 'Prioritizes topics by traffic potential and competition gaps', col: 'var(--text)', icon: '▦', bd: 'var(--border)' },
              { n: '03', label: 'Generate', desc: 'Creates publish-ready SEO + AEO optimized articles at scale', col: 'var(--text)', icon: '⟳', bd: 'var(--border)' },
              { n: '04', label: 'Measure', desc: 'Tracks rankings, organic traffic, and content ROI automatically', col: 'var(--text)', icon: '↗', bd: 'var(--border)' },
              { n: '05', label: 'Improve', desc: 'Refreshes content to maintain and grow rankings continuously', col: 'var(--text)', icon: '◈', bd: 'var(--border)' },
            ].map((stage, i) => (
              <div
                key={stage.n}
                className={`fade-up fade-up-delay-${i + 1}`}
                style={{ textAlign: 'center', padding: '0 14px', position: 'relative', zIndex: 1 }}
              >
                <div className="stage-circle" style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'var(--surface)', border: `2px solid ${stage.bd}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 18px', fontSize: 18, color: stage.col,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}>
                  {stage.icon}
                </div>
                <div style={{
                  fontSize: 11, fontWeight: 700, color: stage.col,
                  textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8,
                }}>
                  {stage.label}
                </div>
                <p style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.55 }}>
                  {stage.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES BENTO ────────────────────────────────────────── */}
      <section id="features" style={{ padding: '0 24px 96px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--text)', marginBottom: 12,
            }}>
              Built for every stage of the loop
            </h2>
            <p style={{ fontSize: 17, color: 'var(--text-muted)', maxWidth: 440, margin: '0 auto', lineHeight: 1.65 }}>
              From finding opportunities to publishing and auto-improving — everything in one platform.
            </p>
          </div>

          {/* 2-column bento */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="bento-grid">

            {/* DISCOVER — left */}
            <div className="card scale-in" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 18, overflow: 'hidden' }}>
              <div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: '#eff6ff', border: '1px solid #bfdbfe',
                  borderRadius: 100, padding: '3px 10px',
                  fontSize: 11, fontWeight: 600, color: '#2563eb', marginBottom: 14,
                }}>✦ Discover</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 8 }}>
                  Find your next 100 articles
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  AI scans your niche to surface high-intent, low-competition keywords your competitors haven&apos;t touched yet.
                </p>
              </div>
              {/* Keyword table mockup */}
              <div aria-hidden="true" style={{ background: '#f9f9f8', border: '1px solid #e4e4e2', borderRadius: 10, overflow: 'hidden', flex: 1 }}>
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 64px 52px',
                  padding: '7px 12px', borderBottom: '1px solid #e4e4e2',
                  fontSize: 10, fontWeight: 600, color: '#9b9b96',
                  textTransform: 'uppercase', letterSpacing: '0.06em', background: '#f4f4f3',
                }}>
                  <span>Keyword</span><span style={{ textAlign: 'right' }}>Volume</span><span style={{ textAlign: 'right' }}>Diff</span>
                </div>
                {[
                  { kw: 'best seo tools 2026', vol: '8.2K', diff: 'Med', dc: '#d97706', db: '#fffbeb' },
                  { kw: 'ai content generation', vol: '12K', diff: 'Low', dc: '#16a34a', db: '#f0fdf4', star: true },
                  { kw: 'content strategy 2026', vol: '5.4K', diff: 'High', dc: '#dc2626', db: '#fef2f2' },
                  { kw: 'blog automation tools', vol: '3.2K', diff: 'Low', dc: '#16a34a', db: '#f0fdf4', star: true },
                  { kw: 'wordpress seo plugin', vol: '18K', diff: 'High', dc: '#dc2626', db: '#fef2f2' },
                  { kw: 'seo content calendar', vol: '2.1K', diff: 'Low', dc: '#16a34a', db: '#f0fdf4', star: true },
                ].map((row, i) => (
                  <div key={i} style={{
                    display: 'grid', gridTemplateColumns: '1fr 64px 52px',
                    padding: '9px 12px', fontSize: 12.5,
                    borderBottom: i < 5 ? '1px solid #f4f4f3' : 'none',
                    background: row.star ? '#fafffc' : '#ffffff',
                    alignItems: 'center',
                  }}>
                    <span style={{ color: '#0f0f0e', fontWeight: row.star ? 500 : 400 }}>
                      {row.star ? '★ ' : ''}{row.kw}
                    </span>
                    <span style={{ color: '#6b6b67', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{row.vol}</span>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <span style={{
                        fontSize: 10.5, fontWeight: 600, color: row.dc,
                        background: row.db, padding: '2px 7px', borderRadius: 100,
                      }}>{row.diff}</span>
                    </div>
                  </div>
                ))}
                <div style={{ padding: '8px 12px', fontSize: 11, color: '#9b9b96', background: '#f9f9f8', borderTop: '1px solid #e4e4e2' }}>
                  127 opportunities found in your niche
                </div>
              </div>
            </div>

            {/* GENERATE — right */}
            <div className="card scale-in" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: '#faf5ff', border: '1px solid #ddd6fe',
                  borderRadius: 100, padding: '3px 10px',
                  fontSize: 11, fontWeight: 600, color: '#7c3aed', marginBottom: 14,
                }}>⟳ Generate</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 8 }}>
                  Publish-ready in seconds
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  GPT-4o and Gemini 1.5 Pro generate full articles — structured, fact-checked, and optimized for both Google and AI overviews.
                </p>
              </div>
              {/* Generation progress */}
              <div aria-hidden="true" style={{ background: '#f9f9f8', border: '1px solid #e4e4e2', borderRadius: 10, padding: 16, flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#0f0f0e', marginBottom: 14, lineHeight: 1.4 }}>
                  &ldquo;10 Best SEO Tools for Startups in 2026&rdquo;
                </div>
                {[
                  { label: 'Research & SERP analysis', pct: 100 },
                  { label: 'Outline & heading structure', pct: 100 },
                  { label: 'Article body (2,400 words)', pct: 72 },
                  { label: 'SEO optimization pass', pct: 0 },
                  { label: 'WordPress publish', pct: 0 },
                ].map(step => (
                  <div key={step.label} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 12 }}>
                      <span style={{
                        color: step.pct === 100 ? '#16a34a' : step.pct > 0 ? '#7c3aed' : '#9b9b96',
                        fontWeight: 500,
                      }}>
                        {step.pct === 100 ? '✓ ' : step.pct > 0 ? '● ' : '○ '}{step.label}
                      </span>
                      <span style={{ color: '#9b9b96', fontVariantNumeric: 'tabular-nums' }}>{step.pct}%</span>
                    </div>
                    <div style={{ height: 4, background: '#ececea', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 2, width: `${step.pct}%`,
                        background: step.pct === 100 ? '#16a34a' : '#7c3aed',
                        transition: 'width 1.2s cubic-bezier(0.16,1,0.3,1)',
                      }} />
                    </div>
                  </div>
                ))}
                <div style={{
                  marginTop: 14, paddingTop: 12, borderTop: '1px solid #e4e4e2',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <span style={{ fontSize: 11, color: '#9b9b96' }}>Estimated SEO score</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#16a34a' }}>94 / 100</span>
                </div>
              </div>
            </div>

            {/* PLAN — left bottom */}
            <div className="card scale-in" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: '#f0fdf4', border: '1px solid #bbf7d0',
                  borderRadius: 100, padding: '3px 10px',
                  fontSize: 11, fontWeight: 600, color: '#16a34a', marginBottom: 14,
                }}>▦ Plan</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 8 }}>
                  Your content calendar, automated
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  articlos schedules weeks of content in minutes. Set publishing cadence and let the AI fill the calendar intelligently.
                </p>
              </div>
              {/* Calendar mockup */}
              <div aria-hidden="true" style={{ background: '#f9f9f8', border: '1px solid #e4e4e2', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
                  background: '#f4f4f3', borderBottom: '1px solid #e4e4e2',
                }}>
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                    <div key={i} style={{ padding: '6px 0', textAlign: 'center', fontSize: 10, fontWeight: 600, color: '#9b9b96' }}>{d}</div>
                  ))}
                </div>
                {[
                  [true, false, true, false, true, false, false],
                  [false, true, false, true, false, false, false],
                  [true, false, false, true, false, true, false],
                  [false, true, true, false, true, false, false],
                ].map((week, wi) => (
                  <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: wi < 3 ? '1px solid #f0f0ee' : 'none' }}>
                    {week.map((hasArticle, di) => (
                      <div key={di} style={{
                        padding: '8px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {hasArticle ? (
                          <div style={{
                            width: 28, height: 20, borderRadius: 4,
                            background: '#16a34a', opacity: 0.7 + (Math.random() * 0.3),
                          }} />
                        ) : (
                          <div style={{ width: 28, height: 20, borderRadius: 4, background: '#f0f0ee' }} />
                        )}
                      </div>
                    ))}
                  </div>
                ))}
                <div style={{ padding: '8px 12px', fontSize: 11, color: '#9b9b96', background: '#f9f9f8', borderTop: '1px solid #e4e4e2' }}>
                  14 articles scheduled this month
                </div>
              </div>
            </div>

            {/* MEASURE — right bottom */}
            <div className="card scale-in" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: '#fffbeb', border: '1px solid #fde68a',
                  borderRadius: 100, padding: '3px 10px',
                  fontSize: 11, fontWeight: 600, color: '#d97706', marginBottom: 14,
                }}>↗ Measure</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 8 }}>
                  Track every ranking, every click
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Google Search Console and GA4 data flows in automatically. See exactly which articles drive revenue.
                </p>
              </div>
              {/* Chart mockup */}
              <div aria-hidden="true" style={{ background: '#f9f9f8', border: '1px solid #e4e4e2', borderRadius: 10, padding: '14px 16px', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: '#0f0f0e' }}>Organic Traffic</span>
                  <span style={{
                    fontSize: 12, fontWeight: 700, color: '#16a34a',
                    background: '#f0fdf4', padding: '3px 9px', borderRadius: 100,
                  }}>↑ 32% this month</span>
                </div>
                {/* Bar chart */}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 72, marginBottom: 8 }}>
                  {[22, 28, 25, 34, 38, 44, 40, 52, 48, 60, 56, 72, 68, 88].map((h, i) => (
                    <div key={i} style={{
                      flex: 1, borderRadius: '3px 3px 0 0',
                      height: `${h}%`,
                      background: i === 13 ? '#0f0f0e' : i > 9 ? '#d4d4d0' : '#ececea',
                      transition: 'background 0.2s',
                    }} />
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 12 }}>
                  {[
                    { label: 'Impressions', val: '284K', up: true },
                    { label: 'Clicks', val: '18.4K', up: true },
                    { label: 'Avg position', val: '4.2', up: false },
                  ].map(m => (
                    <div key={m.label} style={{ background: '#fff', border: '1px solid #e4e4e2', borderRadius: 6, padding: '8px 10px' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0f0f0e', letterSpacing: '-0.02em' }}>{m.val}</div>
                      <div style={{ fontSize: 10, color: '#9b9b96', marginTop: 1 }}>{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* IMPROVE — full width */}
            <div className="card scale-in bento-dark" style={{
              gridColumn: '1 / 3',
              padding: 36,
              background: '#0f0f0e',
              border: 'none',
            }}>
              <div style={{ display: 'flex', gap: 48, alignItems: 'center' }} className="improve-inner">
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: 'rgba(22,163,74,0.2)', border: '1px solid rgba(22,163,74,0.35)',
                    borderRadius: 100, padding: '3px 10px',
                    fontSize: 11, fontWeight: 600, color: '#4ade80', marginBottom: 18,
                  }}>◈ Improve</div>
                  <h3 style={{
                    fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em',
                    color: '#ffffff', marginBottom: 12, lineHeight: 1.3,
                  }}>
                    Content that keeps getting better
                  </h3>
                  <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, maxWidth: 400 }}>
                    articlos monitors ranking drops, identifies why, and refreshes your articles automatically — so your content compounds over time instead of decaying.
                  </p>
                  <div style={{ display: 'flex', gap: 24, marginTop: 24 }}>
                    {[
                      { label: 'Articles improved', val: '3,847' },
                      { label: 'Avg score gain', val: '+22pts' },
                    ].map(s => (
                      <div key={s.label}>
                        <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.03em' }}>{s.val}</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Optimization checklist */}
                <div style={{
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12, padding: 22, minWidth: 300, flexShrink: 0,
                }} className="improve-card" aria-hidden="true">
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 14 }}>
                    Auto-Optimization Running
                  </div>
                  {[
                    { t: 'Added FAQ section', done: true },
                    { t: 'Enhanced H2 heading structure', done: true },
                    { t: 'Improved internal linking', done: true },
                    { t: 'Updated meta description', done: false },
                    { t: 'Added schema markup', done: false },
                  ].map((item, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '7px 0',
                      borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                    }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: 5,
                        background: item.done ? '#16a34a' : 'rgba(255,255,255,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, color: '#fff', flexShrink: 0,
                      }}>{item.done ? '✓' : ''}</div>
                      <span style={{
                        fontSize: 13, lineHeight: 1.35,
                        color: item.done ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.3)',
                      }}>{item.t}</span>
                    </div>
                  ))}
                  <div style={{
                    marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>SEO Score</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through' }}>72</span>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>→</span>
                      <span style={{ fontSize: 18, fontWeight: 700, color: '#4ade80' }}>94</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: '96px 24px', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: 72 }}>
            <h2 style={{
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 700, letterSpacing: '-0.04em', marginBottom: 14,
            }}>
              Up and running in minutes
            </h2>
            <p style={{ fontSize: 17, color: 'var(--text-muted)', maxWidth: 400, margin: '0 auto', lineHeight: 1.65 }}>
              Three steps and your content machine is live. No dev work, no setup pain.
            </p>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 0, position: 'relative',
          }} className="steps-grid">
            <div className="steps-line" style={{
              position: 'absolute', top: 28,
              left: 'calc(16.67% + 28px)', right: 'calc(16.67% + 28px)',
              height: 1,
              background: 'linear-gradient(to right, #0f0f0e 0%, #e4e4e2 50%, #e4e4e2 100%)',
              zIndex: 0,
            }} />
            {[
              {
                num: '01',
                title: 'Connect your website',
                desc: 'Add your WordPress site in one click. articlos handles authentication, categories, and publishing rules automatically.',
              },
              {
                num: '02',
                title: 'Set your topic strategy',
                desc: 'Enter seed keywords or let articlos scan your niche. The AI builds a complete, prioritized content plan for you.',
              },
              {
                num: '03',
                title: 'Watch content go live',
                desc: 'Articles are generated, SEO-optimized, and published on your schedule — fully autonomous or with your review.',
              },
            ].map((step, i) => (
              <div
                key={step.num}
                className={`fade-up fade-up-delay-${i + 1}`}
                style={{ textAlign: 'center', padding: '0 36px', position: 'relative', zIndex: 1 }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: i === 0 ? 'var(--accent)' : 'var(--surface)',
                  border: `2px solid ${i === 0 ? 'var(--accent)' : 'var(--border)'}`,
                  color: i === 0 ? 'var(--accent-fg)' : 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, margin: '0 auto 24px',
                  boxShadow: i === 0 ? '0 4px 16px rgba(0,0,0,0.16)' : 'none',
                }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 10 }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.65 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────── */}
      <section style={{ padding: '96px 24px', background: 'var(--cta-bg)' }}>
        <div style={{
          maxWidth: 960, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0,
        }} className="stats-grid">
          {[
            { target: 50000, suffix: '+', label: 'Articles generated', sub: 'and still counting' },
            { target: 2400, suffix: '+', label: 'Websites connected', sub: 'across every niche' },
            { target: 94, suffix: '%', label: 'Average SEO score', sub: 'vs 67% industry average' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`fade-up fade-up-delay-${i + 1}`}
              style={{
                textAlign: 'center', padding: '32px 40px',
                borderRight: i < 2 ? '1px solid var(--cta-border)' : 'none',
              }}
            >
              <div style={{
                fontSize: 'clamp(40px, 6vw, 68px)',
                fontWeight: 700, letterSpacing: '-0.05em',
                color: 'var(--cta-text)', lineHeight: 1, marginBottom: 10,
              }}>
                <CountUp target={stat.target} suffix={stat.suffix} />
              </div>
              <div style={{ fontSize: 15, color: 'var(--cta-text-muted)', fontWeight: 500, marginBottom: 5 }}>
                {stat.label}
              </div>
              <div style={{ fontSize: 12, color: 'var(--cta-text-muted)', opacity: 0.6 }}>
                {stat.sub}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT / PRICING ─────────────────────────────────────── */}
      <section id="contact" style={{ padding: '96px 24px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 580, margin: '0 auto', textAlign: 'center' }} className="fade-up">
          <div style={{
            display: 'inline-block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 20,
          }}>
            Pricing
          </div>
          <h2 style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--text)',
            marginBottom: 18, lineHeight: 1.1,
          }}>
            Let&apos;s talk about your needs
          </h2>
          <p style={{
            fontSize: 18, color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 44,
          }}>
            We offer flexible plans for content teams of all sizes — from solo bloggers to enterprise agencies.
            Reach out and we&apos;ll find the right fit for you.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="mailto:hello@articlos.com" className="btn btn-primary btn-lg" style={{ gap: 8 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              hello@articlos.com
            </a>
            <a href="https://app.articlos.com/login" className="btn btn-ghost btn-lg">
              Log in
            </a>
          </div>
        </div>
      </section>

      {/* ── BLOG PREVIEW ──────────────────────────────────────────── */}
      <section style={{ padding: '96px 24px', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="fade-up" style={{
            display: 'flex', alignItems: 'baseline',
            justifyContent: 'space-between', marginBottom: 44,
            flexWrap: 'wrap', gap: 12,
          }}>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 700, letterSpacing: '-0.03em' }}>
              From the blog
            </h2>
            <a href="/blog" className="link-muted" style={{ fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
              All posts
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {posts.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }} className="blog-grid">
              {posts.map(post => (
                <BlogCard
                  key={post.id}
                  title={post.title}
                  slug={post.slug}
                  excerpt={post.excerpt}
                  featuredImage={post.featuredImage}
                  tags={post.tags}
                  publishedAt={post.publishedAt}
                  createdAt={post.createdAt}
                />
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }} className="blog-grid">
              {[0, 1, 2].map(i => (
                <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                  <div className="skeleton" style={{ height: 180 }} />
                  <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div className="skeleton" style={{ height: 12, width: 80, borderRadius: 100 }} />
                    <div className="skeleton" style={{ height: 18, width: '90%' }} />
                    <div className="skeleton" style={{ height: 14, width: '70%' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────── */}
      <section style={{ padding: '96px 24px', background: 'var(--bg)', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }} className="fade-up">
          <h2 style={{
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: 700, letterSpacing: '-0.045em',
            color: 'var(--text)', marginBottom: 16, lineHeight: 1.08,
          }}>
            {c('cta_title')}
          </h2>
          <p style={{
            fontSize: 17, color: 'var(--text-muted)',
            maxWidth: 420, margin: '0 auto 40px', lineHeight: 1.65,
          }}>
            {c('cta_subtitle')}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://app.articlos.com/login" className="btn btn-primary btn-lg">
              Log in →
            </a>
            <a
              href="/contact"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '13px 24px', borderRadius: 6,
                border: '1px solid var(--border)',
                color: 'var(--text-muted)', fontSize: 15, fontWeight: 500,
                textDecoration: 'none', transition: 'all 0.2s ease',
                background: 'var(--surface)',
              }}
            >
              Contact the articlos team
            </a>
          </div>
        </div>
      </section>

      <NewsletterSection />
      <Footer />
    </>
  )
}
