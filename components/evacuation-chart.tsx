"use client"

import { useState } from "react"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

export function EvacuationChart() {
  // Define floor data exactly as in the PDF
  const floors = [
    { id: "b2-bn", name: "Verdieping -2", location: "Bunker noord" },
    { id: "b2-bk", name: "Verdieping -2", location: "Bunker kelder" },
    { id: "b2-w", name: "Verdieping -2", location: "west" },
    { id: "b2-o", name: "Verdieping -2", location: "oost" },
    { id: "b1-f", name: "Verdieping -1", location: "fitness (PK -niveau)" },
    { id: "b1", name: "Verdieping -1", location: "(PK -niveau)" },
    { id: "g-r", name: "Begane grond", location: "Bedrijfsrestaurant" },
    { id: "g-sw", name: "Begane grond", location: "Statenzaal west" },
    { id: "g-so", name: "Begane grond", location: "Statenzaal oost" },
    { id: "f1-zw", name: "Verdieping 1", location: "Zuid west" },
    { id: "f1-nw", name: "Verdieping 1", location: "Noord west" },
    { id: "f1-zo", name: "Verdieping 1", location: "Zuid oost" },
    { id: "f1-no", name: "Verdieping 1", location: "Noord oost" },
    { id: "f1-wg", name: "Verdieping 1", location: "west Griffie" },
    { id: "f1-o", name: "Verdieping 1", location: "oost" },
    { id: "f2-w", name: "Verdieping 2", location: "west" },
    { id: "f2-o", name: "Verdieping 2", location: "oost" },
    { id: "f3-w", name: "Verdieping 3", location: "west" },
    { id: "f3-o", name: "Verdieping 3", location: "oost" },
    { id: "f4-w", name: "Verdieping 4", location: "west" },
    { id: "f4-o", name: "Verdieping 4", location: "oost" },
    { id: "f5-w", name: "Verdieping 5", location: "west" },
    { id: "f5-o", name: "Verdieping 5", location: "oost" },
    { id: "f6-w", name: "Verdieping 6", location: "west" },
    { id: "f6-o", name: "Verdieping 6", location: "oost" },
    { id: "f7-w", name: "Verdieping 7", location: "west" },
    { id: "f7-o", name: "Verdieping 7", location: "oost" },
    { id: "f8-w", name: "Verdieping 8", location: "west" },
    { id: "f8-o", name: "Verdieping 8", location: "oost" },
    { id: "f9-w", name: "Verdieping 9", location: "west" },
    { id: "f9-o", name: "Verdieping 9", location: "oost" },
    { id: "f10-w", name: "Verdieping 10", location: "west" },
    { id: "f10-o", name: "Verdieping 10", location: "oost" },
    { id: "f11-w", name: "Verdieping 11", location: "west" },
    { id: "f11-o", name: "Verdieping 11", location: "oost" },
    { id: "f12-w", name: "Verdieping 12", location: "west" },
    { id: "f12-o", name: "Verdieping 12", location: "oost" },
    { id: "f13-w", name: "Verdieping 13", location: "west" },
    { id: "f13-o", name: "Verdieping 13", location: "oost" },
    { id: "f14-w", name: "Verdieping 14", location: "west" },
    { id: "f14-o", name: "Verdieping 14", location: "oost" },
    { id: "f15-w", name: "Verdieping 15", location: "west" },
    { id: "f15-o", name: "Verdieping 15", location: "oost" },
    { id: "f16-w", name: "Verdieping 16", location: "west" },
    { id: "f16-o", name: "Verdieping 16", location: "oost" },
    { id: "f17-w", name: "Verdieping 17", location: "west" },
    { id: "f17-o", name: "Verdieping 17", location: "oost" },
    { id: "f18-w", name: "Verdieping 18", location: "west" },
    { id: "f18-o", name: "Verdieping 18", location: "oost" },
    { id: "f19-w", name: "Verdieping 19", location: "west" },
    { id: "f19-o", name: "Verdieping 19", location: "oost" },
    { id: "f20-w", name: "Verdieping 20", location: "west" },
    { id: "f20-o", name: "Verdieping 20", location: "oost" },
    { id: "f21-w", name: "Verdieping 21", location: "west" },
    { id: "f21-o", name: "Verdieping 21", location: "oost" },
    { id: "f22-w", name: "Verdieping 22", location: "west" },
    { id: "f22-o", name: "Verdieping 22", location: "oost" },
    { id: "f23-w", name: "Verdieping 23", location: "west" },
    { id: "f23-o", name: "Verdieping 23", location: "oost" },
    { id: "f24", name: "Verdieping 24", location: "" },
  ]

  // State for form values
  const [formState, setFormState] = useState({
    floorStatus: {},
    additionalInfo: {
      totalAlarm: false,
      emergency112: false,
      externalWorkers: "",
      tours: "",
      events: "",
      aedUsed: false,
    },
    comments: "",
  })

  // Update form state
  const updateFormState = (section, field, value) => {
    setFormState((prev) => ({
      ...prev,
      [section]: typeof prev[section] === "object" ? { ...prev[section], [field]: value } : value,
    }))
  }

  return (
    <div className="h-[calc(100vh-60px)] max-h-[calc(100vh-60px)] overflow-hidden">
      <table className="w-full border-collapse border text-[9px]">
        <thead>
          <tr className="bg-gray-100">
            <th colSpan={5} className="border p-1 text-left">
              Overzicht Ontruimingsslip Provinciehuis
            </th>
            <th colSpan={2} className="border p-1 text-left">
              Aanvullende informatie
            </th>
            <th colSpan={2} className="border p-1 text-left">
              Opmerkingen
            </th>
          </tr>
          <tr className="bg-gray-50">
            <th className="border p-0.5 text-left">Verdieping</th>
            <th className="border p-0.5 text-center">ontruimd</th>
            <th className="border p-0.5 text-center">MiVa aanwezig</th>
            <th className="border p-0.5 text-center">MiVa ontruimd</th>
            <th className="border p-0.5 text-left">Opmerkingen</th>
            <th colSpan={2} className="border p-0.5 text-left">
              Gereed
            </th>
            <th colSpan={2} className="border p-0.5 text-left">
              Aandachtspunten
            </th>
          </tr>
        </thead>
        <tbody>
          {/* First row with additional info */}
          <tr>
            <td className="border p-0.5">
              {floors[0].name} {floors[0].location}
            </td>
            <td className="border p-0.5 text-center">
              <Checkbox
                id={`evacuated-${floors[0].id}`}
                checked={formState.floorStatus[`${floors[0].id}-evacuated`] || false}
                onCheckedChange={(checked) =>
                  updateFormState("floorStatus", `${floors[0].id}-evacuated`, checked === true)
                }
                className="h-2 w-2"
              />
            </td>
            <td className="border p-0.5 text-center">
              <Checkbox
                id={`miva-present-${floors[0].id}`}
                checked={formState.floorStatus[`${floors[0].id}-mivaPresent`] || false}
                onCheckedChange={(checked) =>
                  updateFormState("floorStatus", `${floors[0].id}-mivaPresent`, checked === true)
                }
                className="h-2 w-2"
              />
            </td>
            <td className="border p-0.5 text-center">
              <Checkbox
                id={`miva-evacuated-${floors[0].id}`}
                checked={formState.floorStatus[`${floors[0].id}-mivaEvacuated`] || false}
                onCheckedChange={(checked) =>
                  updateFormState("floorStatus", `${floors[0].id}-mivaEvacuated`, checked === true)
                }
                className="h-2 w-2"
              />
            </td>
            <td className="border p-0.5">
              <Input
                id={`comments-${floors[0].id}`}
                value={formState.floorStatus[`${floors[0].id}-comments`] || ""}
                onChange={(e) => updateFormState("floorStatus", `${floors[0].id}-comments`, e.target.value)}
                className="h-4 text-[9px]"
              />
            </td>
            <td colSpan={2} className="border p-0.5">
              <div className="flex items-center space-x-0.5">
                <Checkbox
                  id="total-alarm"
                  checked={formState.additionalInfo.totalAlarm}
                  onCheckedChange={(checked) => updateFormState("additionalInfo", "totalAlarm", checked === true)}
                  className="h-2 w-2"
                />
                <label htmlFor="total-alarm" className="text-[9px]">
                  Totaal alarm gemaakt?
                </label>
              </div>
            </td>
            <td colSpan={2} rowSpan={3} className="border p-0.5">
              <textarea
                id="comments"
                value={formState.comments}
                onChange={(e) => updateFormState("comments", "", e.target.value)}
                className="h-full w-full resize-none border-0 p-0 text-[9px]"
                placeholder="Opmerkingen..."
              />
            </td>
          </tr>

          {/* Second row with additional info */}
          <tr>
            <td className="border p-0.5">
              {floors[1].name} {floors[1].location}
            </td>
            <td className="border p-0.5 text-center">
              <Checkbox
                id={`evacuated-${floors[1].id}`}
                checked={formState.floorStatus[`${floors[1].id}-evacuated`] || false}
                onCheckedChange={(checked) =>
                  updateFormState("floorStatus", `${floors[1].id}-evacuated`, checked === true)
                }
                className="h-2 w-2"
              />
            </td>
            <td className="border p-0.5 text-center">
              <Checkbox
                id={`miva-present-${floors[1].id}`}
                checked={formState.floorStatus[`${floors[1].id}-mivaPresent`] || false}
                onCheckedChange={(checked) =>
                  updateFormState("floorStatus", `${floors[1].id}-mivaPresent`, checked === true)
                }
                className="h-2 w-2"
              />
            </td>
            <td className="border p-0.5 text-center">
              <Checkbox
                id={`miva-evacuated-${floors[1].id}`}
                checked={formState.floorStatus[`${floors[1].id}-mivaEvacuated`] || false}
                onCheckedChange={(checked) =>
                  updateFormState("floorStatus", `${floors[1].id}-mivaEvacuated`, checked === true)
                }
                className="h-2 w-2"
              />
            </td>
            <td className="border p-0.5">
              <Input
                id={`comments-${floors[1].id}`}
                value={formState.floorStatus[`${floors[1].id}-comments`] || ""}
                onChange={(e) => updateFormState("floorStatus", `${floors[1].id}-comments`, e.target.value)}
                className="h-4 text-[9px]"
              />
            </td>
            <td colSpan={2} className="border p-0.5">
              <div className="flex items-center space-x-0.5">
                <Checkbox
                  id="emergency-112"
                  checked={formState.additionalInfo.emergency112}
                  onCheckedChange={(checked) => updateFormState("additionalInfo", "emergency112", checked === true)}
                  className="h-2 w-2"
                />
                <label htmlFor="emergency-112" className="text-[9px]">
                  1-1-2 gewaarschuwd?
                </label>
              </div>
            </td>
          </tr>

          {/* Third row with additional info */}
          <tr>
            <td className="border p-0.5">
              {floors[2].name} {floors[2].location}
            </td>
            <td className="border p-0.5 text-center">
              <Checkbox
                id={`evacuated-${floors[2].id}`}
                checked={formState.floorStatus[`${floors[2].id}-evacuated`] || false}
                onCheckedChange={(checked) =>
                  updateFormState("floorStatus", `${floors[2].id}-evacuated`, checked === true)
                }
                className="h-2 w-2"
              />
            </td>
            <td className="border p-0.5 text-center">
              <Checkbox
                id={`miva-present-${floors[2].id}`}
                checked={formState.floorStatus[`${floors[2].id}-mivaPresent`] || false}
                onCheckedChange={(checked) =>
                  updateFormState("floorStatus", `${floors[2].id}-mivaPresent`, checked === true)
                }
                className="h-2 w-2"
              />
            </td>
            <td className="border p-0.5 text-center">
              <Checkbox
                id={`miva-evacuated-${floors[2].id}`}
                checked={formState.floorStatus[`${floors[2].id}-mivaEvacuated`] || false}
                onCheckedChange={(checked) =>
                  updateFormState("floorStatus", `${floors[2].id}-mivaEvacuated`, checked === true)
                }
                className="h-2 w-2"
              />
            </td>
            <td className="border p-0.5">
              <Input
                id={`comments-${floors[2].id}`}
                value={formState.floorStatus[`${floors[2].id}-comments`] || ""}
                onChange={(e) => updateFormState("floorStatus", `${floors[2].id}-comments`, e.target.value)}
                className="h-4 text-[9px]"
              />
            </td>
            <td colSpan={2} className="border p-0.5">
              <div className="flex items-center space-x-0.5">
                <label htmlFor="external-workers" className="text-[9px]">
                  Mindervaliden:
                </label>
                <Input
                  id="external-workers"
                  value={formState.additionalInfo.externalWorkers}
                  onChange={(e) => updateFormState("additionalInfo", "externalWorkers", e.target.value)}
                  className="h-4 text-[9px]"
                />
              </div>
            </td>
          </tr>

          {/* Remaining rows */}
          {floors.slice(3).map((floor, index) => (
            <tr key={floor.id}>
              <td className="border p-0.5">
                {floor.name} {floor.location}
              </td>
              <td className="border p-0.5 text-center">
                <Checkbox
                  id={`evacuated-${floor.id}`}
                  checked={formState.floorStatus[`${floor.id}-evacuated`] || false}
                  onCheckedChange={(checked) =>
                    updateFormState("floorStatus", `${floor.id}-evacuated`, checked === true)
                  }
                  className="h-2 w-2"
                />
              </td>
              <td className="border p-0.5 text-center">
                <Checkbox
                  id={`miva-present-${floor.id}`}
                  checked={formState.floorStatus[`${floor.id}-mivaPresent`] || false}
                  onCheckedChange={(checked) =>
                    updateFormState("floorStatus", `${floor.id}-mivaPresent`, checked === true)
                  }
                  className="h-2 w-2"
                />
              </td>
              <td className="border p-0.5 text-center">
                <Checkbox
                  id={`miva-evacuated-${floor.id}`}
                  checked={formState.floorStatus[`${floor.id}-mivaEvacuated`] || false}
                  onCheckedChange={(checked) =>
                    updateFormState("floorStatus", `${floor.id}-mivaEvacuated`, checked === true)
                  }
                  className="h-2 w-2"
                />
              </td>
              <td className="border p-0.5">
                <Input
                  id={`comments-${floor.id}`}
                  value={formState.floorStatus[`${floor.id}-comments`] || ""}
                  onChange={(e) => updateFormState("floorStatus", `${floor.id}-comments`, e.target.value)}
                  className="h-4 text-[9px]"
                />
              </td>
              {index === 0 && (
                <>
                  <td colSpan={2} className="border p-0.5">
                    <div className="flex items-center space-x-0.5">
                      <label htmlFor="external-workers" className="text-[9px]">
                        Externe monteurs in huis (aantal):
                      </label>
                      <Input
                        id="external-workers"
                        value={formState.additionalInfo.externalWorkers}
                        onChange={(e) => updateFormState("additionalInfo", "externalWorkers", e.target.value)}
                        className="h-4 text-[9px]"
                      />
                    </div>
                  </td>
                  <td colSpan={2} className="border p-0.5">
                    <div className="flex items-center space-x-0.5">
                      <label htmlFor="tours" className="text-[9px]">
                        Rondleidingen:
                      </label>
                      <Input
                        id="tours"
                        value={formState.additionalInfo.tours}
                        onChange={(e) => updateFormState("additionalInfo", "tours", e.target.value)}
                        className="h-4 text-[9px]"
                      />
                    </div>
                  </td>
                </>
              )}
              {index === 1 && (
                <>
                  <td colSpan={2} className="border p-0.5">
                    <div className="flex items-center space-x-0.5">
                      <label htmlFor="events" className="text-[9px]">
                        Evenementen:
                      </label>
                      <Input
                        id="events"
                        value={formState.additionalInfo.events}
                        onChange={(e) => updateFormState("additionalInfo", "events", e.target.value)}
                        className="h-4 text-[9px]"
                      />
                    </div>
                  </td>
                  <td colSpan={2} className="border p-0.5">
                    <div className="flex items-center space-x-0.5">
                      <Checkbox
                        id="aed-used"
                        checked={formState.additionalInfo.aedUsed}
                        onCheckedChange={(checked) => updateFormState("additionalInfo", "aedUsed", checked === true)}
                        className="h-2 w-2"
                      />
                      <label htmlFor="aed-used" className="text-[9px]">
                        AED gebruikt (BG of -1)
                      </label>
                    </div>
                  </td>
                </>
              )}
              {index === 2 && (
                <>
                  <td colSpan={2} className="border p-0.5 text-center font-bold">
                    Gebruikt
                  </td>
                  <td colSpan={2} className="border p-0.5 text-center font-bold">
                    Toegang en sleutels
                  </td>
                </>
              )}
              {index === 3 && (
                <>
                  <td colSpan={2} className="border p-0.5">
                    <div className="flex items-center space-x-0.5">
                      <Checkbox className="h-2 w-2" />
                      <span className="text-[9px]">Gesloten gedeelte</span>
                    </div>
                  </td>
                  <td colSpan={2} className="border p-0.5">
                    <div className="flex items-center space-x-0.5">
                      <Checkbox className="h-2 w-2" />
                      <span className="text-[9px]">Sleutelkluis poort</span>
                    </div>
                  </td>
                </>
              )}
              {index === 4 && (
                <>
                  <td colSpan={2} className="border p-0.5">
                    <div className="flex items-center space-x-0.5">
                      <Checkbox className="h-2 w-2" />
                      <span className="text-[9px]">Hart der provincie</span>
                    </div>
                  </td>
                  <td colSpan={2} className="border p-0.5">
                    <div className="flex items-center space-x-0.5">
                      <Checkbox className="h-2 w-2" />
                      <span className="text-[9px]">Sleutelkluis brandweeringang</span>
                    </div>
                  </td>
                </>
              )}
              {index === 5 && (
                <>
                  <td colSpan={2} className="border p-0.5">
                    <div className="flex items-center space-x-0.5">
                      <Checkbox className="h-2 w-2" />
                      <span className="text-[9px]">Ter hoogte van de persruimte</span>
                    </div>
                  </td>
                  <td colSpan={2} className="border p-0.5">
                    <div className="flex items-center space-x-0.5">
                      <Checkbox className="h-2 w-2" />
                      <span className="text-[9px]">Losse sleutels</span>
                    </div>
                  </td>
                </>
              )}
              {index === 6 && (
                <>
                  <td colSpan={2} className="border p-0.5">
                    <div className="flex items-center space-x-0.5">
                      <Checkbox className="h-2 w-2" />
                      <span className="text-[9px]">Ter hoogte van de directiekamers</span>
                    </div>
                  </td>
                  <td colSpan={2} className="border p-0.5 text-center font-bold">
                    Opmerkingen
                  </td>
                </>
              )}
              {index === 7 && (
                <>
                  <td colSpan={2} className="border p-0.5">
                    <div className="flex items-center space-x-0.5">
                      <Checkbox className="h-2 w-2" />
                      <span className="text-[9px]">Ter hoogte van de griffeikamer</span>
                    </div>
                  </td>
                  <td colSpan={2} rowSpan={4} className="border p-0.5">
                    <textarea
                      className="h-full w-full resize-none border-0 p-0 text-[9px]"
                      placeholder="Opmerkingen..."
                    />
                  </td>
                </>
              )}
              {index === 8 && (
                <>
                  <td colSpan={2} className="border p-0.5 text-center font-bold">
                    Gereed
                  </td>
                </>
              )}
              {index === 9 && (
                <>
                  <td colSpan={2} className="border p-0.5 text-center font-bold">
                    Taken
                  </td>
                </>
              )}
              {index === 10 && (
                <>
                  <td colSpan={2} className="border p-0.5">
                    <div className="flex items-center space-x-0.5">
                      <Checkbox className="h-2 w-2" />
                      <span className="text-[9px]">Technische verdieping</span>
                    </div>
                  </td>
                </>
              )}
              {index === 11 && (
                <>
                  <td colSpan={2} className="border p-0.5">
                    <div className="flex items-center space-x-0.5">
                      <Checkbox className="h-2 w-2" />
                      <span className="text-[9px]">Verzamelplaats ingericht?</span>
                    </div>
                  </td>
                  <td colSpan={2} className="border p-0.5 text-center font-bold">
                    Opmerkingen
                  </td>
                </>
              )}
              {index === 12 && (
                <>
                  <td colSpan={2} className="border p-0.5">
                    <div className="flex items-center space-x-0.5">
                      <Checkbox className="h-2 w-2" />
                      <span className="text-[9px]">BHV (ploegleider) op de verzamelplaats?</span>
                    </div>
                  </td>
                  <td colSpan={2} rowSpan={4} className="border p-0.5">
                    <textarea
                      className="h-full w-full resize-none border-0 p-0 text-[9px]"
                      placeholder="Opmerkingen..."
                    />
                  </td>
                </>
              )}
              {index === 13 && (
                <>
                  <td colSpan={2} className="border p-0.5">
                    <div className="flex items-center space-x-0.5">
                      <Checkbox className="h-2 w-2" />
                      <span className="text-[9px]">Opvang hulpverlingsdiensten door Ploegleider</span>
                    </div>
                  </td>
                </>
              )}
              {index === 14 && (
                <>
                  <td colSpan={2} className="border p-0.5">
                    <div className="flex items-center space-x-0.5">
                      <Checkbox className="h-2 w-2" />
                      <span className="text-[9px]">Ophalen mindervaliden</span>
                    </div>
                  </td>
                </>
              )}
              {index === 15 && (
                <>
                  <td colSpan={2} className="border p-0.5">
                    <div className="flex items-center space-x-0.5">
                      <Checkbox className="h-2 w-2" />
                      <span className="text-[9px]">Stand-by EHBO</span>
                    </div>
                  </td>
                </>
              )}
              {index === 16 && (
                <>
                  <td colSpan={2} className="border p-0.5">
                    <div className="flex items-center space-x-0.5">
                      <Checkbox className="h-2 w-2" />
                      <span className="text-[9px]">Aanwezige gevaarlijke stoffen die meedoen</span>
                    </div>
                  </td>
                  <td colSpan={2} className="border p-0.5 text-center font-bold">
                    Sleepmatras ingezet
                  </td>
                </>
              )}
              {index === 17 && (
                <>
                  <td colSpan={2} className="border p-0.5 text-center font-bold">
                    Gereed
                  </td>
                  <td colSpan={2} className="border p-0.5">
                    <div className="flex items-center space-x-0.5">
                      <Checkbox className="h-2 w-2" />
                      <span className="text-[9px]">Verdieping 22</span>
                    </div>
                  </td>
                </>
              )}
              {index === 18 && (
                <>
                  <td colSpan={2} className="border p-0.5 text-center font-bold">
                    Gebruik Liften
                  </td>
                  <td colSpan={2} className="border p-0.5">
                    <div className="flex items-center space-x-0.5">
                      <Checkbox className="h-2 w-2" />
                      <span className="text-[9px]">Verdieping 17</span>
                    </div>
                  </td>
                </>
              )}
              {index === 19 && (
                <>
                  <td colSpan={2} className="border p-0.5">
                    <div className="flex items-center space-x-0.5">
                      <Checkbox className="h-2 w-2" />
                      <span className="text-[9px]">Brandweer lift A</span>
                    </div>
                  </td>
                  <td colSpan={2} className="border p-0.5">
                    <div className="flex items-center space-x-0.5">
                      <Checkbox className="h-2 w-2" />
                      <span className="text-[9px]">Verdieping 14</span>
                    </div>
                  </td>
                </>
              )}
              {index === 20 && (
                <>
                  <td colSpan={2} className="border p-0.5">
                    <div className="flex items-center space-x-0.5">
                      <Checkbox className="h-2 w-2" />
                      <span className="text-[9px]">Evacuatielift B</span>
                    </div>
                  </td>
                  <td colSpan={2} className="border p-0.5">
                    <div className="flex items-center space-x-0.5">
                      <Checkbox className="h-2 w-2" />
                      <span className="text-[9px]">Verdieping 11</span>
                    </div>
                  </td>
                </>
              )}
              {index === 21 && (
                <>
                  <td colSpan={2} className="border p-0.5">
                    <div className="flex items-center space-x-0.5">
                      <Checkbox className="h-2 w-2" />
                      <span className="text-[9px]">Lift C</span>
                    </div>
                  </td>
                  <td colSpan={2} className="border p-0.5 text-center font-bold">
                    Opmerkingen (Portofoon nummer, BHV'er)
                  </td>
                </>
              )}
              {index === 22 && (
                <>
                  <td colSpan={2} className="border p-0.5">
                    <div className="flex items-center space-x-0.5">
                      <Checkbox className="h-2 w-2" />
                      <span className="text-[9px]">Lift D</span>
                    </div>
                  </td>
                  <td colSpan={2} rowSpan={4} className="border p-0.5">
                    <textarea
                      className="h-full w-full resize-none border-0 p-0 text-[9px]"
                      placeholder="Opmerkingen..."
                    />
                  </td>
                </>
              )}
              {index > 22 && index < 60 && (
                <>
                  <td colSpan={2} className="border p-0.5"></td>
                  {index > 26 && <td colSpan={2} className="border p-0.5"></td>}
                </>
              )}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={9} className="border p-0.5 text-[8px] text-gray-500">
              Hangt op brandslanghaspelkast 22 west
            </td>
          </tr>
          <tr>
            <td colSpan={9} className="border p-0.5 text-[8px] text-gray-500">
              Hangt op trapluik 23 naast de centrale trap
            </td>
          </tr>
          <tr>
            <td colSpan={9} className="border p-0.5 text-[8px] text-gray-500">
              Opmerkingen
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
