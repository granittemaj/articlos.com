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

  return (
    <>
      <Nav />
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
        background: '#f9f9f8',
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
              background: '#ffffff', border: '1px solid #e4e4e2',
              borderRadius: 100, padding: '5px 16px 5px 8px',
              fontSize: 12, fontWeight: 500, color: '#6b6b67',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: '#f0fdf4', border: '1px solid #bbf7d0',
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
            color: '#0f0f0e',
            marginBottom: 24,
            whiteSpace: 'pre-line',
          }}>
            {c('hero_title')}
          </h1>

          {/* Subtitle */}
          <p className="hero-sub" style={{
            fontSize: 'clamp(16px, 2vw, 19px)',
            color: '#6b6b67',
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
        <div className="hero-visual hero-mockup-wrap" style={{
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
                app.articlos.com
              </div>
            </div>

            {/* App shell */}
            <div style={{ display: 'flex', height: 380 }}>
              {/* Sidebar */}
              <div className="mockup-sidebar" style={{
                width: 188, flexShrink: 0, background: '#ffffff',
                borderRight: '1px solid #e4e4e2', padding: '14px 0',
                display: 'flex', flexDirection: 'column',
              }}>
                <div style={{ padding: '0 14px 12px', borderBottom: '1px solid #f0f0ee', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: 6, background: '#0f0f0e',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontWeight: 700, fontSize: 13,
                    }}>a</div>
                    <span style={{ fontWeight: 600, fontSize: 13.5, letterSpacing: '-0.02em' }}>articlos</span>
                  </div>
                </div>
                {[
                  { icon: '◻', label: 'Dashboard', active: false },
                  { icon: '✦', label: 'Discover', active: false },
                  { icon: '▦', label: 'Plan', active: false },
                  { icon: '⟳', label: 'Generate', active: true },
                  { icon: '↗', label: 'Measure', active: false },
                  { icon: '◈', label: 'Improve', active: false },
                ].map(item => (
                  <div key={item.label} style={{
                    display: 'flex', alignItems: 'center', gap: 9,
                    padding: '7px 12px', margin: '1px 6px',
                    borderRadius: 6, fontSize: 13,
                    background: item.active ? '#f4f4f3' : 'transparent',
                    color: item.active ? '#0f0f0e' : '#9b9b96',
                    fontWeight: item.active ? 500 : 400,
                    cursor: 'default',
                  }}>
                    <span style={{ fontSize: 10, width: 14, textAlign: 'center' }}>{item.icon}</span>
                    {item.label}
                  </div>
                ))}
              </div>

              {/* Main area */}
              <div style={{ flex: 1, background: '#f9f9f8', padding: 18, overflow: 'hidden' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14,
                }}>
                  <span style={{ fontSize: 14.5, fontWeight: 600, letterSpacing: '-0.02em' }}>Content Queue</span>
                  <span style={{
                    background: '#0f0f0e', color: '#fff',
                    padding: '4px 10px', borderRadius: 6, fontSize: 11.5, fontWeight: 500, cursor: 'default',
                  }}>+ Generate</span>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 12 }}>
                  {[
                    { v: '1,247', l: 'Generated', col: '#0f0f0e' },
                    { v: '8', l: 'Today', col: '#16a34a' },
                    { v: '94', l: 'Avg Score', col: '#2563eb' },
                    { v: '+32%', l: 'Traffic', col: '#d97706' },
                  ].map(s => (
                    <div key={s.l} style={{
                      background: '#fff', border: '1px solid #e4e4e2',
                      borderRadius: 8, padding: '9px 10px',
                    }}>
                      <div style={{ fontSize: 17, fontWeight: 700, color: s.col, letterSpacing: '-0.03em' }}>{s.v}</div>
                      <div style={{ fontSize: 10, color: '#9b9b96', marginTop: 2 }}>{s.l}</div>
                    </div>
                  ))}
                </div>

                {/* Article rows */}
                <div style={{ background: '#fff', border: '1px solid #e4e4e2', borderRadius: 8, overflow: 'hidden' }}>
                  {[
                    { t: '10 Best SEO Tools for Startups in 2026', s: 'Published', sc: '#16a34a', bg: '#f0fdf4', score: 96 },
                    { t: 'How to Build Backlinks Without Cold Outreach', s: 'Generating…', sc: '#d97706', bg: '#fffbeb', score: null },
                    { t: 'Content Marketing ROI: A Complete Guide', s: 'Queued', sc: '#9b9b96', bg: '#f4f4f3', score: null },
                    { t: 'Technical SEO Audit Checklist 2026', s: 'Scheduled', sc: '#2563eb', bg: '#eff6ff', score: null },
                  ].map((row, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center',
                      padding: '9px 12px', gap: 10,
                      borderBottom: i < 3 ? '1px solid #f4f4f3' : 'none',
                    }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: row.sc, flexShrink: 0 }} />
                      <div style={{ flex: 1, fontSize: 12, color: '#0f0f0e', fontWeight: 500, lineHeight: 1.35 }}>{row.t}</div>
                      <div style={{
                        fontSize: 10.5, fontWeight: 500, color: row.sc,
                        background: row.bg, padding: '2px 8px', borderRadius: 100, flexShrink: 0,
                      }}>{row.s}</div>
                      {row.score && (
                        <div style={{
                          fontSize: 10.5, fontWeight: 700, color: '#16a34a',
                          background: '#f0fdf4', padding: '2px 7px', borderRadius: 100,
                        }}>{row.score}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ── INTELLIGENCE LOOP ─────────────────────────────────────── */}
      <section style={{ padding: '96px 24px', background: '#f9f9f8' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: 72 }}>
            <div style={{
              display: 'inline-block', fontSize: 11, fontWeight: 600, color: '#9b9b96',
              textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14,
            }}>
              Five-Stage System
            </div>
            <h2 style={{
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.08,
              color: '#0f0f0e', marginBottom: 16,
            }}>
              Every stage. Automated.
            </h2>
            <p style={{
              fontSize: 18, color: '#6b6b67', maxWidth: 480,
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
              background: 'linear-gradient(to right, transparent, #d4d4d0 20%, #d4d4d0 80%, transparent)',
              zIndex: 0,
            }} />
            {[
              { n: '01', label: 'Discover', desc: 'Surfaces high-intent, low-competition keyword opportunities', col: '#2563eb', icon: '✦', bg: '#eff6ff', bd: '#bfdbfe' },
              { n: '02', label: 'Plan', desc: 'Prioritizes topics by traffic potential and competition gaps', col: '#7c3aed', icon: '▦', bg: '#faf5ff', bd: '#ddd6fe' },
              { n: '03', label: 'Generate', desc: 'Creates publish-ready SEO + AEO optimized articles at scale', col: '#0f0f0e', icon: '⟳', bg: '#f4f4f3', bd: '#e4e4e2' },
              { n: '04', label: 'Measure', desc: 'Tracks rankings, organic traffic, and content ROI automatically', col: '#d97706', icon: '↗', bg: '#fffbeb', bd: '#fde68a' },
              { n: '05', label: 'Improve', desc: 'Refreshes content to maintain and grow rankings continuously', col: '#16a34a', icon: '◈', bg: '#f0fdf4', bd: '#bbf7d0' },
            ].map((stage, i) => (
              <div
                key={stage.n}
                className={`fade-up fade-up-delay-${i + 1}`}
                style={{ textAlign: 'center', padding: '0 14px', position: 'relative', zIndex: 1 }}
              >
                <div className="stage-circle" style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: '#ffffff', border: `2px solid ${stage.bd}`,
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
                <p style={{ fontSize: 12.5, color: '#6b6b67', lineHeight: 1.55 }}>
                  {stage.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES BENTO ────────────────────────────────────────── */}
      <section id="features" style={{ padding: '0 24px 96px', background: '#f9f9f8' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 700, letterSpacing: '-0.04em', color: '#0f0f0e', marginBottom: 12,
            }}>
              Built for every stage of the loop
            </h2>
            <p style={{ fontSize: 17, color: '#6b6b67', maxWidth: 440, margin: '0 auto', lineHeight: 1.65 }}>
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
                <p style={{ fontSize: 14, color: '#6b6b67', lineHeight: 1.6 }}>
                  AI scans your niche to surface high-intent, low-competition keywords your competitors haven&apos;t touched yet.
                </p>
              </div>
              {/* Keyword table mockup */}
              <div style={{ background: '#f9f9f8', border: '1px solid #e4e4e2', borderRadius: 10, overflow: 'hidden', flex: 1 }}>
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
                <p style={{ fontSize: 14, color: '#6b6b67', lineHeight: 1.6 }}>
                  GPT-4o and Gemini 1.5 Pro generate full articles — structured, fact-checked, and optimized for both Google and AI overviews.
                </p>
              </div>
              {/* Generation progress */}
              <div style={{ background: '#f9f9f8', border: '1px solid #e4e4e2', borderRadius: 10, padding: 16, flex: 1 }}>
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
                <p style={{ fontSize: 14, color: '#6b6b67', lineHeight: 1.6 }}>
                  articlos schedules weeks of content in minutes. Set publishing cadence and let the AI fill the calendar intelligently.
                </p>
              </div>
              {/* Calendar mockup */}
              <div style={{ background: '#f9f9f8', border: '1px solid #e4e4e2', borderRadius: 10, overflow: 'hidden' }}>
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
                <p style={{ fontSize: 14, color: '#6b6b67', lineHeight: 1.6 }}>
                  Google Search Console and GA4 data flows in automatically. See exactly which articles drive revenue.
                </p>
              </div>
              {/* Chart mockup */}
              <div style={{ background: '#f9f9f8', border: '1px solid #e4e4e2', borderRadius: 10, padding: '14px 16px', flex: 1 }}>
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
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Optimization checklist */}
                <div style={{
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12, padding: 22, minWidth: 300, flexShrink: 0,
                }} className="improve-card">
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
      <section id="how-it-works" style={{ padding: '96px 24px', background: '#ffffff' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: 72 }}>
            <h2 style={{
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 700, letterSpacing: '-0.04em', marginBottom: 14,
            }}>
              Up and running in minutes
            </h2>
            <p style={{ fontSize: 17, color: '#6b6b67', maxWidth: 400, margin: '0 auto', lineHeight: 1.65 }}>
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
                  background: i === 0 ? '#0f0f0e' : '#ffffff',
                  border: `2px solid ${i === 0 ? '#0f0f0e' : '#e4e4e2'}`,
                  color: i === 0 ? '#ffffff' : '#6b6b67',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, margin: '0 auto 24px',
                  boxShadow: i === 0 ? '0 4px 16px rgba(0,0,0,0.16)' : 'none',
                }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 10 }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 14, color: '#6b6b67', lineHeight: 1.65 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────── */}
      <section style={{ padding: '96px 24px', background: '#0f0f0e' }}>
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
                borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              }}
            >
              <div style={{
                fontSize: 'clamp(40px, 6vw, 68px)',
                fontWeight: 700, letterSpacing: '-0.05em',
                color: '#ffffff', lineHeight: 1, marginBottom: 10,
              }}>
                <CountUp target={stat.target} suffix={stat.suffix} />
              </div>
              <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', fontWeight: 500, marginBottom: 5 }}>
                {stat.label}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)' }}>
                {stat.sub}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT / PRICING ─────────────────────────────────────── */}
      <section id="contact" style={{ padding: '96px 24px', background: '#f9f9f8' }}>
        <div style={{ maxWidth: 580, margin: '0 auto', textAlign: 'center' }} className="fade-up">
          <div style={{
            display: 'inline-block', fontSize: 11, fontWeight: 600, color: '#9b9b96',
            textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 20,
          }}>
            Pricing
          </div>
          <h2 style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 700, letterSpacing: '-0.04em', color: '#0f0f0e',
            marginBottom: 18, lineHeight: 1.1,
          }}>
            Let&apos;s talk about your needs
          </h2>
          <p style={{
            fontSize: 18, color: '#6b6b67', lineHeight: 1.65, marginBottom: 44,
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
      <section style={{ padding: '96px 24px', background: '#ffffff' }}>
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
                <div key={i} style={{ background: '#ffffff', border: '1px solid #e4e4e2', borderRadius: 10, overflow: 'hidden' }}>
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
      <section style={{ padding: '96px 24px', background: '#f9f9f8', borderTop: '1px solid #e8e8e6', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }} className="fade-up">
          <h2 style={{
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: 700, letterSpacing: '-0.045em',
            color: '#0f0f0e', marginBottom: 16, lineHeight: 1.08,
          }}>
            {c('cta_title')}
          </h2>
          <p style={{
            fontSize: 17, color: '#6b6b67',
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
                border: '1px solid #e8e8e6',
                color: '#6b6b67', fontSize: 15, fontWeight: 500,
                textDecoration: 'none', transition: 'all 0.2s ease',
                background: '#ffffff',
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
