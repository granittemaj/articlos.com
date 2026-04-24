import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — articlos',
  description: 'We respect your data as much as your content. Here\'s exactly what we collect, why we collect it, and how we keep it safe.',
  alternates: { canonical: '/privacy' },
}

const sections = [
  {
    id: 'overview',
    title: '1. Overview',
    body: `PAPINGU L.L.C. ("Articlos", "we", "us", or "our") operates articlos.com and the Articlos platform, including the application at app.articlos.com. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service \u2014 whether you access it through our marketing site or the application itself.

We are committed to protecting your privacy. If you disagree with the practices described in this policy, please do not use our Service. By using Articlos, you consent to the collection and use of information as described here.`,
  },
  {
    id: 'information-we-collect',
    title: '2. Information We Collect',
    body: `**Account Information**
When you register, we collect your name, email address, password (hashed and never stored in plain text), and billing information. For team accounts, we also collect information about team members you invite.

**Usage Data**
We automatically collect information about how you use the Service, including pages visited, features used, articles generated, keywords researched, and publishing activity. We also collect technical data such as IP address, browser type, device type, and operating system.

**Content Data**
We process the websites you connect, keywords you submit, articles we generate on your behalf, and settings you configure. This data is necessary to provide the Service.

**Payment Data**
All billing is handled by bank transfer (SEPA or SWIFT). We do not collect, process, or store card numbers, CVV codes, or other payment card details at any point. We retain invoice records, transaction references, and billing contact information as required for accounting and tax compliance.

**Communications**
If you contact us via email or in-app support, we retain records of those communications to respond to you and improve our support quality.`,
  },
  {
    id: 'how-we-use',
    title: '3. How We Use Your Information',
    body: `We use collected information to:

\u2022 Provide, operate, and improve the Service
\u2022 Process payments and send billing communications
\u2022 Send transactional emails (account confirmations, password resets, publishing notifications)
\u2022 Send product updates, newsletters, and promotional emails (you may opt out at any time)
\u2022 Analyse usage patterns to improve features and performance
\u2022 Detect and prevent fraud, abuse, or security incidents
\u2022 Comply with legal obligations
\u2022 Respond to your inquiries and support requests

We do not sell your personal information to third parties. We do not use your content to train AI models without your explicit consent.`,
  },
  {
    id: 'google-user-data',
    title: '4. Use of Google User Data',
    body: `Articlos integrates with Google Search Console (GSC) and Google Analytics 4 (GA4) via Google OAuth 2.0. We never access or store your Google password.

**What data we access**
\u2022 Google Search Console: search queries, impressions, clicks, average position, and page-level performance data for websites you connect to your Articlos account.
\u2022 Google Analytics 4: sessions, page views, bounce rates, traffic sources, and audience behavior for connected properties.

**Why we access it**
We use this data exclusively to power Articlos features \u2014 specifically to surface keyword opportunities, identify content gaps, detect content decay, and generate data-driven content briefs for your account. We do not access your Google data for any purpose unrelated to delivering the Service to you.

**Data storage & security**
Google API data is cached temporarily (up to 24 hours) to improve dashboard performance and reduce API calls. Cached data is stored in encrypted databases protected by TLS/SSL in transit and AES-256 at rest. Access tokens and refresh tokens are encrypted before storage. We do not permanently store raw Google API responses beyond the cache period.

**Data sharing & limited use**
Your Google data is never sold, rented, transferred, or disclosed to third parties for any purpose \u2014 including advertising, market research, or building user profiles. We never use your Google data to train AI models. Our use and transfer of information received from Google APIs adheres to the Google API Services User Data Policy (https://developers.google.com/terms/api-services-user-data-policy), including the Limited Use requirements.

**Retention & revocation**
Cached Google data is purged within 24 hours of being fetched. OAuth tokens are deleted immediately upon disconnecting your Google account from Articlos or deleting your account entirely. You may revoke access at any time from Settings \u2192 Integrations within Articlos, or directly from your Google Account permissions page at https://myaccount.google.com/permissions.`,
  },
  {
    id: 'ai-processing',
    title: '5. AI Processing of Content',
    body: `Content you submit \u2014 such as keywords, topics, and article drafts \u2014 is processed by our AI infrastructure and third-party AI model providers (e.g., OpenAI, Google) to generate results. We do not send personally identifiable information in content generation requests.

We do not use your submitted content to train shared AI models without your explicit consent.`,
  },
  {
    id: 'third-parties',
    title: '6. Third-Party Services',
    body: `We share data with the following categories of service providers who help us operate the Service:

**Infrastructure & Hosting:** Cloud hosting providers process and store your data. All providers are contractually bound to data protection standards.

**Payment Processing:** We do not use a third-party payment processor. All invoices are paid by direct bank transfer (SEPA or SWIFT).

**Analytics:** We use privacy-respecting analytics to understand product usage. Data is aggregated and anonymised where possible.

**AI Model Providers:** When generating content, your prompts and context are sent to AI model providers subject to their privacy policies. We do not include personally identifiable information in these requests.

**Email Delivery:** We use an email service provider to send transactional and marketing emails.

**Legal & Business Transfers:** We may share information in connection with a business merger, acquisition, or sale of assets, or when required by law or court order.

We do not share your data with advertisers or data brokers.`,
  },
  {
    id: 'data-retention',
    title: '7. Data Retention',
    body: `We retain your account information and content for as long as your account is active. After account deletion, we delete or anonymise your data within 90 days, except where we are required to retain it for legal compliance (e.g., billing records for 7 years).

Generated articles stored in your account are deleted with your account. You may export your content at any time before deletion. Certain data may be retained for legitimate business purposes such as fraud prevention and audit logs.`,
  },
  {
    id: 'security',
    title: '8. Security',
    body: `We implement industry-standard security measures including encryption in transit (TLS), encryption at rest (AES-256), hashed passwords, access controls, and regular security reviews. However, no method of transmission over the internet is 100% secure.

You are responsible for maintaining the security of your account credentials. We recommend using a strong, unique password and enabling two-factor authentication when available.

In the event of a data breach that affects your personal information, we will notify you as required by applicable law.`,
  },
  {
    id: 'your-rights',
    title: '9. Your Rights',
    body: `Depending on your location, you may have the following rights regarding your personal data:

\u2022 **Access:** Request a copy of the personal data we hold about you
\u2022 **Correction:** Request correction of inaccurate or incomplete data
\u2022 **Deletion:** Request deletion of your personal data ("right to be forgotten")
\u2022 **Portability:** Request your data in a machine-readable format
\u2022 **Objection:** Object to certain types of processing, including marketing emails
\u2022 **Restriction:** Request that we limit how we use your data

To exercise any of these rights, contact us at hello@articlos.com. We will respond within 30 days and may need to verify your identity before fulfilling requests.

If you are in the EU/EEA, you also have the right to lodge a complaint with your local data protection authority.`,
  },
  {
    id: 'cookies',
    title: '10. Cookies & Tracking',
    body: `We use cookies and similar tracking technologies to operate and improve the Service:

\u2022 **Essential cookies:** Required for authentication and basic functionality
\u2022 **Analytics cookies:** Used to understand how users interact with the Service (aggregated and anonymised, including Vercel Analytics)
\u2022 **Preference cookies:** Remember your settings and preferences

You can control cookies through your browser settings. Disabling essential cookies may impact Service functionality.`,
  },
  {
    id: 'international',
    title: '11. International Transfers',
    body: `Articlos is operated from the United States. If you are accessing the Service from outside the United States, your data will be transferred to and processed in the United States. We take appropriate measures to ensure that international transfers of personal data comply with applicable data protection laws.`,
  },
  {
    id: 'third-party-links',
    title: '12. Third-Party Links',
    body: `The Service may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites. We encourage you to review the privacy policies of any third-party sites you visit.`,
  },
  {
    id: 'children',
    title: '13. Children\'s Privacy',
    body: `The Service is not directed to children under 13 years of age. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us and we will delete it promptly.`,
  },
  {
    id: 'changes',
    title: '14. Changes to This Policy',
    body: `We may update this Privacy Policy from time to time. We will notify you of significant changes by email or via a prominent notice in the Service. Your continued use of the Service after changes are effective constitutes acceptance of the revised policy.`,
  },
  {
    id: 'contact',
    title: '15. Contact Us',
    body: `For privacy-related questions, requests, or concerns, contact us at hello@articlos.com. For data deletion requests or to exercise your rights, please include your full name, email address, and a description of your request.

PAPINGU L.L.C.`,
  },
]

