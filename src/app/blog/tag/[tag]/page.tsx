import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import BlogCard from '@/components/BlogCard'
import Link from 'next/link'

interface PageProps {
  params: { tag: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const tag = decodeURIComponent(params.tag)
  return {
    title: `Articles tagged "${tag}"`,
    description: `Browse all articlos blog posts tagged with "${tag}".`,
    alternates: { canonical: `/blog/tag/${encodeURIComponent(tag.toLowerCase())}` },
  }
}

export const dynamic = 'force-dynamic'

export default async function TagPage({ params }: PageProps) {
  const tag = decodeURIComponent(params.tag)

  let posts: {
    id: string
    title: string
    slug: string
    excerpt: string | null
    featuredImage: string | null
    tags: string | null
    publishedAt: Date | null
    createdAt: Date
  }[] = []

  try {
    posts = await prisma.post.findMany({
      where: {
        published: true,
        tags: { contains: tag, mode: 'insensitive' },
      },
      orderBy: [{ publishedAt: { sort: 'desc', nulls: 'last' } }, { createdAt: 'desc' }],
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
    // DB unavailable — render empty state
  }

  return (
    <>
      <Nav />
      <main style={{ paddingTop: 60 }}>
        {/* Hero */}
        <section
          style={{
            padding: '64px 24px 48px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--surface)',
          }}
        >
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            {/* Breadcrumb */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
              <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
              <span>/</span>
              <Link href="/blog" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Blog</Link>
              <span>/</span>
              <span style={{ color: 'var(--text)' }}>{tag}</span>
            </nav>
            <span className="tag-chip" style={{ marginBottom: 16, display: 'inline-block' }}>{tag}</span>
            <h1
              style={{
                fontSize: 'clamp(28px, 5vw, 44px)',
                fontWeight: 700,
                letterSpacing: '-0.04em',
                marginBottom: 8,
                color: 'var(--text)',
              }}
            >
              Articles tagged &ldquo;{tag}&rdquo;
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text-muted)' }}>
              {posts.length} article{posts.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </section>

        {/* Posts grid */}
        <section style={{ padding: '48px 24px 80px', background: 'var(--bg)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            {posts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px 24px' }}>
                <p style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 20 }}>
                  No articles found for &ldquo;{tag}&rdquo;.
                </p>
                <Link
                  href="/blog"
                  style={{
                    padding: '10px 22px',
                    background: 'var(--accent)',
                    color: 'var(--accent-fg)',
                    borderRadius: 6,
                    fontWeight: 500,
                    fontSize: 14,
                    textDecoration: 'none',
                  }}
                >
                  Browse all articles
                </Link>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: 24,
                }}
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
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
