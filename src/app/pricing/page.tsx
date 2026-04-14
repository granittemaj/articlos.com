import type { Metadata } from 'next'
import PricingClient from './PricingClient'

export const metadata: Metadata = {
  title: 'Pricing — Simple Plans for Every Content Team',
  description:
    'AI-powered content intelligence. From solo creators to full autopilot — choose the plan that fits your content strategy. No hidden fees.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'Pricing | articlos',
    description: 'AI-powered content intelligence. From solo creators to full autopilot — no hidden fees.',
    url: 'https://articlos.com/pricing',
  },
}

const pricingJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'articlos',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description: 'AI-powered content intelligence. Discover topics, generate articles, and grow organic traffic automatically.',
  url: 'https://articlos.com',
  offers: [
    {
      '@type': 'Offer',
      name: 'Lite',
      price: '24',
      priceCurrency: 'USD',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '24',
        priceCurrency: 'USD',
        billingDuration: 1,
        billingIncrement: 1,
        unitCode: 'MON',
      },
      description: 'For solo creators getting started with AI content.',
    },
    {
      '@type': 'Offer',
      name: 'Growth',
      price: '79',
      priceCurrency: 'USD',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '79',
        priceCurrency: 'USD',
        billingDuration: 1,
        billingIncrement: 1,
        unitCode: 'MON',
      },
      description: 'For growing content teams that need more volume and automation.',
    },
    {
      '@type': 'Offer',
      name: 'Scale',
      price: '199',
      priceCurrency: 'USD',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '199',
        priceCurrency: 'USD',
        billingDuration: 1,
        billingIncrement: 1,
        unitCode: 'MON',
      },
      description: 'Full autopilot for agencies and high-volume content operations.',
    },
  ],
}

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingJsonLd) }}
      />
      <PricingClient />
    </>
  )
}
