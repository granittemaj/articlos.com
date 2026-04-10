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

export default function PricingPage() {
  return <PricingClient />
}
