import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD

        if (!adminEmail || !adminPassword) {
          console.error('ADMIN_EMAIL or ADMIN_PASSWORD not set in environment')
          return null
        }

        if (credentials.email !== adminEmail) {
          return null
        }

        // Support both plain text and bcrypt hashed passwords
        let passwordMatch = false
        if (adminPassword.startsWith('$2b$') || adminPassword.startsWith('$2a$')) {
          passwordMatch = await bcrypt.compare(credentials.password, adminPassword)
        } else {
          passwordMatch = credentials.password === adminPassword
        }

        if (!passwordMatch) {
          return null
        }

        return {
          id: '1',
          email: adminEmail,
          name: 'Admin',
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { id?: string }).id = token.id as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
