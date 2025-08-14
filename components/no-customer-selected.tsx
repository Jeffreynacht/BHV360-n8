"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, ArrowRight, Users, Shield } from "lucide-react"
import { useCustomer } from "@/components/customer-context"

export function NoCustomerSelected() {
  const { customers, setSelectedCustomer } = useCustomer()

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header met BHV360 branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img
              src="/images/bhv360-logo.png"
              alt="BHV360"
              className="h-16 w-auto"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?height=64&width=160&text=BHV360"
              }}
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welkom bij BHV360</h1>
          <p className="text-lg text-gray-600">Professioneel BHV management systeem</p>
        </div>

        {/* Klant selectie */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Selecteer een klant om te beginnen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customers.map((customer) => (
                <div
                  key={customer.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <div className="flex items-start space-x-3">
                    {customer.logo ? (
                      <img
                        src={customer.logo || "/placeholder.svg"}
                        alt={customer.name}
                        className="h-10 w-auto max-w-[80px] flex-shrink-0"
                        onError={(e) => {
                          e.currentTarget.src =
                            "/placeholder.svg?height=40&width=60&text=" +
                            encodeURIComponent(customer.name.substring(0, 2))
                        }}
                      />
                    ) : (
                      <div className="h-10 w-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{customer.name}</h3>
                      <p className="text-sm text-gray-600 truncate">{customer.address}</p>
                      <p className="text-xs text-gray-500 mt-1">{customer.contactPerson}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3 bg-transparent">
                    Selecteren
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Features overzicht */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">BHV Plotkaarten</h3>
              <p className="text-sm text-gray-600">
                Interactieve plattegronden met alle veiligheidsvoorzieningen en NFC-tags
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Gebruikersbeheer</h3>
              <p className="text-sm text-gray-600">Rol-gebaseerde toegang voor verschillende gebruikerstypen</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Building2 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Multi-tenant</h3>
              <p className="text-sm text-gray-600">Ondersteuning voor meerdere klanten met eigen branding</p>
            </CardContent>
          </Card>
        </div>

        {/* Call to action */}
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">
            Selecteer een klant hierboven om toegang te krijgen tot alle BHV360 functionaliteiten
          </p>
          <div className="text-xs text-gray-500">Powered by BHV360 - Professional Safety Management</div>
        </div>
      </div>
    </div>
  )
}
