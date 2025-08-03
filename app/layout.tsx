import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { OfflineIndicator } from "@/components/offline-indicator"
import { CustomerProvider } from "@/components/customer-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "BHV360",
  description: "BHV360 - Bedrijfshulpverlening overzicht",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <CustomerProvider>
              <OfflineIndicator />
              {children}
              <Toaster />
            </CustomerProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
