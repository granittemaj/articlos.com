'use client'

import { useState, useEffect } from 'react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <>
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className="back-to-top-btn"
        style={{
          zIndex: 50,
          width: 40,
          height: 40,
          borderRadius: 8,
          background: '#0f0f0e',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
          transform: visible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#2a2a28'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#0f0f0e'
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M8 12V4M8 4L4 8M8 4L12 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <style>{`
        .back-to-top-btn {
          position: fixed;
          bottom: 24px;
          right: 24px;
        }
        @media (max-width: 768px) {
          .back-to-top-btn {
            bottom: 16px;
            right: 16px;
          }
        }
      `}</style>
    </>
  )
}
