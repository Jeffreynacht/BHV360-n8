"use client"

import { useState, useEffect } from "react"

export default function ApiTest() {
  const [result, setResult] = useState<string>("Loading...")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const testApi = async () => {
      try {
        const response = await fetch("/api/debug/database")
        const data = await response.json()
        setResult(JSON.stringify(data, null, 2))
      } catch (error) {
        setResult(`Error: ${error}`)
      } finally {
        setLoading(false)
      }
    }

    testApi()
  }, [])

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1>API Test (Auto-run)</h1>
      <p>This page automatically tests the database API when loaded.</p>

      {loading ? (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <p>Testing database connection...</p>
        </div>
      ) : (
        <pre
          style={{
            backgroundColor: "#f8f9fa",
            padding: "15px",
            borderRadius: "4px",
            overflow: "auto",
            fontSize: "11px",
            border: "1px solid #dee2e6",
            whiteSpace: "pre-wrap",
          }}
        >
          {result}
        </pre>
      )}
    </div>
  )
}
