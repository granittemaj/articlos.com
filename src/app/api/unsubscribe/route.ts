import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  let email: string
  try {
    const body = await req.json()
    email = body.email?.trim().toLowerCase()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  // Remove from local DB
  try {
    await prisma.newsletterSubscriber.delete({ where: { email } })
  } catch {
    // Not found — already unsubscribed, that's fine
  }

  // Remove from Brevo
  const apiKey = process.env.BREVO_API_KEY
  if (apiKey) {
    await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
      method: 'DELETE',
      headers: { 'api-key': apiKey, Accept: 'application/json' },
    }).catch(() => {})
  }

  return NextResponse.json({ success: true })
}
