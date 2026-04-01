'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      {/* Win2k Taskbar-style header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'linear-gradient(to bottom, #d4d0c8, #b8b4a8)',
        borderTop: '2px solid #fff',
        borderBottom: '2px solid #404040',
        height: 30,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '0 4px',
        userSelect: 'none',
      }}>
        {/* Start button */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '2px 8px',
            background: 'linear-gradient(to bottom, #d4d0c8, #ece9d8)',
            borderTop: '1px solid #fff',
            borderLeft: '1px solid #fff',
            borderBottom: '1px solid #404040',
            borderRight: '1px solid #404040',
            fontWeight: 'bold',
            fontSize: 11,
            color: '#000',
            textDecoration: 'none',
            fontFamily: 'Tahoma, sans-serif',
            height: 22,
            flexShrink: 0,
          }}
        >
          {/* "Windows" flag pixel icon */}
          <span style={{
            display: 'inline-grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 1,
            width: 12,
            height: 12,
            flexShrink: 0,
          }}>
            <span style={{ background: '#cc0000', display: 'block' }} />
            <span style={{ background: '#006600', display: 'block' }} />
            <span style={{ background: '#0000cc', display: 'block' }} />
            <span style={{ background: '#cc6600', display: 'block' }} />
          </span>
          articlos
        </Link>

        {/* Separator */}
        <div style={{ width: 1, height: 20, background: '#808080', marginRight: 2 }} />

        {/* Nav links as taskbar buttons */}
        {[
          { label: 'Features', href: '/#features' },
          { label: 'Contact', href: '/#contact' },
          { label: 'Blog', href: '/blog' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '2px 10px',
              borderTop: '1px solid #fff',
              borderLeft: '1px solid #fff',
              borderBottom: '1px solid #404040',
              borderRight: '1px solid #404040',
              background: '#ece9d8',
              fontSize: 11,
              fontFamily: 'Tahoma, sans-serif',
              color: '#000',
              textDecoration: 'none',
              height: 22,
              whiteSpace: 'nowrap',
            }}
          >
            {item.label}
          </Link>
        ))}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Right side — Log in / Start free */}
        <a
          href="https://app.articlos.com/login"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '2px 10px',
            borderTop: '1px solid #fff',
            borderLeft: '1px solid #fff',
            borderBottom: '1px solid #404040',
            borderRight: '1px solid #404040',
            background: '#ece9d8',
            fontSize: 11,
            fontFamily: 'Tahoma, sans-serif',
            color: '#000',
            textDecoration: 'none',
            height: 22,
            whiteSpace: 'nowrap',
          }}
        >
          Log in
        </a>
        <a
          href="https://app.articlos.com/register"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '2px 12px',
            borderTop: '1px solid #fff',
            borderLeft: '1px solid #fff',
            borderBottom: '1px solid #404040',
            borderRight: '1px solid #404040',
            background: '#0a246a',
            fontSize: 11,
            fontFamily: 'Tahoma, sans-serif',
            fontWeight: 'bold',
            color: '#fff',
            textDecoration: 'none',
            height: 22,
            whiteSpace: 'nowrap',
          }}
        >
          Start free ▶
        </a>

        {/* System clock area */}
        <div style={{
          borderTop: '1px solid #808080',
          borderLeft: '1px solid #808080',
          borderBottom: '1px solid #fff',
          borderRight: '1px solid #fff',
          padding: '2px 8px',
          fontSize: 11,
          fontFamily: 'Tahoma, sans-serif',
          background: '#d4d0c8',
          height: 22,
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
        }}>
          articlos.com
        </div>

        {/* Hamburger for mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="hamburger-btn"
          aria-label="Toggle menu"
          style={{
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            width: 22,
            height: 22,
            borderTop: '1px solid #fff',
            borderLeft: '1px solid #fff',
            borderBottom: '1px solid #404040',
            borderRight: '1px solid #404040',
            background: '#ece9d8',
            fontSize: 11,
            cursor: 'default',
          }}
        >
          ▼
        </button>
      </header>

      {/* Mobile Menu — Win2k context menu style */}
      {menuOpen && (
        <div style={{
          position: 'fixed',
          top: 30,
          left: 0,
          right: 0,
          zIndex: 99,
          background: '#ece9d8',
          borderTop: '1px solid #fff',
          borderLeft: '1px solid #fff',
          borderBottom: '2px solid #404040',
          borderRight: '2px solid #404040',
          padding: '4px 0',
          boxShadow: '3px 3px 6px rgba(0,0,0,0.3)',
        }}>
          {[
            { label: 'Features', href: '/#features' },
            { label: 'Contact', href: '/#contact' },
            { label: 'Blog', href: '/blog' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block',
                padding: '4px 20px',
                fontSize: 11,
                color: '#000',
                textDecoration: 'none',
                fontFamily: 'Tahoma, sans-serif',
              }}
            >
              {item.label}
            </Link>
          ))}
          <div style={{ borderTop: '1px solid #808080', borderBottom: '1px solid #fff', margin: '3px 0' }} />
          <a
            href="https://app.articlos.com/login"
            style={{ display: 'block', padding: '4px 20px', fontSize: 11, color: '#000', textDecoration: 'none', fontFamily: 'Tahoma, sans-serif' }}
          >
            Log in
          </a>
          <a
            href="https://app.articlos.com/register"
            style={{ display: 'block', padding: '4px 20px', fontSize: 11, color: '#000', fontWeight: 'bold', textDecoration: 'none', fontFamily: 'Tahoma, sans-serif' }}
          >
            Start free
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav-items { display: none !important; }
          .desktop-cta-items { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}
