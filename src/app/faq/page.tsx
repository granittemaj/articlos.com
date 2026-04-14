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
    label: 'Product & How It Works',
    questions: [
      {
        q: 'What is articlos?',
        a: 'articlos is a content intelligence system that automates the full content lifecycle: discovering keyword opportunities, planning what to write, generating SEO and AEO-optimized articles, publishing them to WordPress, measuring performance, and continuously improving content over time. It\'s not a writing assistant — it\'s a closed-loop system built to compound your organic traffic month over month.',
      },
      {
        q: 'How is articlos different from other AI writing tools?',
        a: 'Most AI writing tools give you a blank text box and let you prompt your way to mediocre output. articlos is built around a complete intelligence loop — keyword discovery, content planning, generation, publishing, performance measurement, and automated improvement — all in one system. The difference is between a tool that helps you write occasionally and a system that runs your content operation continuously.',
      },
      {
        q: 'What AI models does articlos use?',
        a: 'articlos uses GPT-4o (OpenAI) and Gemini 2.5 (Google) for content generation. Gemini 2.5 is the default — it\'s fast and handles most article types excellently. GPT-4o is available for technical or highly nuanced topics where deeper reasoning matters. You choose the model per article, or let articlos select automatically based on content type.',
      },
      {
        q: 'Does articlos support languages other than English?',
        a: 'Yes. articlos generates content in over 30 languages. SEO optimization, keyword research, and publishing workflows are available globally. Full SERP analysis is available for major markets; coverage in smaller regional markets may be more limited.',
      },
      {
        q: 'Can I review articles before they go live?',
        a: 'Yes, and you choose how much control you want. You can require manual review and approval for every article before publishing, or enable fully autonomous mode where articlos generates and publishes on a set schedule without any manual step. Both modes are configurable per website.',
      },
      {
        q: 'How does the content improvement loop work?',
        a: 'articlos monitors your published articles\' ranking positions via Google Search Console. When an article begins losing rankings or traffic, articlos identifies the cause — outdated information, new competitor content, declining relevance — and automatically rewrites or updates the piece. Your content library gets stronger over time, not weaker.',
      },
    ],
  },
  {
    label: 'Content Quality & AI',
    questions: [
      {
        q: 'How good is the AI-generated content?',
        a: 'articlos-generated articles consistently score 90+ on SEO analysis, are structured correctly for Google and AI overviews, and include proper headings, FAQ sections, internal links, and optimized meta descriptions. Quality improves significantly when you provide a Brand Voice profile and a detailed topic brief. For YMYL (Your Money Your Life) content, we recommend human review before publishing.',
      },
      {
        q: 'Will Google penalize AI-generated content?',
        a: 'No. Google\'s position is that they care about content quality and helpfulness — not how content was produced. High-quality AI-generated content ranks just as well as human-written content. articlos is specifically designed to meet Google\'s quality guidelines, including E-E-A-T signals, structured data, and topical authority patterns.',
      },
      {
        q: 'Can articlos match my brand voice?',
        a: 'Yes. You provide sample content (paste URLs or raw text from your existing articles) and articlos learns your tone, vocabulary, sentence structure, and formatting preferences. This voice profile is applied to every article generated for your site. Each connected website can have its own distinct voice profile.',
      },
      {
        q: 'What is AEO and why does it matter?',
        a: 'AEO stands for Answer Engine Optimization — structuring content to be cited by AI-powered search systems like Google AI Overviews, Perplexity, and ChatGPT. As AI search becomes the dominant discovery channel, appearing in AI answers matters as much as ranking in traditional results. articlos optimizes every article for both traditional SEO and AEO simultaneously.',
      },
      {
        q: 'Does articlos produce factually accurate content?',
        a: 'articlos generates well-structured, well-researched content based on its training data, but AI can occasionally produce outdated or imprecise information — especially in fast-moving fields. We strongly recommend reviewing articles on topics where factual precision is critical (medical, legal, financial, technical) before publishing. The built-in editor makes it easy to check and correct any claims.',
      },
      {
        q: 'How does articlos handle E-E-A-T requirements?',
        a: 'E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) is addressed across several layers: articles include structured expert perspectives, use appropriate evidence-based language, are optimized for topical authority signals, and are written in a tone consistent with your site\'s established voice. For maximum E-E-A-T, we recommend adding author bios and first-person experience sections via the editor.',
      },
    ],
  },
  {
    label: 'SEO & Rankings',
    questions: [
      {
        q: 'How long until I see ranking improvements?',
        a: 'SEO results depend on your domain authority, competition level, and publishing consistency. Most articlos customers see meaningful ranking improvements within 8–12 weeks. Articles targeting low-competition keywords can rank within 2–4 weeks. The more consistently you publish — and the more you let the improvement loop run — the faster results compound.',
      },
      {
        q: 'Does articlos do keyword research?',
        a: 'Yes. The Opportunities feature scans your niche for keywords your site could realistically rank for, ranked by traffic potential and difficulty. The Keyword Tracker monitors specific keywords over time. The Competitors module surfaces keyword gaps — topics your rivals rank for that you don\'t yet cover. Together, these replace the need for a separate keyword research tool.',
      },
      {
        q: 'How does articlos optimize for Google AI Overviews and featured snippets?',
        a: 'articlos structures articles to maximize capture of AI-powered placements: clear question-and-answer pairs, concise definitions, properly nested heading hierarchies, FAQ sections with schema-ready markup, and factual summaries at the top of sections. These are the patterns both traditional featured snippets and AI Overviews preferentially pull from.',
      },
      {
        q: 'What SEO elements does articlos include in every article?',
        a: 'Every generated article includes an optimized title tag, meta description, H1/H2/H3 heading structure, keyword-rich body copy with natural density, an FAQ section, internal link suggestions, image alt text, and a schema-ready structure. SEO scores are shown in real time during generation so you can fix gaps before publishing.',
      },
      {
        q: 'Can articlos help me target keywords my competitors rank for?',
        a: 'Yes. The Competitors feature shows you the exact keywords driving the most traffic to your competitors\' sites and which ones your site doesn\'t currently rank for. These gaps represent direct opportunities — topics with proven demand you can move into. articlos lets you add any gap keyword to your Queue with one click.',
      },
    ],
  },
  {
    label: 'WordPress & Publishing',
    questions: [
      {
        q: 'What platforms does articlos publish to?',
        a: 'articlos publishes directly to WordPress (self-hosted and WordPress.com). WordPress covers the vast majority of content sites. We\'re actively building integrations for Webflow, Ghost, Shopify Blog, and custom CMS endpoints via API. If you need a specific integration, contact us.',
      },
      {
        q: 'How does WordPress publishing work?',
        a: 'You connect your WordPress site using Application Password credentials — a standard, secure WordPress feature that takes about 3 minutes to set up. Once connected, articlos can create posts, assign categories and tags, upload featured images, set SEO metadata, and publish or schedule content automatically.',
      },
      {
        q: 'Does articlos generate featured images?',
        a: 'Yes. articlos generates contextually relevant featured images using AI and attaches them to WordPress posts automatically. You can also configure it to use your own image library, upload images manually, or skip featured images entirely — whatever fits your workflow.',
      },
      {
        q: 'Can I connect multiple websites?',
        a: 'Yes. Pro supports up to 5 websites, Agency supports up to 20. Each site has its own keyword strategy, brand voice, publishing schedule, and content queue. Agencies can manage all client sites from a single articlos account.',
      },
      {
        q: 'Can I schedule articles to publish at a specific date and time?',
        a: 'Yes. When publishing from articlos, choose to schedule the post rather than publish immediately. The article is created as a WordPress scheduled post and goes live automatically at the time you set — no manual follow-up required.',
      },
    ],
  },
  {
    label: 'Analytics & Measurement',
    questions: [
      {
        q: 'How does articlos track content performance?',
        a: 'articlos connects to Google Search Console and Google Analytics 4 to pull impressions, clicks, rankings, and traffic data for every article it generates. You see performance data directly in articlos alongside the articles themselves — no switching between tools to understand what\'s working.',
      },
      {
        q: 'What does "continuous improvement" mean in practice?',
        a: 'articlos monitors ranking positions over time. When an article drops in rankings or loses traffic, articlos diagnoses why — outdated information, new competitor content covering the topic more thoroughly, or a shift in search intent — and automatically regenerates or updates the article. Your published content gets better over time without manual audits.',
      },
      {
        q: 'Do I need Google Analytics connected for articlos to work?',
        a: 'No. Google Search Console is the core integration for performance data. Google Analytics 4 adds conversion and engagement data on top if you want it. articlos works fully without GA4 — GSC data alone is sufficient for keyword tracking, ranking monitoring, and the improvement loop.',
      },
      {
        q: 'What is the Impact dashboard?',
        a: 'Impact is a high-level view of how your articlos-generated content is performing: total impressions, clicks, average position, and CTR across all published articles. It\'s designed to give you a clear, honest picture of the ROI your content programme is generating — useful for reporting to stakeholders or tracking your own progress.',
      },
    ],
  },
  {
    label: 'Plans & Pricing',
    questions: [
      {
        q: 'Is there a free trial?',
        a: 'Yes — all plans start with a 7-day free trial. No credit card required. You get full access to every feature on your chosen plan during the trial so you can see exactly what articlos can do before committing.',
      },
      {
        q: 'Can I change plans at any time?',
        a: 'Absolutely. Upgrade any time and the change takes effect immediately. Downgrade any time and it takes effect at the end of your current billing cycle — you keep your current limits until then.',
      },
      {
        q: 'What happens if I exceed my monthly article limit?',
        a: 'We will never cut off your access mid-month. If you reach your limit, you can purchase a top-up pack to generate additional articles, or upgrade to a higher plan. Top-up packs are available from your billing settings.',
      },
      {
        q: 'Do you offer annual billing?',
        a: 'Yes. Annual plans are available at a 20% discount compared to monthly billing — equivalent to more than 2 months free. You can switch to annual billing from your account settings at any time.',
      },
      {
        q: 'Can I cancel at any time?',
        a: 'Yes, there are no long-term contracts or lock-in periods. Cancel anytime from your account settings or by contacting support. Your access continues until the end of your current billing period.',
      },
      {
        q: 'Do you offer refunds?',
        a: 'Yes — if you\'re not satisfied within your first 7 days, contact us for a full refund, no questions asked. After 7 days, charges for the current period are non-refundable, but you can cancel at any time to stop future charges.',
      },
      {
        q: 'Is there an enterprise plan?',
        a: 'Yes. For teams needing custom article volumes, more than 20 sites, dedicated account management, custom SLAs, or invoiced billing, we offer enterprise arrangements. Email enterprise@articlos.com to discuss your requirements.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit and debit cards — Visa, Mastercard, and American Express. Invoiced billing and bank transfer options are available for Agency and Enterprise customers.',
      },
    ],
  },
  {
    label: 'Data & Security',
    questions: [
      {
        q: 'Who owns the content articlos generates?',
        a: 'You do. All articles generated through articlos are entirely yours. We claim no rights over content created using your account. You are free to publish, edit, sell, or repurpose the content however you choose.',
      },
      {
        q: 'Is my content and account data secure?',
        a: 'Yes. All data is transmitted over encrypted connections (TLS). We do not sell or share your content or account data with third parties. Your WordPress credentials are stored encrypted and are never exposed in our interface.',
      },
      {
        q: 'What happens to my data if I cancel?',
        a: 'Your articles, settings, and data remain accessible for 30 days after cancellation. After 30 days the account is deactivated and data is scheduled for deletion. If you resubscribe within 30 days, everything is restored exactly as you left it.',
      },
    ],
  },
  {
    label: 'Getting Started',
    questions: [
      {
        q: 'How quickly can I get started?',
        a: 'Most users publish their first article within 15 minutes of signing up. Connect your WordPress site (5 minutes), set up Brand Voice (5 minutes), and generate your first article (under a minute). From there, Autopilot can maintain a publishing cadence without further manual work.',
      },
      {
        q: 'Do I need technical knowledge to use articlos?',
        a: 'No. articlos is designed for content teams, not developers. Connecting WordPress takes 5 minutes with step-by-step instructions. There is no code to write, no API to configure, and no infrastructure to manage. If you can write a brief, you can use articlos.',
      },
      {
        q: 'What do I need before generating my first article?',
        a: 'At minimum, a topic or keyword to target. To get full value from day one, we recommend connecting your WordPress site and adding at least a basic Brand Voice profile — both take under 10 minutes combined and significantly improve output quality from the start.',
      },
      {
        q: 'Is there onboarding support?',
        a: 'Yes. All accounts get access to our Help documentation and in-app FAQ. Pro and Autopilot accounts get priority email support. Agency accounts include a dedicated onboarding session with the articlos team to configure your setup for maximum performance.',
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
