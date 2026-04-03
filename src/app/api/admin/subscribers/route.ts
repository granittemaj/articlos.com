import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function checkAdmin() {
  const session = await getServerSession(authOptions)
  return !!session?.user
}

export async function GET() {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ subscribers })
  } catch (error) {
    console.error('Error fetching subscribers:', error)
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    await prisma.newsletterSubscriber.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete subscriber' }, { status: 500 })
  }
}
