import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

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

        // 1. Check the database for an AdminUser matching the email
        try {
          const dbUser = await prisma.adminUser.findUnique({
            where: { email: credentials.email },
          })

          if (dbUser) {
            const passwordMatch = await bcrypt.compare(credentials.password, dbUser.password)
            if (!passwordMatch) {
              return null
            }
            return {
              id: dbUser.id,
              email: dbUser.email,
              name: dbUser.name || 'Admin',
              role: dbUser.role,
            }
          }
        } catch {
          // If DB is not available or table doesn't exist yet, fall through to env var check
        }

        // 2. Fall back to env var check for backwards compatibility
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
          role: 'admin',
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/plogin-admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role || 'admin'
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { id?: string; role?: string }).id = token.id as string;
        (session.user as { id?: string; role?: string }).role = token.role as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
