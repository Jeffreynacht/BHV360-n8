import NextAuth, { type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

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

        // Demo authentication - replace with real auth logic
        const demoUsers = [
          {
            id: "1",
            email: "admin@bhv360.nl",
            name: "Super Admin",
            role: "SUPER_ADMIN",
          },
          {
            id: "2",
            email: "manager@company.nl",
            name: "BHV Manager",
            role: "CUSTOMER_MANAGER",
          },
        ]

        const user = demoUsers.find((u) => u.email === credentials.email)

        if (user && credentials.password === "demo123") {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
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
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub
        session.user.role = token.role
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
