import type { Metadata } from 'next'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact articlos — Talk to Our Team',
  description: 'Questions about articlos, procurement, partnerships, or security? Reach the team directly at hello@articlos.com or use the form.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact articlos',
    description: 'Reach the articlos team — product questions, procurement, partnerships, and security.',
    url: 'https://articlos.com/contact',
  },
}

export default function ContactPage() {
  return <ContactForm />
}
