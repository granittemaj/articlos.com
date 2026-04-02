import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy — articlos',
  description: 'How articlos uses cookies and similar technologies.',
}

const sections = [
  {
    id: 'what-are-cookies',
    title: '1. What Are Cookies',
    body: `Cookies are small text files placed on your device when you visit a website. They are widely used to make websites work efficiently, remember your preferences, and provide information to site owners.

Similar technologies — such as local storage, session storage, and pixel tags — work in comparable ways and are covered by this policy.`,
  },
  {
    id: 'how-we-use',
    title: '2. How We Use Cookies',
    body: `articlos uses cookies for the following purposes:

**Essential cookies**
These are required for the Service to function. They enable authentication (keeping you logged in), security, and core functionality. You cannot opt out of essential cookies while using the Service.

**Analytics cookies**
We use Google Analytics 4 (GA4) to understand how visitors interact with our website — pages viewed, session duration, traffic sources, and device type. This data is aggregated and anonymised. GA4 sets cookies such as _ga and _gid to distinguish users and sessions.

**Preference cookies**
We store your consent decision (accept/decline) in your browser's localStorage under the key articlos_consent. This is not transmitted to our servers.

**Third-party cookies**
Some of our third-party service providers may also set cookies. These are governed by their own privacy policies.`,
  },
  {
    id: 'specific-cookies',
    title: '3. Cookies We Set',
    body: `**_ga**
Type: Analytics · Duration: 2 years
Set by Google Analytics. Used to distinguish unique users.

**_gid**
Type: Analytics · Duration: 24 hours
Set by Google Analytics. Used to distinguish users within a session.

**_ga_[ID]**
Type: Analytics · Duration: 2 years
Used to persist session state for GA4.

**next-auth.session-token**
Type: Essential · Duration: Session / 30 days
Used to keep you signed in to the articlos admin area. HttpOnly, Secure.

**next-auth.csrf-token**
Type: Essential · Duration: Session
CSRF protection token for authentication flows.

**articlos_consent** (localStorage)
Type: Preference · Duration: Persistent until cleared
Stores your cookie consent choice (accepted or declined).`,
  },
  {
    id: 'google-analytics',
    title: '4. Google Analytics',
    body: `We use Google Analytics 4 to measure how users interact with articlos.com. Google Analytics collects data such as pages visited, time on page, referring URLs, approximate geographic location (country/city level), device and browser type.

This data is processed by Google on servers in the United States. Google acts as a data processor under our instructions and is bound by the Google Measurement Controller-Controller Data Protection Terms.

We have configured GA4 with:
• IP anonymisation enabled
• Data retention set to the minimum available period
• No advertising features or remarketing enabled

You can opt out of Google Analytics tracking across all websites by installing the Google Analytics Opt-out Browser Add-on at tools.google.com/dlpage/gaoptout.`,
  },
  {
    id: 'your-choices',
    title: '5. Your Choices',
    body: `**Consent banner**
When you first visit articlos.com, a consent banner allows you to accept or decline non-essential cookies. Your choice is stored locally and respected on subsequent visits.

**Browser settings**
Most browsers allow you to view, block, or delete cookies through their settings. Blocking essential cookies will prevent the Service from functioning correctly.

**Do Not Track**
We honour Do Not Track (DNT) signals where technically feasible. When DNT is enabled, we disable GA4 analytics for your session.

**Opt-out links**
• Google Analytics opt-out: tools.google.com/dlpage/gaoptout
• Your Online Choices (EU): youronlinechoices.com`,
  },
  {
    id: 'updates',
    title: '6. Updates to This Policy',
    body: `We may update this Cookie Policy when we add new cookies or change how we use existing ones. We will note the date of the most recent revision at the top of this page. For significant changes, we will display a new consent banner.`,
  },
  {
    id: 'contact',
    title: '7. Contact',
    body: `Questions about our use of cookies? Contact us at hello@articlos.com or visit our Privacy Policy at articlos.com/privacy for broader information on how we handle your data.`,
  },
]

export default function CookiesPage() {
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
            Cookie Policy
          </h1>
          <p style={{ fontSize: 14, color: '#9b9b96' }}>
            Last updated: April 2, 2026 · Effective: April 2, 2026
          </p>
        </div>
      </section>

      <section style={{ padding: '64px 24px 96px', background: '#ffffff' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', gap: 56, alignItems: 'flex-start' }} className="privacy-layout">
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
