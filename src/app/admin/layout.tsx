import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import AdminLayoutComponent from '@/components/AdminLayout'
import SessionProvider from './SessionProvider'

export default async function AdminShellLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Middleware handles redirecting unauthenticated users away from admin
  // (except /admin/login which is excluded in middleware config)
  const session = await getServerSession(authOptions)

  // If no session, render children as-is (login page handles its own UI)
  if (!session) {
    return <>{children}</>
  }

  return (
    <SessionProvider session={session}>
      <AdminLayoutComponent>{children}</AdminLayoutComponent>
    </SessionProvider>
  )
}
