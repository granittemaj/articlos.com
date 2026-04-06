import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const form = await req.formData()
  const file = form.get('file') as File | null

  if (!file || !file.name) {
    return NextResponse.json({ error: 'No file provided.' }, { status: 400 })
  }

  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: 'Only JPEG, PNG, WebP, GIF, and AVIF images are allowed.' }, { status: 400 })
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File size must be under 5 MB.' }, { status: 400 })
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    return NextResponse.json(
      { error: 'Image upload is not configured yet. Please add a URL directly, or set BLOB_READ_WRITE_TOKEN in your environment variables.' },
      { status: 503 }
    )
  }

  try {
    const { put } = await import('@vercel/blob')
    const safeName = file.name.replace(/\s+/g, '-').toLowerCase()
    const blob = await put(`blog/${Date.now()}-${safeName}`, file, { access: 'public', token })
    return NextResponse.json({ url: blob.url })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
