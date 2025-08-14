"use client"

interface BHV360LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "default" | "white" | "dark"
  showText?: boolean
  className?: string
}

export function BHV360Logo({ size = "md", variant = "default", showText = true, className = "" }: BHV360LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-auto",
    md: "h-10 w-auto",
    lg: "h-12 w-auto",
    xl: "h-16 w-auto",
  }

  // Use the actual BHV360 logo image
  const logoSrc = "/images/bhv360-logo-full.png"

  return (
    <div className={`flex items-center ${className}`}>
      <img src={logoSrc || "/placeholder.svg"} alt="BHV360 Logo" className={`${sizeClasses[size]} object-contain`} />
      {showText && variant !== "default" && (
        <div className="ml-3">
          <div
            className={`font-bold ${variant === "white" ? "text-white" : "text-gray-900"} ${
              size === "sm" ? "text-lg" : size === "md" ? "text-xl" : size === "lg" ? "text-2xl" : "text-3xl"
            }`}
          >
            BHV360
          </div>
          <div className={`text-sm ${variant === "white" ? "text-blue-100" : "text-gray-600"}`}>
            Veiligheid Platform
          </div>
        </div>
      )}
    </div>
  )
}
