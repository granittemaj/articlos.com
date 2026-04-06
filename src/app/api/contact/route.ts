import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, subject, message } = body

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    // Rate limit: one message per email per 30 minutes
    const since = new Date(Date.now() - 30 * 60 * 1000)
    const recent = await prisma.contactMessage.findFirst({
      where: { email: email.trim().toLowerCase(), createdAt: { gte: since } },
      select: { id: true },
    })
    if (recent) {
      return NextResponse.json(
        { error: 'You already sent a message recently. Please wait 30 minutes before sending another.' },
        { status: 429 },
      )
    }

    await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject?.trim() || null,
        message: message.trim(),
      },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
