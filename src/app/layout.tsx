import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { Analytics } from '@vercel/analytics/next'
import ConsentBanner from '@/components/ConsentBanner'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import './globals.css'


export const metadata: Metadata = {
  metadataBase: new URL('https://articlos.com'),
  title: {
    default: 'articlos — The Content Intelligence System That Never Stops',
    template: '%s | articlos',
  },
  description:
    'The content intelligence system that never stops. articlos discovers what to write, generates high-quality articles, and grows your organic traffic — automatically.',
  keywords: [
    'AI article generator',
    'SEO content automation',
    'WordPress auto-publish',
    'AI writing tool',
    'content marketing automation',
    'SEO articles',
  ],
  authors: [{ name: 'PAPINGU L.L.C.' }],
  creator: 'PAPINGU L.L.C.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://articlos.com',
    siteName: 'articlos',
    title: 'articlos — The Content Intelligence System That Never Stops',
    description:
      'The content intelligence system that never stops. Discover what to write, generate high-quality articles, and grow your organic traffic — automatically.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'articlos — AI Article Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'articlos — The Content Intelligence System That Never Stops',
    description:
      'The content intelligence system that never stops. AI-powered article generation for content teams that want to rank.',
    creator: '@articlos',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="theme-color" content="#0f0f0e" />
        {/* Anti-FOUC: apply theme before first paint */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.setAttribute('data-theme','dark')}}catch(e){}})()` }} />
      </head>
      <body>
        {children}
        <GoogleAnalytics />
        <Analytics />
        <ConsentBanner />
      </body>
    </html>
  )
}
