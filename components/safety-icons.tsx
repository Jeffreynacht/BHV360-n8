import Image from "next/image"

export interface SafetyIconProps {
  iconType: string
  size?: number
  className?: string
}

const iconMap: Record<string, string> = {
  brandblusser: "/images/fire-extinguisher-symbol.png",
  nooduitgang: "/images/emergency-exit-green.png",
  ehbo: "/images/medical-cross.png",
  aed: "/images/aed-heart.png",
  verzamelplaats: "/images/assembly-point-people.png",
  brandmelder: "/images/fire-alarm-symbol.png",
  noodtelefoon: "/images/emergency-phone.png",
  brandslang: "/images/fire-hose-symbol.png",
  branddeken: "/images/fire-blanket.png",
  noodstop: "/images/emergency-stop.png",
  oogdouche: "/images/eye-wash-station.png",
  nooddouche: "/images/emergency-shower.png",
  brandkraan: "/images/fire-hydrant.png",
  noodverlichting: "/images/emergency-torch.png",
  evacuatiepijl: "/images/evacuation-arrow-green.png",
  richtingpijl: "/images/direction-arrow-simple.png",
  "bhv-helm": "/images/bhv-helmet.png",
  veiligheidshandschoenen: "/images/safety-gloves.png",
  veiligheidsvest: "/images/safety-vest.png",
  veiligheidsharnas: "/images/safety-harness.png",
  gasklep: "/images/gas-valve.png",
  waterklep: "/images/water-valve.png",
  sprinkler: "/images/sprinkler-symbol.png",
  brandweerverbinding: "/images/fire-suppression-nozzle.png",
  noodoproep: "/images/emergency-call-button.png",
  omroepinstallatie: "/images/public-address.png",
  brandalarm: "/images/fire-alarm-horn.png",
  "elektrisch-gevaar": "/images/electrical-hazard.png",
  "geen-lift": "/images/no-elevator.png",
  "geen-open-vuur": "/images/no-open-flames.png",
  "geen-heftrucks": "/images/no-forklifts.png",
  "ehbo-verlener": "/images/first-aid-provider.png",
  brancard: "/images/medical-stretcher.png",
  "medisch-transport": "/images/medical-transport.png",
  "mobiele-blusser": "/images/mobile-fire-extinguisher.png",
  brandgordijn: "/images/fire-curtain.png",
  branddeur: "/images/fire-door-symbol.png",
  branduitrusting: "/images/fire-equipment.png",
  "klasse-b-blusser": "/images/class-b-extinguisher.png",
  "toegankelijke-uitgang": "/images/accessible-exit.png",
  "uitgang-omhoog": "/images/exit-up-arrow.png",
  "bmc-symbool": "/images/bmc-symbol.png",
  "branddeken-gebruik": "/images/fire-blanket-usage.png",
  "richtingpijl-rood": "/images/direction-arrow-red.png",
}

export function SafetyIcon({ iconType, size = 24, className = "" }: SafetyIconProps) {
  const iconPath = iconMap[iconType]

  if (!iconPath) {
    return (
      <div
        className={`bg-gray-200 rounded flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-xs text-gray-500">?</span>
      </div>
    )
  }

  return (
    <Image
      src={iconPath || "/placeholder.svg"}
      alt={iconType}
      width={size}
      height={size}
      className={`object-contain ${className}`}
    />
  )
}

export default SafetyIcon
