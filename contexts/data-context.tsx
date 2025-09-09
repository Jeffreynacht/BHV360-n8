"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context"
import type { Customer } from "@/components/customer-context"

// Types
interface PlotkaartElement {
  id: string
  type:
    | "fire_extinguisher"
    | "aed"
    | "first_aid"
    | "emergency_exit"
    | "assembly_point"
    | "fire_alarm"
    | "fire_hose"
    | "evacuation_chair"
    | "emergency_lighting"
    | "smoke_detector"
    | "emergency_phone"
    | "fire_door"
    | "sprinkler"
    | "fire_blanket"
    | "eye_wash_station"
    | "emergency_shower"
    | "gas_shut_off"
    | "water_shut_off"
    | "electrical_panel"
    | "fire_pump"
    | "ventilation_control"
    | "emergency_generator"
    | "fire_command_center"
    | "evacuation_lift"
    | "refuge_area"
    | "fire_warden_point"
    | "muster_point"
    | "disabled_refuge"
    | "emergency_stretcher"
    | "defibrillator_cabinet"
    | "oxygen_supply"
    | "burn_kit"
    | "spill_kit"
    | "safety_equipment_cabinet"
    | "emergency_radio"
    | "public_address_speaker"
    | "emergency_beacon"
    | "fire_rated_door"
    | "smoke_barrier"
    | "fire_damper"
    | "emergency_stop_button"
    | "manual_call_point"
    | "break_glass_alarm"
    | "emergency_key_box"
    | "fire_extinguisher_cabinet"
    | "hose_reel"
    | "dry_riser"
    | "wet_riser"
    | "fire_hydrant"
    | "foam_inlet"
    | "other"
  x: number
  y: number
  name: string
  description?: string
  icon?: string
  status?: "operational" | "maintenance" | "defect" | "unknown"
  lastInspection?: string
  nextInspection?: string
  serialNumber?: string
  manufacturer?: string
  installationDate?: string
  notes?: string
}

interface FloorData {
  id: string
  name: string
  level: number
  elements: PlotkaartElement[]
  backgroundImage?: string
  dimensions?: {
    width: number
    height: number
  }
  scale?: number
}

interface PlotkaartData {
  id: string
  customerId: string
  floors: FloorData[]
  lastUpdated: string
  updatedBy: string
  version: number
  buildingName?: string
  address?: string
  emergencyContacts?: {
    fire: string
    medical: string
    police: string
    building: string
  }
}

interface User {
  id: string
  name: string
  email: string
  role: "super_admin" | "partner_admin" | "customer_admin" | "bhv_coordinator" | "employee"
  customerId?: string
  isActive: boolean
}

export interface DataContextType {
  data: any
  setData: (data: any) => void
  loading: boolean
  setLoading: (loading: boolean) => void
  error: string | null
  refreshData: () => Promise<void>
  lastRefresh: Date | null

  // Plotkaart functions
  getPlotkaartByCustomer: (customerId: string) => Promise<PlotkaartData | null>
  updatePlotkaartForCustomer: (customerId: string, plotkaart: PlotkaartData) => Promise<boolean>
  createPlotkaartForCustomer: (customerId: string, plotkaart: Omit<PlotkaartData, "id">) => Promise<string>
  deletePlotkaartForCustomer: (customerId: string) => Promise<boolean>

  // Customer functions
  getCustomers: () => Promise<Customer[]>
  getCustomerById: (id: string) => Promise<Customer | null>
  updateCustomer: (customer: Customer) => Promise<boolean>
  createCustomer: (customer: Omit<Customer, "id">) => Promise<string>
  deleteCustomer: (id: string) => Promise<boolean>

  // User functions
  getUsersByCustomer: (customerId: string) => Promise<User[]>
  getUserById: (id: string) => Promise<User | null>
  updateUser: (user: User) => Promise<boolean>
  createUser: (user: Omit<User, "id">) => Promise<string>
  deleteUser: (id: string) => Promise<boolean>

