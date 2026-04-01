import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — articlos',
  description: 'How articlos collects, uses, and protects your personal data.',
}

const sections = [
  {
    id: 'overview',
    title: '1. Overview',
    body: `PAPINGU L.L.C. ("articlos", "we", "us", or "our") operates articlos.com and the articlos platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.

We are committed to protecting your privacy. If you disagree with the practices described in this policy, please do not use our Service. By using articlos, you consent to the collection and use of information as described here.`,
  },
  {
    id: 'information-we-collect',
    title: '2. Information We Collect',
    body: `**Account Information**
When you register, we collect your name, email address, password (hashed), and billing information. For team accounts, we collect information about team members you invite.

**Usage Data**
We automatically collect information about how you use the Service, including pages visited, features used, articles generated, keywords researched, and publishing activity. We also collect technical data such as IP address, browser type, device type, and operating system.

**Content Data**
We process the websites you connect, keywords you submit, articles we generate on your behalf, and settings you configure. This is necessary to provide the Service.

**Payment Data**
Payment card details are processed by our payment processor (Stripe) and are not stored on our servers. We receive transaction confirmation and billing history.

**Communications**
If you contact us via email or in-app chat, we retain records of those communications to respond to you and improve our support.`,
  },
  {
    id: 'how-we-use',
    title: '3. How We Use Your Information',
    body: `We use collected information to:

• Provide, operate, and improve the Service
• Process payments and send billing communications
• Send transactional emails (account confirmations, password resets, publishing notifications)
• Send product updates, newsletters, and promotional emails (you may opt out at any time)
• Analyze usage patterns to improve features and performance
• Detect and prevent fraud, abuse, or security incidents
• Comply with legal obligations
• Respond to your inquiries and support requests

We do not sell your personal information to third parties. We do not use your content to train our AI models without explicit consent.`,
  },
  {
    id: 'google-user-data',
    title: '4. Use of Google User Data',
    body: `Articlos accesses data from Google Search Console (GSC) and Google Analytics 4 (GA4) via Google OAuth Services. This section explains exactly what data we access, why, and how it is handled.

**What data we access**
• Google Search Console: search queries, impressions, clicks, average position, and page-level performance data for websites you connect to your articlos account.
• Google Analytics 4: traffic metrics, session data, page views, and audience behavior for connected properties.

**Why we access it**
We use this data exclusively to power articlos features — specifically, to surface keyword opportunities, identify content gaps, and generate data-driven content briefs for your account. We do not access your Google data for any purpose unrelated to delivering the Service to you.

**How we handle it**
• Your Google data is processed in real time or cached temporarily to reduce API calls. It is never stored permanently in a form that identifies individual users of your website.
• Your Google data is never sold, rented, transferred, or disclosed to third parties for any purpose, including advertising.
• We never use your Google data to train or improve AI models — ours or anyone else's.
• Access tokens are stored encrypted and are scoped to the minimum permissions required. You can revoke access at any time from your Google Account settings or from within articlos.

**Retention**
Cached Google data is purged within 24 hours of being fetched. OAuth tokens are deleted immediately upon disconnecting your Google account from articlos or deleting your articlos account.

**Compliance**
Our use of Google APIs complies with the Google API Services User Data Policy, including the Limited Use requirements.`,
  },
  {
    id: 'third-parties',
    title: '5. Third-Party Services',
    body: `We share data with the following categories of service providers who help us operate the Service:

**Infrastructure & Hosting:** Cloud hosting providers process and store your data. All providers are contractually bound to data protection standards.

**Payment Processing:** Stripe processes payments. See stripe.com/privacy for their privacy practices.

**Analytics:** We use privacy-respecting analytics to understand product usage. Data is aggregated and anonymized.

**AI Model Providers:** When generating content, your prompts and context are sent to AI model providers (e.g., OpenAI, Google) subject to their privacy policies. We do not send personally identifiable information in content generation requests.

**Email Delivery:** We use an email service provider to send transactional and marketing emails.

We do not share your data with advertisers or data brokers.`,
  },
  {
    id: 'data-retention',
    title: '6. Data Retention',
    body: `We retain your account information and content for as long as your account is active. After account deletion, we delete or anonymize your data within 90 days, except where we are required to retain it for legal compliance (e.g., billing records for 7 years).

Generated articles stored in your account are deleted with your account. You may export your content at any time before deletion.`,
  },
  {
    id: 'security',
    title: '7. Security',
    body: `We implement industry-standard security measures including encryption in transit (TLS), encryption at rest, access controls, and regular security audits. However, no method of transmission over the internet is 100% secure.

You are responsible for maintaining the security of your account credentials. We recommend using a strong, unique password and enabling two-factor authentication when available.

In the event of a data breach that affects your personal information, we will notify you as required by applicable law.`,
  },
  {
    id: 'your-rights',
    title: '8. Your Rights',
    body: `Depending on your location, you may have the following rights regarding your personal data:

• **Access:** Request a copy of the personal data we hold about you
• **Correction:** Request correction of inaccurate or incomplete data
• **Deletion:** Request deletion of your personal data ("right to be forgotten")
• **Portability:** Request your data in a machine-readable format
• **Objection:** Object to certain types of processing, including marketing emails
• **Restriction:** Request we limit how we use your data

To exercise any of these rights, contact us at hello@articlos.com. We will respond within 30 days. We may need to verify your identity before fulfilling requests.

If you are in the EU/EEA, you also have the right to lodge a complaint with your local data protection authority.`,
  },
  {
    id: 'cookies',
    title: '9. Cookies',
    body: `We use cookies and similar tracking technologies to operate and improve the Service. This includes:

• **Essential cookies:** Required for authentication and basic functionality
• **Analytics cookies:** Used to understand how users interact with the Service (aggregated, anonymized)
• **Preference cookies:** Remember your settings and preferences

You can control cookies through your browser settings. Disabling essential cookies may impact Service functionality.`,
  },
  {
    id: 'international',
    title: '10. International Transfers',
    body: `articlos is operated from the United States. If you are accessing the Service from outside the United States, your data will be transferred to and processed in the United States. We take appropriate measures to ensure that international transfers of personal data comply with applicable data protection laws.`,
  },
  {
    id: 'children',
    title: '11. Children\'s Privacy',
    body: `The Service is not directed to children under 13 years of age. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us and we will delete it promptly.`,
  },
  {
    id: 'changes',
    title: '12. Changes to This Policy',
    body: `We may update this Privacy Policy from time to time. We will notify you of significant changes by email or via a prominent notice in the Service. Your continued use of the Service after changes are effective constitutes acceptance of the revised policy.`,
  },
  {
    id: 'contact',
    title: '13. Contact Us',
    body: `For privacy-related questions, requests, or concerns, contact us at hello@articlos.com. For data deletion requests or to exercise your rights, please include your full name, email address, and a description of your request.`,
  },
]

