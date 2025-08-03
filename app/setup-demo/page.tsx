import { SetupDemoButton } from "@/components/setup-demo-button"

export default function SetupDemoPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Database Setup</h1>
      <div className="max-w-2xl">
        <SetupDemoButton />
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="font-semibold text-blue-800">Na setup:</h3>
          <ol className="mt-2 text-sm text-blue-700 list-decimal list-inside space-y-1">
            <li>Ga terug naar de gebruikers pagina</li>
            <li>Selecteer een klant uit de dropdown</li>
            <li>Voeg nieuwe gebruikers toe</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
