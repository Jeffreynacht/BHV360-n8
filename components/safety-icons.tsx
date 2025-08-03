import type React from "react"
import { Flame, ShieldCheck, Heart, Phone, Zap, Droplets, Eye, Volume2 } from "lucide-react"

type IconType =
  | "fire-extinguisher"
  | "fire-hose"
  | "sprinkler"
  | "fire-door"
  | "bmc"
  | "mobile-fire-extinguisher"
  | "fire-curtain"
  | "fire-suppression-nozzle"
  | "fire-blanket"
  | "class-b-extinguisher"
  | "fire-alarm-horn"
  | "fire-blanket-usage"
  | "emergency-phone"
  | "fire-hydrant"
  | "emergency-exit-green"
  | "direction-arrow-red"
  | "direction-arrow-simple"
  | "safety-vest"
  | "fire-equipment"
  | "water-valve"
  | "electrical-hazard"
  | "gas-valve"
  | "public-address"
  | "emergency-stop"
  | "emergency-torch"
  | "evacuation-arrow-green"
  | "exit-up-arrow"
  | "assembly-point-people"
  | "accessible-exit"
  | "emergency-call-button"
  | "medical-stretcher"
  | "medical-cross"
  | "eye-wash-station"
  | "medical-transport"
  | "first-aid-provider"
  | "aed-heart"
  | "emergency-shower"
  | "bhv-helmet"
  | "safety-gloves"
  | "safety-harness"
  | "no-elevator"
  | "no-open-flames"
  | "no-forklifts"
  | "evacuation-chair"
  | "emergency-exit"
  | "assembly-point"
  | "first-aid"
  | "aed"
  | "emergency-button"
  | "evacuation-route"
  | "fire-alarm"
  | "drag-mattress"
  | "dry-riser"
  | "a-first-aid"
  | "auto-gas"
  | "mobile-extinguisher"
  | "smoke-screens"
  | "bhv-kit"
  | "yellow-first-aid"
  | "red-bhv-bag"

interface SafetyIconProps {
  type: IconType
  size?: number
  className?: string
}

