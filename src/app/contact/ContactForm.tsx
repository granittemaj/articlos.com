'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export default function ContactForm() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong.')
      router.push('/contact/thank-you')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setSending(false)
    }
  }

  return (
    <>
      <Nav />

      <main style={{ paddingTop: 60 }}>
        {/* Hero */}
        <section style={{
          padding: '80px 24px 64px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface)',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <h1 style={{
              fontSize: 'clamp(32px, 6vw, 52px)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              marginBottom: 14,
            }}>
              Get in touch
            </h1>
            <p style={{ fontSize: 18, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Questions about articlos, partnership inquiries, or just want to say hi? We&apos;d love to hear from you.
            </p>
          </div>
        </section>

        {/* Content */}
        <section style={{ padding: '64px 24px 96px', background: 'var(--bg)' }}>
          <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 64, alignItems: 'start' }} className="contact-layout">

            {/* Left: info */}
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 8 }}>
                Contact information
              </h2>
              <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 32 }}>
                We typically respond within one business day.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {[
                  {
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                      </svg>
                    ),
                    label: 'Email',
                    value: 'hello@articlos.com',
                    href: 'mailto:hello@articlos.com',
                  },
                  {
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    ),
                    label: 'LinkedIn',
                    value: 'articlos',
                    href: 'https://www.linkedin.com/company/articlos/',
                  },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      textDecoration: 'none',
                      color: 'var(--text)',
                    }}
                  >
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: 'var(--bg-elevated)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: 'var(--text-muted)',
                    }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{item.value}</div>
                    </div>
                  </a>
                ))}
              </div>

              <div style={{
                marginTop: 48,
                padding: 20,
                background: 'var(--bg-elevated)',
                borderRadius: 10,
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Need help with your account?</div>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Check our <a href="/faq" style={{ color: 'var(--text)', fontWeight: 500 }}>FAQ</a> for quick answers to common questions about billing, integrations, and content generation.
                </p>
              </div>
            </div>

            {/* Right: form */}
            <div style={{
              background: 'var(--surface)',
              borderRadius: 12,
              border: '1px solid var(--border)',
              padding: 32,
            }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="contact-name-row">
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>
                        Name <span style={{ color: '#dc2626' }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => update('name', e.target.value)}
                        placeholder="Jane Smith"
                        required
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          border: '1px solid var(--border)',
                          borderRadius: 7,
                          fontSize: 14,
                          outline: 'none',
                          fontFamily: 'Geist, sans-serif',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>
                        Email <span style={{ color: '#dc2626' }}>*</span>
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                        placeholder="jane@company.com"
                        required
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          border: '1px solid var(--border)',
                          borderRadius: 7,
                          fontSize: 14,
                          outline: 'none',
                          fontFamily: 'Geist, sans-serif',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>
                      Subject
                    </label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => update('subject', e.target.value)}
                      placeholder="How can we help?"
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        border: '1px solid var(--border)',
                        borderRadius: 7,
                        fontSize: 14,
                        outline: 'none',
                        fontFamily: 'Geist, sans-serif',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>
                      Message <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <textarea
                      value={form.message}
                      onChange={(e) => update('message', e.target.value)}
                      placeholder="Tell us what's on your mind…"
                      required
                      rows={5}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        border: '1px solid var(--border)',
                        borderRadius: 7,
                        fontSize: 14,
                        outline: 'none',
                        fontFamily: 'Geist, sans-serif',
                        resize: 'vertical',
                        lineHeight: 1.6,
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {error && (
                    <p style={{ fontSize: 13, color: '#dc2626', margin: 0 }}>{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={sending}
                    style={{
                      padding: '11px 24px',
                      borderRadius: 7,
                      background: sending ? 'var(--text-muted)' : 'var(--accent)',
                      color: 'var(--accent-fg)',
                      fontSize: 15,
                      fontWeight: 600,
                      border: 'none',
                      cursor: sending ? 'not-allowed' : 'pointer',
                      fontFamily: 'Geist, sans-serif',
                      alignSelf: 'flex-start',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    {sending ? 'Sending…' : 'Send message →'}
                  </button>
                </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .contact-layout { grid-template-columns: 1fr !important; gap: 40px !important; }
          .contact-name-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
