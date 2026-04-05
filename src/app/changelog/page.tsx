import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'See what\'s new in articlos — latest features, improvements, and fixes.',
  alternates: { canonical: '/changelog' },
}

const FALLBACK = [
  {
    month: 'April 2026',
    entries: [
      {
        title: 'AI Blog Generator',
        description: 'Generate SEO-optimized articles with Google Gemini. Provide a topic or keyword and get a complete, well-structured blog post ready to publish.',
      },
      {
        title: 'Multi-admin support',
        description: 'Invite team members with different roles. Admins get full access, editors can manage posts only.',
      },
      {
        title: 'Keyword suggestions',
        description: 'AI-powered keyword ideas for your niche. Get relevant keyword recommendations to improve your content strategy.',
      },
    ],
  },
  {
    month: 'March 2026',
    entries: [
      {
        title: 'Newsletter integration',
        description: 'Connect with Brevo for email marketing. Collect subscribers and manage your newsletter directly from the admin panel.',
      },
      {
        title: 'Image library',
        description: 'Upload and manage images with Vercel Blob. Browse, search, and organize all your media assets in one place.',
      },
      {
        title: 'Contact form',
        description: 'Receive and manage messages from your website. Review, respond to, and organize incoming inquiries from the admin dashboard.',
      },
    ],
  },
]

export default function ChangelogPage() {
  const changelog = FALLBACK

  return (
    <>
      <Nav />

      <section style={{
        padding: '140px 24px 96px',
        background: 'var(--bg)',
        minHeight: '100vh',
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: 56 }}>
            <h1 style={{
              fontSize: 36,
              fontWeight: 700,
              color: 'var(--text)',
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              marginBottom: 12,
            }}>
              Changelog
            </h1>
            <p style={{
              fontSize: 17,
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              maxWidth: 500,
            }}>
              New features, improvements, and fixes. We ship updates regularly to make articlos better for your content workflow.
            </p>
          </div>

          {/* Timeline */}
          <div style={{ position: 'relative' }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute',
              left: 7,
              top: 8,
              bottom: 8,
              width: 1,
              background: 'var(--border)',
            }} />

            {changelog.map((section, sectionIdx) => (
              <div key={section.month} style={{ marginBottom: sectionIdx < changelog.length - 1 ? 48 : 0 }}>
                {/* Month header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  marginBottom: 24,
                  position: 'relative',
                }}>
                  <div style={{
                    width: 15,
                    height: 15,
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    flexShrink: 0,
                    position: 'relative',
                    zIndex: 1,
                  }} />
                  <h2 style={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: 'var(--text)',
                    letterSpacing: '-0.02em',
                    margin: 0,
                  }}>
                    {section.month}
                  </h2>
                </div>

                {/* Entries */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  paddingLeft: 31,
                }}>
                  {section.entries.map((entry, i) => (
                    <div
                      key={i}
                      style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: 10,
                        padding: '20px 24px',
                      }}
                    >
                      <h3 style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: 'var(--text)',
                        marginBottom: 6,
                        letterSpacing: '-0.01em',
                      }}>
                        {entry.title}
                      </h3>
                      <p style={{
                        fontSize: 14,
                        color: 'var(--text-muted)',
                        lineHeight: 1.6,
                        margin: 0,
                      }}>
                        {entry.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
