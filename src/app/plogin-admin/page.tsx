import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

async function getStats() {
  try {
    const now = new Date()
    const [totalPosts, publishedPosts, draftPosts, scheduledPosts, subscribers] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { published: true } }),
      prisma.post.count({ where: { published: false, OR: [{ publishedAt: null }, { publishedAt: { lt: now } }] } }),
      prisma.post.count({ where: { published: false, publishedAt: { gt: now } } }),
      prisma.newsletterSubscriber.count().catch(() => 0),
    ])

    const recentPosts = await prisma.post.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
        updatedAt: true,
      },
    })

    return { totalPosts, publishedPosts, draftPosts, scheduledPosts, subscribers, recentPosts }
  } catch {
    return {
      totalPosts: 0,
      publishedPosts: 0,
      draftPosts: 0,
      scheduledPosts: 0,
      subscribers: 0,
      recentPosts: [],
    }
  }
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/plogin-admin/login')

  const { totalPosts, publishedPosts, draftPosts, scheduledPosts, subscribers, recentPosts } = await getStats()

  const statCards = [
    {
      label: 'Total Posts',
      value: totalPosts,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      ),
    },
    {
      label: 'Published',
      value: publishedPosts,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.75">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    {
      label: 'Drafts',
      value: draftPosts,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.75">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
    },
    {
      label: 'Scheduled',
      value: scheduledPosts,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.75">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      label: 'Subscribers',
      value: subscribers,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="1.75">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
  ]

  return (
    <div>
      <div className="page-header">
        <h1 className="page-header-title">Dashboard</h1>
        <Link href="/plogin-admin/blog/new" className="btn btn-primary btn-sm">
          + New post
        </Link>
      </div>

      <div className="page-body">
        {/* Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 16,
            marginBottom: 32,
          }}
          className="dashboard-stats"
        >
          {statCards.map((card) => (
            <div
              key={card.label}
              style={{
                background: '#ffffff',
                border: '1px solid #e8e8e6',
                borderRadius: 8,
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: '#f5f5f3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {card.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    marginBottom: 4,
                  }}
                >
                  {card.value}
                </div>
                <div style={{ fontSize: 13, color: '#6b6b67' }}>{card.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e8e8e6',
              borderRadius: 8,
              padding: '20px',
            }}
          >
            <h3
              style={{
                fontSize: 15,
                fontWeight: 600,
                marginBottom: 12,
                letterSpacing: '-0.01em',
              }}
            >
              Quick actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link
                href="/plogin-admin/blog/new"
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'flex-start' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Write new post
              </Link>
              <Link
                href="/plogin-admin/blog"
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'flex-start' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                Manage blog posts
              </Link>
              <Link
                href="/plogin-admin/content"
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'flex-start' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit site content
              </Link>
              <Link
                href="/plogin-admin/changelog"
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'flex-start' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                Manage changelog
              </Link>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'flex-start' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                View public site
              </a>
            </div>
          </div>

          {/* Recent Posts */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e8e8e6',
              borderRadius: 8,
              padding: '20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}
            >
              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                }}
              >
                Recent posts
              </h3>
              <Link
                href="/plogin-admin/blog"
                style={{ fontSize: 12, color: '#6b6b67', textDecoration: 'none' }}
              >
                View all →
              </Link>
            </div>

            {recentPosts.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {recentPosts.map((post, i) => (
                  <Link
                    key={post.id}
                    href={`/plogin-admin/blog/${post.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '9px 0',
                      borderBottom: i < recentPosts.length - 1 ? '1px solid #f5f5f3' : 'none',
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: post.published ? '#22c55e' : '#e8e8e6',
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 13,
                        color: '#0f0f0e',
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {post.title}
                    </span>
                    <span style={{ fontSize: 11, color: '#a0a09c', flexShrink: 0 }}>
                      {new Date(post.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: 14, color: '#a0a09c', textAlign: 'center', padding: '20px 0' }}>
                No posts yet. <Link href="/plogin-admin/blog/new" style={{ color: '#0f0f0e' }}>Create your first →</Link>
              </p>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .dashboard-stats { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .dashboard-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}
