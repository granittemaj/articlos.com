'use client'

import Link from 'next/link'
import Image from 'next/image'
import { formatDate, truncate } from '@/lib/utils'

interface BlogCardProps {
  title: string
  slug: string
  excerpt?: string | null
  featuredImage?: string | null
  tags?: string | null
  publishedAt?: Date | string | null
  createdAt: Date | string
}

export default function BlogCard({
  title,
  slug,
  excerpt,
  featuredImage,
  tags,
  publishedAt,
  createdAt,
}: BlogCardProps) {
  const date = publishedAt || createdAt
  const tagList = tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : []

  return (
    <Link
      href={`/blog/${slug}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        overflow: 'hidden',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.09), 0 2px 8px rgba(0,0,0,0.05)'
        el.style.transform = 'translateY(-3px)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.boxShadow = 'none'
        el.style.transform = 'translateY(0)'
      }}
    >
      {/* Featured Image */}
      <div
        style={{
          width: '100%',
          height: 200,
          background: featuredImage
            ? undefined
            : 'linear-gradient(135deg, var(--bg-elevated) 0%, var(--border) 100%)',
          flexShrink: 0,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {featuredImage ? (
          <Image
            src={featuredImage}
            alt={title}
            width={600}
            height={200}
            style={{ width: '100%', height: 200, objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--border)" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div
        style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          flex: 1,
        }}
      >
        {/* Tags */}
        {tagList.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {tagList.slice(0, 3).map((tag) => (
              <span key={tag} className="tag-chip" style={{ fontSize: 11 }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3
          style={{
            fontSize: 17,
            fontWeight: 600,
            lineHeight: 1.3,
            letterSpacing: '-0.02em',
            color: 'var(--text)',
          }}
        >
          {title}
        </h3>

        {/* Excerpt */}
        {excerpt && (
          <p
            style={{
              fontSize: 14,
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              flex: 1,
            }}
          >
            {truncate(excerpt, 120)}
          </p>
        )}

        {/* Date */}
        <p
          style={{
            fontSize: 12,
            color: 'var(--text-muted)',
            marginTop: 4,
          }}
        >
          {formatDate(date)}
        </p>
      </div>
    </Link>
  )
}
