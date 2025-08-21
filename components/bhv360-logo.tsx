"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"

interface BHV360LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "default" | "white" | "dark"
  showText?: boolean
  className?: string
}

export function BHV360Logo({ size = "md", variant = "default", showText = true, className }: BHV360LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-auto",
    md: "h-10 w-auto",
    lg: "h-12 w-auto",
    xl: "h-16 w-auto",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  }

  return (
    <div className={cn("flex items-center", className)}>
      <Image
        src="/images/bhv360-logo-full.png"
        alt="BHV360 Logo"
        width={200}
        height={60}
        className={cn(sizeClasses[size], "object-contain")}
        priority
      />
      {showText && (
        <div className="ml-3">
          <div
            className={cn(
              "font-bold",
              variant === "white" ? "text-white" : variant === "dark" ? "text-gray-900" : "text-blue-600",
              textSizeClasses[size],
            )}
          >
            BHV360
          </div>
          <div className={cn("text-sm", variant === "white" ? "text-blue-100" : "text-gray-600")}>
            Veiligheid Platform
          </div>
        </div>
      )}
    </div>
  )
}
