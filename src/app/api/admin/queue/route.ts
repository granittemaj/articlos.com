import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/admin/queue — list all queued topics
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const topics = await prisma.topicQueue.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ topics })
}

// POST /api/admin/queue — add topics to queue
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: {
    topics: { title: string; keyword: string; intent?: string; difficulty?: string; why?: string }[]
    niche?: string
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.topics || !Array.isArray(body.topics) || body.topics.length === 0) {
    return NextResponse.json({ error: 'topics array is required' }, { status: 400 })
  }

  const created = await prisma.topicQueue.createMany({
    data: body.topics.map((t) => ({
      title: t.title,
      keyword: t.keyword,
      intent: t.intent ?? null,
      difficulty: t.difficulty ?? null,
      why: t.why ?? null,
      niche: body.niche ?? null,
      status: 'queued',
    })),
  })

  return NextResponse.json({ added: created.count })
}

// DELETE /api/admin/queue — delete queued topics by IDs
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { ids: string[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.ids || !Array.isArray(body.ids) || body.ids.length === 0) {
    return NextResponse.json({ error: 'ids array is required' }, { status: 400 })
  }

  const deleted = await prisma.topicQueue.deleteMany({
    where: { id: { in: body.ids } },
  })

  return NextResponse.json({ deleted: deleted.count })
}
