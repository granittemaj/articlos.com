import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ScrollAnimations from '../ScrollAnimations'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ — Everything You Need to Know',
  description: 'Got questions about how articlos works, what it integrates with, or how it generates content? We have the answers right here.',
  alternates: { canonical: '/faq' },
}

const categories = [
  {
    label: 'Product',
    questions: [
      {
        q: 'What is articlos?',
        a: 'articlos is a content intelligence system that automates the full content lifecycle: discovering keyword opportunities, planning what to write, generating SEO + AEO optimized articles, publishing them to WordPress, measuring performance, and continuously improving content over time. It\'s not just an AI writer — it\'s a closed-loop system designed to compound your organic traffic.',
      },
      {
        q: 'How is articlos different from other AI writing tools?',
        a: 'Most AI writing tools give you a blank text box and let you prompt your way to mediocre content. articlos is built around a complete intelligence loop — from keyword research to auto-publishing to automated improvement. The difference is between a tool that helps you write and a system that builds your content operation.',
      },
      {
        q: 'What AI models does articlos use?',
        a: 'articlos uses GPT-4o (OpenAI) and Gemini 1.5 Pro (Google) for content generation. You can select your preferred model or let articlos choose based on the content type. For certain tasks like research and factual verification, we blend multiple models for higher accuracy.',
      },
      {
        q: 'Does articlos support languages other than English?',
        a: 'Yes. articlos supports content generation in over 30 languages. SEO optimization, keyword research, and publishing workflows are available for major markets globally. Some advanced features (like SERP analysis) may have limited coverage in smaller markets.',
      },
      {
        q: 'Can I review articles before they go live?',
        a: 'Yes. You can configure articlos to require your review and approval before any article is published. You can also enable fully autonomous publishing where articles are generated and published on your set schedule without manual intervention. Both modes are available per-website.',
      },
    ],
  },
  {
    label: 'Content Quality',
    questions: [
      {
        q: 'How good is the AI-generated content?',
        a: 'articlos-generated articles consistently score 90+ on SEO analysis tools, structure content correctly for Google and AI overviews, include appropriate headings, FAQ sections, internal links, and meta descriptions. The quality depends on your inputs — better topic briefs and brand voice settings produce better results. You should still review content before publishing, especially for YMYL (Your Money Your Life) topics.',
      },
      {
        q: 'Will Google penalize AI-generated content?',
        a: 'Google\'s guidance is clear: they care about the quality and helpfulness of content, not how it was produced. High-quality, accurate, helpful AI-generated content ranks just as well as human-written content. articlos is specifically designed to produce content that meets Google\'s quality standards, including E-E-A-T signals.',
      },
      {
        q: 'Can articlos match my brand voice?',
        a: 'Yes. You can provide a brand voice guide, writing style examples, and specific tone instructions. articlos incorporates these into every article it generates for your site. You can set different voice profiles for different websites or content types.',
      },
      {
        q: 'What is AEO and why does it matter?',
        a: 'AEO stands for Answer Engine Optimization — optimizing content for AI-powered search systems like Google\'s AI Overviews, Perplexity, ChatGPT, and similar tools. As AI search grows, being cited in AI answers becomes as valuable as ranking in traditional results. articlos structures content to maximize visibility in both traditional and AI-powered search.',
      },
    ],
  },
  {
    label: 'Publishing & Integrations',
    questions: [
      {
        q: 'What platforms does articlos publish to?',
        a: 'articlos currently publishes directly to WordPress (self-hosted and WordPress.com). This covers the majority of content websites. We\'re actively building integrations for Webflow, Ghost, Shopify Blog, and custom API endpoints. Contact us if you need a specific integration.',
      },
      {
        q: 'How does WordPress publishing work?',
        a: 'You connect your WordPress site using the articlos plugin or REST API credentials. Once connected, articlos can create posts, set categories and tags, upload featured images, configure SEO metadata, and publish or schedule content — all automatically. The integration takes under 5 minutes to set up.',
      },
      {
        q: 'Does articlos handle featured images?',
        a: 'Yes. articlos generates contextually relevant featured images for articles using AI image generation. You can also configure it to use your own image sources or pull from licensed stock photo services. Images are automatically formatted and sized for your WordPress theme.',
      },
      {
        q: 'Can I connect multiple websites?',
        a: 'Yes. articlos supports multiple websites on most plans. Each website can have its own keyword strategy, brand voice, publishing schedule, and content queue. For agencies managing many client sites, we offer bulk management tools.',
      },
    ],
  },
  {
    label: 'Analytics & Improvement',
    questions: [
      {
        q: 'How does the Measure stage work?',
        a: 'articlos connects to Google Search Console and Google Analytics 4 to track impressions, clicks, rankings, and conversions for every article it generates. You see performance data directly in articlos — no need to switch between tools.',
      },
      {
        q: 'What does "continuous improvement" mean?',
        a: 'articlos monitors your content\'s ranking positions over time. When an article starts to lose rankings or traffic, articlos identifies why — outdated information, missing topics competitors cover, declining backlinks — and automatically rewrites or updates the content. Your articles get better over time, not worse.',
      },
      {
        q: 'How long until I see ranking results?',
        a: 'SEO results depend on many factors including domain authority, competition, and content quality. Most articlos customers see meaningful ranking improvements within 8-12 weeks. Articles targeting low-competition keywords can rank within 2-4 weeks. The content improvement loop becomes more powerful over time.',
      },
    ],
  },
  {
    label: 'Pricing & Account',
    questions: [
      {
        q: 'How does pricing work?',
        a: 'We offer flexible plans tailored to content teams of different sizes. Contact us at hello@articlos.com to discuss pricing for your use case. We offer a free trial with no credit card required so you can evaluate the platform before committing.',
      },
      {
        q: 'Is there a free trial?',
        a: 'Yes. You can start a free trial without a credit card. The trial includes access to all core features so you can evaluate articlos end-to-end before deciding on a plan.',
      },
      {
        q: 'Can I cancel at any time?',
        a: 'Yes. There are no long-term contracts. You can cancel your subscription at any time from your account settings. Cancellation takes effect at the end of your current billing period. We do not offer prorated refunds for unused time.',
      },
      {
        q: 'Do you offer discounts for agencies or annual billing?',
        a: 'Yes, we offer discounts for annual billing and have agency-specific pricing for teams managing multiple client websites. Contact hello@articlos.com to discuss the best plan for your situation.',
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <>
      <Nav />
      <ScrollAnimations />

      {/* Hero */}
      <section style={{
        padding: '140px 24px 80px',
        background: 'var(--bg)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          // handled by hero-grid class
          backgroundSize: '28px 28px',
          opacity: 0.4,
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="fade-up" style={{
            display: 'inline-block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 20,
          }}>
            FAQ
          </div>
          <h1 className="fade-up fade-up-delay-1" style={{
            fontSize: 'clamp(32px, 6vw, 56px)',
            fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.08,
            color: 'var(--text)', marginBottom: 18,
          }}>
            Frequently asked questions
          </h1>
          <p className="fade-up fade-up-delay-2" style={{
            fontSize: 18, color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 32,
          }}>
            Everything you need to know about articlos. Can&apos;t find your answer?{' '}
            <a href="mailto:hello@articlos.com" style={{ color: 'var(--text)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
              Email us
            </a>
            .
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section style={{ padding: '80px 24px 96px', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          {categories.map((cat, ci) => (
            <div key={cat.label} className="fade-up" style={{ marginBottom: 64 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                marginBottom: 28, paddingBottom: 16,
                borderBottom: '1px solid var(--border)',
              }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: 'var(--text-muted)',
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                }}>{String(ci + 1).padStart(2, '0')}</span>
                <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.03em' }}>
                  {cat.label}
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {cat.questions.map((item, qi) => (
                  <details key={qi} style={{
                    borderBottom: '1px solid var(--border)',
                  }}>
                    <summary style={{
                      padding: '16px 0',
                      fontSize: 15.5, fontWeight: 600, color: 'var(--text)',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      gap: 16,
                      listStyle: 'none',
                      userSelect: 'none',
                    }}>
                      <span>{item.q}</span>
                      <span style={{
                        width: 20, height: 20, borderRadius: '50%',
                        background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', flexShrink: 0,
                        fontSize: 14, color: 'var(--text-muted)',
                        transition: 'background 0.15s',
                      }}>+</span>
                    </summary>
                    <p style={{
                      padding: '0 0 18px',
                      fontSize: 15, color: 'var(--text)', lineHeight: 1.75,
                    }}>
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '80px 24px',
        background: 'var(--bg)',
        borderTop: '1px solid var(--border)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }} className="fade-up">
          <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 12 }}>
            Still have questions?
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.65 }}>
            We&apos;re happy to help. Drop us a message and we&apos;ll get back to you within 24 hours.
          </p>
          <a href="mailto:hello@articlos.com" className="btn btn-primary btn-lg" style={{ gap: 8 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            hello@articlos.com
          </a>
        </div>
      </section>

      <Footer />

      <style>{`
        details summary::-webkit-details-marker { display: none; }
        details[open] summary span:last-child { background: var(--accent) !important; color: var(--accent-fg) !important; transform: rotate(45deg); }
        details[open] summary { color: var(--text); }
      `}</style>
    </>
  )
}
