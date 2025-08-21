"use client"

import dynamic from "next/dynamic"

const VoorzieningenContent = dynamic(() => import("./voorzieningen-content"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2">Loading voorzieningen...</span>
    </div>
  ),
})

export default function VoorzieningenClient() {
  return <VoorzieningenContent />
}
