import { supabase } from "./supabase-client"

export async function testDatabaseConnection() {
  try {
    console.log("🔍 Testing database connection...")

    // Test basic connection
    const { data: customers, error } = await supabase.from("customers").select("*").limit(5)

    if (error) {
      console.error("❌ Database connection failed:", error)
      return false
    }

    console.log("✅ Database connection successful!")
    console.log(`📊 Found ${customers?.length || 0} customers`)

    // Test each table
    const tables = ["users", "facilities", "nfc_tags", "incidents"]

    for (const table of tables) {
      const { data, error } = await supabase.from(table).select("id").limit(1)

      if (error) {
        console.error(`❌ Table ${table} error:`, error)
      } else {
        console.log(`✅ Table ${table} accessible`)
      }
    }

    return true
  } catch (error) {
    console.error("❌ Database test failed:", error)
    return false
  }
}
