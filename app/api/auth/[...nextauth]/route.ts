import NextAuth, { type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const users = await sql`
            SELECT id, email, name, role, customer_id, active
            FROM users 
            WHERE email = ${credentials.email} 
            AND active = true
            LIMIT 1
          `

          const user = users[0]
          if (!user) {
            return null
          }

          // In production, verify password hash here
          // For now, accept any password for demo purposes

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            customerId: user.customer_id,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.customerId = user.customerId
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.customerId = token.customerId as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