  // NFC Tag functions
  nfcTags: any[]
  getNfcTagsByCustomer: (customerId: string) => Promise<any[]>
  addNfcTag: (tagData: any, customerId: string) => Promise<any>
  updateNfcTag: (tagId: string, tagData: any) => Promise<any>
  deleteNfcTag: (tagId: string) => Promise<boolean>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

// Demo data
const DEMO_CUSTOMERS: Customer[] = [
  {
    id: "demo-bedrijf-bv",
    name: "Demo Bedrijf BV",
    address: "Hoofdstraat 123, 1234 AB Amsterdam",
    contactPerson: "Jan Janssen",
    email: "jan@demobedrijf.nl",
    phone: "+31 20 123 4567",
    isActive: true,
  },
  {
    id: "test-company-ltd",
    name: "Test Company Ltd",
    address: "Testlaan 456, 5678 CD Rotterdam",
    contactPerson: "Piet Pietersen",
    email: "piet@testcompany.nl",
    phone: "+31 10 987 6543",
    isActive: true,
  },
  {
    id: "zorgcentrum-boomgaard",
    name: "Zorgcentrum De Boomgaard",
    address: "Zorgstraat 789, 3500 EF Utrecht",
    contactPerson: "Dr. Peter van der Berg",
    email: "p.vandenberg@boomgaard.nl",
    phone: "+31 30 555 7890",
    isActive: true,
  },
]

const DEMO_USERS: User[] = [
  {
    id: "jan",
    name: "Jan Janssen",
    email: "jan@demobedrijf.nl",
    role: "customer_admin",
    customerId: "demo-bedrijf-bv",
    isActive: true,
  },
  {
    id: "piet",
    name: "Piet Pietersen",
    email: "piet@demobedrijf.nl",
    role: "bhv_coordinator",
    customerId: "demo-bedrijf-bv",
    isActive: true,
  },
  {
    id: "marie",
    name: "Marie de Vries",
    email: "marie@demobedrijf.nl",
    role: "employee",
    customerId: "demo-bedrijf-bv",
    isActive: true,
  },
]

const DEMO_PLOTKAART: PlotkaartData = {
  id: "plotkaart-demo-bedrijf",
  customerId: "demo-bedrijf-bv",
  lastUpdated: "2024-01-15T10:30:00Z",
  updatedBy: "Jan Janssen",
  version: 1,
  buildingName: "Hoofdkantoor Demo Bedrijf BV",
  address: "Hoofdstraat 123, 1234 AB Amsterdam",
  emergencyContacts: {
    fire: "112",
    medical: "112",
    police: "112",
    building: "+31 20 123 4567",
  },
  floors: [
    {
      id: "floor-0",
      name: "Begane Grond",
      level: 0,
      dimensions: { width: 800, height: 600 },
      scale: 1.0,
      elements: [
        {
          id: "elem-1",
          type: "fire_extinguisher",
          x: 150,
          y: 200,
          name: "Brandblusser BG-01",
          description: "6kg poeder brandblusser bij hoofdingang",
          status: "operational",
          lastInspection: "2024-01-10",
          nextInspection: "2024-07-10",
          serialNumber: "FE-2023-001",
          manufacturer: "Gloria",
          installationDate: "2023-01-15",
        },
        {
          id: "elem-2",
          type: "aed",
          x: 300,
          y: 150,
          name: "AED Receptie",
          description: "Automatische externe defibrillator bij receptie",
          status: "operational",
          lastInspection: "2024-01-05",
          nextInspection: "2024-02-05",
          serialNumber: "AED-2023-001",
          manufacturer: "Philips HeartStart",
          installationDate: "2023-02-01",
        },
        {
          id: "elem-3",
          type: "emergency_exit",
          x: 50,
          y: 100,
          name: "Nooduitgang Noord",
          description: "Hoofdnooduitgang naar parkeerplaats",
          status: "operational",
          lastInspection: "2024-01-12",
          nextInspection: "2024-04-12",
        },
        {
          id: "elem-4",
          type: "assembly_point",
          x: 400,
          y: 300,
          name: "Verzamelplaats A",
          description: "Primaire verzamelplaats op parkeerplaats",
          status: "operational",
        },
        {
          id: "elem-5",
          type: "fire_alarm",
          x: 250,
          y: 120,
          name: "Handmelder BG-01",
          description: "Handmatige brandmelder bij receptie",
          status: "operational",
          lastInspection: "2024-01-08",
          nextInspection: "2024-07-08",
          serialNumber: "HM-2023-001",
          manufacturer: "Bosch",
        },
        {
          id: "elem-6",
          type: "fire_hose",
          x: 100,
          y: 250,
          name: "Brandslanghaspel BG-01",
          description: "25m brandslanghaspel bij trap",
          status: "operational",
          lastInspection: "2024-01-10",
          nextInspection: "2024-07-10",
          serialNumber: "BH-2023-001",
        },
        {
          id: "elem-7",
          type: "emergency_lighting",
          x: 200,
          y: 80,
          name: "Noodverlichting Gang",
          description: "LED noodverlichting hoofdgang",
          status: "operational",
          lastInspection: "2024-01-15",
          nextInspection: "2024-07-15",
        },
        {
          id: "elem-8",
          type: "smoke_detector",
          x: 350,
          y: 200,
          name: "Rookmelder BG-01",
          description: "Optische rookmelder receptieruimte",
          status: "operational",
          lastInspection: "2024-01-08",
          nextInspection: "2024-07-08",
          serialNumber: "RM-2023-001",
        },
        {
          id: "elem-9",
          type: "emergency_phone",
          x: 180,
          y: 180,
          name: "Noodtelefoon Receptie",
          description: "Directe lijn naar alarmcentrale",
          status: "operational",
          lastInspection: "2024-01-12",
          nextInspection: "2024-04-12",
        },
        {
          id: "elem-10",
          type: "fire_door",
          x: 120,
          y: 300,
          name: "Brandwerende Deur BD-01",
          description: "30 minuten brandwerende deur naar trap",
          status: "operational",
          lastInspection: "2024-01-10",
          nextInspection: "2024-07-10",
        },
        {
          id: "elem-11",
          type: "electrical_panel",
          x: 450,
          y: 250,
          name: "Hoofdschakelaar",
          description: "Hoofdelektriciteitspaneel gebouw",
          status: "operational",
          notes: "Alleen toegankelijk voor elektriciens",
        },
        {
          id: "elem-12",
          type: "water_shut_off",
          x: 420,
          y: 280,
          name: "Hoofdwaterafsluiter",
          description: "Hoofdafsluiter watertoevoer gebouw",
          status: "operational",
        },
      ],
    },
    {
      id: "floor-1",
      name: "1e Verdieping",
      level: 1,
      dimensions: { width: 800, height: 600 },
      scale: 1.0,
      elements: [
        {
          id: "elem-13",
          type: "first_aid",
          x: 200,
          y: 180,
          name: "EHBO-post 1V-01",
          description: "Volledige EHBO-uitrusting kantoorruimte",
          status: "operational",
          lastInspection: "2024-01-08",
          nextInspection: "2024-04-08",
          serialNumber: "EHBO-2023-001",
        },
        {
          id: "elem-14",
          type: "fire_extinguisher",
          x: 350,
          y: 120,
          name: "Brandblusser 1V-01",
          description: "6kg poeder brandblusser bij trap",
          status: "operational",
          lastInspection: "2024-01-10",
          nextInspection: "2024-07-10",
          serialNumber: "FE-2023-002",
          manufacturer: "Gloria",
        },
        {
          id: "elem-15",
          type: "emergency_exit",
          x: 100,
          y: 250,
          name: "Nooduitgang Trap",
          description: "Nooduitgang via trappenhuis",
          status: "operational",
          lastInspection: "2024-01-12",
          nextInspection: "2024-04-12",
        },
        {
          id: "elem-16",
          type: "evacuation_chair",
          x: 150,
          y: 220,
          name: "Evacuatiestoel 1V-01",
          description: "Evacuatiestoel voor mindervaliden",
          status: "operational",
          lastInspection: "2024-01-05",
          nextInspection: "2024-07-05",
          serialNumber: "ES-2023-001",
          manufacturer: "Evac+Chair",
        },
        {
          id: "elem-17",
          type: "fire_alarm",
          x: 280,
          y: 100,
          name: "Handmelder 1V-01",
          description: "Handmatige brandmelder bij trap",
          status: "operational",
          lastInspection: "2024-01-08",
          nextInspection: "2024-07-08",
          serialNumber: "HM-2023-002",
          manufacturer: "Bosch",
        },
        {
          id: "elem-18",
          type: "sprinkler",
          x: 250,
          y: 200,
          name: "Sprinkler Zone 1V-A",
          description: "Automatische sprinklerinstallatie kantoren",
          status: "operational",
          lastInspection: "2024-01-15",
          nextInspection: "2024-07-15",
        },
        {
          id: "elem-19",
          type: "fire_blanket",
          x: 320,
          y: 180,
          name: "Blusdeken Keuken",
          description: "Blusdeken bij koffiehoek",
          status: "operational",
          lastInspection: "2024-01-10",
          nextInspection: "2024-07-10",
          serialNumber: "BD-2023-001",
        },
        {
          id: "elem-20",
          type: "emergency_lighting",
          x: 180,
          y: 80,
          name: "Noodverlichting Gang 1V",
          description: "LED noodverlichting gang 1e verdieping",
          status: "operational",
          lastInspection: "2024-01-15",
          nextInspection: "2024-07-15",
        },
        {
          id: "elem-21",
          type: "smoke_detector",
          x: 400,
          y: 150,
          name: "Rookmelder 1V-01",
          description: "Optische rookmelder kantoorruimte",
          status: "operational",
          lastInspection: "2024-01-08",
          nextInspection: "2024-07-08",
          serialNumber: "RM-2023-002",
        },
        {
          id: "elem-22",
          type: "fire_warden_point",
          x: 120,
          y: 150,
          name: "BHV-post 1V",
          description: "BHV-coördinator post 1e verdieping",
          status: "operational",
        },
        {
          id: "elem-23",
          type: "disabled_refuge",
          x: 80,
          y: 200,
          name: "Wachtruimte Mindervaliden",
          description: "Veilige wachtruimte voor mindervaliden",
          status: "operational",
        },
        {
          id: "elem-24",
          type: "emergency_stretcher",
          x: 380,
          y: 220,
          name: "Noodstretcher",
          description: "Opvouwbare stretcher voor gewondentransport",
          status: "operational",
          lastInspection: "2024-01-05",
          nextInspection: "2024-07-05",
          serialNumber: "NS-2023-001",
        },
      ],
    },
    {
      id: "floor-2",
      name: "2e Verdieping",
      level: 2,
      dimensions: { width: 800, height: 600 },
      scale: 1.0,
      elements: [
        {
          id: "elem-25",
          type: "defibrillator_cabinet",
          x: 200,
          y: 150,
          name: "AED Kast 2V",
          description: "Verwarmde AED kast met alarm",
          status: "operational",
          lastInspection: "2024-01-05",
          nextInspection: "2024-02-05",
          serialNumber: "AEDK-2023-001",
        },
        {
          id: "elem-26",
          type: "fire_extinguisher",
          x: 350,
          y: 180,
          name: "Brandblusser 2V-01",
          description: "6kg poeder brandblusser serverruimte",
          status: "operational",
          lastInspection: "2024-01-10",
          nextInspection: "2024-07-10",
          serialNumber: "FE-2023-003",
          manufacturer: "Gloria",
        },
        {
          id: "elem-27",
          type: "gas_shut_off",
          x: 400,
          y: 200,
          name: "Gasafsluiter 2V",
          description: "Noodafsluiter gastoevoer 2e verdieping",
          status: "operational",
        },
        {
          id: "elem-28",
          type: "fire_command_center",
          x: 150,
          y: 100,
          name: "Brandmeldcentrale",
          description: "Centrale brandmeldinstallatie",
          status: "operational",
          lastInspection: "2024-01-08",
          nextInspection: "2024-07-08",
          serialNumber: "BMC-2023-001",
          manufacturer: "Bosch",
        },
        {
          id: "elem-29",
          type: "ventilation_control",
          x: 300,
          y: 120,
          name: "Ventilatieregeling",
          description: "Noodregeling ventilatiesysteem",
          status: "operational",
        },
        {
          id: "elem-30",
          type: "emergency_generator",
          x: 450,
          y: 250,
          name: "Noodstroomgenerator",
          description: "Diesel noodstroomgenerator 50kW",
          status: "operational",
          lastInspection: "2024-01-12",
          nextInspection: "2024-04-12",
          serialNumber: "NG-2023-001",
        },
        {
          id: "elem-31",
          type: "oxygen_supply",
          x: 250,
          y: 220,
          name: "Zuurstofvoorraad",
          description: "Medische zuurstofflessen",
          status: "operational",
          lastInspection: "2024-01-08",
          nextInspection: "2024-04-08",
        },
        {
          id: "elem-32",
          type: "burn_kit",
          x: 180,
          y: 200,
          name: "Brandwondenset",
          description: "Speciale EHBO-set voor brandwonden",
          status: "operational",
          lastInspection: "2024-01-08",
          nextInspection: "2024-04-08",
        },
        {
          id: "elem-33",
          type: "spill_kit",
          x: 320,
          y: 250,
          name: "Absorptieset",
          description: "Set voor chemische morsen",
          status: "operational",
          lastInspection: "2024-01-10",
          nextInspection: "2024-07-10",
        },
        {
          id: "elem-34",
          type: "safety_equipment_cabinet",
          x: 120,
          y: 180,
          name: "Veiligheidsuitrusting",
          description: "Kast met persoonlijke beschermingsmiddelen",
          status: "operational",
          lastInspection: "2024-01-10",
          nextInspection: "2024-07-10",
        },
        {
          id: "elem-35",
          type: "emergency_radio",
          x: 380,
          y: 120,
          name: "Noodradio",
          description: "Draagbare noodcommunicatie",
          status: "operational",
          lastInspection: "2024-01-12",
          nextInspection: "2024-04-12",
        },
        {
          id: "elem-36",
          type: "public_address_speaker",
          x: 280,
          y: 80,
          name: "Omroepluidspreker",
          description: "Luidspreker noodomroep systeem",
          status: "operational",
          lastInspection: "2024-01-08",
          nextInspection: "2024-07-08",
        },
      ],
    },
    {
      id: "floor-basement",
      name: "Kelder",
      level: -1,
      dimensions: { width: 800, height: 600 },
      scale: 1.0,
      elements: [
        {
          id: "elem-37",
          type: "fire_pump",
          x: 200,
          y: 200,
          name: "Brandweerpomp",
          description: "Hoofdpomp brandweerinstallatie",
          status: "operational",
          lastInspection: "2024-01-12",
          nextInspection: "2024-04-12",
          serialNumber: "BP-2023-001",
        },
        {
          id: "elem-38",
          type: "dry_riser",
          x: 150,
          y: 150,
          name: "Droge Stijgleiding",
          description: "Aansluitpunt brandweerslangen",
          status: "operational",
          lastInspection: "2024-01-10",
          nextInspection: "2024-07-10",
        },
        {
          id: "elem-39",
          type: "wet_riser",
          x: 250,
          y: 150,
          name: "Natte Stijgleiding",
          description: "Permanente watertoevoer brandweerslangen",
          status: "operational",
          lastInspection: "2024-01-10",
          nextInspection: "2024-07-10",
        },
        {
          id: "elem-40",
          type: "fire_hydrant",
          x: 300,
          y: 250,
          name: "Brandkraan Kelder",
          description: "Ondergrondse brandkraan",
          status: "operational",
          lastInspection: "2024-01-12",
          nextInspection: "2024-07-12",
        },
        {
          id: "elem-41",
          type: "foam_inlet",
          x: 350,
          y: 200,
          name: "Schuim Inlaat",
          description: "Aansluitpunt brandweerschuim",
          status: "operational",
          lastInspection: "2024-01-12",
          nextInspection: "2024-07-12",
        },
        {
          id: "elem-42",
          type: "emergency_key_box",
          x: 100,
          y: 100,
          name: "Noodsleutelkast",
          description: "Brandweersleutelkast toegang gebouw",
          status: "operational",
          lastInspection: "2024-01-08",
          nextInspection: "2024-07-08",
        },
        {
          id: "elem-43",
          type: "fire_extinguisher_cabinet",
          x: 180,
          y: 300,
          name: "Blusser Kast Kelder",
          description: "Inbouwkast met 6kg poeder brandblusser",
          status: "operational",
          lastInspection: "2024-01-10",
          nextInspection: "2024-07-10",
        },
        {
          id: "elem-44",
          type: "hose_reel",
          x: 400,
          y: 150,
          name: "Slanghaspel Kelder",
          description: "30m slanghaspel technische ruimte",
          status: "operational",
          lastInspection: "2024-01-10",
          nextInspection: "2024-07-10",
        },
        {
          id: "elem-45",
          type: "emergency_beacon",
          x: 120,
          y: 250,
          name: "Noodbaken",
          description: "Automatisch noodbaken bij stroomuitval",
          status: "operational",
          lastInspection: "2024-01-15",
          nextInspection: "2024-07-15",
        },
        {
          id: "elem-46",
          type: "smoke_barrier",
          x: 280,
          y: 300,
          name: "Rookscherm",
          description: "Automatisch rookscherm compartimentering",
          status: "operational",
          lastInspection: "2024-01-12",
          nextInspection: "2024-07-12",
        },
      ],
    },
  ],
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [nfcTags, setNfcTags] = useState<any[]>([])
  const { user } = useAuth()

  const refreshData = async () => {
    try {
      setLoading(true)
      setError(null)
      // Mock data loading - replace with actual API calls
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setData({ message: "Data loaded successfully" })
      setLastRefresh(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshData()
  }, [])

  // Plotkaart functions
  const getPlotkaartByCustomer = async (customerId: string): Promise<PlotkaartData | null> => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Check localStorage first
      const stored = localStorage.getItem(`plotkaart-${customerId}`)
      if (stored) {
        const plotkaart = JSON.parse(stored)
        setLoading(false)
        return plotkaart
      }

      // Return demo data for demo customer
      if (customerId === "demo-bedrijf-bv") {
        // Store in localStorage for persistence
        localStorage.setItem(`plotkaart-${customerId}`, JSON.stringify(DEMO_PLOTKAART))
        setLoading(false)
        return DEMO_PLOTKAART
      }

      setLoading(false)
      return null
    } catch (err) {
      setError("Fout bij ophalen plotkaart")
      setLoading(false)
      return null
    }
  }

