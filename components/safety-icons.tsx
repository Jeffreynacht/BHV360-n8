"use client"

import Image from "next/image"
import { useState } from "react"
import { AlertTriangle } from "lucide-react"

interface SafetyIconProps {
  src: string
  alt: string
  size?: number
  className?: string
}

export function SafetyIcon({ src, alt, size = 32, className = "" }: SafetyIconProps) {
  const [imageError, setImageError] = useState(false)

  if (imageError) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 rounded ${className}`}
        style={{ width: size, height: size }}
      >
        <AlertTriangle className="h-4 w-4 text-gray-400" />
      </div>
    )
  }

  return (
    <Image
      src={src || "/placeholder.svg"}
      alt={alt}
      width={size}
      height={size}
      className={`rounded ${className}`}
      onError={() => setImageError(true)}
    />
  )
}

// Predefined safety icons
export const SafetyIcons = {
  FireExtinguisher: (props: Omit<SafetyIconProps, "src" | "alt">) => (
    <SafetyIcon src="/images/fire-extinguisher-symbol.png" alt="Brandblusser" {...props} />
  ),
  EmergencyExit: (props: Omit<SafetyIconProps, "src" | "alt">) => (
    <SafetyIcon src="/images/emergency-exit-green.png" alt="Nooduitgang" {...props} />
  ),
  FirstAid: (props: Omit<SafetyIconProps, "src" | "alt">) => (
    <SafetyIcon src="/images/medical-cross.png" alt="EHBO" {...props} />
  ),
  AED: (props: Omit<SafetyIconProps, "src" | "alt">) => <SafetyIcon src="/images/aed-heart.png" alt="AED" {...props} />,
  AssemblyPoint: (props: Omit<SafetyIconProps, "src" | "alt">) => (
    <SafetyIcon src="/images/assembly-point-people.png" alt="Verzamelpunt" {...props} />
  ),
  FireAlarm: (props: Omit<SafetyIconProps, "src" | "alt">) => (
    <SafetyIcon src="/images/fire-alarm-symbol.png" alt="Brandmelder" {...props} />
  ),
  EmergencyPhone: (props: Omit<SafetyIconProps, "src" | "alt">) => (
    <SafetyIcon src="/images/emergency-phone.png" alt="Noodtelefoon" {...props} />
  ),
  FireBlanket: (props: Omit<SafetyIconProps, "src" | "alt">) => (
    <SafetyIcon src="/images/fire-blanket.png" alt="Branddeken" {...props} />
  ),
  EyeWash: (props: Omit<SafetyIconProps, "src" | "alt">) => (
    <SafetyIcon src="/images/eye-wash-station.png" alt="Oogdouche" {...props} />
  ),
  EmergencyShower: (props: Omit<SafetyIconProps, "src" | "alt">) => (
    <SafetyIcon src="/images/emergency-shower.png" alt="Nooddouche" {...props} />
  ),
}

// Icon categories for the plotkaart editor
export const SafetyIconCategories = {
  fire: {
    name: "Brand & Blusmiddelen",
    icons: [
      { key: "fire-extinguisher", src: "/images/fire-extinguisher-symbol.png", alt: "Brandblusser" },
      { key: "fire-blanket", src: "/images/fire-blanket.png", alt: "Branddeken" },
      { key: "fire-hose", src: "/images/fire-hose-symbol.png", alt: "Brandslang" },
      { key: "fire-alarm", src: "/images/fire-alarm-symbol.png", alt: "Brandmelder" },
      { key: "sprinkler", src: "/images/sprinkler-symbol.png", alt: "Sprinkler" },
    ],
  },
  emergency: {
    name: "Nooduitgangen & Evacuatie",
    icons: [
      { key: "emergency-exit", src: "/images/emergency-exit-green.png", alt: "Nooduitgang" },
      { key: "exit-arrow", src: "/images/evacuation-arrow-green.png", alt: "Evacuatiepijl" },
      { key: "assembly-point", src: "/images/assembly-point-people.png", alt: "Verzamelpunt" },
      { key: "emergency-torch", src: "/images/emergency-torch.png", alt: "Noodverlichting" },
    ],
  },
  medical: {
    name: "Medische Hulp",
    icons: [
      { key: "first-aid", src: "/images/medical-cross.png", alt: "EHBO" },
      { key: "aed", src: "/images/aed-heart.png", alt: "AED" },
      { key: "stretcher", src: "/images/medical-stretcher.png", alt: "Brancard" },
      { key: "eye-wash", src: "/images/eye-wash-station.png", alt: "Oogdouche" },
      { key: "emergency-shower", src: "/images/emergency-shower.png", alt: "Nooddouche" },
    ],
  },
  communication: {
    name: "Communicatie",
    icons: [
      { key: "emergency-phone", src: "/images/emergency-phone.png", alt: "Noodtelefoon" },
      { key: "emergency-button", src: "/images/emergency-call-button.png", alt: "Noodknop" },
      { key: "public-address", src: "/images/public-address.png", alt: "Omroep" },
    ],
  },
  safety: {
    name: "Veiligheidsuitrusting",
    icons: [
      { key: "safety-helmet", src: "/images/bhv-helmet.png", alt: "Veiligheidshelm" },
      { key: "safety-vest", src: "/images/safety-vest.png", alt: "Veiligheidsvest" },
      { key: "safety-gloves", src: "/images/safety-gloves.png", alt: "Veiligheidshandschoenen" },
      { key: "safety-harness", src: "/images/safety-harness.png", alt: "Veiligheidsharnas" },
    ],
  },
  utilities: {
    name: "Voorzieningen",
    icons: [
      { key: "water-valve", src: "/images/water-valve.png", alt: "Waterafsluiter" },
      { key: "gas-valve", src: "/images/gas-valve.png", alt: "Gasafsluiter" },
      { key: "emergency-stop", src: "/images/emergency-stop.png", alt: "Noodstop" },
      { key: "electrical-hazard", src: "/images/electrical-hazard.png", alt: "Elektrisch gevaar" },
    ],
  },
}
