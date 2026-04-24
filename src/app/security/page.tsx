import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ScrollAnimations from '../ScrollAnimations'

export const metadata: Metadata = {
  title: 'Security — How articlos Protects Your Content Operation',
  description: 'How articlos handles encryption, credentials, Google OAuth data, payments, and your rights. Straight facts, no marketing badges we have not earned.',
  alternates: { canonical: '/security' },
  openGraph: {
    title: 'Security — articlos',
    description: 'How we handle encryption, credentials, Google OAuth data, and your rights. No marketing badges we have not earned.',
    url: 'https://articlos.com/security',
  },
}

type Pillar = {
  title: string
  summary: string
  details: string[]
}

const pillars: Pillar[] = [
  {
    title: 'Encryption',
    summary: 'In transit and at rest, using the same standards the rest of the modern web uses.',
    details: [
      'All traffic between your browser and articlos is encrypted with TLS.',
      'All data stored in our databases is encrypted at rest with AES-256.',
      'OAuth access and refresh tokens are encrypted before being written to storage.',
      'WordPress application passwords are encrypted at rest and never displayed back in our UI.',
    ],
  },
  {
    title: 'Your content is yours',
    summary: 'You own everything articlos generates on your behalf. We do not train models on it.',
    details: [
      'You retain full ownership of every article, brief, and asset generated through your account.',
      'We do not sell or rent your personal or content data to third parties, ever.',
      'We do not use your submitted content to train shared AI models without your explicit consent.',
      'When AI model providers (OpenAI, Google, Anthropic) process your requests, we do not send personally identifiable information in those requests.',
    ],
  },
  {
    title: 'Your Google data',
    summary: 'Google Search Console and GA4 are connected via OAuth. We follow Google\'s Limited Use policy to the letter.',
    details: [
      'We never ask for or see your Google password. OAuth only.',
      'Google API data is cached for up to 24 hours to reduce API calls — then purged.',
      'Your Google data is never sold, rented, transferred, or disclosed to third parties for advertising, market research, or user profiling.',
      'We never use Google data to train AI models.',
      'You can revoke access at any time from Settings → Integrations, or directly at myaccount.google.com/permissions.',
      'Our use of Google APIs adheres to the Google API Services User Data Policy, including Limited Use requirements.',
    ],
  },
  {
    title: 'Credentials and passwords',
    summary: 'Your account password is hashed. Your WordPress credentials never leave encrypted storage.',
    details: [
      'Account passwords are hashed with industry-standard algorithms and never stored in plain text.',
      'WordPress publishing uses per-site application passwords that are encrypted at rest.',
      'No credential is ever displayed back in the articlos UI after initial setup.',
      'We recommend using a strong, unique password and enabling two-factor authentication on any service you connect.',
    ],
  },
  {
    title: 'Payments',
    summary: 'Handled by Paysera. Your card data never touches our servers.',
    details: [
      'All payment processing goes through Paysera, a regulated European payment provider.',
      'We receive only transaction confirmations and billing history — never card numbers, CVVs, or bank details.',
      'See paysera.com for their security and compliance posture.',
    ],
  },
  {
    title: 'Data retention',
    summary: 'Keep what\'s yours while you\'re a customer. Delete it when you leave.',
    details: [
      'Account and content data is retained for as long as your account is active.',
      'If you cancel, you have 30 days to reactivate and recover everything.',
      'After account deletion, we delete or anonymize your data within 90 days.',
      'Billing records are retained for 7 years where required by law.',
      'You can export your content at any time before deletion.',
    ],
  },
  {
    title: 'Your rights',
    summary: 'Access, correction, deletion, portability, objection, restriction — whatever applies in your jurisdiction, we honour.',
    details: [
      'Request a copy of the personal data we hold about you at any time.',
      'Request correction of inaccurate or incomplete data.',
      'Request deletion of your personal data ("right to be forgotten").',
      'Request your data in a machine-readable portable format.',
      'Object to marketing emails or other specific processing.',
      'Request that we restrict how we use your data.',
      'Email hello@articlos.com to exercise any of these rights. We respond within 30 days.',
    ],
  },
  {
    title: 'Third-party processors',
    summary: 'The short, honest list of who touches your data and why.',
    details: [
      'Cloud infrastructure for hosting, databases, and storage.',
      'Paysera for payment processing.',
      'OpenAI, Google (Gemini), and Anthropic (Claude) for AI model inference.',
      'An email service provider for transactional and marketing emails.',
      'Vercel Analytics for aggregate, anonymized usage metrics.',
      'We do not share data with advertisers or data brokers.',
    ],
  },
  {
    title: 'Incident response',
    summary: 'If something goes wrong, we tell you.',
    details: [
      'We monitor our infrastructure and application logs for security events.',
      'In the event of a data breach affecting your personal information, we notify you as required by applicable law.',
      'Security questions and reports can be sent to hello@articlos.com.',
    ],
  },
]

