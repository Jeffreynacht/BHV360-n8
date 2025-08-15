"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Monitor,
  Tablet,
  Smartphone,
  ArrowUpWideNarrowIcon as ArrowsHorizontal,
  ImageIcon,
  TrendingUp,
} from "lucide-react"

export function ResponsiveTestIndicator() {
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 })
  const [breakpoint, setBreakpoint] = useState("")
  const [navWidth, setNavWidth] = useState(0)
  const [logoHeight, setLogoHeight] = useState(0)
  const [ratio, setRatio] = useState(0)
  const [consistency, setConsistency] = useState("")

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      setScreenSize({ width, height })

      let currentNavWidth = 0
      let currentLogoHeight = 0
      const targetRatio = 2.5 // Consistent target ratio

      // Calculate proportional values with consistent 2.5:1 ratio
      if (width < 640) {
        setBreakpoint("Mobile (sm)")
        currentLogoHeight = 128
        currentNavWidth = Math.round(currentLogoHeight * targetRatio) // 320px
      } else if (width < 768) {
        setBreakpoint("Small Tablet (md)")
        currentLogoHeight = 144
        currentNavWidth = Math.round(currentLogoHeight * targetRatio) // 360px
      } else if (width < 1024) {
        setBreakpoint("Medium Tablet (lg)")
        currentLogoHeight = 160
        currentNavWidth = Math.round(currentLogoHeight * targetRatio) // 400px
      } else if (width < 1280) {
        setBreakpoint("Large Desktop (xl)")
        currentLogoHeight = 176
        currentNavWidth = Math.round(currentLogoHeight * targetRatio) // 440px
      } else {
        setBreakpoint("Extra Large (2xl)")
        currentLogoHeight = 192
        currentNavWidth = Math.round(currentLogoHeight * targetRatio) // 480px
      }

      setNavWidth(currentNavWidth)
      setLogoHeight(currentLogoHeight)

      const actualRatio = Number((currentNavWidth / currentLogoHeight).toFixed(2))
      setRatio(actualRatio)

      // Check consistency
      const deviation = Math.abs(actualRatio - targetRatio)
      if (deviation < 0.01) {
        setConsistency("Perfect")
      } else if (deviation < 0.05) {
        setConsistency("Excellent")
      } else if (deviation < 0.1) {
        setConsistency("Good")
      } else {
        setConsistency("Needs adjustment")
      }
    }

    updateScreenSize()
    window.addEventListener("resize", updateScreenSize)
    return () => window.removeEventListener("resize", updateScreenSize)
  }, [])

  const getIcon = () => {
    if (screenSize.width < 768) return <Smartphone className="h-4 w-4" />
    if (screenSize.width < 1024) return <Tablet className="h-4 w-4" />
    return <Monitor className="h-4 w-4" />
  }

  const getLogoSize = () => {
    if (screenSize.width < 640) return "Logo: 128px (h-32)"
    if (screenSize.width < 768) return "Logo: 144px (h-36)"
    if (screenSize.width < 1024) return "Logo: 160px (h-40)"
    if (screenSize.width < 1280) return "Logo: 176px (h-44)"
    return "Logo: 192px (h-48)"
  }

  const getDashboardLogoSize = () => {
    if (screenSize.width < 640) return "Dashboard: 80px (h-20)"
    if (screenSize.width < 768) return "Dashboard: 96px (h-24)"
    if (screenSize.width < 1024) return "Dashboard: 112px (h-28)"
    if (screenSize.width < 1280) return "Dashboard: 128px (h-32)"
    return "Dashboard: 144px (h-36)"
  }

  const getColor = () => {
    if (screenSize.width < 640) return "bg-red-100 text-red-800"
    if (screenSize.width < 768) return "bg-orange-100 text-orange-800"
    if (screenSize.width < 1024) return "bg-yellow-100 text-yellow-800"
    if (screenSize.width < 1280) return "bg-green-100 text-green-800"
    return "bg-blue-100 text-blue-800"
  }

  const getConsistencyColor = () => {
    switch (consistency) {
      case "Perfect":
        return "text-green-600"
      case "Excellent":
        return "text-blue-600"
      case "Good":
        return "text-yellow-600"
      default:
        return "text-red-600"
    }
  }

  if (screenSize.width === 0) return null

  return (
    <Card className="fixed top-4 right-4 z-50 shadow-lg">
      <CardContent className="p-3">
        <div className="flex items-center space-x-2 mb-2">
          {getIcon()}
          <Badge className={getColor()}>{breakpoint}</Badge>
        </div>
        <div className="text-xs space-y-1">
          <div className="font-mono">
            {screenSize.width} × {screenSize.height}px
          </div>
          <div className="text-muted-foreground">{getLogoSize()}</div>
          <div className="text-muted-foreground">{getDashboardLogoSize()}</div>
          <div className="flex items-center text-muted-foreground">
            <ArrowsHorizontal className="h-3 w-3 mr-1" />
            <span>Nav: {navWidth}px</span>
          </div>
          <div className="flex items-center text-blue-600 font-medium">
            <ImageIcon className="h-3 w-3 mr-1" />
            <span>Ratio: {ratio}:1</span>
          </div>
          <div className={`flex items-center font-medium ${getConsistencyColor()}`}>
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>{consistency}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
