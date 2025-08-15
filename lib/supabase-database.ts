import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface User {
  id: number
  customer_id: number
  name: string
  email: string
  role: string
  department: string
  bhv_roles: string[]
  active: boolean
  created_at?: string
  updated_at?: string
}

export interface Customer {
  id: number
  name: string
  contact_person: string
  email: string
  phone: string
  address: string
  active: boolean
  created_at?: string
}

// Demo users - Security heeft GEEN BHV rechten standaard
const demoUsers: User[] = [
  {
    id: 1,
    customer_id: 1,
    name: "Admin Demo",
    email: "admin@demobedrijf.nl",
    role: "admin",
    department: "IT",
    bhv_roles: ["BHV", "Coordinator BHV"],
    active: true,
  },
  {
    id: 2,
    customer_id: 1,
    name: "BHV Coordinator Demo",
    email: "bhv@demobedrijf.nl",
    role: "bhv-coordinator",
    department: "Facilitair",
    bhv_roles: ["BHV", "Coordinator BHV", "EHBO"],
    active: true,
  },
  {
    id: 3,
    customer_id: 1,
    name: "Medewerker Demo",
    email: "medewerker@demobedrijf.nl",
    role: "employee",
    department: "Marketing",
    bhv_roles: [],
    active: true,
  },
  {
    id: 4,
    customer_id: 1,
    name: "Sandra Beveiliging",
    email: "security@demobedrijf.nl",
    role: "security-receptionist",
    department: "Beveiliging",
    bhv_roles: [], // GEEN BHV rechten standaard
    active: true,
  },
]

const demoCustomers: Customer[] = [
  {
    id: 1,
    name: "Demo Bedrijf BV",
    contact_person: "Jan Janssen",
    email: "contact@demobedrijf.nl",
    phone: "020-1234567",
    address: "Demostraat 123, 1234 AB Amsterdam",
    active: true,
  },
]

export async function getAllUsers(): Promise<User[]> {
  try {
    const { data, error } = await supabase.from("users").select("*").eq("active", true)

    if (error) {
      console.warn("Supabase query failed, using demo data:", error.message)
      return demoUsers
    }

    return data || demoUsers
  } catch (error) {
    console.warn("Database connection failed, using demo data:", error)
    return demoUsers
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const { data, error } = await supabase.from("users").select("*").eq("email", email).eq("active", true).single()

    if (error) {
      console.warn("Supabase query failed, checking demo data:", error.message)
      return demoUsers.find((user) => user.email === email) || null
    }

    return data
  } catch (error) {
    console.warn("Database connection failed, checking demo data:", error)
    return demoUsers.find((user) => user.email === email) || null
  }
}

export async function getUserById(id: number): Promise<User | null> {
  try {
    const { data, error } = await supabase.from("users").select("*").eq("id", id).eq("active", true).single()

    if (error) {
      console.warn("Supabase query failed, checking demo data:", error.message)
      return demoUsers.find((user) => user.id === id) || null
    }

    return data
  } catch (error) {
    console.warn("Database connection failed, checking demo data:", error)
    return demoUsers.find((user) => user.id === id) || null
  }
}

export async function getAllCustomers(): Promise<Customer[]> {
  try {
    const { data, error } = await supabase.from("customers").select("*").eq("active", true)

    if (error) {
      console.warn("Supabase query failed, using demo data:", error.message)
      return demoCustomers
    }

    return data || demoCustomers
  } catch (error) {
    console.warn("Database connection failed, using demo data:", error)
    return demoCustomers
  }
}

export async function getCustomerById(id: number): Promise<Customer | null> {
  try {
    const { data, error } = await supabase.from("customers").select("*").eq("id", id).eq("active", true).single()

    if (error) {
      console.warn("Supabase query failed, checking demo data:", error.message)
      return demoCustomers.find((customer) => customer.id === id) || null
    }

    return data
  } catch (error) {
    console.warn("Database connection failed, checking demo data:", error)
    return demoCustomers.find((customer) => customer.id === id) || null
  }
}

// Nieuwe functies voor BHV rol beheer
export async function updateUserBHVRoles(userId: number, bhvRoles: string[]): Promise<boolean> {
  try {
    const { error } = await supabase.from("users").update({ bhv_roles: bhvRoles }).eq("id", userId)

    if (error) {
      console.warn("Failed to update BHV roles in database:", error.message)
      // Update demo data als fallback
      const userIndex = demoUsers.findIndex((user) => user.id === userId)
      if (userIndex !== -1) {
        demoUsers[userIndex].bhv_roles = bhvRoles
        return true
      }
      return false
    }

    return true
  } catch (error) {
    console.warn("Database connection failed for BHV role update:", error)
    // Update demo data als fallback
    const userIndex = demoUsers.findIndex((user) => user.id === userId)
    if (userIndex !== -1) {
      demoUsers[userIndex].bhv_roles = bhvRoles
      return true
    }
    return false
  }
}

export async function createUser(userData: Omit<User, "id" | "created_at" | "updated_at">): Promise<User | null> {
  try {
    const { data, error } = await supabase.from("users").insert([userData]).select().single()

    if (error) {
      console.warn("Failed to create user in database:", error.message)
      // Create in demo data als fallback
      const newUser: User = {
        ...userData,
        id: Math.max(...demoUsers.map((u) => u.id)) + 1,
      }
      demoUsers.push(newUser)
      return newUser
    }

    return data
  } catch (error) {
    console.warn("Database connection failed for user creation:", error)
    // Create in demo data als fallback
    const newUser: User = {
      ...userData,
      id: Math.max(...demoUsers.map((u) => u.id)) + 1,
    }
    demoUsers.push(newUser)
    return newUser
  }
}
