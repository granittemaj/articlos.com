import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ShareButtons from '@/components/ShareButtons'
import { formatDate } from '@/lib/utils'
import { marked } from 'marked'

interface PageProps {
  params: { slug: string }
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPost(params.slug)

  if (!post) {
    return { title: 'Post Not Found' }
  }

  const title = post.metaTitle || post.title
  const description = post.metaDescription || post.excerpt || ''
  const ogImage = post.featuredImage || '/og-image.png'

  return {
    title,
    description,
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
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  // Determine if content is HTML or Markdown
  const isHtml = post.content.trim().startsWith('<')
  let htmlContent: string

  if (isHtml) {
    htmlContent = post.content
  } else {
    htmlContent = await marked(post.content)
  }

  const tagList = post.tags
    ? post.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : []

  const publishDate = post.publishedAt || post.createdAt
  const dateIso = new Date(publishDate).toISOString()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || '',
    image: post.featuredImage || 'https://articlos.com/og-image.png',
    datePublished: dateIso,
    dateModified: post.updatedAt.toISOString(),
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
        {/* Article Header */}
        <header
          style={{
            padding: '72px 24px 48px',
            borderBottom: '1px solid #e8e8e6',
            background: '#ffffff',
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
                  <span key={tag} className="tag-chip">
                    {tag}
                  </span>
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
                color: '#0f0f0e',
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
                  color: '#6b6b67',
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
                color: '#a0a09c',
              }}
            >
              <span>By articlos Team</span>
              <span>·</span>
              <time dateTime={dateIso}>{formatDate(publishDate)}</time>
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
              alt={post.title}
              style={{
                width: '100%',
                borderRadius: 12,
                border: '1px solid #e8e8e6',
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
          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* Tags footer */}
          {tagList.length > 0 && (
            <div
              style={{
                marginTop: 48,
                paddingTop: 24,
                borderTop: '1px solid #e8e8e6',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                flexWrap: 'wrap',
              }}
            >
              <span style={{ fontSize: 13, color: '#a0a09c', fontWeight: 500 }}>Tags:</span>
              {tagList.map((tag) => (
                <span key={tag} className="tag-chip">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Share */}
          <ShareButtons
            title={post.title}
            url={`https://articlos.com/blog/${post.slug}`}
          />
        </article>

        {/* CTA */}
        <section
          style={{
            background: '#0f0f0e',
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
                color: '#ffffff',
                marginBottom: 12,
              }}
            >
              Ready to automate your content?
            </h2>
            <p
              style={{
                fontSize: 15,
                color: 'rgba(255,255,255,0.55)',
                marginBottom: 28,
                lineHeight: 1.6,
              }}
            >
              Join thousands of content teams using articlos to grow their organic traffic.
            </p>
            <a
              href="https://app.articlos.com/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '12px 24px',
                background: '#ffffff',
                color: '#0f0f0e',
                borderRadius: 6,
                fontWeight: 600,
                fontSize: 15,
                textDecoration: 'none',
              }}
            >
              Start for free →
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
