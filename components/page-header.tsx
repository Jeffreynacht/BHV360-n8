"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Home } from "lucide-react"
import { useRouter } from "next/navigation"

interface PageHeaderProps {
  title: string
  description?: string
  showBackButton?: boolean
  backUrl?: string
  showHomeButton?: boolean
  children?: React.ReactNode
}

export function PageHeader({
  title,
  description,
  showBackButton = false,
  backUrl,
  showHomeButton = false,
  children,
}: PageHeaderProps) {
  const router = useRouter()

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl)
    } else {
      router.back()
    }
  }

  const handleHome = () => {
    router.push("/dashboard")
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Button variant="outline" size="sm" onClick={handleBack} className="flex items-center gap-2 bg-transparent">
            <ArrowLeft className="h-4 w-4" />
            Terug
          </Button>
        )}
        {showHomeButton && (
          <Button variant="outline" size="sm" onClick={handleHome} className="flex items-center gap-2 bg-transparent">
            <Home className="h-4 w-4" />
            Dashboard
          </Button>
        )}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}
