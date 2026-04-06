import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'FAQ — Frequently Asked Questions',
  description:
    'Got questions about Articlos? Find answers about pricing, AI models, WordPress integration, article quality, and more.',
  openGraph: {
    title: 'FAQ | Articlos',
    description: 'Frequently asked questions about Articlos AI article generation.',
    url: 'https://articlos.com/faq',
  },
}

const faqs = [
  {
    category: 'Getting started',
    items: [
      {
        q: 'Is there a free trial?',
        a: "Yes — all plans start with a 7-day free trial. No credit card required. You'll get full access to all features on your chosen plan.",
      },
      {
        q: 'How do I connect my WordPress site?',
        a: 'After signing up, go to Settings → Websites and click "Add website". Enter your WordPress URL and follow the one-click plugin install. Your site will be connected in under two minutes.',
      },
      {
        q: 'Do I need any technical knowledge to use Articlos?',
        a: "No. Articlos is designed for content teams and marketers, not developers. If you can use WordPress, you can use Articlos. The AI handles the writing; you just review and publish.",
      },
    ],
  },
  {
    category: 'Plans & billing',
    items: [
      {
        q: 'Can I change plans at any time?',
        a: 'Absolutely. Upgrade or downgrade any time from your account settings. Changes take effect on your next billing cycle.',
      },
      {
        q: 'What happens if I exceed my monthly article limit?',
        a: 'You can purchase top-up packs or upgrade to a higher plan at any time. We will never cut off mid-month.',
      },
      {
        q: 'Do you offer annual billing?',
        a: 'Yes — annual plans are available at a 20% discount compared to monthly billing. You can switch to annual from your billing settings.',
      },
    ],
  },
  {
    category: 'Content & AI',
    items: [
      {
        q: 'What AI models do you use?',
        a: 'Articlos uses GPT-4o and Gemini 1.5 Pro to generate content. You can select your preferred model from the article settings.',
      },
      {
        q: 'How does article quality compare to human writers?',
        a: 'Our articles are structured for SEO with proper headings, keyword density, and readability scores. Most customers use them directly; power users review before publishing.',
      },
      {
        q: 'Can I customise the tone and style of generated articles?',
        a: 'Yes. You can set a brand voice, provide writing style instructions, and supply example articles for the AI to match. These settings apply globally or per website.',
      },
    ],
  },
  {
    category: 'Integrations',
    items: [
      {
        q: 'Do you support non-WordPress sites?',
        a: 'WordPress is natively supported. API access (Agency plan) lets you integrate with any CMS. Direct support for Webflow, Ghost, and Shopify is coming soon.',
      },
      {
        q: 'Can I use Articlos with multiple client websites?',
        a: 'Yes. The Pro plan supports up to 5 websites, and the Agency plan supports up to 20. Each website has its own settings, keywords, and publishing schedule.',
      },
    ],
  },
]

export default function FaqPage() {
  return (
    <>
      <Nav />
      <main style={{ paddingTop: 60 }}>
        {/* Hero */}
        <section
          style={{
            padding: '80px 0 64px',
            textAlign: 'center',
            borderBottom: '1px solid #e8e8e6',
          }}
        >
          <div className="container">
            <p
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: '#6b6b67',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: 16,
              }}
            >
              Support
            </p>
            <h1
              style={{
                fontSize: 'clamp(32px, 5vw, 48px)',
                fontWeight: 600,
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                marginBottom: 16,
              }}
            >
              Frequently asked questions
            </h1>
            <p
              style={{
                fontSize: 17,
                color: '#6b6b67',
                lineHeight: 1.6,
                maxWidth: 480,
                margin: '0 auto 32px',
              }}
            >
              Can't find what you're looking for?{' '}
              <a
                href="mailto:support@articlos.com"
                style={{ color: '#0f0f0e', textDecoration: 'underline', textUnderlineOffset: 3 }}
              >
                Email our team
              </a>
              .
            </p>
          </div>
        </section>

        {/* FAQ sections */}
        <section style={{ padding: '64px 0 96px' }}>
          <div
            className="container"
            style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px' }}
          >
            {faqs.map((section, si) => (
              <div
                key={si}
                style={{ marginBottom: si < faqs.length - 1 ? 56 : 0 }}
              >
                <h2
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: '#6b6b67',
                    marginBottom: 24,
                  }}
                >
                  {section.category}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {section.items.map((faq, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '20px 0',
                        borderBottom:
                          i < section.items.length - 1 ? '1px solid #e8e8e6' : 'none',
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
                      <p style={{ fontSize: 14, color: '#6b6b67', lineHeight: 1.6 }}>
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* CTA */}
            <div
              style={{
                marginTop: 64,
                padding: 32,
                background: '#f5f5f3',
                borderRadius: 12,
                textAlign: 'center',
              }}
            >
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  marginBottom: 8,
                }}
              >
                Still have questions?
              </h3>
              <p style={{ fontSize: 14, color: '#6b6b67', marginBottom: 20 }}>
                Our team is happy to help — usually within a few hours.
              </p>
              <a
                href="mailto:support@articlos.com"
                className="btn btn-primary btn-sm"
              >
                Contact support
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
