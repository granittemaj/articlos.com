import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Pricing — Simple Plans for Every Team',
  description:
    'From solo bloggers to content agencies — articlos has a plan for you. Start free, no credit card required.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'Pricing | articlos',
    description: 'Simple, transparent pricing for AI article generation. Start free.',
    url: 'https://articlos.com/pricing',
  },
}

const plans = [
  {
    name: 'Starter',
    price: '$29',
    period: '/mo',
    tagline: 'Perfect for solo bloggers and small sites.',
    features: [
      '20 articles / month',
      '1 website',
      'WordPress auto-publishing',
      'Keyword suggestions',
      'Basic SEO scoring',
      'Email support',
    ],
    cta: 'Start free',
    href: 'https://app.articlos.com/register?plan=starter',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$79',
    period: '/mo',
    tagline: 'For growing content teams and agencies.',
    features: [
      '100 articles / month',
      '5 websites',
      'WordPress auto-publishing',
      'Advanced keyword research',
      'SEO Analytics dashboard',
      'Content queue & calendar',
      'Priority support',
      'Bulk article generation',
    ],
    cta: 'Start free',
    href: 'https://app.articlos.com/register?plan=pro',
    featured: true,
  },
  {
    name: 'Agency',
    price: '$199',
    period: '/mo',
    tagline: 'For agencies managing client content at scale.',
    features: [
      'Unlimited articles',
      '20 websites',
      'WordPress auto-publishing',
      'Full SEO suite',
      'White-label reports',
      'Dedicated account manager',
      'API access',
      'Custom integrations',
      'SLA guarantee',
    ],
    cta: 'Start free',
    href: 'https://app.articlos.com/register?plan=agency',
    featured: false,
  },
]

