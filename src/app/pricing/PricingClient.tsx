'use client'

import { useState, useEffect, useRef } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

type Billing = 'monthly' | 'annual'

const plans = [
  {
    id: 'lite',
    name: 'Lite',
    desc: 'For solo creators getting started with AI content.',
    monthly: 29,
    annual: 24,
    annualTotal: 290,
    annualSave: 58,
    cta: 'Get started',
    ctaStyle: 'ghost' as const,
    href: 'https://app.articlos.com/register?plan=lite',

    featured: false,
    badge: null,
    featuresLabel: "What's included",
    features: [
      '20 AI articles per month',
      '20 tracked keywords',
      '2 competitor domains',
      'Analytics (7, 30, 90 days)',
      'WordPress publishing',
      'Brand Voice (text analysis)',
      'Internal linking (10 articles)',
      'Markdown export',
      'SEO + AEO scoring',
    ],
    limits: [
      'No scheduling',
      'No Content Map',
      'No Autopilot',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    desc: 'For growing teams scaling their content engine.',
    monthly: 89,
    annual: 74,
    annualTotal: 890,
    annualSave: 178,
    cta: 'Get started',
    ctaStyle: 'ghost' as const,
    href: 'https://app.articlos.com/register?plan=pro',
    featured: false,
    badge: null,
    featuresLabel: 'Everything in Lite, plus',
    features: [
      '100 AI articles per month',
      '100 tracked keywords',
      '20 competitor domains',
      'Full analytics (all time ranges)',
      'WordPress + scheduling',
      'Full Brand Voice',
      'Internal linking (100 articles)',
      'All content gaps + decay alerts',
      'CSV + Markdown export',
      'Top pages + Overlap analysis',
    ],
    limits: [
      'No AI insights',
      'No Content Map',
      'No Autopilot',
    ],
  },
  {
    id: 'autopilot',
    name: 'Autopilot',
    desc: 'For teams that want AI to run their entire content strategy.',
    monthly: 149,
    annual: 124,
    annualTotal: 1490,
    annualSave: 298,
    cta: 'Get started',
    ctaStyle: 'primary' as const,
    href: 'https://app.articlos.com/register?plan=autopilot',
    featured: true,
    badge: 'Recommended',
    featuresLabel: 'Everything in Pro, plus',
    features: [
      '300 AI articles per month',
      '300 tracked keywords',
      '50 competitor domains',
      'Autopilot — automated generation',
      'AI insights in Analytics',
      'Content Map (30 per month)',
      'Bulk queue (unlimited)',
      'Cannibalization detection',
      'Competitor Structure + History',
      'Team members (up to 5)',
      'Internal linking (300 articles)',
      'Priority support',
    ],
    limits: [],
  },
]

const comparisonRows = [
  { section: 'Content Generation' },
  { label: 'AI articles per month', values: ['20', '100', '300'] },
  { label: 'AI models (GPT, Claude, Gemini)', values: ['check', 'check', 'check'] },
  { label: 'SEO + AEO scoring', values: ['check', 'check', 'check'] },
  { label: 'Internal link suggestions', values: ['2 per article', 'All', 'All'] },
  { label: 'Content queue', values: ['20 items', '100 items', '300 items'] },
  { label: 'Bulk queue generation', values: ['cross', 'cross', 'Unlimited'] },
  { label: 'Autopilot (automated)', values: ['cross', 'cross', 'check'] },
  { section: 'SEO & Analytics' },
  { label: 'Keyword tracking', values: ['20', '100', '300'] },
  { label: 'Analytics time ranges', values: ['7, 30, 90d', 'All ranges', 'All ranges'] },
  { label: 'AI insights', values: ['cross', 'cross', 'check'] },
  { label: 'Internal linking analysis', values: ['10 articles', '100 articles', '300 articles'] },
  { section: 'Opportunities' },
  { label: 'Keyword opportunities', values: ['20', '100', '300'] },
  { label: 'Content gaps', values: ['5', 'All', 'All'] },
  { label: 'Decay alerts', values: ['2', 'All', 'All'] },
  { label: 'Cannibalization detection', values: ['cross', 'cross', 'check'] },
  { section: 'Competitors' },
  { label: 'Competitor domains', values: ['2', '20', '50'] },
  { label: 'Keyword gaps', values: ['5', 'All', 'All'] },
  { label: 'Top pages + Overlap', values: ['cross', 'check', 'check'] },
  { label: 'Structure + History', values: ['cross', 'cross', 'check'] },
  { section: 'Content Strategy' },
  { label: 'Content Map', values: ['cross', 'cross', '30 / month'] },
  { label: 'Brand Voice', values: ['Limited', 'Full', 'Full'] },
  { section: 'Publishing & Export' },
  { label: 'WordPress publishing', values: ['check', 'check', 'check'] },
  { label: 'WordPress scheduling', values: ['cross', 'check', 'check'] },
  { label: 'Markdown export', values: ['check', 'check', 'check'] },
  { label: 'CSV export', values: ['cross', 'check', 'check'] },
  { section: 'Team & Support' },
  { label: 'Team members', values: ['cross', 'cross', 'Up to 5'] },
  { label: 'Support', values: ['Email', 'Email', 'Priority'] },
]

const faqs = [
  {
    q: 'Can I switch plans anytime?',
    a: 'Yes. Upgrade or downgrade at any time from your billing settings. When upgrading, you only pay the difference for the remaining billing period.',
  },
  {
    q: 'What happens when I hit my article limit?',
    a: "You'll see a notification in the Generator. You can upgrade your plan instantly to continue creating content, or wait until your next billing cycle resets the counter.",
  },
  {
    q: 'How does the annual billing work?',
    a: "Annual billing gives you 2 months free — you pay for 10 months instead of 12. You're billed once per year and can cancel anytime.",
  },
  {
    q: 'What AI models are available?',
    a: 'All plans include GPT-4o, Claude Sonnet, and Gemini Flash. You choose which model to use for each article in the Generator settings.',
  },
  {
    q: 'Do I need a WordPress site?',
    a: 'No. You can use articlos to generate and export content without WordPress. WordPress integration is optional and lets you publish directly from the app.',
  },
  {
    q: 'What is Autopilot?',
    a: 'Autopilot automatically generates articles on a schedule based on your queue and brand voice. It picks the highest-priority keywords, generates optimized content, and can publish directly to WordPress — all without manual intervention.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. No long-term contracts. Cancel from your billing settings and your plan stays active until the end of the current billing period.',
  },
]

function CheckIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function CrossIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function CellValue({ v }: { v: string }) {
  if (v === 'check') return <span style={{ color: '#16a34a', display: 'flex', justifyContent: 'center' }}><CheckIcon size={15} /></span>
  if (v === 'cross') return <span style={{ color: 'var(--border)', display: 'flex', justifyContent: 'center' }}><CrossIcon size={14} /></span>
  return <span>{v}</span>
}

export default function PricingClient() {
  const [billing, setBilling] = useState<Billing>('annual')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.fade-up').forEach((el) => observerRef.current?.observe(el))
    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <>
      <Nav />
      <main style={{ paddingTop: 60 }}>

        {/* Hero */}
        <section style={{
          padding: '100px 24px 72px',
          background: 'var(--bg)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div className="hero-grid" style={{ opacity: 0.35 }} />
          <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div className="fade-up" style={{
              display: 'inline-block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 20,
            }}>
              Pricing
            </div>
            <h1 className="fade-up fade-up-delay-1" style={{
              fontSize: 'clamp(36px, 6vw, 58px)',
              fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.08,
              marginBottom: 18,
            }}>
              Simple pricing for<br />serious content teams
            </h1>
            <p className="fade-up fade-up-delay-2" style={{
              fontSize: 18, color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 40,
            }}>
              AI-powered content intelligence that creates, optimizes, and scales your SEO content. No hidden fees.
            </p>

            {/* Billing toggle */}
            <div className="fade-up fade-up-delay-3" style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                display: 'inline-flex',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: 4,
                gap: 2,
              }}>
                <button
                  onClick={() => setBilling('monthly')}
                  style={{
                    padding: '8px 22px',
                    borderRadius: 7,
                    fontSize: 14,
                    fontWeight: billing === 'monthly' ? 600 : 500,
                    background: billing === 'monthly' ? 'var(--bg-elevated)' : 'transparent',
                    color: billing === 'monthly' ? 'var(--text)' : 'var(--text-muted)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    boxShadow: billing === 'monthly' ? 'var(--shadow-sm)' : 'none',
                  }}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBilling('annual')}
                  style={{
                    padding: '8px 22px',
                    borderRadius: 7,
                    fontSize: 14,
                    fontWeight: billing === 'annual' ? 600 : 500,
                    background: billing === 'annual' ? 'var(--bg-elevated)' : 'transparent',
                    color: billing === 'annual' ? 'var(--text)' : 'var(--text-muted)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    boxShadow: billing === 'annual' ? 'var(--shadow-sm)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  Annual
                  <span style={{
                    fontSize: 11, fontWeight: 700, color: '#16a34a',
                    background: '#f0fdf4', border: '1px solid #bbf7d0',
                    padding: '2px 7px', borderRadius: 100,
                  }}>
                    2 months free
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section style={{ padding: '0 24px 80px', background: 'var(--bg)' }}>
          <div style={{ maxWidth: 1060, margin: '0 auto' }}>
            <div className="pricing-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 16,
              alignItems: 'start',
            }}>
              {plans.map((plan, i) => (
                <div
                  key={plan.id}
                  className="fade-up"
                  style={{
                    animationDelay: `${i * 0.08}s`,
                    transitionDelay: `${i * 0.08}s`,
                    background: 'var(--surface)',
                    border: plan.featured ? '2px solid var(--accent)' : '1px solid var(--border)',
                    borderRadius: 12,
                    padding: '28px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 20,
                    position: 'relative',
                    marginTop: plan.featured ? -8 : 0,
                    boxShadow: plan.featured ? 'var(--shadow-lg)' : 'none',
                  }}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div style={{
                      position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                      background: 'var(--accent)', color: 'var(--accent-fg)',
                      fontSize: 11, fontWeight: 700, padding: '3px 14px',
                      borderRadius: 100, whiteSpace: 'nowrap', letterSpacing: '0.05em',
                    }}>
                      {plan.badge}
                    </div>
                  )}

                  {/* Header */}
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, letterSpacing: '-0.01em' }}>
                      {plan.name}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 16 }}>
                      {plan.desc}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 2 }}>
                      <span style={{
                        fontSize: 42, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1,
                      }}>
                        ${billing === 'annual' ? plan.annual : plan.monthly}
                      </span>
                      <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>/month</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', minHeight: 18 }}>
                      {billing === 'annual'
                        ? <span style={{ color: '#16a34a' }}>${plan.annualTotal}/year — save ${plan.annualSave}</span>
                        : '\u00A0'}
                    </div>
                  </div>

                  {/* CTA */}
                  <a
                    href={plan.href}
                    className={`btn btn-lg ${plan.featured ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ justifyContent: 'center', width: '100%' }}
                  >
                    {plan.cta}
                  </a>

                  {/* Features */}
                  <div>
                    <div style={{
                      fontSize: 11, fontWeight: 700, color: 'var(--text-muted)',
                      textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12,
                    }}>
                      {plan.featuresLabel}
                    </div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9 }}>
                      {plan.features.map((f) => (
                        <li key={f} style={{
                          display: 'flex', alignItems: 'flex-start', gap: 9,
                          fontSize: 13.5, color: 'var(--text)', lineHeight: 1.45,
                        }}>
                          <span style={{ color: '#16a34a', flexShrink: 0, marginTop: 1 }}>
                            <CheckIcon />
                          </span>
                          {f}
                        </li>
                      ))}
                      {plan.limits.map((f) => (
                        <li key={f} style={{
                          display: 'flex', alignItems: 'flex-start', gap: 9,
                          fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.45,
                        }}>
                          <span style={{ color: 'var(--border)', flexShrink: 0, marginTop: 2 }}>—</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Enterprise row */}
            <div className="fade-up" style={{
              marginTop: 20,
              padding: '18px 24px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              flexWrap: 'wrap',
            }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>Need more scale?</p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  Enterprise plans with custom volumes, dedicated infrastructure, and SLAs are available.
                </p>
              </div>
              <a href="/contact" className="btn btn-ghost btn-sm" style={{ flexShrink: 0 }}>
                Talk to us →
              </a>
            </div>
          </div>
        </section>

        {/* Autopilot spotlight */}
        <section style={{ padding: '80px 24px', background: 'var(--cta-bg)' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <div className="fade-up" style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center',
            }}>
              <div>
                <div style={{
                  fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
                  letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', marginBottom: 16,
                }}>
                  Autopilot plan
                </div>
                <h2 style={{
                  fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700,
                  letterSpacing: '-0.04em', lineHeight: 1.1,
                  color: 'var(--cta-text)', marginBottom: 20,
                }}>
                  Your content machine, fully on autopilot
                </h2>
                <p style={{
                  fontSize: 16, color: 'var(--cta-text-secondary)', lineHeight: 1.7, marginBottom: 32,
                }}>
                  Autopilot picks the highest-priority keywords from your queue, generates SEO-optimized articles in your brand voice, and publishes them directly to WordPress — on your schedule, without any manual work.
                </p>
                <a
                  href="https://app.articlos.com/register?plan=autopilot"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '12px 24px', borderRadius: 6,
                    background: 'var(--cta-text)', color: 'var(--cta-bg)',
                    fontSize: 14, fontWeight: 600, textDecoration: 'none',
                    transition: 'opacity 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9' }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
                >
                  Get started →
                </a>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { icon: '⚡', title: 'Automated generation', desc: 'Articles generated and published on your schedule — daily, weekly, or custom.' },
                  { icon: '◎', title: 'AI insights in Analytics', desc: 'Understand what content is working and get AI-powered recommendations for what to write next.' },
                  { icon: '◈', title: 'Content Map', desc: 'Build a complete topical authority map. articlos plans your entire content structure around your niche.' },
                  { icon: '↗', title: '300 articles per month', desc: 'More than enough to dominate any niche or manage multiple content properties at once.' },
                ].map((item) => (
                  <div key={item.title} style={{
                    padding: '16px 20px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 10,
                    display: 'flex', gap: 16, alignItems: 'flex-start',
                  }}>
                    <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--cta-text)', marginBottom: 4 }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--cta-text-secondary)', lineHeight: 1.55 }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Comparison table */}
        <section style={{ padding: '96px 24px 80px', background: 'var(--bg)' }}>
          <div style={{ maxWidth: 1060, margin: '0 auto' }}>
            <div className="fade-up" style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 style={{
                fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 700,
                letterSpacing: '-0.03em', marginBottom: 10,
              }}>
                Compare plans in detail
              </h2>
              <p style={{ fontSize: 15, color: 'var(--text-muted)' }}>
                Every feature, every limit — side by side.
              </p>
            </div>

            <div className="fade-up" style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 12, overflow: 'hidden',
              overflowX: 'auto',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 520 }}>
                <thead>
                  <tr style={{ background: 'var(--bg-elevated)' }}>
                    <th style={{
                      padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600,
                      color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em',
                      borderBottom: '1px solid var(--border)', width: '40%',
                    }}>
                      Feature
                    </th>
                    {plans.map((p) => (
                      <th key={p.id} style={{
                        padding: '14px 16px', textAlign: 'center', fontSize: 13, fontWeight: 700,
                        color: p.featured ? 'var(--text)' : 'var(--text-muted)',
                        borderBottom: '1px solid var(--border)',
                        borderLeft: '1px solid var(--border)',
                        background: p.featured ? 'var(--bg)' : 'var(--bg-elevated)',
                      }}>
                        {p.name}
                        {p.featured && (
                          <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--text-muted)', marginTop: 2, letterSpacing: '0.04em' }}>
                            RECOMMENDED
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, ri) => {
                    if ('section' in row) {
                      return (
                        <tr key={`section-${ri}`} style={{ background: 'var(--bg-elevated)' }}>
                          <td colSpan={4} style={{
                            padding: '12px 20px 8px',
                            fontSize: 11, fontWeight: 700, color: 'var(--text-muted)',
                            textTransform: 'uppercase', letterSpacing: '0.08em',
                            borderBottom: '1px solid var(--border)',
                            borderTop: ri > 0 ? '1px solid var(--border)' : 'none',
                          }}>
                            {row.section}
                          </td>
                        </tr>
                      )
                    }
                    return (
                      <tr key={row.label} style={{
                        background: ri % 2 === 0 ? 'var(--surface)' : 'transparent',
                      }}>
                        <td style={{
                          padding: '11px 20px', fontSize: 13.5, color: 'var(--text)',
                          borderBottom: '1px solid var(--bg-elevated)',
                        }}>
                          {row.label}
                        </td>
                        {row.values!.map((v, vi) => (
                          <td key={vi} style={{
                            padding: '11px 16px', textAlign: 'center', fontSize: 13.5,
                            color: 'var(--text)', fontWeight: 500,
                            borderBottom: '1px solid var(--bg-elevated)',
                            borderLeft: '1px solid var(--bg-elevated)',
                            background: vi === 2 ? 'rgba(0,0,0,0.01)' : undefined,
                          }}>
                            <CellValue v={v} />
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: '0 24px 96px', background: 'var(--bg)' }}>
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <div className="fade-up" style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 style={{
                fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 700,
                letterSpacing: '-0.03em', marginBottom: 10,
              }}>
                Frequently asked questions
              </h2>
            </div>
            <div className="fade-up" style={{ borderTop: '1px solid var(--border)' }}>
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      width: '100%', textAlign: 'left', padding: '18px 0',
                      background: 'none', border: 'none', cursor: 'pointer',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      gap: 16,
                    }}
                  >
                    <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.01em' }}>
                      {faq.q}
                    </span>
                    <span style={{
                      fontSize: 20, color: 'var(--text-muted)', flexShrink: 0, lineHeight: 1,
                      transition: 'transform 0.2s',
                      transform: openFaq === i ? 'rotate(45deg)' : 'none',
                    }}>
                      +
                    </span>
                  </button>
                  {openFaq === i && (
                    <p style={{
                      fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7,
                      paddingBottom: 18, maxWidth: 560,
                    }}>
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section style={{ padding: '96px 24px', background: 'var(--cta-bg)', textAlign: 'center' }}>
          <div style={{ maxWidth: 520, margin: '0 auto' }} className="fade-up">
            <h2 style={{
              fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 700,
              letterSpacing: '-0.04em', lineHeight: 1.08,
              color: 'var(--cta-text)', marginBottom: 16,
            }}>
              Ready to put your content on autopilot?
            </h2>
            <p style={{ fontSize: 16, color: 'var(--cta-text-secondary)', marginBottom: 32, lineHeight: 1.6 }}>
              Start your free trial today. No credit card required.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="https://app.articlos.com/register?plan=autopilot"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '13px 26px', borderRadius: 6,
                  background: 'var(--cta-text)', color: 'var(--cta-bg)',
                  fontSize: 15, fontWeight: 600, textDecoration: 'none',
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9' }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
              >
                Get started with Autopilot →
              </a>
              <a href="/contact" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '13px 24px', borderRadius: 6,
                border: '1px solid var(--cta-border)',
                color: 'var(--cta-text-secondary)', fontSize: 15, fontWeight: 500,
                textDecoration: 'none', transition: 'border-color 0.15s',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--cta-border)' }}
              >
                Contact sales
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style>{`
        @media (max-width: 860px) {
          .pricing-grid { grid-template-columns: 1fr !important; max-width: 420px; margin: 0 auto; }
          .pricing-grid > div { margin-top: 0 !important; }
          .autopilot-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
        @media (max-width: 600px) {
          table { font-size: 12px !important; }
          table td, table th { padding: 9px 12px !important; }
        }
      `}</style>
    </>
  )
}
