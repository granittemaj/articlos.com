import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

async function isAdmin(session: { user?: { email?: string | null; role?: string } } | null): Promise<boolean> {
  if (!session?.user) return false
  if (session.user.email === process.env.ADMIN_EMAIL) return true
  return (session.user as { role?: string }).role === 'admin'
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!(await isAdmin(session))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { name, role, password } = await req.json()

  if (role && !['admin', 'editor'].includes(role)) {
    return NextResponse.json({ error: 'Role must be "admin" or "editor"' }, { status: 400 })
  }

  const data: { name?: string; role?: string; password?: string } = {}
  if (name !== undefined) data.name = name
  if (role !== undefined) data.role = role
  if (password) data.password = await bcrypt.hash(password, 12)

  const user = await prisma.adminUser.update({
    where: { id: params.id },
    data,
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  })

  return NextResponse.json({ user })
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!(await isAdmin(session))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Find the user to delete
  const userToDelete = await prisma.adminUser.findUnique({ where: { id: params.id } })
  if (!userToDelete) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Cannot delete yourself
  if (session.user?.email === userToDelete.email) {
    return NextResponse.json({ error: 'You cannot delete yourself' }, { status: 400 })
  }

  await prisma.adminUser.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
