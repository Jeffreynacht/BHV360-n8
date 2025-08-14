"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { ErrorBoundary } from "react-error-boundary"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { DataProvider } from "@/contexts/data-context"
import { CustomerProvider } from "@/components/customer-context"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { BHV360Header } from "@/components/bhv360-header"

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Er is iets misgegaan</h2>
        <p className="text-gray-600 mb-4">
          {error.message || "Er is een onverwachte fout opgetreden. Probeer het opnieuw."}
        </p>
        <button
          onClick={resetErrorBoundary}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Probeer opnieuw
        </button>
      </div>
    </div>
  )
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Pages that should not show the sidebar
  const noSidebarPages = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/contact",
    "/about",
    "/pricing",
    "/features",
    "/privacy",
    "/terms",
  ]

  const showSidebar = !noSidebarPages.includes(pathname)

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <AuthProvider>
          <DataProvider>
            <CustomerProvider>
              {showSidebar ? (
                <SidebarProvider>
                  <div className="flex min-h-screen w-full">
                    <AppSidebar />
                    <div className="flex-1 flex flex-col">
                      <BHV360Header />
                      <main className="flex-1 p-6 bg-gray-50">{children}</main>
                    </div>
                  </div>
                </SidebarProvider>
              ) : (
                <div className="min-h-screen bg-gray-50">{children}</div>
              )}
              <Toaster />
            </CustomerProvider>
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
