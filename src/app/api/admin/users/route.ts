import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

async function isAdmin(session: { user?: { email?: string | null; role?: string } } | null): Promise<boolean> {
  if (!session?.user) return false
  // Env-var user is always admin
  if (session.user.email === process.env.ADMIN_EMAIL) return true
  // DB users need admin role
  return (session.user as { role?: string }).role === 'admin'
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!(await isAdmin(session))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const users = await prisma.adminUser.findMany({
    select: { id: true, email: true, name: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ users })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!(await isAdmin(session))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { email, password, name, role } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  }

  if (role && !['admin', 'editor'].includes(role)) {
    return NextResponse.json({ error: 'Role must be "admin" or "editor"' }, { status: 400 })
  }

  // Check if email already exists
  const existing = await prisma.adminUser.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 })
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  const user = await prisma.adminUser.create({
    data: {
      email,
      password: hashedPassword,
      name: name || null,
      role: role || 'editor',
    },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  })

  return NextResponse.json({ user }, { status: 201 })
}
