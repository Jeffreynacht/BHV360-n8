"use client"

import { useState } from "react"

export default function SimpleDbTest() {
  const [result, setResult] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const testDatabase = async () => {
    setLoading(true)
    setResult("")

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

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Simple Database Test</h1>

      <button
        onClick={testDatabase}
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: loading ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
          marginBottom: "20px",
        }}
      >
        {loading ? "Testing..." : "Test Database Connection"}
      </button>

      {result && (
        <pre
          style={{
            backgroundColor: "#f8f9fa",
            padding: "15px",
            borderRadius: "4px",
            overflow: "auto",
            fontSize: "12px",
            border: "1px solid #dee2e6",
          }}
        >
          {result}
        </pre>
      )}
    </div>
  )
}
