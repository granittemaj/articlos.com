'use client'

import Link from 'next/link'

type FooterLink = {
  label: string
  href: string
  external?: boolean
  icon?: 'linkedin'
}

const productLinks: FooterLink[] = [
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
]

const resourceLinks: FooterLink[] = [
  { label: 'Blog', href: '/blog' },
  { label: 'Changelog', href: '/changelog' },
  { label: 'FAQ', href: '/faq' },
  { label: 'llms.txt', href: '/llms.txt' },
]

const compareLinks: FooterLink[] = [
  { label: 'vs Frase', href: '/compare/vs-frase' },
  { label: 'vs Surfer SEO', href: '/compare/vs-surfer' },
  { label: 'vs Clearscope', href: '/compare/vs-clearscope' },
  { label: 'vs MarketMuse', href: '/compare/vs-marketmuse' },
  { label: 'vs Jasper', href: '/compare/vs-jasper' },
  { label: 'vs ChatGPT, Claude & Gemini', href: '/compare/vs-llms' },
  { label: 'All comparisons', href: '/compare' },
]

const companyLinks: FooterLink[] = [
  { label: 'About', href: '/about' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
  { label: 'Security', href: '/security' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/articlos/', external: true, icon: 'linkedin' },
]

const linkStyle = {
  fontSize: 14,
  color: 'var(--text-muted)',
  textDecoration: 'none',
  transition: 'color 0.15s ease',
} as const

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <p
        style={{
          fontSize: 12,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--text-muted)',
          marginBottom: 16,
        }}
      >
        {title}
      </p>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {links.map((item) => {
          const content = item.icon === 'linkedin' ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 7 }}>
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              {item.label}
            </>
          ) : item.label

          const commonProps = {
            style: { ...linkStyle, ...(item.icon ? { display: 'inline-flex', alignItems: 'center' } : {}) },
            onMouseEnter: (e: React.MouseEvent<HTMLElement>) => { (e.currentTarget as HTMLElement).style.color = 'var(--text)' },
            onMouseLeave: (e: React.MouseEvent<HTMLElement>) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' },
          }

          if (item.external) {
            return (
              <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" {...commonProps}>
                {content}
              </a>
            )
          }
          return (
            <Link key={item.label} href={item.href} {...commonProps}>
              {content}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default function Footer() {
  return (
    <footer
      style={{
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        padding: '64px 0 32px',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
        }}
      >
        {/* 5-column grid — Brand wider than the four nav columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr repeat(4, 1fr)',
            gap: 48,
            marginBottom: 56,
          }}
          className="footer-grid"
        >
          {/* Brand */}
          <div className="footer-brand" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Link
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                textDecoration: 'none',
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 7,
                  background: 'var(--text)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--bg)',
                  fontWeight: 700,
                  fontSize: 16,
                  flexShrink: 0,
                }}
              >
                a
              </div>
              <span
                style={{
                  fontWeight: 600,
                  fontSize: 16,
                  color: 'var(--text)',
                  letterSpacing: '-0.02em',
                }}
              >
                articlos
              </span>
            </Link>
            <p
              style={{
                fontSize: 13,
                color: 'var(--text-muted)',
                lineHeight: 1.6,
                maxWidth: 240,
              }}
            >
              The closed-loop content intelligence system. Researches, generates, publishes, and rewrites — so your content ranks on Google and gets cited by AI.
            </p>
          </div>

          <FooterColumn title="Product" links={productLinks} />
          <FooterColumn title="Resources" links={resourceLinks} />
          <FooterColumn title="Compare" links={compareLinks} />
          <FooterColumn title="Company" links={companyLinks} />
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid var(--border)',
            paddingTop: 24,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            © 2026 PAPINGU L.L.C.
          </p>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { label: 'Terms', href: '/terms' },
              { label: 'Privacy', href: '/privacy' },
              { label: 'Cookies', href: '/cookies' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={{
                  fontSize: 12,
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
          }
          .footer-brand {
            grid-column: 1 / -1 !important;
          }
        }
      `}</style>
    </footer>
  )
}