export default function SecurityPage() {
  return (
    <>
      <Nav />
      <ScrollAnimations />

      <main style={{ background: 'var(--bg)' }}>
        {/* Hero */}
        <section style={{ padding: '96px 24px 48px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
            <div
              className="fade-up"
              style={{
                display: 'inline-block',
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginBottom: 20,
              }}
            >
              Security & Trust
            </div>
            <h1
              className="fade-up fade-up-delay-1"
              style={{
                fontSize: 'clamp(36px, 5vw, 56px)',
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                fontWeight: 700,
                marginBottom: 20,
                color: 'var(--text)',
              }}
            >
              Your content operation is yours.<br />We protect it accordingly.
            </h1>
            <p className="fade-up fade-up-delay-2" style={{ fontSize: 18, color: 'var(--text-muted)', lineHeight: 1.65, maxWidth: 700, margin: '0 auto' }}>
              Straight facts about how articlos handles your data. We don&apos;t claim certifications we haven&apos;t earned, and we don&apos;t hide the tradeoffs. Here is what we actually do today.
            </p>
          </div>
        </section>

        {/* Honest disclosure */}
        <section style={{ padding: '32px 24px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            <div
              className="fade-up"
              style={{
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: '20px 24px',
                background: 'var(--bg)',
                display: 'flex',
                gap: 14,
                alignItems: 'flex-start',
              }}
            >
              <span style={{ color: 'var(--text-muted)', fontSize: 18, flexShrink: 0, marginTop: 1 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </span>
              <div>
                <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6, margin: 0, fontWeight: 600 }}>
                  We don&apos;t carry SOC 2 or ISO 27001 attestation today.
                </p>
                <p style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.6, margin: '6px 0 0' }}>
                  These take 6–18 months of external audit. If you need one for procurement, tell us at <a href="mailto:hello@articlos.com" style={{ color: 'var(--text)', textDecoration: 'underline' }}>hello@articlos.com</a> — demand signal helps us prioritize. In the meantime, this page is the full picture of what we actually do.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pillars */}
        <section style={{ padding: '72px 24px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
            {pillars.map((p, i) => (
              <article
                key={p.title}
                className={`fade-up fade-up-delay-${Math.min(i + 1, 6)}`}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  padding: '28px 32px',
                }}
              >
                <h2 style={{
                  fontSize: 20,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--text)',
                  margin: 0,
                  marginBottom: 8,
                }}>
                  {p.title}
                </h2>
                <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0, marginBottom: 16 }}>
                  {p.summary}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {p.details.map((d, j) => (
                    <li key={j} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14.5, lineHeight: 1.55, color: 'var(--text)' }}>
                      <span style={{ color: '#16a34a', marginTop: 3, flexShrink: 0 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      {d}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* Legal links */}
        <section style={{ padding: '48px 24px', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
          <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 18 }}>
              The commitments on this page are grounded in our Privacy Policy, Terms of Service, and Cookies Policy. Read the full legal text below.
            </p>
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', fontSize: 14 }}>
              <Link href="/privacy" style={{ color: 'var(--text)', textDecoration: 'underline', fontWeight: 500 }}>Privacy Policy</Link>
              <Link href="/terms" style={{ color: 'var(--text)', textDecoration: 'underline', fontWeight: 500 }}>Terms of Service</Link>
              <Link href="/cookies" style={{ color: 'var(--text)', textDecoration: 'underline', fontWeight: 500 }}>Cookies Policy</Link>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section style={{ padding: '72px 24px' }}>
          <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 700, marginBottom: 14, letterSpacing: '-0.02em', color: 'var(--text)' }}>
              Questions about security?
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.6 }}>
              Report a vulnerability, ask about our posture for a procurement review, or request a deeper walk-through — we answer every email.
            </p>
            <a href="mailto:hello@articlos.com" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>
              hello@articlos.com
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
