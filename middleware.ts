import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default withAuth(
  function middleware(req: NextRequest) {
    const res = NextResponse.next()
    res.headers.set('x-pathname', req.nextUrl.pathname)
    return res
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/admin/login',
    },
  }
)

export const config = {
  // Protect all /admin routes except /admin/login
  matcher: ['/admin/((?!login).*)'],
}
