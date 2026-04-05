'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const choice = localStorage.getItem('articlos_consent')
    if (!choice) {
      // Small delay so it doesn't pop up instantly on page load
      const t = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(t)
    }
  }, [])

  function dismiss(accepted: boolean) {
    localStorage.setItem('articlos_consent', accepted ? 'accepted' : 'declined')
    if (accepted) {
      window.dispatchEvent(new Event('articlos_consent_accepted'))
    }
    setLeaving(true)
    setTimeout(() => setVisible(false), 380)
  }

  if (!visible) return null

  return (
    <>
      <div
        className={`consent-backdrop${leaving ? ' consent-leaving' : ''}`}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Cookie consent"
        className={`consent-banner${leaving ? ' consent-leaving' : ''}`}
      >
        {/* Left: icon + text */}
        <div className="consent-body">
          <div className="consent-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <p className="consent-title">Your privacy, your choice</p>
            <p className="consent-text">
              We use cookies to keep you signed in, analyse usage, and improve articlos. By continuing you accept our{' '}
              <Link href="/terms" className="consent-link">Terms</Link>
              {' '}and{' '}
              <Link href="/cookies" className="consent-link">Cookie Policy</Link>.
            </p>
          </div>
        </div>

        {/* Right: actions */}
        <div className="consent-actions">
          <button
            onClick={() => dismiss(false)}
            className="consent-btn consent-btn-secondary"
          >
            Decline
          </button>
          <button
            onClick={() => dismiss(true)}
            className="consent-btn consent-btn-primary"
          >
            Accept all
          </button>
        </div>
      </div>

      <style>{`
        .consent-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15,15,14,0.18);
          backdrop-filter: blur(2px);
          z-index: 999;
          animation: consent-fade-in 0.35s ease both;
          pointer-events: none;
        }
        .consent-banner {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%) translateY(0);
          z-index: 1000;
          width: calc(100% - 48px);
          max-width: 760px;
          background: var(--text);
          color: var(--bg);
          border-radius: 16px;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          box-shadow:
            0 4px 6px -1px rgba(0,0,0,0.25),
            0 20px 60px -10px rgba(0,0,0,0.45),
            0 0 0 1px rgba(255,255,255,0.06) inset;
          animation: consent-slide-up 0.42s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes consent-slide-up {
          from { opacity: 0; transform: translateX(-50%) translateY(28px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes consent-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .consent-banner.consent-leaving {
          animation: consent-slide-down 0.38s cubic-bezier(0.55,0,1,0.45) both;
        }
        .consent-backdrop.consent-leaving {
          animation: consent-fade-out 0.38s ease both;
        }
        @keyframes consent-slide-down {
          from { opacity: 1; transform: translateX(-50%) translateY(0); }
          to   { opacity: 0; transform: translateX(-50%) translateY(24px); }
        }
        @keyframes consent-fade-out {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        .consent-body {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          flex: 1;
          min-width: 0;
        }
        .consent-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: transparent;
          border: 1px solid var(--bg);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--bg);
          opacity: 0.5;
          margin-top: 1px;
        }
        .consent-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--bg);
          margin-bottom: 3px;
          letter-spacing: -0.01em;
        }
        .consent-text {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.55;
        }
        .consent-link {
          color: var(--bg);
          text-decoration: underline;
          text-underline-offset: 2px;
          opacity: 0.7;
        }
        .consent-link:hover { opacity: 1; }
        .consent-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .consent-btn {
          padding: 9px 18px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.15s ease;
          white-space: nowrap;
          letter-spacing: -0.01em;
        }
        .consent-btn-secondary {
          background: transparent;
          color: var(--bg);
          border: 1px solid var(--bg);
          opacity: 0.5;
        }
        .consent-btn-secondary:hover {
          opacity: 0.8;
        }
        .consent-btn-primary {
          background: var(--bg);
          color: var(--text);
        }
        .consent-btn-primary:hover {
          opacity: 0.9;
        }
        @media (max-width: 600px) {
          .consent-banner {
            flex-direction: column;
            bottom: 16px;
            padding: 18px 18px;
            gap: 16px;
          }
          .consent-actions {
            width: 100%;
          }
          .consent-btn {
            flex: 1;
            text-align: center;
            padding: 10px 12px;
          }
        }
      `}</style>
    </>
  )
}
