import type { Handler } from "@netlify/functions"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const AUTH_PASSWORD = process.env.AUTH_PASSWORD || "admin123"

export const handler: Handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json",
  }

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" }
  }

  try {
    if (event.httpMethod === "POST" && event.path?.includes("/login")) {
      const { username, password } = JSON.parse(event.body || "{}")

      if (!username || !password) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Gebruikersnaam en wachtwoord zijn verplicht" }),
        }
      }

      // Simple auth check - replace with real user verification
      if (username === "admin" && password === AUTH_PASSWORD) {
        const token = jwt.sign({ username, role: "admin" }, JWT_SECRET, { expiresIn: "24h" })

        return {
          statusCode: 200,
          headers: {
            ...headers,
            "Set-Cookie": `auth-token=${token}; HttpOnly; Secure; SameSite=Lax; Max-Age=86400; Path=/`,
          },
          body: JSON.stringify({
            success: true,
            user: { username, role: "admin" },
          }),
        }
      }

      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: "Ongeldige inloggegevens" }),
      }
    }

    if (event.httpMethod === "POST" && event.path?.includes("/logout")) {
      return {
        statusCode: 200,
        headers: {
          ...headers,
          "Set-Cookie": "auth-token=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/",
        },
        body: JSON.stringify({ success: true }),
      }
    }

    if (event.httpMethod === "GET" && event.path?.includes("/status")) {
      const cookies = event.headers.cookie || ""
      const tokenMatch = cookies.match(/auth-token=([^;]+)/)
      const token = tokenMatch ? tokenMatch[1] : null

      if (!token) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ isAuthenticated: false }),
        }
      }

      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            isAuthenticated: true,
            user: { username: decoded.username, role: decoded.role },
          }),
        }
      } catch (error) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ isAuthenticated: false }),
        }
      }
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: "Not found" }),
    }
  } catch (error) {
    console.error("Auth function error:", error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error" }),
    }
  }
}
