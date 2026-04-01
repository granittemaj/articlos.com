import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import BlogCard from '@/components/BlogCard'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Blog — SEO & Content Marketing Insights',
  description:
    'Expert articles on SEO, content marketing, AI writing, and growing organic traffic. Tips and strategies from the articlos team.',
  openGraph: {
    title: 'Blog | Articlos',
    description: 'Expert articles on SEO, content marketing, and AI writing.',
    url: 'https://articlos.com/blog',
  },
}

async function getPosts() {
  try {
    return await prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        tags: true,
        publishedAt: true,
        createdAt: true,
      },
    })
  } catch {
    return []
  }
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <>
      <Nav />
      <main style={{ paddingTop: 60 }}>
        {/* Hero */}
        <section
          style={{
            padding: '80px 24px 56px',
            textAlign: 'center',
            borderBottom: '1px solid #e8e8e6',
            background: '#ffffff',
          }}
        >
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <h1
              style={{
                fontSize: 'clamp(36px, 6vw, 56px)',
                fontWeight: 700,
                letterSpacing: '-0.04em',
                marginBottom: 14,
              }}
            >
              The Blog
            </h1>
            <p
              style={{
                fontSize: 18,
                color: '#6b6b67',
                lineHeight: 1.6,
              }}
            >
              SEO strategies, content marketing tips, and insights on AI-powered writing from the articlos team.
            </p>
          </div>
        </section>

        {/* Posts Grid */}
        <section style={{ padding: '64px 24px', background: '#fafaf9' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            {posts.length > 0 ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 24,
                }}
                className="blog-grid"
              >
                {posts.map((post) => (
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
              <div
                style={{
                  textAlign: 'center',
                  padding: '80px 24px',
                  color: '#6b6b67',
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: '#f0f0ee',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a0a09c" strokeWidth="1.75">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#0f0f0e', marginBottom: 8 }}>
                  No posts yet
                </h3>
                <p style={{ fontSize: 15 }}>
                  Check back soon — we&apos;re working on some great content.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .blog-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .blog-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </>
  )
}
