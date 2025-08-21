import NextAuth, { type NextAuthOptions } from "next-auth"
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
        if (credentials?.email && credentials?.password) {
          // In production, validate against your database
          if (credentials.email === "admin@bhv360.nl" && credentials.password === "admin123") {
            return {
              id: "1",
              email: credentials.email,
              name: "BHV Admin",
              role: "super_admin",
            }
          }
          if (credentials.email === "demo@bhv360.nl" && credentials.password === "demo123") {
            return {
              id: "2",
              email: credentials.email,
              name: "Demo User",
              role: "customer_admin",
            }
          }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
