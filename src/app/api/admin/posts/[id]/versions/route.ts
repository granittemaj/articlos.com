import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface Params {
  params: { id: string }
}

export async function GET(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const versions = await prisma.postVersion.findMany({
      where: { postId: params.id },
      orderBy: { savedAt: 'desc' },
      take: 10,
      select: { id: true, title: true, excerpt: true, savedAt: true, content: true },
    })
    return NextResponse.json({ versions })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch versions' }, { status: 500 })
  }
}
