import { prisma } from '@/lib/prisma'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import BlogCard from '@/components/BlogCard'
import ScrollAnimations from './ScrollAnimations'
import CountUp from '@/components/CountUp'

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

// Shared Win2k titlebar with window controls
function WinTitleBar({ title, icon }: { title: string; icon?: string }) {
  return (
    <div className="win-titlebar">
      <span className="win-titlebar-icon">{icon || 'a'}</span>
      <span style={{ flex: 1, marginLeft: 4, fontSize: 11, fontWeight: 'bold' }}>{title}</span>
      <div className="win-titlebar-buttons">
        <div className="win-titlebar-btn">_</div>
        <div className="win-titlebar-btn">□</div>
        <div className="win-titlebar-btn close">✕</div>
      </div>
    </div>
  )
}

// Win2k panel wrapper
function WinWindow({ title, icon, children, style }: { title: string; icon?: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="win-window" style={style}>
      <WinTitleBar title={title} icon={icon} />
      <div style={{ padding: '8px', background: '#ece9d8' }}>
        {children}
      </div>
    </div>
  )
}

export default async function HomePage() {
  const [content, posts] = await Promise.all([getSiteContent(), getLatestPosts()])
  const c = (key: keyof typeof defaults) => content[key] || defaults[key]

  return (
    <>
      <Nav />
      <ScrollAnimations />

      {/* Desktop wallpaper bg */}
      <div style={{
        minHeight: '100vh',
        background: '#008080',
        paddingTop: 30,
      }}>

        {/* ── HERO — Full desktop with windows ── */}
        <section style={{ padding: '24px 24px 0', background: '#008080' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="bento-grid">

            {/* Main hero window */}
            <div className="win-window" style={{ gridColumn: '1 / 2' }}>
              <WinTitleBar title="articlos — Welcome" icon="a" />
              <div style={{ padding: 16, background: '#ece9d8' }}>
                {/* Live badge */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: '#d4ffd4', border: '1px solid #008000',
                  padding: '2px 8px', fontSize: 11, marginBottom: 14,
                }}>
                  <span style={{ width: 6, height: 6, background: '#008000', borderRadius: '50%', animation: 'pulse-dot 2s infinite', display: 'inline-block' }} />
                  LIVE — Content Intelligence System
                </div>

                <h1 style={{
                  fontSize: 26,
                  fontWeight: 'bold',
                  color: '#0a246a',
                  marginBottom: 12,
                  lineHeight: 1.2,
                  fontFamily: 'Tahoma, sans-serif',
                  whiteSpace: 'pre-line',
                }}>
                  {c('hero_title')}
                </h1>

                <p style={{
                  fontSize: 11,
                  color: '#000',
                  lineHeight: 1.6,
                  marginBottom: 16,
                  maxWidth: 400,
                }}>
                  {c('hero_subtitle')}
                </p>

                {/* CTA buttons */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <a href="https://app.articlos.com/register" className="btn btn-primary btn-lg">
                    Get started free ▶
                  </a>
                  <a href="#features" className="btn btn-ghost btn-lg">See the platform</a>
                </div>

                {/* "Trusted by" marquee strip */}
                <div style={{
                  marginTop: 20,
                  borderTop: '1px solid #808080',
                  borderBottom: '1px solid #fff',
                  padding: '6px 0',
                  overflow: 'hidden',
                }}>
                  <div style={{ fontSize: 10, color: '#808080', marginBottom: 4 }}>Trusted by:</div>
                  <div style={{
                    display: 'flex',
                    gap: 24,
                    animation: 'marquee 18s linear infinite',
                    width: 'max-content',
                  }}>
                    {[...logoNames, ...logoNames].map((name, i) => (
                      <span key={i} style={{ fontSize: 11, fontWeight: 'bold', color: '#404040', whiteSpace: 'nowrap' }}>
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard mockup window */}
            <div className="win-window">
              <WinTitleBar title="articlos — Content Queue" icon="a" />
              <div style={{ background: '#fff', padding: 0 }}>
                {/* Menu bar */}
                <div style={{
                  display: 'flex', gap: 0, padding: '2px 4px',
                  borderBottom: '1px solid #d4d0c8', background: '#ece9d8',
                  fontSize: 11,
                }}>
                  {['File', 'Edit', 'View', 'Tools', 'Help'].map(m => (
                    <span key={m} style={{ padding: '2px 8px', cursor: 'default' }}>{m}</span>
                  ))}
                </div>

                {/* Toolbar */}
                <div style={{
                  display: 'flex', gap: 4, padding: '3px 4px',
                  borderBottom: '2px solid #808080', background: '#d4d0c8',
                  alignItems: 'center',
                }}>
                  {['+ Generate', 'Publish', 'Refresh'].map(b => (
                    <span key={b} style={{
                      display: 'inline-flex', padding: '1px 8px', fontSize: 11,
                      borderTop: '1px solid #fff', borderLeft: '1px solid #fff',
                      borderBottom: '1px solid #404040', borderRight: '1px solid #404040',
                      background: '#ece9d8', cursor: 'default',
                    }}>{b}</span>
                  ))}
                  <div style={{ flex: 1 }} />
                  <span style={{ fontSize: 10, color: '#808080' }}>1,247 articles</span>
                </div>

                {/* Stats row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0, borderBottom: '1px solid #d4d0c8' }}>
                  {[
                    { v: '1,247', l: 'Generated', col: '#0a246a' },
                    { v: '8', l: 'Today', col: '#006600' },
                    { v: '94', l: 'Avg Score', col: '#0000cc' },
                    { v: '+32%', l: 'Traffic', col: '#cc6600' },
                  ].map((s, i) => (
                    <div key={s.l} style={{
                      padding: '6px 8px',
                      borderRight: i < 3 ? '1px solid #d4d0c8' : 'none',
                      background: '#fff',
                    }}>
                      <div style={{ fontSize: 16, fontWeight: 'bold', color: s.col }}>{s.v}</div>
                      <div style={{ fontSize: 10, color: '#808080' }}>{s.l}</div>
                    </div>
                  ))}
                </div>

                {/* Column headers */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 80px 70px',
                  background: '#d4d0c8', padding: '3px 8px',
                  borderBottom: '2px solid #808080', fontSize: 11, fontWeight: 'bold',
                }}>
                  <span>Title</span>
                  <span>Status</span>
                  <span>Score</span>
                </div>

                {/* Article rows */}
                {[
                  { t: '10 Best SEO Tools for Startups in 2026', s: 'Published', sc: '#006600', score: '96' },
                  { t: 'How to Build Backlinks Without Cold Outreach', s: 'Generating…', sc: '#cc6600', score: '—' },
                  { t: 'Content Marketing ROI: A Complete Guide', s: 'Queued', sc: '#808080', score: '—' },
                  { t: 'Technical SEO Audit Checklist 2026', s: 'Scheduled', sc: '#0000cc', score: '—' },
                ].map((row, i) => (
                  <div key={i} style={{
                    display: 'grid', gridTemplateColumns: '1fr 80px 70px',
                    padding: '4px 8px', fontSize: 11,
                    borderBottom: '1px solid #f0ede8',
                    background: i % 2 === 0 ? '#fff' : '#f5f4f0',
                  }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.t}</span>
                    <span style={{ color: row.sc, fontWeight: 'bold', fontSize: 10 }}>{row.s}</span>
                    <span style={{ color: row.score !== '—' ? '#006600' : '#808080', fontWeight: 'bold' }}>{row.score}</span>
                  </div>
                ))}

                {/* Status bar */}
                <div style={{
                  padding: '2px 8px', borderTop: '2px solid #808080',
                  background: '#d4d0c8', fontSize: 10, color: '#000',
                  display: 'flex', justifyContent: 'space-between',
                }}>
                  <span>4 items</span>
                  <span>app.articlos.com</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FIVE-STAGE SYSTEM ── */}
        <section id="features" style={{ padding: '16px 24px 0', background: '#008080' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="win-window">
              <WinTitleBar title="Intelligence Loop — Five-Stage System" icon="◻" />
              <div style={{ padding: 16, background: '#ece9d8' }}>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <h2 style={{ fontSize: 18, color: '#0a246a', marginBottom: 4, fontFamily: 'Tahoma, sans-serif' }}>
                    Every stage. Automated.
                  </h2>
                  <p style={{ fontSize: 11, color: '#404040', maxWidth: 480, margin: '0 auto' }}>
                    A closed-loop intelligence system that continuously optimizes your entire content strategy.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8 }} className="stages-grid">
                  {[
                    { n: '01', label: 'Discover', desc: 'Surfaces high-intent, low-competition keyword opportunities', col: '#0000cc', icon: '✦', bg: '#e8f0ff' },
                    { n: '02', label: 'Plan', desc: 'Prioritizes topics by traffic potential and competition gaps', col: '#660099', icon: '▦', bg: '#f0e8ff' },
                    { n: '03', label: 'Generate', desc: 'Creates publish-ready SEO + AEO optimized articles at scale', col: '#000000', icon: '⟳', bg: '#f0f0ee' },
                    { n: '04', label: 'Measure', desc: 'Tracks rankings, organic traffic, and content ROI automatically', col: '#cc6600', icon: '↗', bg: '#fff8e8' },
                    { n: '05', label: 'Improve', desc: 'Refreshes content to maintain and grow rankings continuously', col: '#006600', icon: '◈', bg: '#e8ffe8' },
                  ].map((stage) => (
                    <div key={stage.n} className="win-panel" style={{ textAlign: 'center', padding: '10px 8px' }}>
                      {/* Sunken icon well */}
                      <div style={{
                        width: 40, height: 40,
                        borderTop: '2px solid #404040', borderLeft: '2px solid #404040',
                        borderBottom: '2px solid #fff', borderRight: '2px solid #fff',
                        background: stage.bg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 8px', fontSize: 18, color: stage.col,
                      }}>
                        {stage.icon}
                      </div>
                      <div style={{ fontSize: 10, fontWeight: 'bold', color: stage.col, textTransform: 'uppercase', marginBottom: 4 }}>
                        {stage.n} — {stage.label}
                      </div>
                      <p style={{ fontSize: 10, color: '#404040', lineHeight: 1.4 }}>
                        {stage.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES BENTO ── */}
        <section style={{ padding: '16px 24px 0', background: '#008080' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="win-window" style={{ marginBottom: 8 }}>
              <WinTitleBar title="Platform Features — Built for Every Stage" icon="▦" />
              <div style={{ padding: '4px 8px 8px', background: '#d4d0c8', fontSize: 11, color: '#000' }}>
                From finding opportunities to publishing and auto-improving — everything in one platform.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }} className="bento-grid">

              {/* DISCOVER */}
              <div className="win-window">
                <WinTitleBar title="Discover — Find Your Next 100 Articles" icon="✦" />
                <div style={{ padding: 12, background: '#ece9d8' }}>
                  <p style={{ fontSize: 11, color: '#000', lineHeight: 1.5, marginBottom: 10 }}>
                    AI scans your niche to surface high-intent, low-competition keywords your competitors haven&apos;t touched yet.
                  </p>
                  {/* Keyword table */}
                  <div style={{ background: '#fff' }}>
                    <div style={{
                      display: 'grid', gridTemplateColumns: '1fr 64px 52px',
                      padding: '3px 8px', borderBottom: '2px solid #808080',
                      fontSize: 10, fontWeight: 'bold', background: '#d4d0c8',
                    }}>
                      <span>Keyword</span><span style={{ textAlign: 'right' }}>Volume</span><span style={{ textAlign: 'right' }}>Diff</span>
                    </div>
                    {[
                      { kw: 'best seo tools 2026', vol: '8.2K', diff: 'Med', dc: '#cc6600', star: false },
                      { kw: 'ai content generation', vol: '12K', diff: 'Low', dc: '#006600', star: true },
                      { kw: 'content strategy 2026', vol: '5.4K', diff: 'High', dc: '#cc0000', star: false },
                      { kw: 'blog automation tools', vol: '3.2K', diff: 'Low', dc: '#006600', star: true },
                      { kw: 'wordpress seo plugin', vol: '18K', diff: 'High', dc: '#cc0000', star: false },
                      { kw: 'seo content calendar', vol: '2.1K', diff: 'Low', dc: '#006600', star: true },
                    ].map((row, i) => (
                      <div key={i} style={{
                        display: 'grid', gridTemplateColumns: '1fr 64px 52px',
                        padding: '3px 8px', fontSize: 11,
                        borderBottom: i < 5 ? '1px solid #f0f0ee' : 'none',
                        background: row.star ? '#f0fff0' : (i % 2 === 0 ? '#fff' : '#f8f8f5'),
                        alignItems: 'center',
                      }}>
                        <span style={{ fontWeight: row.star ? 'bold' : 'normal', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {row.star ? '★ ' : ''}{row.kw}
                        </span>
                        <span style={{ color: '#404040', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{row.vol}</span>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <span style={{ fontSize: 10, fontWeight: 'bold', color: row.dc }}>{row.diff}</span>
                        </div>
                      </div>
                    ))}
                    <div style={{ padding: '3px 8px', fontSize: 10, color: '#808080', background: '#f0f0ee', borderTop: '1px solid #d4d0c8' }}>
                      127 opportunities found
                    </div>
                  </div>
                </div>
              </div>

              {/* GENERATE */}
              <div className="win-window">
                <WinTitleBar title="Generate — Publish-Ready in Seconds" icon="⟳" />
                <div style={{ padding: 12, background: '#ece9d8' }}>
                  <p style={{ fontSize: 11, color: '#000', lineHeight: 1.5, marginBottom: 10 }}>
                    GPT-4o and Gemini 1.5 Pro generate full articles — structured, fact-checked, and optimized for both Google and AI overviews.
                  </p>
                  {/* Progress window */}
                  <div style={{ background: '#fff', border: '2px inset #808080', padding: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 10, color: '#0a246a' }}>
                      &ldquo;10 Best SEO Tools for Startups in 2026&rdquo;
                    </div>
                    {[
                      { label: 'Research & SERP analysis', pct: 100 },
                      { label: 'Outline & heading structure', pct: 100 },
                      { label: 'Article body (2,400 words)', pct: 72 },
                      { label: 'SEO optimization pass', pct: 0 },
                      { label: 'WordPress publish', pct: 0 },
                    ].map(step => (
                      <div key={step.label} style={{ marginBottom: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, fontSize: 11 }}>
                          <span style={{
                            color: step.pct === 100 ? '#006600' : step.pct > 0 ? '#0000cc' : '#808080',
                            fontWeight: step.pct > 0 ? 'bold' : 'normal',
                          }}>
                            {step.pct === 100 ? '✓ ' : step.pct > 0 ? '● ' : '○ '}{step.label}
                          </span>
                          <span style={{ color: '#808080' }}>{step.pct}%</span>
                        </div>
                        <div className="win-progress-track">
                          <div className="win-progress-fill" style={{ width: `${step.pct}%` }} />
                        </div>
                      </div>
                    ))}
                    <div style={{
                      marginTop: 10, paddingTop: 8, borderTop: '1px solid #d4d0c8',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                      <span style={{ fontSize: 11, color: '#808080' }}>Estimated SEO score</span>
                      <span style={{ fontSize: 13, fontWeight: 'bold', color: '#006600' }}>94 / 100</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* PLAN */}
              <div className="win-window">
                <WinTitleBar title="Plan — Your Content Calendar, Automated" icon="▦" />
                <div style={{ padding: 12, background: '#ece9d8' }}>
                  <p style={{ fontSize: 11, color: '#000', lineHeight: 1.5, marginBottom: 10 }}>
                    articlos schedules weeks of content in minutes. Set publishing cadence and let the AI fill the calendar intelligently.
                  </p>
                  {/* Calendar mockup */}
                  <div style={{ background: '#fff' }}>
                    <div style={{
                      display: 'grid', gridTemplateColumns: 'repeat(7,1fr)',
                      background: '#d4d0c8', borderBottom: '2px solid #808080',
                    }}>
                      {['M','T','W','T','F','S','S'].map((d,i) => (
                        <div key={i} style={{ padding: '3px 0', textAlign: 'center', fontSize: 10, fontWeight: 'bold' }}>{d}</div>
                      ))}
                    </div>
                    {[
                      [true, false, true, false, true, false, false],
                      [false, true, false, true, false, false, false],
                      [true, false, false, true, false, true, false],
                      [false, true, true, false, true, false, false],
                    ].map((week, wi) => (
                      <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', borderBottom: wi < 3 ? '1px solid #f0ede8' : 'none' }}>
                        {week.map((hasArticle, di) => (
                          <div key={di} style={{ padding: '4px 2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {hasArticle ? (
                              <div style={{ width: 24, height: 14, background: '#0a246a', opacity: 0.85 }} />
                            ) : (
                              <div style={{ width: 24, height: 14, background: '#f0f0ee', border: '1px solid #d4d0c8' }} />
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                    <div style={{ padding: '3px 8px', fontSize: 10, color: '#808080', background: '#f0f0ee', borderTop: '1px solid #d4d0c8' }}>
                      14 articles scheduled this month
                    </div>
                  </div>
                </div>
              </div>

              {/* MEASURE */}
              <div className="win-window">
                <WinTitleBar title="Measure — Track Every Ranking, Every Click" icon="↗" />
                <div style={{ padding: 12, background: '#ece9d8' }}>
                  <p style={{ fontSize: 11, color: '#000', lineHeight: 1.5, marginBottom: 10 }}>
                    Google Search Console and GA4 data flows in automatically. See exactly which articles drive revenue.
                  </p>
                  {/* Chart mockup */}
                  <div style={{ background: '#fff', border: '2px inset #808080', padding: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 'bold' }}>Organic Traffic</span>
                      <span style={{ fontSize: 11, fontWeight: 'bold', color: '#006600' }}>↑ 32% this month</span>
                    </div>
                    {/* Bar chart */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 60, marginBottom: 8 }}>
                      {[22,28,25,34,38,44,40,52,48,60,56,72,68,88].map((h, i) => (
                        <div key={i} style={{
                          flex: 1,
                          height: `${h}%`,
                          background: i === 13 ? '#0a246a' : i > 9 ? '#6080c0' : '#d4d0c8',
                        }} />
                      ))}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 4, marginTop: 8 }}>
                      {[
                        { label: 'Impressions', val: '284K' },
                        { label: 'Clicks', val: '18.4K' },
                        { label: 'Avg position', val: '4.2' },
                      ].map(m => (
                        <div key={m.label} style={{
                          background: '#f0f0ee', padding: '4px 6px',
                          borderTop: '1px solid #808080', borderLeft: '1px solid #808080',
                          borderBottom: '1px solid #fff', borderRight: '1px solid #fff',
                        }}>
                          <div style={{ fontSize: 13, fontWeight: 'bold', color: '#0a246a' }}>{m.val}</div>
                          <div style={{ fontSize: 10, color: '#808080' }}>{m.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* IMPROVE — full width */}
              <div className="win-window" style={{ gridColumn: '1 / 3' }}>
                <WinTitleBar title="Improve — Content That Keeps Getting Better" icon="◈" />
                <div style={{ padding: 16, background: '#0a246a' }}>
                  <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }} className="improve-inner">
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 8, fontFamily: 'Tahoma, sans-serif' }}>
                        Content that keeps getting better
                      </h3>
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, maxWidth: 400, marginBottom: 16 }}>
                        articlos monitors ranking drops, identifies why, and refreshes your articles automatically — so your content compounds over time instead of decaying.
                      </p>
                      <div style={{ display: 'flex', gap: 24 }}>
                        {[
                          { label: 'Articles improved', val: '3,847' },
                          { label: 'Avg score gain', val: '+22pts' },
                        ].map(s => (
                          <div key={s.label} style={{
                            borderTop: '2px solid rgba(255,255,255,0.3)',
                            borderLeft: '2px solid rgba(255,255,255,0.3)',
                            borderBottom: '2px solid rgba(255,255,255,0.1)',
                            borderRight: '2px solid rgba(255,255,255,0.1)',
                            padding: '8px 12px', background: 'rgba(255,255,255,0.08)',
                          }}>
                            <div style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>{s.val}</div>
                            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{s.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Optimization checklist — as a sub-window */}
                    <div className="win-window improve-card" style={{ minWidth: 280, flexShrink: 0 }}>
                      <WinTitleBar title="Auto-Optimization Running" />
                      <div style={{ padding: 10, background: '#ece9d8' }}>
                        {[
                          { t: 'Added FAQ section', done: true },
                          { t: 'Enhanced H2 heading structure', done: true },
                          { t: 'Improved internal linking', done: true },
                          { t: 'Updated meta description', done: false },
                          { t: 'Added schema markup', done: false },
                        ].map((item, i) => (
                          <div key={i} style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '4px 0',
                            borderBottom: i < 4 ? '1px solid #d4d0c8' : 'none',
                          }}>
                            <div style={{
                              width: 16, height: 16,
                              borderTop: '1px solid #808080', borderLeft: '1px solid #808080',
                              borderBottom: '1px solid #fff', borderRight: '1px solid #fff',
                              background: item.done ? '#d4ffd4' : '#fff',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 10, color: '#006600', flexShrink: 0,
                            }}>{item.done ? '✓' : ''}</div>
                            <span style={{
                              fontSize: 11, lineHeight: 1.35,
                              color: item.done ? '#000' : '#808080',
                            }}>{item.t}</span>
                          </div>
                        ))}
                        <div style={{
                          marginTop: 8, paddingTop: 6, borderTop: '2px solid #808080',
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        }}>
                          <span style={{ fontSize: 11 }}>SEO Score</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 13, color: '#808080', textDecoration: 'line-through' }}>72</span>
                            <span style={{ fontSize: 10, color: '#808080' }}>→</span>
                            <span style={{ fontSize: 16, fontWeight: 'bold', color: '#006600' }}>94</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" style={{ padding: '16px 24px 0', background: '#008080' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="win-window">
              <WinTitleBar title="Getting Started — Up and Running in Minutes" icon="◻" />
              <div style={{ padding: 16, background: '#ece9d8' }}>
                <p style={{ fontSize: 11, color: '#404040', textAlign: 'center', marginBottom: 16 }}>
                  Three steps and your content machine is live. No dev work, no setup pain.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }} className="steps-grid">
                  {[
                    { num: '01', title: 'Connect your website', desc: 'Add your WordPress site in one click. articlos handles authentication, categories, and publishing rules automatically.' },
                    { num: '02', title: 'Set your topic strategy', desc: 'Enter seed keywords or let articlos scan your niche. The AI builds a complete, prioritized content plan for you.' },
                    { num: '03', title: 'Watch content go live', desc: 'Articles are generated, SEO-optimized, and published on your schedule — fully autonomous or with your review.' },
                  ].map((step, i) => (
                    <div key={step.num} className="win-panel" style={{ padding: 12, textAlign: 'center' }}>
                      <div style={{
                        width: 36, height: 36, margin: '0 auto 10px',
                        borderTop: i === 0 ? '2px solid #fff' : '2px solid #808080',
                        borderLeft: i === 0 ? '2px solid #fff' : '2px solid #808080',
                        borderBottom: i === 0 ? '2px solid #808080' : '2px solid #fff',
                        borderRight: i === 0 ? '2px solid #808080' : '2px solid #fff',
                        background: i === 0 ? '#0a246a' : '#ece9d8',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 'bold',
                        color: i === 0 ? '#fff' : '#808080',
                      }}>
                        {step.num}
                      </div>
                      <h3 style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 6 }}>{step.title}</h3>
                      <p style={{ fontSize: 11, color: '#404040', lineHeight: 1.5 }}>{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section style={{ padding: '16px 24px 0', background: '#008080' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="win-window">
              <WinTitleBar title="System Statistics" icon="↗" />
              <div style={{ background: '#0a246a', padding: 0 }}>
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
                }} className="stats-grid">
                  {[
                    { target: 50000, suffix: '+', label: 'Articles generated', sub: 'and still counting' },
                    { target: 2400, suffix: '+', label: 'Websites connected', sub: 'across every niche' },
                    { target: 94, suffix: '%', label: 'Average SEO score', sub: 'vs 67% industry average' },
                  ].map((stat, i) => (
                    <div key={stat.label} style={{
                      textAlign: 'center', padding: '24px 20px',
                      borderRight: i < 2 ? '1px solid rgba(255,255,255,0.15)' : 'none',
                    }}>
                      <div style={{ fontSize: 44, fontWeight: 'bold', color: '#fff', lineHeight: 1, marginBottom: 6, fontFamily: 'Tahoma, sans-serif' }}>
                        <CountUp target={stat.target} suffix={stat.suffix} />
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginBottom: 3 }}>
                        {stat.label}
                      </div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>
                        {stat.sub}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PRICING / CONTACT ── */}
        <section id="contact" style={{ padding: '16px 24px 0', background: '#008080' }}>
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <div className="win-window">
              <WinTitleBar title="Pricing — Let's Talk About Your Needs" icon="◻" />
              <div style={{ padding: 20, background: '#ece9d8', textAlign: 'center' }}>
                <div style={{ marginBottom: 8 }}>
                  <span style={{
                    display: 'inline-block', fontSize: 10, fontWeight: 'bold', color: '#808080',
                    textTransform: 'uppercase', letterSpacing: '0.08em', padding: '2px 8px',
                    background: '#d4d0c8', borderTop: '1px solid #fff', borderLeft: '1px solid #fff',
                    borderBottom: '1px solid #808080', borderRight: '1px solid #808080',
                  }}>
                    Pricing
                  </span>
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 'bold', color: '#0a246a', marginBottom: 10, fontFamily: 'Tahoma, sans-serif' }}>
                  Let&apos;s talk about your needs
                </h2>
                <p style={{ fontSize: 11, color: '#404040', lineHeight: 1.6, marginBottom: 20 }}>
                  We offer flexible plans for content teams of all sizes — from solo bloggers to enterprise agencies.
                  Reach out and we&apos;ll find the right fit for you.
                </p>

                {/* Win2k dialog-style buttons */}
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a href="mailto:hello@articlos.com" className="btn btn-primary btn-lg">
                    hello@articlos.com
                  </a>
                  <a href="https://app.articlos.com/register" className="btn btn-ghost btn-lg">
                    Try free first
                  </a>
                </div>

                <p style={{ fontSize: 10, color: '#808080', marginTop: 12 }}>
                  Free trial available · No credit card required
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── BLOG PREVIEW ── */}
        <section style={{ padding: '16px 24px 0', background: '#008080' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="win-window">
              <WinTitleBar title="From the Blog" icon="◻" />
              <div style={{ padding: 16, background: '#ece9d8' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 'bold', color: '#0a246a', fontFamily: 'Tahoma, sans-serif' }}>Recent Posts</h2>
                  <a href="/blog" className="btn btn-sm">All posts →</a>
                </div>

                {posts.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }} className="blog-grid">
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
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }} className="blog-grid">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="win-panel" style={{ overflow: 'hidden' }}>
                        <div className="win-titlebar" style={{ fontSize: 10 }}>Loading post...</div>
                        <div style={{ padding: 10, background: '#ece9d8' }}>
                          <div className="skeleton" style={{ height: 10, marginBottom: 6 }} />
                          <div className="skeleton" style={{ height: 10, width: '80%', marginBottom: 4 }} />
                          <div className="skeleton" style={{ height: 10, width: '60%' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section style={{ padding: '16px 24px 24px', background: '#008080' }}>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <div className="win-window">
              <WinTitleBar title="Get Started — articlos Content Intelligence" icon="a" />
              <div style={{ padding: 24, background: '#0a246a', textAlign: 'center' }}>
                <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 10, fontFamily: 'Tahoma, sans-serif' }}>
                  {c('cta_title')}
                </h2>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 20, lineHeight: 1.6 }}>
                  {c('cta_subtitle')}
                </p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a href="https://app.articlos.com/register" className="cta-white-btn">
                    Get started free ▶
                  </a>
                  <a href="mailto:hello@articlos.com" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '4px 18px',
                    border: '2px solid rgba(255,255,255,0.4)',
                    color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: 'bold',
                    textDecoration: 'none', fontFamily: 'Tahoma, sans-serif',
                  }}>
                    Contact sales
                  </a>
                </div>
              </div>
              {/* Win2k status bar */}
              <div style={{
                padding: '2px 8px', background: '#d4d0c8',
                borderTop: '2px solid #808080', fontSize: 10,
                display: 'flex', justifyContent: 'space-between',
              }}>
                <span>2,400+ websites connected</span>
                <span>articlos.com © 2026</span>
              </div>
            </div>
          </div>
        </section>

      </div>{/* end desktop bg */}

      <Footer />
    </>
  )
}
