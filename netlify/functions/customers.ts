import type { Handler } from "@netlify/functions"
import { getCustomers } from "../../lib/neon-database"

export const handler: Handler = async (event, context) => {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Content-Type": "application/json",
  }

  // Handle preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    }
  }

  try {
    if (event.httpMethod === "GET") {
      const customers = await getCustomers()

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(customers),
      }
    }

    if (event.httpMethod === "POST") {
      const customerData = JSON.parse(event.body || "{}")

      // Mock implementation - replace with real database insert
      const newCustomer = {
        ...customerData,
        id: Date.now().toString(),
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(newCustomer),
      }
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    }
  } catch (error) {
    console.error("Error in customers function:", error)

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    }
  }
}