export default function PrivacyPage() {
  return (
    <>
      <Nav />

      <section style={{ padding: '120px 24px 64px', background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{
            fontSize: 11, fontWeight: 600, color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16,
          }}>
            Articlos &middot; PAPINGU L.L.C.
          </div>
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--text)', marginBottom: 12,
          }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            Last updated: April 24, 2026 &middot; Effective: April 24, 2026
          </p>
        </div>
      </section>

      <section style={{ padding: '64px 24px 96px', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', gap: 56, alignItems: 'flex-start' }} className="privacy-layout">
          {/* TOC */}
          <aside style={{ width: 200, flexShrink: 0, position: 'sticky', top: 90 }} className="privacy-toc">
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
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
                  color: 'var(--text)', marginBottom: 14,
                }}>
                  {s.title}
                </h2>
                {s.body.split('\n\n').map((para, i) => {
                  const isHeading = para.startsWith('**') && para.includes('**\n')
                  if (isHeading) {
                    const [label, ...rest] = para.split('\n')
                    return (
                      <div key={i} style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                          {label.replace(/\*\*/g, '')}
                        </div>
                        <p style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.75 }}>
                          {rest.join('\n')}
                        </p>
                      </div>
                    )
                  }
                  return (
                    <p key={i} style={{
                      fontSize: 15, color: 'var(--text)', lineHeight: 1.75, marginBottom: 14,
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
