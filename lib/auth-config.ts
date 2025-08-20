import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth" // Correct import for NextAuthOptions
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
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

        // Demo users for testing
        const demoUsers = [
          {
            id: "1",
            email: "admin@bhv360.nl",
            name: "Super Admin",
            role: "SUPER_ADMIN",
            customerId: "1",
          },
          {
            id: "2",
            email: "manager@company.nl",
            name: "BHV Manager",
            role: "CUSTOMER_MANAGER",
            customerId: "2",
          },
          {
            id: "3",
            email: "coordinator@company.nl",
            name: "BHV Coordinator",
            role: "BHV_PLOEGLEIDER",
            customerId: "3",
          },
        ]

        const user = demoUsers.find((u) => u.email === credentials.email)

        if (user && credentials.password === "demo123") {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            customerId: user.customerId,
          }
        }

        return null
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
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
}

export default NextAuth(authOptions)
