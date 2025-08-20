import { SafetyIcon } from "./safety-icons"

export function Legend() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="flex items-center space-x-2">
        <SafetyIcon type="fire-extinguisher" size={24} />
        <span className="text-sm">Brandblusser</span>
      </div>
      <div className="flex items-center space-x-2">
        <SafetyIcon type="fire-hose" size={24} />
        <span className="text-sm">Brandslanghaspel</span>
      </div>
      <div className="flex items-center space-x-2">
        <SafetyIcon type="evacuation-chair" size={24} />
        <span className="text-sm">Evacuatiestoel</span>
      </div>
      <div className="flex items-center space-x-2">
        <SafetyIcon type="emergency-exit" size={24} />
        <span className="text-sm">Nooduitgang</span>
      </div>
      <div className="flex items-center space-x-2">
        <SafetyIcon type="assembly-point" size={24} />
        <span className="text-sm">Verzamelpunt</span>
      </div>
      <div className="flex items-center space-x-2">
        <SafetyIcon type="first-aid" size={24} />
        <span className="text-sm">EHBO-koffer</span>
      </div>
      <div className="flex items-center space-x-2">
        <SafetyIcon type="aed" size={24} />
        <span className="text-sm">AED</span>
      </div>
      <div className="flex items-center space-x-2">
        <SafetyIcon type="emergency-button" size={24} />
        <span className="text-sm">Noodknop</span>
      </div>
      <div className="flex items-center space-x-2">
        <SafetyIcon type="evacuation-route" size={24} />
        <span className="text-sm">Vluchtroute</span>
      </div>
      <div className="flex items-center space-x-2">
        <SafetyIcon type="fire-alarm" size={24} />
        <span className="text-sm">Brandmelder</span>
      </div>
      <div className="flex items-center space-x-2">
        <SafetyIcon type="drag-mattress" size={24} />
        <span className="text-sm">Sleepmatras</span>
      </div>
      <div className="flex items-center space-x-2">
        <SafetyIcon type="bhv-kit" size={24} />
        <span className="text-sm">BHV trommel</span>
      </div>
    </div>
  )
}