export default function PrivacyPage() {
  return (
    <>
      <Nav />

      <section style={{ padding: '120px 24px 64px', background: '#f9f9f8', borderBottom: '1px solid #e4e4e2' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{
            fontSize: 11, fontWeight: 600, color: '#9b9b96',
            textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16,
          }}>
            Legal
          </div>
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 700, letterSpacing: '-0.04em', color: '#0f0f0e', marginBottom: 12,
          }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: 14, color: '#9b9b96' }}>
            Last updated: April 1, 2026 · Effective: April 1, 2026
          </p>
        </div>
      </section>

      <section style={{ padding: '64px 24px 96px', background: '#ffffff' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', gap: 56, alignItems: 'flex-start' }} className="privacy-layout">
          {/* TOC */}
          <aside style={{ width: 200, flexShrink: 0, position: 'sticky', top: 90 }} className="privacy-toc">
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9b9b96', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
              Contents
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {sections.map(s => (
                <a key={s.id} href={`#${s.id}`} className="toc-link">
                  {s.title.replace(/^\d+\.\s/, '')}
                </a>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {sections.map(s => (
              <div key={s.id} id={s.id} style={{ marginBottom: 48 }}>
                <h2 style={{
                  fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em',
                  color: '#0f0f0e', marginBottom: 14,
                }}>
                  {s.title}
                </h2>
                {s.body.split('\n\n').map((para, i) => {
                  const isHeading = para.startsWith('**') && para.includes('**\n')
                  if (isHeading) {
                    const [label, ...rest] = para.split('\n')
                    return (
                      <div key={i} style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#0f0f0e', marginBottom: 4 }}>
                          {label.replace(/\*\*/g, '')}
                        </div>
                        <p style={{ fontSize: 15, color: '#3d3d3a', lineHeight: 1.75 }}>
                          {rest.join('\n')}
                        </p>
                      </div>
                    )
                  }
                  return (
                    <p key={i} style={{
                      fontSize: 15, color: '#3d3d3a', lineHeight: 1.75, marginBottom: 14,
                      whiteSpace: 'pre-line',
                    }}>
                      {para}
                    </p>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .privacy-layout { flex-direction: column !important; gap: 32px !important; }
          .privacy-toc { width: 100% !important; position: static !important; }
        }
      `}</style>
    </>
  )
}
