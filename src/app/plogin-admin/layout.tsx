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

  // Middleware enforces authentication for all /plogin-admin/* routes
  // except /plogin-admin/login. When there's no session here, we're on
  // the login page — render children as-is.
  if (!session) {
    return <>{children}</>
  }

  return (
    <SessionProvider session={session}>
      <AdminLayoutComponent>{children}</AdminLayoutComponent>
    </SessionProvider>
  )
}
