import { prisma } from '@/lib/prisma'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import BlogCard from '@/components/BlogCard'
import ScrollAnimations from './ScrollAnimations'

// Fetch site content from DB with fallbacks
async function getSiteContent() {
  try {
    const records = await prisma.siteContent.findMany()
    const map: Record<string, string> = {}
    for (const r of records) {
      map[r.key] = r.value
    }
    return map
  } catch {
    return {}
  }
}

async function getLatestPosts() {
  try {
    return await prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        tags: true,
        publishedAt: true,
        createdAt: true,
      },
    })
  } catch {
    return []
  }
}

const defaults = {
  hero_badge: 'Now with GPT-4o & Gemini 1.5 Pro',
  hero_title: 'AI articles that rank,\nautomatically.',
  hero_subtitle:
    'articlos generates SEO-optimised articles, manages your content calendar, and publishes to WordPress — all on autopilot.',
  features_title: 'Everything you need to dominate search',
  features_subtitle:
    'From keyword research to auto-publishing, articlos handles the full content pipeline.',
  cta_title: 'Start generating content today',
  cta_subtitle:
    'Join 2,400+ websites already using articlos to build their organic traffic on autopilot.',
}

export default async function HomePage() {
  const [content, posts] = await Promise.all([getSiteContent(), getLatestPosts()])
  const c = (key: keyof typeof defaults) => content[key] || defaults[key]

  const features = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M12 2a10 10 0 1 0 10 10" />
          <path d="M12 6v6l4 2" />
          <path d="M22 2 12 12" />
        </svg>
      ),
      title: 'AI Article Generation',
      desc: 'Produce full, publish-ready articles in seconds using GPT-4o and Gemini 1.5 Pro with your brand voice.',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      title: 'WordPress Auto-publish',
      desc: 'Connect your WordPress site and articles go live automatically — including featured images and categories.',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
      title: 'Keyword Research',
      desc: 'Discover high-intent, low-competition keywords your audience is searching for and build topic clusters.',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      title: 'Content Queue',
      desc: 'Plan and schedule weeks of content in minutes. Set it and forget it with your automated publishing calendar.',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      title: 'Site Audit',
      desc: 'Find content gaps, broken links, and on-page SEO issues automatically and get actionable fix recommendations.',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
      title: 'SEO Analytics',
      desc: 'Track rankings, organic traffic, and content performance with built-in analytics and weekly reports.',
    },
  ]

  const steps = [
    {
      num: '01',
      title: 'Connect your website',
      desc: 'Add your WordPress site with a single click. We handle the integration — no dev work required.',
    },
    {
      num: '02',
      title: 'Add topics or let AI suggest them',
      desc: "Enter your keywords manually or let articlos scan your niche and suggest exactly what you should write about.",
    },
    {
      num: '03',
      title: 'Articles are generated and published automatically',
      desc: "We generate SEO-optimised content and push it live on your schedule. You review optionally — or let it run fully autonomous.",
    },
  ]

  const stats = [
    { value: '50,000+', label: 'articles generated' },
    { value: '2,400+', label: 'websites connected' },
    { value: '94%', label: 'avg SEO score' },
  ]

  const logos = ['TechCrunch', 'SeedRound', 'ContentOps', 'GrowthLab', 'Blogaroo', 'DigitalMint']

  return (
    <>
      <Nav />
      <ScrollAnimations />

      {/* ============================================================
          HERO
      ============================================================ */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '120px 24px 80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated gradient background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(15,15,14,0.04) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 80% 70%, rgba(99,102,241,0.05) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: 780, margin: '0 auto', position: 'relative' }}>
          {/* Badge */}
          <div
            className="fade-up"
            style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}
          >
            <span className="badge">
              <span className="badge-dot" />
              {c('hero_badge')}
            </span>
          </div>

          {/* H1 */}
          <h1
            className="fade-up fade-up-delay-1"
            style={{
              fontSize: 'clamp(48px, 8vw, 80px)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              color: '#0f0f0e',
              marginBottom: 24,
              whiteSpace: 'pre-line',
            }}
          >
            {c('hero_title')}
          </h1>

          {/* Subtitle */}
          <p
            className="fade-up fade-up-delay-2"
            style={{
              fontSize: 'clamp(17px, 2.5vw, 20px)',
              color: '#6b6b67',
              lineHeight: 1.6,
              marginBottom: 40,
              maxWidth: 580,
              margin: '0 auto 40px',
            }}
          >
            {c('hero_subtitle')}
          </p>

          {/* CTAs */}
          <div
            className="fade-up fade-up-delay-3"
            style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: 64,
            }}
          >
            <a
              href="https://app.articlos.com/register"
              className="btn btn-primary btn-lg"
            >
              Start for free →
            </a>
            <a href="#how-it-works" className="btn btn-ghost btn-lg">
              See how it works
            </a>
          </div>

          {/* Browser Mockup / Dashboard Preview */}
          <div
            className="fade-up fade-up-delay-4"
            style={{
              background: '#ffffff',
              border: '1px solid #e8e8e6',
              borderRadius: 14,
              boxShadow:
                '0 32px 80px rgba(0,0,0,0.10), 0 8px 24px rgba(0,0,0,0.06)',
              overflow: 'hidden',
              maxWidth: 780,
              margin: '0 auto',
              animation: 'float 6s ease-in-out infinite',
            }}
          >
            {/* Browser chrome */}
            <div
              style={{
                padding: '12px 16px',
                background: '#f5f5f3',
                borderBottom: '1px solid #e8e8e6',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', gap: 6 }}>
                {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
                  <div
                    key={c}
                    style={{
                      width: 11,
                      height: 11,
                      borderRadius: '50%',
                      background: c,
                    }}
                  />
                ))}
              </div>
              <div
                style={{
                  flex: 1,
                  background: '#ebebea',
                  borderRadius: 5,
                  height: 22,
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 10,
                  fontSize: 11,
                  color: '#a0a09c',
                  maxWidth: 280,
                  margin: '0 auto',
                }}
              >
                app.articlos.com/dashboard
              </div>
            </div>

            {/* Dashboard content */}
            <div style={{ padding: 20, background: '#fafaf9' }}>
              {/* Top stats */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                {[
                  { label: 'Articles Generated', val: '1,247', color: '#0f0f0e' },
                  { label: 'Published Today', val: '8', color: '#22c55e' },
                  { label: 'Avg SEO Score', val: '94', color: '#6366f1' },
                  { label: 'Organic Traffic', val: '↑ 32%', color: '#f59e0b' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e8e8e6',
                      borderRadius: 8,
                      padding: '12px 14px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: stat.color,
                        letterSpacing: '-0.03em',
                      }}
                    >
                      {stat.val}
                    </div>
                    <div style={{ fontSize: 11, color: '#a0a09c', marginTop: 2 }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Content rows */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #e8e8e6',
                  borderRadius: 8,
                  overflow: 'hidden',
                }}
              >
                {[
                  { title: '10 Best SEO Tools for Startups in 2026', status: 'Published', score: 96 },
                  { title: 'How to Build Backlinks Without Cold Outreach', status: 'Generating...', score: null },
                  { title: 'Content Marketing ROI: A Complete Guide', status: 'Queued', score: null },
                ].map((row, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '10px 14px',
                      borderBottom: i < 2 ? '1px solid #f0f0ee' : 'none',
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background:
                          row.status === 'Published'
                            ? '#22c55e'
                            : row.status === 'Generating...'
                            ? '#f59e0b'
                            : '#e8e8e6',
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, fontSize: 12, color: '#0f0f0e', fontWeight: 500 }}>
                      {row.title}
                    </div>
                    <div style={{ fontSize: 11, color: '#a0a09c', width: 80, textAlign: 'right' }}>
                      {row.status}
                    </div>
                    {row.score && (
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: '#22c55e',
                          background: '#dcfce7',
                          padding: '2px 7px',
                          borderRadius: 100,
                        }}
                      >
                        {row.score}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          LOGOS STRIP
      ============================================================ */}
      <section
        style={{
          padding: '48px 24px',
          borderTop: '1px solid #e8e8e6',
          borderBottom: '1px solid #e8e8e6',
          background: '#ffffff',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p
            style={{
              textAlign: 'center',
              fontSize: 13,
              color: '#a0a09c',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 500,
              marginBottom: 28,
            }}
          >
            Trusted by content teams at
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 48,
              flexWrap: 'wrap',
            }}
          >
            {logos.map((name) => (
              <span
                key={name}
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#c8c8c4',
                  letterSpacing: '-0.01em',
                  transition: 'color 0.2s ease',
                }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          FEATURES GRID
      ============================================================ */}
      <section id="features" className="section" style={{ background: '#fafaf9' }}>
        <div className="container">
          <div
            style={{ textAlign: 'center', marginBottom: 56 }}
            className="fade-up"
          >
            <h2
              style={{
                fontSize: 'clamp(32px, 5vw, 48px)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                marginBottom: 14,
              }}
            >
              {c('features_title')}
            </h2>
            <p
              style={{
                fontSize: 17,
                color: '#6b6b67',
                maxWidth: 480,
                margin: '0 auto',
                lineHeight: 1.6,
              }}
            >
              {c('features_subtitle')}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 20,
            }}
            className="features-grid"
          >
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`card fade-up fade-up-delay-${Math.min(i + 1, 5)}`}
                style={{ cursor: 'default' }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: '#f5f5f3',
                    border: '1px solid #e8e8e6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0f0f0e',
                    marginBottom: 14,
                  }}
                >
                  {f.icon}
                </div>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    marginBottom: 8,
                  }}
                >
                  {f.title}
                </h3>
                <p style={{ fontSize: 14, color: '#6b6b67', lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          HOW IT WORKS
      ============================================================ */}
      <section id="how-it-works" className="section" style={{ background: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }} className="fade-up">
            <h2
              style={{
                fontSize: 'clamp(32px, 5vw, 48px)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                marginBottom: 14,
              }}
            >
              How articlos works
            </h2>
            <p
              style={{
                fontSize: 17,
                color: '#6b6b67',
                maxWidth: 440,
                margin: '0 auto',
              }}
            >
              Three simple steps to fully automated SEO content.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 0,
              position: 'relative',
              maxWidth: 900,
              margin: '0 auto',
            }}
            className="steps-grid"
          >
            {/* Connector line */}
            <div
              style={{
                position: 'absolute',
                top: 28,
                left: 'calc(16.67% + 20px)',
                right: 'calc(16.67% + 20px)',
                height: 1,
                background: 'linear-gradient(to right, #e8e8e6, #d4d4d0, #e8e8e6)',
                zIndex: 0,
              }}
              className="steps-line"
            />

            {steps.map((step, i) => (
              <div
                key={step.num}
                className={`fade-up fade-up-delay-${i + 1}`}
                style={{
                  textAlign: 'center',
                  padding: '0 24px',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: '#0f0f0e',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 700,
                    margin: '0 auto 20px',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {step.num}
                </div>
                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    marginBottom: 10,
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ fontSize: 14, color: '#6b6b67', lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          STATS ROW
      ============================================================ */}
      <section
        style={{
          padding: '80px 24px',
          background: '#0f0f0e',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 0,
          }}
          className="stats-grid"
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`fade-up fade-up-delay-${i + 1}`}
              style={{
                textAlign: 'center',
                padding: '20px 32px',
                borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
              }}
            >
              <div
                style={{
                  fontSize: 'clamp(36px, 6vw, 56px)',
                  fontWeight: 700,
                  letterSpacing: '-0.04em',
                  color: '#ffffff',
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 15,
                  color: 'rgba(255,255,255,0.5)',
                  fontWeight: 400,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          PRICING SECTION
      ============================================================ */}
      <section id="pricing" className="section" style={{ background: '#fafaf9' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }} className="fade-up">
            <h2
              style={{
                fontSize: 'clamp(32px, 5vw, 48px)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                marginBottom: 14,
              }}
            >
              Simple, transparent pricing
            </h2>
            <p
              style={{
                fontSize: 17,
                color: '#6b6b67',
                maxWidth: 420,
                margin: '0 auto',
              }}
            >
              Start free, scale as you grow. No contracts, cancel any time.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 20,
              maxWidth: 900,
              margin: '0 auto',
              alignItems: 'start',
            }}
            className="pricing-grid"
          >
            {/* Starter */}
            <div className="pricing-card fade-up">
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#6b6b67', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Starter</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.04em' }}>$29</span>
                  <span style={{ color: '#6b6b67', fontSize: 14 }}>/mo</span>
                </div>
                <p style={{ fontSize: 14, color: '#6b6b67', marginTop: 6 }}>Perfect for solo bloggers and small sites.</p>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['20 articles / month', '1 website', 'WordPress publishing', 'Keyword suggestions', 'Email support'].map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 14 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a href="https://app.articlos.com/register?plan=starter" className="btn btn-ghost" style={{ justifyContent: 'center' }}>
                Start free
              </a>
            </div>

            {/* Pro — featured */}
            <div className="pricing-card featured fade-up fade-up-delay-1" style={{ marginTop: -12 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#6b6b67', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Pro</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.04em' }}>$79</span>
                  <span style={{ color: '#6b6b67', fontSize: 14 }}>/mo</span>
                </div>
                <p style={{ fontSize: 14, color: '#6b6b67', marginTop: 6 }}>For growing content teams and agencies.</p>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['100 articles / month', '5 websites', 'WordPress publishing', 'Advanced keyword research', 'SEO Analytics', 'Priority support', 'Content queue & calendar'].map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 14 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a href="https://app.articlos.com/register?plan=pro" className="btn btn-primary" style={{ justifyContent: 'center' }}>
                Start free
              </a>
            </div>

            {/* Agency */}
            <div className="pricing-card fade-up fade-up-delay-2">
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#6b6b67', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Agency</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.04em' }}>$199</span>
                  <span style={{ color: '#6b6b67', fontSize: 14 }}>/mo</span>
                </div>
                <p style={{ fontSize: 14, color: '#6b6b67', marginTop: 6 }}>For agencies managing client content at scale.</p>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Unlimited articles', '20 websites', 'WordPress publishing', 'Full SEO suite', 'White-label reports', 'Dedicated account manager', 'API access', 'Custom integrations'].map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 14 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a href="https://app.articlos.com/register?plan=agency" className="btn btn-ghost" style={{ justifyContent: 'center' }}>
                Start free
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          CTA BANNER
      ============================================================ */}
      <section
        style={{
          padding: '96px 24px',
          background: '#0f0f0e',
          textAlign: 'center',
        }}
      >
        <div className="container fade-up">
          <h2
            style={{
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              color: '#ffffff',
              marginBottom: 16,
            }}
          >
            {c('cta_title')}
          </h2>
          <p
            style={{
              fontSize: 17,
              color: 'rgba(255,255,255,0.55)',
              maxWidth: 440,
              margin: '0 auto 36px',
              lineHeight: 1.6,
            }}
          >
            {c('cta_subtitle')}
          </p>
          <a
            href="https://app.articlos.com/register"
            className="cta-white-btn"
          >
            Get started free →
          </a>
        </div>
      </section>

      {/* ============================================================
          BLOG PREVIEW
      ============================================================ */}
      <section className="section" style={{ background: '#ffffff' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: 40,
              flexWrap: 'wrap',
              gap: 12,
            }}
            className="fade-up"
          >
            <h2
              style={{
                fontSize: 'clamp(26px, 4vw, 36px)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
              }}
            >
              From the blog
            </h2>
            <a
              href="/blog"
              className="link-muted"
              style={{
                fontSize: 14,
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              View all posts →
            </a>
          </div>

          {posts.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 20,
              }}
              className="blog-grid"
            >
              {posts.map((post) => (
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
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 20,
              }}
              className="blog-grid"
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e8e8e6',
                    borderRadius: 10,
                    overflow: 'hidden',
                  }}
                >
                  <div className="skeleton" style={{ height: 200 }} />
                  <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div className="skeleton" style={{ height: 12, width: 80, borderRadius: 100 }} />
                    <div className="skeleton" style={{ height: 20, width: '90%' }} />
                    <div className="skeleton" style={{ height: 14, width: '70%' }} />
                    <div className="skeleton" style={{ height: 12, width: 100 }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .features-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .steps-line { display: none !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr !important; }
          .blog-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .features-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .blog-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </>
  )
}
