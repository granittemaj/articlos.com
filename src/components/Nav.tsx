'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

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
          backgroundColor: scrolled ? 'rgba(250,250,249,0.92)' : '#fafaf9',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: '1px solid #e8e8e6',
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
                background: '#0f0f0e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
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
                color: '#0f0f0e',
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
              { label: 'Features', href: '/#features' },
              { label: 'About', href: '/about' },
              { label: 'Blog', href: '/blog' },
              { label: 'Contact', href: '/contact' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  padding: '6px 14px',
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 450,
                  color: '#6b6b67',
                  textDecoration: 'none',
                  transition: 'color 0.15s ease, background 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#0f0f0e'
                  e.currentTarget.style.background = '#f0f0ee'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#6b6b67'
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                {item.label}
              </Link>
            ))}
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
            <a
              href="https://app.articlos.com/login"
              style={{
                padding: '6px 14px',
                fontSize: 14,
                fontWeight: 450,
                color: '#6b6b67',
                textDecoration: 'none',
                borderRadius: 6,
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#0f0f0e' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#6b6b67' }}
            >
              Log in
            </a>
            <a
              href="https://app.articlos.com/register"
              className="btn btn-primary btn-sm"
              style={{ fontSize: 14 }}
            >
              Start free →
            </a>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="hamburger-btn"
            aria-label="Toggle menu"
            style={{
              display: 'none',
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
                background: '#0f0f0e',
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
                background: '#0f0f0e',
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
                background: '#0f0f0e',
                borderRadius: 2,
                transition: 'transform 0.2s ease, opacity 0.2s ease',
                transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none',
              }}
            />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99,
            background: '#fafaf9',
            display: 'flex',
            flexDirection: 'column',
            padding: '80px 24px 32px',
          }}
        >
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              { label: 'Features', href: '/#features' },
              { label: 'About', href: '/about' },
              { label: 'Blog', href: '/blog' },
              { label: 'Contact', href: '/contact' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: '14px 0',
                  fontSize: 22,
                  fontWeight: 500,
                  color: '#0f0f0e',
                  textDecoration: 'none',
                  borderBottom: '1px solid #e8e8e6',
                  letterSpacing: '-0.02em',
                }}
              >
                {item.label}
              </Link>
            ))}
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
              href="https://app.articlos.com/register"
              className="btn btn-primary"
              style={{ justifyContent: 'center', padding: '13px' }}
            >
              Start free →
            </a>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .desktop-cta { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}
