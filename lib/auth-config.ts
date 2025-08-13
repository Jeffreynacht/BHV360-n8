import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
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

        // Jeffrey's hardcoded credentials - SUPER ADMIN
        if (credentials.email === "jeffrey@bhv360.nl" && credentials.password === "jeffrey123") {
          return {
            id: "jeffrey",
            email: "jeffrey@bhv360.nl",
            name: "Jeffrey van der Meer",
            role: "super_admin",
          }
        }

        // Demo credentials - ADMIN
        if (credentials.email === "jan@demobedrijf.nl" && credentials.password === "demo123") {
          return {
            id: "jan",
            email: "jan@demobedrijf.nl",
            name: "Jan de Vries",
            role: "admin",
          }
        }

        // Additional demo user - EMPLOYEE
        if (credentials.email === "marie@demobedrijf.nl" && credentials.password === "marie123") {
          return {
            id: "marie",
            email: "marie@demobedrijf.nl",
            name: "Marie Janssen",
            role: "employee",
          }
        }

        // BHV Coordinator demo
        if (credentials.email === "piet@demobedrijf.nl" && credentials.password === "piet123") {
          return {
            id: "piet",
            email: "piet@demobedrijf.nl",
            name: "Piet van der Berg",
            role: "bhv_coordinator",
          }
        }

        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "user"
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).role = token.role(session.user as any).id = token.id
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development-only",
  debug: false, // Disable debug to prevent console spam
}
