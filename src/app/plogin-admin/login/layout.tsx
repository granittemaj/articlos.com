import SessionProvider from '../SessionProvider'

// Login page is outside the auth requirement but shares the admin tree
// We pass null session so signIn() from next-auth/react works correctly
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SessionProvider session={null}>{children}</SessionProvider>
}
