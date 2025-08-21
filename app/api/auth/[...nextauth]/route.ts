import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
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

        // Demo accounts for testing
        const demoAccounts = [
          {
            id: "1",
            email: "admin@bhv360.nl",
            password: "admin123",
            name: "BHV360 Admin",
            role: "admin",
          },
          {
            id: "2",
            email: "demo@bhv360.nl",
            password: "demo123",
            name: "Demo User",
            role: "user",
          },
          {
            id: "3",
            email: "test@bhv360.nl",
            password: "test123",
            name: "Test User",
            role: "user",
          },
        ]

        const user = demoAccounts.find(
          (account) => account.email === credentials.email && account.password === credentials.password,
        )

        if (user) {
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
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
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
})

export { handler as GET, handler as POST }
