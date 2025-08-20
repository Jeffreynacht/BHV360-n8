import { DatabaseStatus } from "@/components/database-status"

export default function DatabaseTestPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Database Connection Test</h1>
      <DatabaseStatus />
    </div>
  )
}
