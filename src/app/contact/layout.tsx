import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact — Let\'s Talk',
  description: 'Have a question, partnership idea, or just want to say hi? Reach out — we\'re a reply away.',
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
