import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ShareButtons from '@/components/ShareButtons'
import BlogCard from '@/components/BlogCard'
import { formatDate, readingTime, extractToc, injectHeadingIds } from '@/lib/utils'
import { marked } from 'marked'

interface PageProps {
  params: { slug: string }
}

async function publishScheduledPosts() {
  try {
    await prisma.post.updateMany({
      where: { published: false, publishedAt: { lte: new Date(), not: null } },
      data: { published: true },
    })
  } catch { /* non-fatal */ }
}

async function getPost(slug: string) {
  try {
    return await prisma.post.findFirst({
      where: { slug, published: true },
    })
  } catch {
    return null
  }
}

async function getRelatedPosts(postId: string, tags: string[]) {
  if (!tags.length) return []
  try {
    return await prisma.post.findMany({
      where: {
        published: true,
        id: { not: postId },
        OR: tags.map((tag) => ({ tags: { contains: tag, mode: 'insensitive' as const } })),
      },
      take: 3,
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPost(params.slug)

  if (!post) {
    return { title: 'Post Not Found' }
  }

  const title = post.metaTitle || post.title
  const description = post.metaDescription || post.excerpt || ''
  const ogImage = post.featuredImage || '/opengraph-image'

  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://articlos.com/blog/${post.slug}`,
      publishedTime: post.publishedAt?.toISOString(),
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  await publishScheduledPosts()
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  const isHtml = post.content.trim().startsWith('<')
  const rawHtml = isHtml ? post.content : await marked(post.content)

  const processedHtml = injectHeadingIds(rawHtml)
  const toc = extractToc(rawHtml)
  const minutes = readingTime(rawHtml)

  const tagList = post.tags
    ? post.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : []

  const relatedPosts = await getRelatedPosts(post.id, tagList)

  const publishDate = post.publishedAt || post.createdAt
  const dateIso = new Date(publishDate).toISOString()

  const wordCount = rawHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || '',
    image: post.featuredImage || 'https://articlos.com/opengraph-image',
    datePublished: dateIso,
    dateModified: post.updatedAt.toISOString(),
    wordCount,
    timeRequired: `PT${minutes}M`,
    author: {
      '@type': 'Organization',
      name: 'articlos',
      url: 'https://articlos.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'PAPINGU L.L.C.',
      url: 'https://articlos.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://articlos.com/blog/${post.slug}`,
    },
  }

  return (
    <>
      <Nav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main style={{ paddingTop: 60 }}>
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          style={{
            maxWidth: 720,
            margin: '0 auto',
            padding: '16px 24px 0',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            color: 'var(--text-muted)',
          }}
        >
          <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link href="/blog" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Blog</Link>
          <span>/</span>
          <span
            style={{
              color: 'var(--text)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 320,
            }}
          >
            {post.title}
          </span>
        </nav>

        {/* Article Header */}
        <header
          style={{
            padding: '40px 24px 48px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--surface)',
            textAlign: 'center',
          }}
        >
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            {/* Tags */}
            {tagList.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  gap: 8,
                  marginBottom: 20,
                }}
              >
                {tagList.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/tag/${encodeURIComponent(tag.toLowerCase())}`}
                    className="tag-chip"
                    style={{ textDecoration: 'none' }}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Title */}
            <h1
              style={{
                fontSize: 'clamp(32px, 5vw, 52px)',
                fontWeight: 700,
                letterSpacing: '-0.04em',
                lineHeight: 1.1,
                color: 'var(--text)',
                marginBottom: 20,
              }}
            >
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p
                style={{
                  fontSize: 18,
                  color: 'var(--text-muted)',
                  lineHeight: 1.6,
                  maxWidth: 600,
                  margin: '0 auto 24px',
                }}
              >
                {post.excerpt}
              </p>
            )}

            {/* Meta */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
                fontSize: 13,
                color: 'var(--text-muted)',
                flexWrap: 'wrap',
              }}
            >
              <span>By articlos Team</span>
              <span>·</span>
              <time dateTime={dateIso}>{formatDate(publishDate)}</time>
              <span>·</span>
              <span>{minutes} min read</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.featuredImage && (
          <div
            style={{
              maxWidth: 900,
              margin: '0 auto',
              padding: '40px 24px 0',
            }}
          >
            <img
              src={post.featuredImage}
              alt={post.featuredImageAlt || post.title}
              style={{
                width: '100%',
                borderRadius: 12,
                border: '1px solid var(--border)',
                objectFit: 'cover',
                maxHeight: 480,
              }}
            />
          </div>
        )}

        {/* Article Content */}
        <article
          style={{
            maxWidth: 720,
            margin: '0 auto',
            padding: '48px 24px 80px',
          }}
        >
          {/* Table of Contents */}
          {toc.length >= 3 && (
            <nav
              aria-label="Table of contents"
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: '20px 24px',
                marginBottom: 40,
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--text-muted)',
                  marginBottom: 12,
                }}
              >
                In this article
              </p>
              <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {toc.map((item) => (
                  <li
                    key={item.id}
                    style={{ paddingLeft: item.level === 3 ? 16 : 0 }}
                  >
                    <a
                      href={`#${item.id}`}
                      style={{
                        fontSize: item.level === 3 ? 13 : 14,
                        color: 'var(--text)',
                        textDecoration: 'none',
                        lineHeight: 1.4,
                      }}
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: processedHtml }}
          />

          {/* Tags footer */}
          {tagList.length > 0 && (
            <div
              style={{
                marginTop: 48,
                paddingTop: 24,
                borderTop: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                flexWrap: 'wrap',
              }}
            >
              <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>Tags:</span>
              {tagList.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tag/${encodeURIComponent(tag.toLowerCase())}`}
                  className="tag-chip"
                  style={{ textDecoration: 'none' }}
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          {/* Share */}
          <ShareButtons
            title={post.title}
            url={`https://articlos.com/blog/${post.slug}`}
          />
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section
            style={{
              borderTop: '1px solid var(--border)',
              padding: '64px 24px',
              background: 'var(--bg)',
            }}
          >
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
              <h2
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  marginBottom: 24,
                  color: 'var(--text)',
                }}
              >
                Related articles
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: 20,
                }}
              >
                {relatedPosts.map((p) => (
                  <BlogCard
                    key={p.id}
                    title={p.title}
                    slug={p.slug}
                    excerpt={p.excerpt}
                    featuredImage={p.featuredImage}
                    tags={p.tags}
                    publishedAt={p.publishedAt}
                    createdAt={p.createdAt}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section
          style={{
            background: 'var(--cta-bg)',
            padding: '64px 24px',
            textAlign: 'center',
          }}
        >
          <div style={{ maxWidth: 500, margin: '0 auto' }}>
            <h2
              style={{
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: 'var(--cta-text)',
                marginBottom: 12,
              }}
            >
              Ready to automate your content?
            </h2>
            <p
              style={{
                fontSize: 15,
                color: 'var(--cta-text-muted)',
                marginBottom: 28,
                lineHeight: 1.6,
              }}
            >
              Let articlos run your content loop — from Search Console opportunity to published article.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="https://app.articlos.com/login"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '12px 24px',
                  background: 'var(--cta-text)',
                  color: 'var(--cta-bg)',
                  borderRadius: 6,
                  fontWeight: 600,
                  fontSize: 15,
                  textDecoration: 'none',
                }}
              >
                Log in →
              </a>
              <a
                href="/contact"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '12px 24px',
                  background: 'transparent',
                  color: 'var(--cta-text-secondary)',
                  borderRadius: 6,
                  fontWeight: 500,
                  fontSize: 15,
                  textDecoration: 'none',
                  border: '1px solid var(--cta-border)',
                }}
              >
                Contact the articlos team
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
