import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/plogin-admin/login',
  },
})

export const config = {
  matcher: ['/plogin-admin', '/plogin-admin/((?!login).*)'],
}
