'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import BackToTop from './BackToTop'
import ThemeToggle from './ThemeToggle'

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: 60,
          backgroundColor: scrolled ? 'var(--nav-bg-scrolled)' : 'var(--nav-bg)',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: '1px solid var(--border)',
          transition: 'background-color 0.2s ease, backdrop-filter 0.2s ease',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 24px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              textDecoration: 'none',
              flexShrink: 0,
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
                fontFamily: 'Geist, sans-serif',
                letterSpacing: '-0.02em',
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

          {/* Center Nav Links */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
            className="desktop-nav"
          >
            {[
              { label: 'Features', href: '/features', match: null },
              { label: 'Pricing', href: '/pricing', match: '/pricing' },
              { label: 'Compare', href: '/compare', match: '/compare' },
              { label: 'About', href: '/about', match: '/about' },
              { label: 'Blog', href: '/blog', match: '/blog' },
              { label: 'FAQ', href: '/faq', match: '/faq' },
              { label: 'Contact', href: '/contact', match: '/contact' },
            ].map((item) => {
              const isActive = item.match !== null && pathname.startsWith(item.match)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 6,
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 450,
                    color: isActive ? 'var(--text)' : 'var(--text-muted)',
                    textDecoration: 'none',
                    transition: 'color 0.15s ease, background 0.15s ease',
                    background: isActive ? 'var(--bg-elevated)' : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--text)'
                    e.currentTarget.style.background = 'var(--bg-elevated)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = isActive ? 'var(--text)' : 'var(--text-muted)'
                    e.currentTarget.style.background = isActive ? 'var(--bg-elevated)' : 'transparent'
                  }}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Right CTAs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
            className="desktop-cta"
          >
            <ThemeToggle />
            <a
              href="https://app.articlos.com/login"
              style={{
                padding: '6px 14px',
                fontSize: 14,
                fontWeight: 450,
                color: 'var(--text-muted)',
                textDecoration: 'none',
                borderRadius: 6,
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)' }}
            >
              Log in
            </a>
            <a
              href="/contact"
              className="btn btn-primary btn-sm"
              style={{ fontSize: 14 }}
            >
              Contact us →
            </a>
          </div>

          {/* Mobile controls: theme toggle + hamburger */}
          <div className="mobile-controls" style={{ display: 'none', alignItems: 'center', gap: 4 }}>
            <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 5,
              padding: 8,
              borderRadius: 6,
              cursor: 'pointer',
              background: 'transparent',
              border: 'none',
            }}
          >
            <span
              style={{
                display: 'block',
                width: 20,
                height: 1.5,
                background: 'var(--text)',
                borderRadius: 2,
                transition: 'transform 0.2s ease, opacity 0.2s ease',
                transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none',
              }}
            />
            <span
              style={{
                display: 'block',
                width: 20,
                height: 1.5,
                background: 'var(--text)',
                borderRadius: 2,
                opacity: menuOpen ? 0 : 1,
                transition: 'opacity 0.2s ease',
              }}
            />
            <span
              style={{
                display: 'block',
                width: 20,
                height: 1.5,
                background: 'var(--text)',
                borderRadius: 2,
                transition: 'transform 0.2s ease, opacity 0.2s ease',
                transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none',
              }}
            />
          </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99,
            background: 'var(--nav-bg)',
            display: 'flex',
            flexDirection: 'column',
            padding: '80px 24px 32px',
          }}
        >
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              { label: 'Features', href: '/features', match: null },
              { label: 'Pricing', href: '/pricing', match: '/pricing' },
              { label: 'Compare', href: '/compare', match: '/compare' },
              { label: 'About', href: '/about', match: '/about' },
              { label: 'Blog', href: '/blog', match: '/blog' },
              { label: 'FAQ', href: '/faq', match: '/faq' },
              { label: 'Contact', href: '/contact', match: '/contact' },
            ].map((item) => {
              const isActive = item.match !== null && pathname.startsWith(item.match)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    padding: '14px 0',
                    fontSize: 22,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--text)' : 'var(--text-muted)',
                    textDecoration: 'none',
                    borderBottom: '1px solid var(--border)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <div
            style={{
              marginTop: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <a
              href="https://app.articlos.com/login"
              className="btn btn-ghost"
              style={{ justifyContent: 'center', padding: '13px' }}
            >
              Log in
            </a>
            <a
              href="/contact"
              className="btn btn-primary"
              style={{ justifyContent: 'center', padding: '13px' }}
            >
              Contact us →
            </a>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .desktop-cta { display: none !important; }
          .mobile-controls { display: flex !important; }
        }
      `}</style>

      <BackToTop />
    </>
  )
}
