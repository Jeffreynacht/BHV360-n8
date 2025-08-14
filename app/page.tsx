"use client"

import { EvacuationChart } from "@/components/evacuation-chart"

export default function Home() {
  return (
    <main className="container mx-auto h-screen max-h-screen overflow-hidden p-2">
      <div className="mb-1 flex items-center justify-between">
        <h1 className="text-lg font-bold">Plotkaart Provinciehuis Noord-Brabant</h1>
        <button
          onClick={() => window.print()}
          className="rounded-md bg-slate-800 px-2 py-1 text-xs text-white print:hidden"
        >
          Afdrukken (A3)
        </button>
      </div>
      <EvacuationChart />
    </main>
  )
}
