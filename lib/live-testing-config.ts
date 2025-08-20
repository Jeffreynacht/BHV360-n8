// BHV360 Live Testing Configuration
export const liveTestingConfig = {
  // Environment settings
  environment: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",

  // App URLs
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  vercelUrl: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,

  // Database configuration
  database: {
    supabaseUrl: "https://ybxmvuzgqevqpusimgmm.supabase.co",
    supabaseAnonKey:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlieG12dXpncWV2cXB1c2ltZ21tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NDk4NDEsImV4cCI6MjA2NjMyNTg0MX0.MFB7ytqPId2c3HEm5KyK2RFZCO-cBrpmiO-FwHJXSv4",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },

  // Authentication
  auth: {
    defaultPassword: process.env.NEXT_PUBLIC_DEFAULT_PASSWORD || "demo123",
    jwtSecret: process.env.JWT_SECRET || "bhv360-live-testing-secret",
  },

  // Feature flags for live testing
  features: {
    enableRealTimeUpdates: true,
    enableNFCSimulation: true,
    enablePDFExport: true,
    enableEmailNotifications: false, // Disable for testing
    enableSMSNotifications: false, // Disable for testing
    enablePushNotifications: true,
    enableOfflineMode: true,
    enableDebugMode: !process.env.NODE_ENV || process.env.NODE_ENV === "development",
  },

  // Live testing specific settings
  testing: {
    enableMockData: true,
    enableTestCustomers: true,
    enableDataReset: true,
    maxTestCustomers: 10,
    maxTestUsers: 50,
    maxTestFacilities: 100,
  },

  // Demo credentials for live testing
  demoCredentials: {
    admin: {
      username: "admin",
      password: "admin123",
      role: "super_admin",
    },
    demo: {
      username: "demo",
      password: "demo123",
      role: "customer_admin",
    },
    bhv: {
      username: "bhv",
      password: "bhv123",
      role: "bhv_coordinator",
    },
  },

  // Sample test data for live testing
  sampleData: {
    customers: [
      {
        name: "Test Bedrijf BV",
        contact_person: "Jan de Tester",
        email: "jan@testbedrijf.nl",
        phone: "06-12345678",
        address: "Teststraat 1, 1234 AB Teststad",
      },
      {
        name: "Demo Kantoor",
        contact_person: "Marie Demo",
        email: "marie@demokantoor.nl",
        phone: "06-87654321",
        address: "Demoweg 2, 5678 CD Demostad",
      },
    ],
    users: [
      {
        name: "Piet BHV'er",
        email: "piet@testbedrijf.nl",
        role: "bhv_coordinator",
        department: "Veiligheid",
      },
      {
        name: "Anna EHBO",
        email: "anna@testbedrijf.nl",
        role: "ehbo_coordinator",
        department: "HR",
      },
    ],
  },

  // Deployment settings
  deployment: {
    autoDeployOnSave: true,
    deploymentTimeout: 300000, // 5 minutes
    retryAttempts: 3,
    watchDirectories: ["app", "components", "lib", "styles"],
    ignorePatterns: [".git", "node_modules", ".next", ".vercel"],
  },
}

// Helper functions for live testing
export const isLiveTesting = () => {
  return liveTestingConfig.environment === "production" || process.env.NEXT_PUBLIC_LIVE_TESTING === "true"
}

export const getAppUrl = () => {
  if (liveTestingConfig.vercelUrl) return liveTestingConfig.vercelUrl
  return liveTestingConfig.appUrl
}

export const getDemoCredentials = (role: "admin" | "demo" | "bhv" = "demo") => {
  return liveTestingConfig.demoCredentials[role]
}

export const getSampleCustomers = () => {
  return liveTestingConfig.sampleData.customers
}

export const getSampleUsers = () => {
  return liveTestingConfig.sampleData.users
}
