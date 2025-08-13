import {
  Flame,
  Heart,
  Cross,
  ShieldCheck,
  Users,
  Bell,
  Droplets,
  Wheelchair,
  Zap,
  Eye,
  Phone,
  DoorOpen,
  Sprinkler,
  Shield,
  Shower,
  Fuel,
  Droplet,
  Cpu,
  Wind,
  Battery,
  Oxygen,
  Bandage,
  FlaskConical,
  HardHat,
  Radio,
  Volume2,
  Lightbulb,
  Archive,
  Codesandbox,
  Waves,
  Key,
  Gauge,
  Separator,
  StopCircle,
  MoreHorizontal,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SafetyIconProps {
  type: string
  size?: number
  className?: string
}

export function SafetyIcon({ type, size = 24, className }: SafetyIconProps) {
  const iconProps = {
    size,
    className: cn("text-current", className),
  }

  switch (type) {
    // Fire Fighting Equipment
    case "fire_extinguisher":
      return <Flame {...iconProps} className={cn(iconProps.className, "text-red-600")} />
    case "fire_hose":
      return <Droplets {...iconProps} className={cn(iconProps.className, "text-blue-600")} />
    case "fire_blanket":
      return <Shield {...iconProps} className={cn(iconProps.className, "text-red-500")} />
    case "sprinkler":
      return <Sprinkler {...iconProps} className={cn(iconProps.className, "text-blue-500")} />
    case "fire_pump":
      return <Gauge {...iconProps} className={cn(iconProps.className, "text-red-700")} />
    case "dry_riser":
    case "wet_riser":
      return <Droplets {...iconProps} className={cn(iconProps.className, "text-blue-700")} />
    case "fire_hydrant":
      return <Droplet {...iconProps} className={cn(iconProps.className, "text-blue-800")} />
    case "foam_inlet":
      return <Waves {...iconProps} className={cn(iconProps.className, "text-blue-400")} />
    case "fire_extinguisher_cabinet":
      return <Archive {...iconProps} className={cn(iconProps.className, "text-red-600")} />
    case "hose_reel":
      return <Codesandbox {...iconProps} className={cn(iconProps.className, "text-blue-600")} />

    // Medical Equipment
    case "aed":
      return <Heart {...iconProps} className={cn(iconProps.className, "text-pink-600")} />
    case "first_aid":
      return <Cross {...iconProps} className={cn(iconProps.className, "text-green-600")} />
    case "defibrillator_cabinet":
      return <Heart {...iconProps} className={cn(iconProps.className, "text-pink-700")} />
    case "oxygen_supply":
      return <Oxygen {...iconProps} className={cn(iconProps.className, "text-blue-500")} />
    case "burn_kit":
      return <Bandage {...iconProps} className={cn(iconProps.className, "text-orange-600")} />
    case "emergency_stretcher":
      return <Separator {...iconProps} className={cn(iconProps.className, "text-green-700")} />
    case "eye_wash_station":
      return <Eye {...iconProps} className={cn(iconProps.className, "text-blue-500")} />
    case "emergency_shower":
      return <Shower {...iconProps} className={cn(iconProps.className, "text-blue-600")} />

    // Evacuation & Safety
    case "emergency_exit":
      return <ShieldCheck {...iconProps} className={cn(iconProps.className, "text-green-600")} />
    case "assembly_point":
    case "muster_point":
      return <Users {...iconProps} className={cn(iconProps.className, "text-green-700")} />
    case "evacuation_chair":
      return <Wheelchair {...iconProps} className={cn(iconProps.className, "text-blue-600")} />
    case "fire_door":
      return <DoorOpen {...iconProps} className={cn(iconProps.className, "text-orange-600")} />
    case "evacuation_lift":
      return <ShieldCheck {...iconProps} className={cn(iconProps.className, "text-green-500")} />
    case "refuge_area":
    case "disabled_refuge":
      return <Shield {...iconProps} className={cn(iconProps.className, "text-green-500")} />

    // Alarm Systems
    case "fire_alarm":
    case "manual_call_point":
    case "break_glass_alarm":
      return <Bell {...iconProps} className={cn(iconProps.className, "text-red-600")} />
    case "smoke_detector":
      return <Eye {...iconProps} className={cn(iconProps.className, "text-gray-600")} />
    case "emergency_phone":
      return <Phone {...iconProps} className={cn(iconProps.className, "text-blue-600")} />
    case "fire_command_center":
      return <Cpu {...iconProps} className={cn(iconProps.className, "text-red-700")} />
    case "public_address_speaker":
      return <Volume2 {...iconProps} className={cn(iconProps.className, "text-purple-600")} />
    case "emergency_beacon":
      return <Lightbulb {...iconProps} className={cn(iconProps.className, "text-yellow-600")} />

    // Lighting & Power
    case "emergency_lighting":
      return <Zap {...iconProps} className={cn(iconProps.className, "text-yellow-600")} />
    case "emergency_generator":
      return <Battery {...iconProps} className={cn(iconProps.className, "text-green-600")} />
    case "electrical_panel":
      return <Cpu {...iconProps} className={cn(iconProps.className, "text-yellow-700")} />

    // Utilities & Controls
    case "gas_shut_off":
      return <Fuel {...iconProps} className={cn(iconProps.className, "text-orange-600")} />
    case "water_shut_off":
      return <Droplet {...iconProps} className={cn(iconProps.className, "text-blue-600")} />
    case "ventilation_control":
      return <Wind {...iconProps} className={cn(iconProps.className, "text-gray-600")} />
    case "emergency_stop_button":
      return <StopCircle {...iconProps} className={cn(iconProps.className, "text-red-700")} />

    // BHV & Management
    case "fire_warden_point":
      return <HardHat {...iconProps} className={cn(iconProps.className, "text-orange-600")} />
    case "emergency_key_box":
      return <Key {...iconProps} className={cn(iconProps.className, "text-gray-600")} />
    case "safety_equipment_cabinet":
      return <Archive {...iconProps} className={cn(iconProps.className, "text-blue-600")} />

    // Chemical & Spill
    case "spill_kit":
      return <FlaskConical {...iconProps} className={cn(iconProps.className, "text-purple-600")} />

    // Communication
    case "emergency_radio":
      return <Radio {...iconProps} className={cn(iconProps.className, "text-blue-600")} />

    // Structural
    case "fire_rated_door":
      return <DoorOpen {...iconProps} className={cn(iconProps.className, "text-orange-700")} />
    case "smoke_barrier":
      return <Separator {...iconProps} className={cn(iconProps.className, "text-gray-700")} />
    case "fire_damper":
      return <Wind {...iconProps} className={cn(iconProps.className, "text-gray-600")} />

    // Default
    case "other":
    default:
      return <MoreHorizontal {...iconProps} className={cn(iconProps.className, "text-gray-500")} />
  }
}

// Helper function to get safety element categories
export const getSafetyElementCategories = () => {
  return [
    {
      id: "fire_fighting",
      name: "Blusmiddelen",
      elements: [
        "fire_extinguisher",
        "fire_hose",
        "fire_blanket",
        "sprinkler",
        "fire_pump",
        "dry_riser",
        "wet_riser",
        "fire_hydrant",
        "foam_inlet",
        "fire_extinguisher_cabinet",
        "hose_reel",
      ],
    },
    {
      id: "medical",
      name: "Medische Hulpmiddelen",
      elements: [
        "aed",
        "first_aid",
        "defibrillator_cabinet",
        "oxygen_supply",
        "burn_kit",
        "emergency_stretcher",
        "eye_wash_station",
        "emergency_shower",
      ],
    },
    {
      id: "evacuation",
      name: "Evacuatie",
      elements: [
        "emergency_exit",
        "assembly_point",
        "muster_point",
        "evacuation_chair",
        "fire_door",
        "evacuation_lift",
        "refuge_area",
        "disabled_refuge",
      ],
    },
    {
      id: "alarm",
      name: "Alarmsystemen",
      elements: [
        "fire_alarm",
        "manual_call_point",
        "break_glass_alarm",
        "smoke_detector",
        "emergency_phone",
        "fire_command_center",
        "public_address_speaker",
        "emergency_beacon",
      ],
    },
    {
      id: "power_lighting",
      name: "Stroom & Verlichting",
      elements: ["emergency_lighting", "emergency_generator", "electrical_panel"],
    },
    {
      id: "utilities",
      name: "Voorzieningen",
      elements: ["gas_shut_off", "water_shut_off", "ventilation_control", "emergency_stop_button"],
    },
    {
      id: "management",
      name: "BHV & Beheer",
      elements: ["fire_warden_point", "emergency_key_box", "safety_equipment_cabinet"],
    },
    {
      id: "chemical",
      name: "Chemisch",
      elements: ["spill_kit"],
    },
    {
      id: "communication",
      name: "Communicatie",
      elements: ["emergency_radio"],
    },
    {
      id: "structural",
      name: "Bouwkundig",
      elements: ["fire_rated_door", "smoke_barrier", "fire_damper"],
    },
  ]
}

// Helper function to get element name in Dutch
export const getSafetyElementName = (type: string): string => {
  const names: Record<string, string> = {
    // Fire Fighting Equipment
    fire_extinguisher: "Brandblusser",
    fire_hose: "Brandslanghaspel",
    fire_blanket: "Blusdeken",
    sprinkler: "Sprinklerinstallatie",
    fire_pump: "Brandweerpomp",
    dry_riser: "Droge Stijgleiding",
    wet_riser: "Natte Stijgleiding",
    fire_hydrant: "Brandkraan",
    foam_inlet: "Schuim Inlaat",
    fire_extinguisher_cabinet: "Blusser Kast",
    hose_reel: "Slanghaspel",

    // Medical Equipment
    aed: "AED",
    first_aid: "EHBO-post",
    defibrillator_cabinet: "AED Kast",
    oxygen_supply: "Zuurstofvoorraad",
    burn_kit: "Brandwondenset",
    emergency_stretcher: "Noodstretcher",
    eye_wash_station: "Oogdouche",
    emergency_shower: "Nooddouche",

    // Evacuation & Safety
    emergency_exit: "Nooduitgang",
    assembly_point: "Verzamelplaats",
    muster_point: "Verzamelplaats",
    evacuation_chair: "Evacuatiestoel",
    fire_door: "Brandwerende Deur",
    evacuation_lift: "Evacuatielift",
    refuge_area: "Wachtruimte",
    disabled_refuge: "Wachtruimte Mindervaliden",

    // Alarm Systems
    fire_alarm: "Handmelder",
    manual_call_point: "Handmelder",
    break_glass_alarm: "Glasbreukmelder",
    smoke_detector: "Rookmelder",
    emergency_phone: "Noodtelefoon",
    fire_command_center: "Brandmeldcentrale",
    public_address_speaker: "Omroepluidspreker",
    emergency_beacon: "Noodbaken",

    // Lighting & Power
    emergency_lighting: "Noodverlichting",
    emergency_generator: "Noodstroomgenerator",
    electrical_panel: "Elektriciteitspaneel",

    // Utilities & Controls
    gas_shut_off: "Gasafsluiter",
    water_shut_off: "Waterafsluiter",
    ventilation_control: "Ventilatieregeling",
    emergency_stop_button: "Noodstop",

    // BHV & Management
    fire_warden_point: "BHV-post",
    emergency_key_box: "Noodsleutelkast",
    safety_equipment_cabinet: "Veiligheidsuitrusting",

    // Chemical & Spill
    spill_kit: "Absorptieset",

    // Communication
    emergency_radio: "Noodradio",

    // Structural
    fire_rated_door: "Brandwerende Deur",
    smoke_barrier: "Rookscherm",
    fire_damper: "Brandklep",

    // Default
    other: "Overig",
  }

  return names[type] || "Onbekend"
}
