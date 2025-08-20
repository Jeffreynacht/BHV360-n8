#!/usr/bin/env node

import { testDatabaseConnection } from "../lib/database-test"

async function main() {
  console.log("🚀 Starting BHV360 Database Test...\n")

  const success = await testDatabaseConnection()

  if (success) {
    console.log("\n🎉 Database test completed successfully!")
    console.log("✅ Ready for deployment!")
  } else {
    console.log("\n❌ Database test failed!")
    console.log("🔧 Please check your Supabase configuration")
    process.exit(1)
  }
}

main().catch(console.error)
