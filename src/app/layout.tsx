import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://articlos.com'),
  title: {
    default: 'Articlos — AI Article Generator for SEO',
    template: '%s | Articlos',
  },
  description:
    'Articlos generates SEO-optimised articles, manages your content calendar, and publishes to WordPress — all on autopilot. Powered by GPT-4o and Gemini 1.5 Pro.',
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
    siteName: 'Articlos',
    title: 'Articlos — AI Article Generator for SEO',
    description:
      'Generate SEO-optimised articles automatically. Connect your WordPress site and let AI handle your content calendar.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Articlos — AI Article Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Articlos — AI Article Generator for SEO',
    description:
      'Generate SEO-optimised articles automatically with GPT-4o and Gemini 1.5 Pro.',
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
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
