import { Heart, Info } from "lucide-react"

export function Legend() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white">
          <span className="text-xs font-bold">F</span>
        </div>
        <span>Brandblusser</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white">
          <Heart className="h-4 w-4" />
        </div>
        <span>EHBO-koffer</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 text-white">
          <span className="text-xs font-bold">AED</span>
        </div>
        <span>AED (Defibrillator)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white">
          <span className="text-xs font-bold">E</span>
        </div>
        <span>Nooduitgang</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
          <span className="text-xs font-bold">V</span>
        </div>
        <span>Verzamelplaats</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-white">
          <Info className="h-4 w-4" />
        </div>
        <span>Informatiepunt</span>
      </div>
    </div>
  )
}
