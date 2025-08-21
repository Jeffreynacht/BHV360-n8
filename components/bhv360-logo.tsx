"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface BHV360LogoProps {
  className?: string
  width?: number
  height?: number
  variant?: "full" | "icon" | "text"
  priority?: boolean
}

export function BHV360Logo({
  className,
  width = 200,
  height = 80,
  variant = "full",
  priority = false,
}: BHV360LogoProps) {
  const getLogoSrc = () => {
    switch (variant) {
      case "icon":
        return "/images/bhv360-logo.png"
      case "full":
        return "/images/bhv360-logo-full.png"
      case "text":
        return "/images/bhv360-logo-full.png"
      default:
        return "/images/bhv360-logo-full.png"
    }
  }

  const getAltText = () => {
    switch (variant) {
      case "icon":
        return "BHV360 Icon"
      case "full":
        return "BHV360 - Professionele BHV Software"
      case "text":
        return "BHV360"
      default:
        return "BHV360 Logo"
    }
  }

  return (
    <div className={cn("flex items-center", className)}>
      <Image
        src={getLogoSrc() || "/placeholder.svg"}
        alt={getAltText()}
        width={width}
        height={height}
        className={cn(
          "object-contain",
          variant === "icon" && "h-8 w-8",
          variant === "full" && "h-12 w-auto max-w-[200px]",
          variant === "text" && "h-10 w-auto",
        )}
        priority={priority}
      />
    </div>
  )
}

export default BHV360Logo
