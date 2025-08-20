import { DebugPanel } from "@/components/debug-panel"

export default function DebugPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">BHV360 Debug Panel</h1>
        <p className="text-muted-foreground">Test database connectie en environment configuratie</p>
      </div>

      <DebugPanel />

      <div className="mt-8 space-y-4">
        <h2 className="text-lg font-semibold">Troubleshooting Steps:</h2>
        <div className="grid gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium">1. Database Connection Issues</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Controleer of DATABASE_URL correct is ingesteld in Vercel environment variables
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium">2. Environment Variables Missing</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Ga naar Vercel Dashboard → Settings → Environment Variables
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium">3. Build/Deploy Issues</h3>
            <p className="text-sm text-muted-foreground mt-1">Check Vercel build logs voor errors tijdens deployment</p>
          </div>
        </div>
      </div>
    </div>
  )
}
