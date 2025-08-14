import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AuthProvider } from "@/contexts/auth-context"
import { CustomerProvider } from "@/components/customer-context"
import { DataProvider } from "@/contexts/data-context"
import ErrorBoundary from "@/components/error-boundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BHV360 - Professional Safety Management",
  description:
    "Complete BHV management system with real-time monitoring, incident management, and compliance reporting",
  keywords: "BHV, safety management, emergency response, incident management, compliance",
  authors: [{ name: "BHV360 Team" }],
  viewport: "width=device-width, initial-scale=1",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <AuthProvider>
              <CustomerProvider>
                <DataProvider>
                  <SidebarProvider>
                    <div className="flex min-h-screen w-full">
                      <AppSidebar />
                      <main className="flex-1 overflow-auto">{children}</main>
                    </div>
                  </SidebarProvider>
                </DataProvider>
              </CustomerProvider>
            </AuthProvider>
            <Toaster />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