const faqs = [
  {
    q: 'Is there a free trial?',
    a: "Yes — all plans start with a 7-day free trial. No credit card required. You'll get full access to all features on your chosen plan.",
  },
  {
    q: 'Can I change plans at any time?',
    a: 'Absolutely. Upgrade or downgrade any time from your account settings. Changes take effect on your next billing cycle.',
  },
  {
    q: 'What AI models do you use?',
    a: 'articlos uses GPT-4o (OpenAI) and Gemini 2.5 (Google) to generate content. Gemini 2.5 is the default for speed and quality; GPT-4o is available for technical or nuanced topics. You can select your preferred model from the article settings.',
  },
  {
    q: 'Do you support non-WordPress sites?',
    a: 'WordPress is natively supported. API access (Agency plan) lets you integrate with any CMS. Direct support for Webflow, Ghost, and Shopify is coming soon.',
  },
  {
    q: 'How does article quality compare to human writers?',
    a: 'Our articles are structured for SEO with proper headings, keyword density, and readability scores. Most customers use them directly; power users review before publishing.',
  },
  {
    q: 'What happens if I exceed my monthly article limit?',
    a: 'You can purchase top-up packs or upgrade to a higher plan at any time. We will never cut off mid-month.',
  },
]

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export default function PricingPage() {
  return (
    <>
      <Nav />
      <main style={{ paddingTop: 60 }}>
        {/* Hero */}
        <section
          style={{
            padding: '80px 24px 64px',
            textAlign: 'center',
            borderBottom: '1px solid var(--border)',
            background: 'var(--surface)',
          }}
        >
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <h1
              style={{
                fontSize: 'clamp(36px, 6vw, 58px)',
                fontWeight: 700,
                letterSpacing: '-0.04em',
                marginBottom: 14,
              }}
            >
              Simple, transparent pricing
            </h1>
            <p
              style={{
                fontSize: 18,
                color: 'var(--text-muted)',
                lineHeight: 1.6,
                marginBottom: 24,
              }}
            >
              Start free, no credit card required. Scale as your content operation grows.
            </p>
            <div
              style={{
                display: 'inline-flex',
                background: 'var(--bg-elevated)',
                borderRadius: 8,
                padding: 3,
                gap: 2,
                border: '1px solid var(--border)',
              }}
            >
              <button
                style={{
                  padding: '7px 16px',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                }}
              >
                Monthly
              </button>
              <button
                style={{
                  padding: '7px 16px',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'var(--text-muted)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Annual <span style={{ color: '#22c55e', fontWeight: 600 }}>−20%</span>
              </button>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section style={{ padding: '80px 24px', background: 'var(--bg)' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 20,
                alignItems: 'start',
              }}
              className="pricing-grid"
            >
              {plans.map((plan, i) => (
                <div
                  key={plan.name}
                  className={`pricing-card${plan.featured ? ' featured' : ''}`}
                  style={plan.featured ? { marginTop: -16 } : {}}
                >
                  {/* Plan header */}
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: 'var(--text-muted)',
                        marginBottom: 8,
                      }}
                    >
                      {plan.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
                      <span
                        style={{
                          fontSize: 44,
                          fontWeight: 700,
                          letterSpacing: '-0.04em',
                          lineHeight: 1,
                        }}
                      >
                        {plan.price}
                      </span>
                      <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{plan.period}</span>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      {plan.tagline}
                    </p>
                  </div>

                  {/* CTA */}
                  <a
                    href={plan.href}
                    className={`btn ${plan.featured ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ justifyContent: 'center', width: '100%' }}
                  >
                    {plan.cta}
                  </a>

                  {/* Divider */}
                  <div style={{ borderTop: '1px solid var(--border)' }} />

                  {/* Features */}
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 9,
                          fontSize: 14,
                          lineHeight: 1.5,
                        }}
                      >
                        <span style={{ flexShrink: 0, marginTop: 1 }}>
                          <CheckIcon />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Enterprise note */}
            <div
              style={{
                marginTop: 32,
                padding: '20px 24px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                flexWrap: 'wrap',
              }}
            >
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
                  Need something bigger?
                </p>
                <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                  Enterprise plans with custom volumes, SLAs, and dedicated support are available.
                </p>
              </div>
              <a
                href="mailto:enterprise@articlos.com"
                className="btn btn-ghost"
                style={{ flexShrink: 0 }}
              >
                Contact Sales →
              </a>
            </div>
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section style={{ padding: '0 24px 80px', background: 'var(--bg)' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <h2
              style={{
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: '-0.03em',
                textAlign: 'center',
                marginBottom: 40,
              }}
            >
              Compare plans
            </h2>
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                overflow: 'hidden',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-elevated)' }}>
                    <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                      Feature
                    </th>
                    {plans.map((p) => (
                      <th
                        key={p.name}
                        style={{
                          padding: '14px 20px',
                          textAlign: 'center',
                          fontSize: 13,
                          fontWeight: 700,
                          color: p.featured ? 'var(--text)' : 'var(--text-muted)',
                          borderBottom: '1px solid var(--border)',
                          borderLeft: '1px solid var(--border)',
                        }}
                      >
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Articles / month', '20', '100', 'Unlimited'],
                    ['Websites', '1', '5', '20'],
                    ['WordPress publishing', '✓', '✓', '✓'],
                    ['Keyword research', 'Basic', 'Advanced', 'Advanced'],
                    ['SEO Analytics', '—', '✓', '✓'],
                    ['Content calendar', '—', '✓', '✓'],
                    ['White-label reports', '—', '—', '✓'],
                    ['API access', '—', '—', '✓'],
                    ['Dedicated support', '—', '—', '✓'],
                  ].map(([feature, ...vals], ri) => (
                    <tr key={feature} style={{ background: ri % 2 === 1 ? 'var(--bg)' : 'var(--surface)' }}>
                      <td style={{ padding: '12px 20px', fontSize: 14, borderBottom: '1px solid var(--bg-elevated)' }}>
                        {feature}
                      </td>
                      {vals.map((v, vi) => (
                        <td
                          key={vi}
                          style={{
                            padding: '12px 20px',
                            textAlign: 'center',
                            fontSize: 14,
                            color: v === '—' ? '#d4d4d0' : v === '✓' ? '#22c55e' : 'var(--text)',
                            fontWeight: v === '✓' ? 700 : 400,
                            borderBottom: '1px solid var(--bg-elevated)',
                            borderLeft: '1px solid var(--bg-elevated)',
                          }}
                        >
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: '0 24px 96px', background: 'var(--bg)' }}>
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <h2
              style={{
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: '-0.03em',
                textAlign: 'center',
                marginBottom: 40,
              }}
            >
              Frequently asked questions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  style={{
                    padding: '20px 0',
                    borderBottom: i < faqs.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      marginBottom: 8,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {faq.q}
                  </h3>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .pricing-grid { grid-template-columns: 1fr !important; }
          table { font-size: 12px !important; }
          table td, table th { padding: 10px 12px !important; }
        }
      `}</style>
    </>
  )
}
