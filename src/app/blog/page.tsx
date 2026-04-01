import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import BlogCard from '@/components/BlogCard'
import BlogFilters from '@/components/BlogFilters'

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

const POSTS_PER_PAGE = 9

async function getBlogData(page: number, tag?: string, q?: string) {
  try {
    const where = {
      published: true as const,
      ...(tag ? { tags: { contains: tag } } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: 'insensitive' as const } },
              { excerpt: { contains: q, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    }

    const [posts, total, tagPosts] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * POSTS_PER_PAGE,
        take: POSTS_PER_PAGE,
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
      }),
      prisma.post.count({ where }),
      prisma.post.findMany({
        where: { published: true },
        select: { tags: true },
      }),
    ])

    const allTags = [
      ...new Set(
        tagPosts
          .flatMap((p) => (p.tags ? p.tags.split(',').map((t) => t.trim()).filter(Boolean) : []))
      ),
    ].sort()

    return { posts, total, pages: Math.ceil(total / POSTS_PER_PAGE), allTags }
  } catch {
    return { posts: [], total: 0, pages: 0, allTags: [] }
  }
}

interface PageProps {
  searchParams: { page?: string; tag?: string; q?: string }
}

export default async function BlogPage({ searchParams }: PageProps) {
  const page = Math.max(1, parseInt(searchParams.page || '1', 10))
  const tag = searchParams.tag
  const q = searchParams.q

  const { posts, total, pages, allTags } = await getBlogData(page, tag, q)

  function buildUrl(p: number) {
    const params = new URLSearchParams()
    if (p > 1) params.set('page', String(p))
    if (tag) params.set('tag', tag)
    if (q) params.set('q', q)
    const qs = params.toString()
    return `/blog${qs ? `?${qs}` : ''}`
  }

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
            <p style={{ fontSize: 18, color: '#6b6b67', lineHeight: 1.6 }}>
              SEO strategies, content marketing tips, and insights on AI-powered writing from the articlos team.
            </p>
            {total > 0 && (
              <p style={{ fontSize: 13, color: '#a0a09c', marginTop: 12 }}>
                {total} article{total !== 1 ? 's' : ''}
                {tag ? ` tagged "${tag}"` : ''}
                {q ? ` matching "${q}"` : ''}
              </p>
            )}
          </div>
        </section>

        {/* Posts Grid */}
        <section style={{ padding: '56px 24px 80px', background: '#fafaf9' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            {/* Filters */}
            <Suspense fallback={null}>
              <BlogFilters allTags={allTags} currentTag={tag} currentQ={q} />
            </Suspense>

            {posts.length > 0 ? (
              <>
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

                {/* Pagination */}
                {pages > 1 && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      marginTop: 56,
                    }}
                  >
                    {page > 1 && (
                      <Link
                        href={buildUrl(page - 1)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: 7,
                          border: '1px solid #e8e8e6',
                          background: '#ffffff',
                          color: '#3d3d3a',
                          fontSize: 14,
                          fontWeight: 500,
                          textDecoration: 'none',
                        }}
                      >
                        ← Prev
                      </Link>
                    )}

                    {Array.from({ length: pages }, (_, i) => i + 1).map((p) => {
                      if (pages > 7 && Math.abs(p - page) > 2 && p !== 1 && p !== pages) {
                        if (p === page - 3 || p === page + 3) {
                          return <span key={p} style={{ color: '#a0a09c', fontSize: 14 }}>…</span>
                        }
                        return null
                      }
                      return (
                        <Link
                          key={p}
                          href={buildUrl(p)}
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 7,
                            border: '1px solid',
                            borderColor: p === page ? '#0f0f0e' : '#e8e8e6',
                            background: p === page ? '#0f0f0e' : '#ffffff',
                            color: p === page ? '#ffffff' : '#3d3d3a',
                            fontSize: 14,
                            fontWeight: p === page ? 600 : 400,
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {p}
                        </Link>
                      )
                    })}

                    {page < pages && (
                      <Link
                        href={buildUrl(page + 1)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: 7,
                          border: '1px solid #e8e8e6',
                          background: '#ffffff',
                          color: '#3d3d3a',
                          fontSize: 14,
                          fontWeight: 500,
                          textDecoration: 'none',
                        }}
                      >
                        Next →
                      </Link>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '80px 24px', color: '#6b6b67' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: '#f0f0ee', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px',
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a0a09c" strokeWidth="1.75">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#0f0f0e', marginBottom: 8 }}>
                  {q || tag ? 'No articles found' : 'No posts yet'}
                </h3>
                <p style={{ fontSize: 15 }}>
                  {q || tag
                    ? 'Try a different search or tag.'
                    : 'Check back soon — we\'re working on some great content.'}
                </p>
                {(q || tag) && (
                  <Link
                    href="/blog"
                    style={{
                      display: 'inline-block',
                      marginTop: 16,
                      padding: '8px 18px',
                      borderRadius: 7,
                      border: '1px solid #e8e8e6',
                      background: '#ffffff',
                      color: '#0f0f0e',
                      fontSize: 14,
                      fontWeight: 500,
                      textDecoration: 'none',
                    }}
                  >
                    View all posts
                  </Link>
                )}
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
