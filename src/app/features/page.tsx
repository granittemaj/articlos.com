import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ScrollAnimations from '../ScrollAnimations'

export const metadata: Metadata = {
  title: 'Features — The Full Articlos Content Operations Platform',
  description: 'Every articlos feature in one place. Opportunity mining, AI article generation, WordPress publishing, keyword tracking, content decay alerts, autopilot, content map, and more.',
  alternates: { canonical: '/features' },
  openGraph: {
    title: 'Features — articlos content operations platform',
    description: 'From GSC opportunity mining to WordPress publishing to auto-rewrites. See every feature of the closed-loop content system.',
    url: 'https://articlos.com/features',
  },
}

type Feature = {
  name: string
  desc: string
  plan?: 'Lite+' | 'Pro+' | 'Autopilot'
}

type Stage = {
  id: string
  badge: string
  title: string
  intro: string
  color: string
  bg: string
  border: string
  features: Feature[]
}

const stages: Stage[] = [
  {
    id: 'discover',
    badge: '✦ Discover',
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#bfdbfe',
    title: 'Discover what to write — from your own data',
    intro: 'Most tools tell you what to write based on generic SERP scores. articlos mines your real Google Search Console data to find keywords your site can actually rank for.',
    features: [
      {
        name: 'Opportunity Map',
        desc: 'Pulls the top 1,000 queries from your Google Search Console and clusters them by intent (informational, commercial, navigational, how-to). Surfaces "high intent, low volume" and "high volume, low position" opportunities where a single article could move the needle. Refreshes every 6 hours.',
      },
      {
        name: 'Keyword Tracker',
        desc: 'Track up to 300 keywords with full position history. Weekly digest of position changes with trending charts. Stored as JSONB snapshots so you can see ranking evolution over months.',
      },
      {
        name: 'Competitor Domains',
        desc: 'Add up to 50 competitor domains. Surfaces keywords competitors rank for that you don\'t yet cover — content gap analysis that pulls directly from GSC data.',
        plan: 'Pro+',
      },
      {
        name: 'Competitor Structure & History',
        desc: 'See how competitor sites structure their content, which topic clusters they\'ve built, and how their rankings have changed over time.',
        plan: 'Autopilot',
      },
      {
        name: 'AI Topic Suggestions',
        desc: 'LLM-powered topic ideas for any niche. Uses the Opportunity Map plus your brand voice to suggest articles with real ranking potential.',
      },
    ],
  },
  {
    id: 'plan',
    badge: '▦ Plan',
    color: '#16a34a',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    title: 'Plan what matters — cluster and sequence intelligently',
    intro: 'Random articles rank randomly. articlos plans topic clusters and publishing cadence so your content compounds into topical authority.',
    features: [
      {
        name: 'Content Map',
        desc: 'Visual topic cluster builder with pillar pages, supporting articles, and the internal link structure between them. Powered by LLM clustering of GSC and keyword data. Up to 30 clusters per month.',
        plan: 'Autopilot',
      },
      {
        name: 'Content Queue',
        desc: 'Batch-queue up to 300 topics with drag-and-drop reordering. Target each article to a specific website when managing multiple sites.',
      },
      {
        name: 'Bulk Queue Generation',
        desc: 'Process the queue in parallel. Generate, optimize, and publish dozens of articles at once instead of one at a time.',
        plan: 'Autopilot',
      },
      {
        name: 'Publishing Calendar',
        desc: 'Schedule articles for specific dates. Weekly cadence, custom rhythms, or ad-hoc — the calendar view shows exactly what ships when.',
        plan: 'Pro+',
      },
      {
        name: 'Cannibalization Detection',
        desc: 'Flags pages on your site competing for the same keyword so you can consolidate, redirect, or differentiate instead of splitting ranking power.',
        plan: 'Autopilot',
      },
    ],
  },
  {
    id: 'generate',
    badge: '⟳ Generate',
    color: '#7c3aed',
    bg: '#faf5ff',
    border: '#ddd6fe',
    title: 'Generate publish-ready articles — with your voice',
    intro: 'Full long-form articles that are actually ready to ship. Not outlines, not drafts — articles with metadata, schema, internal links, and a featured image, styled in your voice.',
    features: [
      {
        name: 'Multi-model AI routing',
        desc: 'GPT-4o, Claude 3.5 Sonnet, and Gemini 2.5 Flash under the hood. Pick the best model per article type; fall back automatically when a provider has an outage.',
      },
      {
        name: 'Brand Voice',
        desc: 'Paste 3–5 sample articles or URLs during setup. articlos extracts your tone, vocabulary, sentence structure, and formatting into a voice profile applied to every generation org-wide.',
        plan: 'Pro+',
      },
      {
        name: 'SEO + AEO scoring',
        desc: 'Every article is scored for traditional SEO (Google rankings) and AEO (Answer Engine Optimization — for ChatGPT, Perplexity, Google AI Overviews citations). See scores before publishing.',
      },
      {
        name: 'Auto internal linking',
        desc: 'Top 3 internal link suggestions per article, validated against your published post URLs. Links are added automatically on save — no manual link hunting.',
      },
      {
        name: 'JSON-LD structured data',
        desc: 'Article and FAQ JSON-LD schema auto-generated and attached on publish. Boosts AI search citation rates and SERP rich-result eligibility.',
      },
      {
        name: 'Featured image selection',
        desc: 'Automatic Pexels image search based on the article topic. Landscape orientation, high resolution, commercially licensed — attached as the WordPress featured image.',
      },
      {
        name: 'Rewrite mode',
        desc: 'Paste an existing article and articlos rewrites it with your brand voice, adds internal links, optimizes for current rankings, and ships. Great for old posts you want to refresh.',
      },
      {
        name: 'Custom instructions',
        desc: 'Up to 10,000 characters of custom instructions per article. Enforce structure, tone, examples, or CTAs that the default brand voice doesn\'t cover.',
      },
    ],
  },
  {
    id: 'publish',
    badge: '⇡ Publish',
    color: '#0891b2',
    bg: '#ecfeff',
    border: '#a5f3fc',
    title: 'Publish to WordPress — directly, not via export',
    intro: 'No copy-paste, no CSV export, no "save as markdown and hope for the best". articlos publishes straight into WordPress with everything wired up.',
    features: [
      {
        name: 'Direct WordPress REST API',
        desc: 'Per-site app password authentication (encrypted at rest). Publish as draft, scheduled, or live. Articles land with correct categories, tags, slug, metadata, and featured image.',
      },
      {
        name: 'Post scheduling',
        desc: 'Schedule individual posts or batches for specific dates. Drip publishing keeps a steady cadence without manual intervention.',
        plan: 'Pro+',
      },
      {
        name: 'Multi-site management',
        desc: 'Connect multiple WordPress sites to one organization. Route queue items to specific sites; manage credentials per property.',
        plan: 'Pro+',
      },
      {
        name: 'Markdown + CSV export',
        desc: 'Export articles as markdown files or bulk-export the content library as CSV. Use if your publishing workflow isn\'t WordPress.',
      },
      {
        name: 'Autopilot — weekly unattended publishing',
        desc: 'The full pipeline on a cron: pulls topics from the Opportunity Map, generates articles with brand voice and internal links, publishes to WordPress on the configured cadence. Zero manual steps per week.',
        plan: 'Autopilot',
      },
    ],
  },
  {
    id: 'measure',
    badge: '↗ Measure',
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
    title: 'Measure every ranking and click',
    intro: 'Google Search Console and GA4 flow in automatically. See exactly which articles drive traffic and revenue — and which are decaying.',
    features: [
      {
        name: 'GSC integration',
        desc: 'OAuth connection to Google Search Console. Query-level clicks, impressions, CTR, and average position. Filter by page, date range, or device. Compare current period vs previous to spot trends.',
      },
      {
        name: 'GA4 integration',
        desc: 'OAuth connection to Google Analytics 4. Session-level data for every article: sessions, users, bounce rate, channels, devices, countries, new vs returning.',
      },
      {
        name: 'Top pages analysis',
        desc: 'See which articles are your biggest organic traffic drivers. Sort by clicks, impressions, position, or session delta.',
        plan: 'Pro+',
      },
      {
        name: 'Overlap analysis',
        desc: 'Find articles ranking for the same queries so you can consolidate or differentiate.',
        plan: 'Pro+',
      },
      {
        name: 'AI insights',
        desc: 'LLM-generated commentary on your analytics — what\'s working, what\'s declining, what to double down on. Reads your data like an in-house analyst would.',
        plan: 'Autopilot',
      },
      {
        name: 'Analytics time ranges',
        desc: 'Lite: 7, 30, and 90-day ranges. Pro and Autopilot: all time ranges including custom periods.',
      },
    ],
  },
  {
    id: 'improve',
    badge: '◈ Improve',
    color: '#16a34a',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    title: 'Improve automatically — content that compounds',
    intro: 'Most content decays. articlos detects the drop, identifies why, and rewrites the article — so your library gets stronger over time instead of weaker.',
    features: [
      {
        name: 'Content Decay Alerts',
        desc: 'Compares two GA4 periods (default 30 days) and flags articles where sessions dropped >10%, clicks dropped >10%, or average position worsened by >5. Severity tiers: critical (>50% drop), high (>25%), medium (>10%). Monday-morning email digest.',
        plan: 'Pro+',
      },
      {
        name: 'Auto-rewrite queue',
        desc: 'Decayed articles can be auto-queued for rewrite. articlos diagnoses the cause (outdated info, new competitor content, relevance drift) and refreshes the piece with current context.',
        plan: 'Autopilot',
      },
      {
        name: 'Site Audit',
        desc: 'Scans for thin content, broken links, duplicate titles, and computes an SEO score per page. Delivers a prioritized fix list.',
      },
      {
        name: 'Internal linking refresh',
        desc: 'As you publish new articles, articlos retroactively updates internal links in older posts so your link graph stays healthy. Up to 300 articles covered on Autopilot.',
      },
      {
        name: 'Version history',
        desc: 'Every article kept with full version history. Diff rewrites, roll back, or fork — never lose the original.',
      },
    ],
  },
]

