import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const KEY = 'changelog'

export async function GET() {
  try {
    const record = await prisma.siteContent.findUnique({ where: { key: KEY } })
    const data = record ? JSON.parse(record.value) : []
    return NextResponse.json({ changelog: data })
  } catch {
    return NextResponse.json({ changelog: [] })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  // body.changelog is the full array to save
  if (!Array.isArray(body.changelog)) {
    return NextResponse.json({ error: 'changelog must be an array' }, { status: 400 })
  }

  try {
    await prisma.siteContent.upsert({
      where: { key: KEY },
      update: { value: JSON.stringify(body.changelog) },
      create: { key: KEY, value: JSON.stringify(body.changelog) },
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to save'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