export const SafetyIcon: React.FC<SafetyIconProps> = ({ type, size = 32, className }) => {
  switch (type) {
    case "fire-extinguisher":
      return (
        <img
          src="/images/fire-extinguisher-symbol.png"
          alt="Brandblusser"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "fire-hose":
      return (
        <img
          src="/images/fire-hose-symbol.png"
          alt="Brandslanghaspel"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "fire-alarm":
      return (
        <img
          src="/images/fire-alarm-symbol.png"
          alt="Handmelder"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "sprinkler":
      return (
        <img
          src="/images/sprinkler-symbol.png"
          alt="Sprinklerinstallatie"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "fire-door":
      return (
        <img
          src="/images/fire-door-symbol.png"
          alt="Brandwerende deur"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "bmc":
      return (
        <img
          src="/images/bmc-symbol.png"
          alt="Brand Meld Centrale"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "mobile-fire-extinguisher":
      return (
        <img
          src="/images/mobile-fire-extinguisher.png"
          alt="Verrijdbare brandblusser"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "fire-curtain":
      return (
        <img
          src="/images/fire-curtain.png"
          alt="Brandscherm"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "fire-suppression-nozzle":
      return (
        <img
          src="/images/fire-suppression-nozzle.png"
          alt="Blusinstallatie mondstuk"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "fire-blanket":
      return (
        <img
          src="/images/fire-blanket.png"
          alt="Blusdeken"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "class-b-extinguisher":
      return (
        <img
          src="/images/class-b-extinguisher.png"
          alt="Klasse B brandblusser"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "fire-alarm-horn":
      return (
        <img
          src="/images/fire-alarm-horn.png"
          alt="Brandalarmsirene"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "fire-blanket-usage":
      return (
        <img
          src="/images/fire-blanket-usage.png"
          alt="Blusdeken gebruik"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "emergency-phone":
      return (
        <img
          src="/images/emergency-phone.png"
          alt="Noodtelefoon"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "fire-hydrant":
      return (
        <img
          src="/images/fire-hydrant.png"
          alt="Brandkraan"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "emergency-exit-green":
      return (
        <img
          src="/images/emergency-exit-green.png"
          alt="Nooduitgang (groen)"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "direction-arrow-red":
      return (
        <img
          src="/images/direction-arrow-red.png"
          alt="Richtingspijl (rood)"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "direction-arrow-simple":
      return (
        <img
          src="/images/direction-arrow-simple.png"
          alt="Richtingspijl (eenvoudig)"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "safety-vest":
      return (
        <img
          src="/images/safety-vest.png"
          alt="Veiligheidsvest"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "fire-equipment":
      return (
        <img
          src="/images/fire-equipment.png"
          alt="Brandweermateriaal"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "water-valve":
      return (
        <img
          src="/images/water-valve.png"
          alt="Waterafsluiter"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "electrical-hazard":
      return (
        <img
          src="/images/electrical-hazard.png"
          alt="Elektrisch gevaar"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "gas-valve":
      return (
        <img
          src="/images/gas-valve.png"
          alt="Gasafsluiter"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "public-address":
      return (
        <img
          src="/images/public-address.png"
          alt="Omroepinstallatie"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "emergency-stop":
      return (
        <img
          src="/images/emergency-stop.png"
          alt="Noodstop"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "emergency-torch":
      return (
        <img
          src="/images/emergency-torch.png"
          alt="Noodverlichting"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "evacuation-arrow-green":
      return (
        <img
          src="/images/evacuation-arrow-green.png"
          alt="Evacuatiepijl (groen)"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "exit-up-arrow":
      return (
        <img
          src="/images/exit-up-arrow.png"
          alt="Uitgang omhoog"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "assembly-point-people":
      return (
        <img
          src="/images/assembly-point-people.png"
          alt="Verzamelpunt personen"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "accessible-exit":
      return (
        <img
          src="/images/accessible-exit.png"
          alt="Toegankelijke uitgang"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "emergency-call-button":
      return (
        <img
          src="/images/emergency-call-button.png"
          alt="Noodoproepknop"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "medical-stretcher":
      return (
        <img
          src="/images/medical-stretcher.png"
          alt="Brancard"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "medical-cross":
      return (
        <img
          src="/images/medical-cross.png"
          alt="Medisch kruis"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "eye-wash-station":
      return (
        <img
          src="/images/eye-wash-station.png"
          alt="Oogdouche"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "medical-transport":
      return (
        <img
          src="/images/medical-transport.png"
          alt="Medisch transport"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "first-aid-provider":
      return (
        <img
          src="/images/first-aid-provider.png"
          alt="EHBO-verlener"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "aed-heart":
      return (
        <img
          src="/images/aed-heart.png"
          alt="AED (hart)"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "emergency-shower":
      return (
        <img
          src="/images/emergency-shower.png"
          alt="Nooddouche"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "bhv-helmet":
      return (
        <img
          src="/images/bhv-helmet.png"
          alt="BHV-helm"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "safety-gloves":
      return (
        <img
          src="/images/safety-gloves.png"
          alt="Veiligheidshandschoenen"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "safety-harness":
      return (
        <img
          src="/images/safety-harness.png"
          alt="Veiligheidsharnas"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "no-elevator":
      return (
        <img
          src="/images/no-elevator.png"
          alt="Lift verboden"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "no-open-flames":
      return (
        <img
          src="/images/no-open-flames.png"
          alt="Open vuur verboden"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    case "no-forklifts":
      return (
        <img
          src="/images/no-forklifts.png"
          alt="Heftrucks verboden"
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain" }}
        />
      )
    // Keep all the existing SVG cases for other icons
    case "evacuation-chair":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className}>
          <path fill="#4CAF50" d="M8,8h8v8H8z" />
          <circle fill="#FFF" cx="12" cy="6" r="2" />
          <path fill="#FFF" d="M10,8v8 M14,8v8" />
          <path fill="#FFF" d="M8,12h8" />
          <circle fill="#333" cx="8" cy="18" r="2" />
          <circle fill="#333" cx="16" cy="18" r="2" />
        </svg>
      )
    case "emergency-exit":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className}>
          <rect fill="#4CAF50" x="2" y="4" width="20" height="16" rx="1" />
          <path fill="#FFF" d="M16,12l-4,4v-2H7v-4h5V8L16,12z" />
          <path fill="#FFF" d="M16,7v10" />
        </svg>
      )
    case "assembly-point":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className}>
          <circle fill="#4CAF50" cx="12" cy="12" r="10" />
          <path
            fill="#FFF"
            d="M12,6c-3.3,0-6,2.7-6,6s2.7,6,6,6s6-2.7,6-6S15.3,6,12,6z M12,16c-2.2,0-4-1.8-4-4s1.8-4,4-4s4,1.8,4,4S14.2,16,12,16z"
          />
          <circle fill="#FFF" cx="12" cy="12" r="1" />
          <path fill="#FFF" d="M12,7v2 M12,15v2 M7,12h2 M15,12h2" />
        </svg>
      )
    case "first-aid":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className}>
          <rect fill="#FFF" x="4" y="6" width="16" height="12" rx="1" stroke="#FF4136" strokeWidth="2" />
          <path fill="#FF4136" d="M10,9h4v2h2v2h-2v2h-4v-2H8v-2h2z" />
        </svg>
      )
    case "aed":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className}>
          <rect fill="#FF4136" x="4" y="6" width="16" height="12" rx="1" />
          <path fill="#FFF" d="M7,9h10v6H7z" />
          <text x="8" y="14" fontSize="4" fill="#FF4136" fontWeight="bold">
            AED
          </text>
          <path fill="#FF4136" d="M12,10v4 M10,12h4" />
        </svg>
      )
    case "emergency-button":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className}>
          <circle fill="#FF4136" cx="12" cy="12" r="8" />
          <circle fill="#FFF" cx="12" cy="12" r="6" />
          <circle fill="#FF4136" cx="12" cy="12" r="4" />
        </svg>
      )
    case "evacuation-route":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className}>
          <rect fill="#4CAF50" x="2" y="6" width="20" height="12" rx="1" />
          <path fill="#FFF" d="M5,12h12l-4-4v8z" />
        </svg>
      )
    case "drag-mattress":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className}>
          <rect fill="#6699CC" x="2" y="8" width="20" height="10" rx="1" />
          <path fill="#FFF" d="M4,10h16v6H4z" />
          <path fill="#333" d="M7,8V6 M17,8V6" />
          <path fill="#333" d="M7,18v2 M17,18v2" />
          <path fill="#333" d="M12,10c0,0-2,2-2,4s2,4,2,4" />
        </svg>
      )
    case "dry-riser":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className}>
          <rect fill="#FF4136" x="6" y="2" width="12" height="20" rx="1" />
          <circle fill="#FFF" cx="12" cy="8" r="2" />
          <circle fill="#FFF" cx="12" cy="16" r="2" />
          <path fill="#333" d="M12,8v8" />
          <path fill="#333" d="M9,12h6" />
        </svg>
      )
    case "a-first-aid":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className}>
          <rect fill="#FFF" x="3" y="5" width="18" height="14" rx="1" />
          <path fill="#FF4136" d="M3,6h18v2H3z" />
          <path fill="#333" d="M10,9h4v2h2v4h-2v2h-4v-2H8v-4h2z" />
          <text x="5" y="10" fontSize="4" fill="#333" fontWeight="bold">
            A
          </text>
        </svg>
      )
    case "auto-gas":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className}>
          <circle fill="#6699CC" cx="12" cy="12" r="10" />
          <path
            fill="#FFF"
            d="M12,6c-3.3,0-6,2.7-6,6s2.7,6,6,6s6-2.7,6-6S15.3,6,12,6z M12,16c-2.2,0-4-1.8-4-4s1.8-4,4-4s4,1.8,4,4S14.2,16,12,16z"
          />
          <path fill="#333" d="M8,8l8,8 M16,8l-8,8" />
        </svg>
      )
    case "mobile-extinguisher":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className}>
          <rect fill="#FF4136" x="6" y="4" width="12" height="14" rx="1" />
          <circle fill="#333" cx="8" cy="19" r="2" />
          <circle fill="#333" cx="16" cy="19" r="2" />
          <path fill="#FFF" d="M9,8h6v6H9z" />
          <path fill="#333" d="M12,2v2" />
        </svg>
      )
    case "smoke-screens":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className}>
          <rect fill="#CCC" x="2" y="6" width="20" height="12" rx="1" />
          <path fill="#333" d="M4,10c2,0,2,2,4,2s2-2,4-2s2,2,4,2s2-2,4-2" />
          <path fill="#333" d="M4,14c2,0,2,2,4,2s2-2,4-2s2,2,4-2s2-2,4-2" />
          <path fill="#333" d="M2,6V4h20v2" />
        </svg>
      )
    case "bhv-kit":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className}>
          <rect fill="#FF851B" x="4" y="6" width="16" height="12" rx="1" />
          <path fill="#FFF" d="M7,9h10v6H7z" />
          <text x="8" y="14" fontSize="4" fill="#333" fontWeight="bold">
            BHV
          </text>
          <path fill="#333" d="M10,6V4h4v2" />
        </svg>
      )
    case "yellow-first-aid":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className}>
          <path fill="#FFDC00" d="M4,8v8l8,4l8-4V8l-8-4L4,8z" />
          <path fill="#FF4136" d="M10,10h4v1h1v2h-1v1h-4v-1H9v-2h1z" />
          <path fill="#333" d="M12,4v4 M12,16v4" />
        </svg>
      )
    case "red-bhv-bag":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className}>
          <path fill="#FF4136" d="M6,8v10h12V8H6z" />
          <path fill="#333" d="M8,8V6c0-1.1,0.9-2,2-2h4c1.1,0,2,0.9,2,2v2" />
          <path fill="#FFF" d="M9,12h6v2H9z" />
          <text x="9" y="11" fontSize="3" fill="#FFF" fontWeight="bold">
            BHV
          </text>
        </svg>
      )
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className}>
          <circle fill="#CCC" cx="12" cy="12" r="10" />
          <text x="8" y="16" fontSize="12" fill="#333">
            ?
          </text>
        </svg>
      )
  }
}

export const SafetyIconsComponent = () => {
  const icons = [
    { icon: Flame, label: "Brand", color: "text-red-500" },
    { icon: ShieldCheck, label: "Veilig", color: "text-green-500" },
    { icon: Heart, label: "AED", color: "text-pink-500" },
    { icon: Phone, label: "Nood", color: "text-indigo-500" },
    { icon: Zap, label: "Elektra", color: "text-yellow-500" },
    { icon: Droplets, label: "Water", color: "text-blue-500" },
    { icon: Eye, label: "Detectie", color: "text-gray-500" },
    { icon: Volume2, label: "Alarm", color: "text-orange-500" },
  ]

  return (
    <div className="grid grid-cols-4 gap-2 p-4">
      {icons.map(({ icon: Icon, label, color }, index) => (
        <div key={index} className="flex flex-col items-center p-2 border rounded">
          <Icon className={`h-6 w-6 ${color} mb-1`} />
          <span className="text-xs">{label}</span>
        </div>
      ))}
    </div>
  )
}