const integrations = [
  { name: 'WordPress', desc: 'Direct REST API, per-site app password, scheduled posts, auto internal linking' },
  { name: 'Google Search Console', desc: 'OAuth, query and page performance, opportunity mining' },
  { name: 'Google Analytics 4', desc: 'OAuth, session-level tracking, content decay detection' },
  { name: 'Pexels', desc: 'Automatic featured image selection per article' },
  { name: 'OpenAI, Anthropic, Google', desc: 'Multi-model routing via Vercel AI Gateway' },
]

export default function FeaturesPage() {
  return (
    <>
      <Nav />
      <ScrollAnimations />

      <main style={{ background: 'var(--bg)' }}>
        {/* Hero */}
        <section style={{ padding: '96px 24px 48px', borderBottom: '1px solid var(--border)' }}>
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
              Every stage. Every feature.
            </h1>
            <p className="fade-up fade-up-delay-1" style={{ fontSize: 18, color: 'var(--text-muted)', lineHeight: 1.65, maxWidth: 680, margin: '0 auto' }}>
              articlos is the closed-loop content operations platform — built around the six stages that run your content marketing continuously. Here is every feature, grouped by stage.
            </p>
          </div>
        </section>

        {/* Quick jump nav */}
        <section style={{ padding: '24px', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
            {stages.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 14px',
                  borderRadius: 100,
                  fontSize: 13,
                  fontWeight: 500,
                  background: s.bg,
                  color: s.color,
                  border: `1px solid ${s.border}`,
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {s.badge}
              </a>
            ))}
          </div>
        </section>

        {/* Stages */}
        {stages.map((stage, stageIdx) => (
          <section
            key={stage.id}
            id={stage.id}
            style={{
              padding: '80px 24px',
              borderBottom: '1px solid var(--border)',
              background: stageIdx % 2 === 0 ? 'var(--bg)' : 'var(--surface)',
              scrollMarginTop: 80,
            }}
          >
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
              <div className="fade-up" style={{ marginBottom: 40, maxWidth: 720 }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: stage.bg, border: `1px solid ${stage.border}`,
                  borderRadius: 100, padding: '4px 12px',
                  fontSize: 12, fontWeight: 600, color: stage.color,
                  marginBottom: 16,
                }}>
                  {stage.badge}
                </div>
                <h2 style={{
                  fontSize: 'clamp(28px, 3.2vw, 38px)',
                  fontWeight: 700, letterSpacing: '-0.03em',
                  color: 'var(--text)', marginBottom: 12, lineHeight: 1.2,
                }}>
                  {stage.title}
                </h2>
                <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.65 }}>
                  {stage.intro}
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 16,
              }}>
                {stage.features.map((f, i) => (
                  <div
                    key={f.name}
                    className={`fade-up fade-up-delay-${Math.min(i + 1, 6)}`}
                    style={{
                      background: 'var(--bg)',
                      border: '1px solid var(--border)',
                      borderRadius: 12,
                      padding: 24,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em', margin: 0 }}>
                        {f.name}
                      </h3>
                      {f.plan && (
                        <span style={{
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          color: stage.color,
                          background: stage.bg,
                          border: `1px solid ${stage.border}`,
                          padding: '2px 8px',
                          borderRadius: 100,
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                        }}>
                          {f.plan}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                      {f.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* Integrations */}
        <section style={{ padding: '80px 24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div className="fade-up" style={{ textAlign: 'center', marginBottom: 40 }}>
              <h2 style={{
                fontSize: 'clamp(26px, 3vw, 36px)',
                fontWeight: 700, letterSpacing: '-0.02em',
                color: 'var(--text)', marginBottom: 12,
              }}>
                Integrations
              </h2>
              <p style={{ fontSize: 16, color: 'var(--text-muted)', maxWidth: 520, margin: '0 auto', lineHeight: 1.6 }}>
                articlos plugs into the tools you already use. OAuth connections, encrypted credentials, no data-massage layer.
              </p>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 14,
            }}>
              {integrations.map((it, i) => (
                <div
                  key={it.name}
                  className={`fade-up fade-up-delay-${Math.min(i + 1, 6)}`}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    padding: 20,
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
                    {it.name}
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
                    {it.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: '88px 24px' }}>
          <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 700, marginBottom: 14, letterSpacing: '-0.02em', color: 'var(--text)' }}>
              See the full loop in action
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.6 }}>
              Get in touch and we&apos;ll walk you through the closed loop on your own site.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/contact" className="btn btn-primary btn-lg">Contact us</Link>
              <Link href="/compare" className="btn btn-ghost btn-lg">Compare alternatives</Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
