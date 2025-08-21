export interface SafetyIconProps {
  iconType: string
  size?: number
  className?: string
}

export function SafetyIcon({ iconType, size = 24, className = "" }: SafetyIconProps) {
  const iconPath = `/images/${iconType}.png`

  return (
    <img
      src={iconPath || "/placeholder.svg"}
      alt={iconType}
      width={size}
      height={size}
      className={className}
      onError={(e) => {
        // Fallback to a default icon if the specific icon is not found
        const target = e.target as HTMLImageElement
        target.src = "/placeholder.svg"
      }}
    />
  )
}

export default SafetyIcon
