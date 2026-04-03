import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email?.trim()) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    // Save subscriber locally regardless of Brevo
    try {
      await prisma.newsletterSubscriber.upsert({
        where: { email: email.trim().toLowerCase() },
        update: {},
        create: { email: email.trim().toLowerCase() },
      })
    } catch {
      // Non-fatal — continue even if local save fails
    }

    const apiKey = process.env.BREVO_API_KEY
    if (!apiKey) {
      console.warn('[Newsletter] BREVO_API_KEY not set — skipping Brevo call')
      return NextResponse.json({ success: true })
    }

    const listId = process.env.BREVO_LIST_ID ? parseInt(process.env.BREVO_LIST_ID, 10) : undefined

    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        ...(listId ? { listIds: [listId] } : {}),
        updateEnabled: true,
      }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      // 204 / already exists is fine
      if (res.status !== 204 && data?.code !== 'duplicate_parameter') {
        console.error('[Newsletter] Brevo error:', data)
        return NextResponse.json({ error: 'Could not subscribe. Please try again.' }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