  const updatePlotkaartForCustomer = async (customerId: string, plotkaart: PlotkaartData): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Update timestamp, user, and version
      const updatedPlotkaart = {
        ...plotkaart,
        lastUpdated: new Date().toISOString(),
        updatedBy: user?.name || "Onbekend",
        version: plotkaart.version + 1,
      }

      // Store in localStorage
      localStorage.setItem(`plotkaart-${customerId}`, JSON.stringify(updatedPlotkaart))

      setLoading(false)
      return true
    } catch (err) {
      setError("Fout bij bijwerken plotkaart")
      setLoading(false)
      return false
    }
  }

  const createPlotkaartForCustomer = async (
    customerId: string,
    plotkaart: Omit<PlotkaartData, "id">,
  ): Promise<string> => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      const newId = `plotkaart-${customerId}-${Date.now()}`
      const newPlotkaart: PlotkaartData = {
        ...plotkaart,
        id: newId,
        lastUpdated: new Date().toISOString(),
        updatedBy: user?.name || "Onbekend",
        version: 1,
      }

      // Store in localStorage
      localStorage.setItem(`plotkaart-${customerId}`, JSON.stringify(newPlotkaart))

      setLoading(false)
      return newId
    } catch (err) {
      setError("Fout bij aanmaken plotkaart")
      setLoading(false)
      throw err
    }
  }

  const deletePlotkaartForCustomer = async (customerId: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Remove from localStorage
      localStorage.removeItem(`plotkaart-${customerId}`)

      setLoading(false)
      return true
    } catch (err) {
      setError("Fout bij verwijderen plotkaart")
      setLoading(false)
      return false
    }
  }

  // Customer functions
  const getCustomers = async (): Promise<Customer[]> => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Check localStorage first
      const stored = localStorage.getItem("customers")
      if (stored) {
        const customers = JSON.parse(stored)
        setLoading(false)
        return customers
      }

      // Store demo data
      localStorage.setItem("customers", JSON.stringify(DEMO_CUSTOMERS))
      setLoading(false)
      return DEMO_CUSTOMERS
    } catch (err) {
      setError("Fout bij ophalen klanten")
      setLoading(false)
      return []
    }
  }

  const getCustomerById = async (id: string): Promise<Customer | null> => {
    const customers = await getCustomers()
    return customers.find((c) => c.id === id) || null
  }

  const updateCustomer = async (customer: Customer): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const customers = await getCustomers()
      const updatedCustomers = customers.map((c) => (c.id === customer.id ? customer : c))
      localStorage.setItem("customers", JSON.stringify(updatedCustomers))

      setLoading(false)
      return true
    } catch (err) {
      setError("Fout bij bijwerken klant")
      setLoading(false)
      return false
    }
  }

  const createCustomer = async (customer: Omit<Customer, "id">): Promise<string> => {
    setLoading(true)
    setError(null)

    try {
      const customers = await getCustomers()
      const newId = `customer-${Date.now()}`
      const newCustomer: Customer = { ...customer, id: newId }

      const updatedCustomers = [...customers, newCustomer]
      localStorage.setItem("customers", JSON.stringify(updatedCustomers))

      setLoading(false)
      return newId
    } catch (err) {
      setError("Fout bij aanmaken klant")
      setLoading(false)
      throw err
    }
  }

  const deleteCustomer = async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const customers = await getCustomers()
      const updatedCustomers = customers.filter((c) => c.id !== id)
      localStorage.setItem("customers", JSON.stringify(updatedCustomers))

      setLoading(false)
      return true
    } catch (err) {
      setError("Fout bij verwijderen klant")
      setLoading(false)
      return false
    }
  }

  // User functions
  const getUsersByCustomer = async (customerId: string): Promise<User[]> => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Check localStorage first
      const stored = localStorage.getItem(`users-${customerId}`)
      if (stored) {
        const users = JSON.parse(stored)
        setLoading(false)
        return users
      }

      // Return demo users for demo customer
      if (customerId === "demo-bedrijf-bv") {
        const demoUsers = DEMO_USERS.filter((u) => u.customerId === customerId)
        localStorage.setItem(`users-${customerId}`, JSON.stringify(demoUsers))
        setLoading(false)
        return demoUsers
      }

      setLoading(false)
      return []
    } catch (err) {
      setError("Fout bij ophalen gebruikers")
      setLoading(false)
      return []
    }
  }

  const getUserById = async (id: string): Promise<User | null> => {
    setLoading(true)
    setError(null)

    try {
      // Check all customer user lists
      const customers = await getCustomers()
      for (const customer of customers) {
        const users = await getUsersByCustomer(customer.id)
        const user = users.find((u) => u.id === id)
        if (user) {
          setLoading(false)
          return user
        }
      }

      setLoading(false)
      return null
    } catch (err) {
      setError("Fout bij ophalen gebruiker")
      setLoading(false)
      return null
    }
  }

  const updateUser = async (user: User): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      if (!user.customerId) {
        setError("Gebruiker heeft geen klant ID")
        setLoading(false)
        return false
      }

      const users = await getUsersByCustomer(user.customerId)
      const updatedUsers = users.map((u) => (u.id === user.id ? user : u))
      localStorage.setItem(`users-${user.customerId}`, JSON.stringify(updatedUsers))

      setLoading(false)
      return true
    } catch (err) {
      setError("Fout bij bijwerken gebruiker")
      setLoading(false)
      return false
    }
  }

  const createUser = async (user: Omit<User, "id">): Promise<string> => {
    setLoading(true)
    setError(null)

    try {
      if (!user.customerId) {
        setError("Gebruiker moet een klant ID hebben")
        setLoading(false)
        throw new Error("Customer ID required")
      }

      const users = await getUsersByCustomer(user.customerId)
      const newId = `user-${Date.now()}`
      const newUser: User = { ...user, id: newId }

      const updatedUsers = [...users, newUser]
      localStorage.setItem(`users-${user.customerId}`, JSON.stringify(updatedUsers))

      setLoading(false)
      return newId
    } catch (err) {
      setError("Fout bij aanmaken gebruiker")
      setLoading(false)
      throw err
    }
  }

  const deleteUser = async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      // Find user first to get customer ID
      const user = await getUserById(id)
      if (!user || !user.customerId) {
        setError("Gebruiker niet gevonden")
        setLoading(false)
        return false
      }

      const users = await getUsersByCustomer(user.customerId)
      const updatedUsers = users.filter((u) => u.id !== id)
      localStorage.setItem(`users-${user.customerId}`, JSON.stringify(updatedUsers))

      setLoading(false)
      return true
    } catch (err) {
      setError("Fout bij verwijderen gebruiker")
      setLoading(false)
      return false
    }
  }

  // NFC Tag functions
  const getNfcTagsByCustomer = async (customerId: string) => {
    // Replace with actual data fetching logic
    return new Promise<any[]>((resolve) => {
      setTimeout(() => {
        const mockTags = [
          { id: "1", name: "Tag 1", uid: "123", customerId: customerId },
          { id: "2", name: "Tag 2", uid: "456", customerId: customerId },
        ]
        resolve(mockTags.filter((tag) => tag.customerId === customerId))
      }, 200)
    })
  }

  const addNfcTag = async (tagData: any, customerId: string) => {
    // Replace with actual data adding logic
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const newTag = { ...tagData, id: Date.now().toString(), customerId: customerId }
        setNfcTags((prevTags) => [...prevTags, newTag])
        resolve(newTag)
      }, 200)
    })
  }

  const updateNfcTag = async (tagId: string, tagData: any) => {
    // Replace with actual data updating logic
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        setNfcTags((prevTags) => prevTags.map((tag) => (tag.id === tagId ? { ...tag, ...tagData } : tag)))
        resolve({ id: tagId, ...tagData })
      }, 200)
    })
  }

  const deleteNfcTag = async (tagId: string) => {
    // Replace with actual data deleting logic
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        setNfcTags((prevTags) => prevTags.filter((tag) => tag.id !== tagId))
        resolve(true)
      }, 200)
    })
  }

  const value: DataContextType = {
    data,
    setData,
    loading,
    setLoading,
    error,
    refreshData,
    lastRefresh,

    // Plotkaart functions
    getPlotkaartByCustomer,
    updatePlotkaartForCustomer,
    createPlotkaartForCustomer,
    deletePlotkaartForCustomer,

    // Customer functions
    getCustomers,
    getCustomerById,
    updateCustomer,
    createCustomer,
    deleteCustomer,

    // User functions
    getUsersByCustomer,
    getUserById,
    updateUser,
    createUser,
    deleteUser,

    // NFC Tag functions
    nfcTags,
    getNfcTagsByCustomer,
    addNfcTag,
    updateNfcTag,
    deleteNfcTag,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}

// Export types
export type { PlotkaartElement, FloorData, PlotkaartData, User }
