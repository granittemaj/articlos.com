import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ScrollAnimations from '../ScrollAnimations'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About — We Built the System That Never Stops',
  description: 'articlos is on a mission to make great content effortless. Meet the team turning content strategy into a system that discovers, writes, and ranks — automatically.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  const values = [
    {
      icon: '◈',
      title: 'Automation first',
      desc: 'We believe the best content teams aren\'t the ones who work harder — they\'re the ones whose systems work hardest. Everything we build starts with: can this be automated without sacrificing quality?',
    },
    {
      icon: '✦',
      title: 'Intelligence over volume',
      desc: 'Publishing 100 mediocre articles is worse than publishing 10 great ones. articlos is built around content intelligence — understanding what to write, why it matters, and how to make it better over time.',
    },
    {
      icon: '↗',
      title: 'Measurable outcomes',
      desc: 'SEO is measurable. We obsess over rankings, traffic, and conversions — not vanity metrics. Every feature we ship is designed to move the numbers that matter.',
    },
    {
      icon: '▦',
      title: 'Built for scale',
      desc: 'Whether you\'re a solo blogger or an agency managing 200 websites, articlos adapts. The same intelligence system that works for one site works for thousands.',
    },
  ]

  return (
    <>
      <Nav />
      <ScrollAnimations />

      {/* Hero */}
      <section style={{
        padding: '140px 24px 96px',
        background: '#f9f9f8',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 1px 1px, #d4d4d0 1px, transparent 0)',
          backgroundSize: '28px 28px',
          opacity: 0.4,
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 760, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="fade-up" style={{
            display: 'inline-block', fontSize: 11, fontWeight: 600, color: '#9b9b96',
            textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 20,
          }}>
            About
          </div>
          <h1 className="fade-up fade-up-delay-1" style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.06,
            color: '#0f0f0e', marginBottom: 24,
          }}>
            We automate content intelligence.
          </h1>
          <p className="fade-up fade-up-delay-2" style={{
            fontSize: 19, color: '#6b6b67', lineHeight: 1.65, maxWidth: 580,
          }}>
            articlos is a content intelligence system built for content teams that refuse to publish mediocre content at mediocre speed. We discover, plan, generate, measure, and improve — so you don&apos;t have to.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding: '96px 24px', background: '#ffffff' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div className="fade-up" style={{
            padding: 40,
            background: '#0f0f0e',
            borderRadius: 16,
          }}>
            <div style={{
              fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16,
            }}>
              Our Mission
            </div>
            <p style={{
              fontSize: 'clamp(20px, 3vw, 28px)',
              fontWeight: 600, letterSpacing: '-0.03em',
              color: '#ffffff', lineHeight: 1.4,
            }}>
              &ldquo;Make it possible for any content team to build compounding organic traffic — without the bottleneck of manual content operations.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section style={{ padding: '0 24px 96px', background: '#ffffff' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div className="fade-up" style={{ marginBottom: 40 }}>
            <h2 style={{
              fontSize: 'clamp(24px, 4vw, 36px)',
              fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 24,
            }}>
              The story
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {[
                'articlos started with a simple observation: the companies dominating search weren\'t the ones with the best writers — they were the ones with the best systems. While others were manually researching keywords, briefing writers, editing drafts, and hoping for rankings, the winners had turned content into a repeatable, scalable process.',
                'We built articlos to give every content team access to that kind of system. Not a writing assistant, not a keyword tool, not another AI chatbot — but a complete content intelligence loop that discovers opportunities, plans around them, generates articles that actually rank, measures what works, and continuously improves.',
                'Today, articlos powers thousands of websites across every niche imaginable. From solo bloggers to agency teams managing hundreds of clients, the system adapts. The intelligence scales. The content compounds.',
              ].map((p, i) => (
                <p key={i} style={{ fontSize: 16, color: '#3d3d3a', lineHeight: 1.75 }}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: '96px 24px', background: '#f9f9f8' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 12,
            }}>
              What we believe
            </h2>
            <p style={{ fontSize: 16, color: '#6b6b67', maxWidth: 400, margin: '0 auto', lineHeight: 1.65 }}>
              The principles behind every product decision we make.
            </p>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16,
          }} className="values-grid">
            {values.map((v, i) => (
              <div
                key={v.title}
                className={`card fade-up fade-up-delay-${i + 1}`}
                style={{ padding: 28 }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: '#0f0f0e', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, marginBottom: 16,
                }}>
                  {v.icon}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 10 }}>
                  {v.title}
                </h3>
                <p style={{ fontSize: 14, color: '#6b6b67', lineHeight: 1.65 }}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '96px 24px', background: '#0f0f0e', textAlign: 'center' }}>
        <div style={{ maxWidth: 520, margin: '0 auto' }} className="fade-up">
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 700, letterSpacing: '-0.04em',
            color: '#ffffff', marginBottom: 16, lineHeight: 1.1,
          }}>
            Ready to build your content machine?
          </h2>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://app.articlos.com/login" className="cta-white-btn">
              Log in →
            </a>
            <a href="/contact" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '13px 24px', borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.14)',
              color: 'rgba(255,255,255,0.65)', fontSize: 15, fontWeight: 500,
              textDecoration: 'none',
            }}>
              Contact the articlos team
            </a>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .values-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
