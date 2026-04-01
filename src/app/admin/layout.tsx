import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import AdminLayoutComponent from '@/components/AdminLayout'
import SessionProvider from './SessionProvider'

export default async function AdminShellLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  // Middleware (middleware.ts) enforces authentication for all /admin/* routes
  // except /admin/login. When this layout renders without a session, we are on
  // the login page — render children as-is (the login page handles its own UI).
  if (!session) {
    return <>{children}</>
  }

  return (
    <SessionProvider session={session}>
      <AdminLayoutComponent>{children}</AdminLayoutComponent>
    </SessionProvider>
  )
}
