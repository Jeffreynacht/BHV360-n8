import { testConnection, getCustomers } from "../lib/database"

async function testDatabaseConnection() {
  console.log("🧪 Testing Neon database connection...")

  // Test basic connection
  const isConnected = await testConnection()
  if (!isConnected) {
    console.error("❌ Database connection failed!")
    process.exit(1)
  }

  // Test data retrieval
  console.log("📊 Testing data retrieval...")
  const customers = await getCustomers()
  console.log(`✅ Found ${customers.length} customers:`)

  customers.forEach((customer: any) => {
    console.log(`  - ${customer.name} (${customer.users} users, ${customer.buildings} buildings)`)
  })

  console.log("🎉 All database tests passed!")
}

// Run test if called directly
if (require.main === module) {
  testDatabaseConnection()
}

export { testDatabaseConnection }
