import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/contexts/auth-context"
import { DataProvider } from "@/contexts/data-context"
import { CustomerProvider } from "@/components/customer-context"
import { RoleBasedSidebar } from "@/components/role-based-sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BHV360 - Complete BHV Management Platform",
  description: "Professioneel BHV management platform voor Jeffrey Nachtegaal",
  keywords: "BHV, veiligheid, management, plotkaart, incidenten",
  icons: {
    icon: "/images/bhv360-logo.png",
    apple: "/images/bhv360-logo.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <CustomerProvider>
              <DataProvider>
                <div className="flex h-screen bg-background">
                  <RoleBasedSidebar />
                  <main className="flex-1 overflow-y-auto md:ml-80">{children}</main>
                </div>
                <Toaster />
              </DataProvider>
            </CustomerProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
