import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ClientLayout from "./client-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BHV360 - Professional Safety Management Platform",
  description:
    "Complete BHV management system with real-time monitoring, incident management, and compliance reporting. Powered by BHV360's innovative blue and green safety technology.",
  keywords: "BHV360, BHV, safety management, emergency response, incident management, compliance, blue green safety",
  authors: [{ name: "BHV360 Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#2563eb", // Blue-600
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
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
