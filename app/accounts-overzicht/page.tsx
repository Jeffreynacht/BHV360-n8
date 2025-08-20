"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Shield, Users, UserCheck, Eye, Building, Crown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const demoAccounts = [
  {
    id: 1,
    name: "Super Admin",
    email: "admin@bhv360.nl",
    password: "demo123",
    role: "super_admin",
    roleColor: "bg-purple-100 text-purple-800",
    icon: Crown,
    bhvRoles: ["BHV Coördinator", "EHBO", "Ontruiming"],
    permissions: ["Alle rechten", "Systeembeheer", "Klantbeheer", "Gebruikersbeheer"],
    description: "Volledige systeemtoegang, kan alle klanten en partners beheren",
  },
  {
    id: 2,
    name: "Admin Demo",
    email: "admin@demobedrijf.nl",
    password: "demo123",
    role: "admin",
    roleColor: "bg-red-100 text-red-800",
    icon: Shield,
    bhvRoles: ["BHV Coördinator", "EHBO"],
    permissions: ["Organisatie beheer", "BHV rollen toekennen", "Rapportages", "Gebruikersbeheer"],
    description: "Organisatie administrator, kan BHV rollen toekennen en beheren",
  },
  {
    id: 3,
    name: "BHV Coördinator",
    email: "bhv@demobedrijf.nl",
    password: "demo123",
    role: "bhv_coordinator",
    roleColor: "bg-orange-100 text-orange-800",
    icon: UserCheck,
    bhvRoles: ["BHV Coördinator", "EHBO", "Ontruiming"],
    permissions: ["BHV coördinatie", "BHV rollen toekennen", "Incidenten beheren", "Trainingen plannen"],
    description: "BHV coördinatie, kan BHV rollen toekennen en incidenten coördineren",
  },
  {
    id: 4,
    name: "Medewerker",
    email: "medewerker@demobedrijf.nl",
    password: "demo123",
    role: "employee",
    roleColor: "bg-blue-100 text-blue-800",
    icon: Users,
    bhvRoles: ["EHBO"],
    permissions: ["Basis toegang", "Eigen profiel", "Incidenten melden", "Trainingen bekijken"],
    description: "Standaard medewerker met basis BHV rechten",
  },
  {
    id: 5,
    name: "Beveiliging",
    email: "security@demobedrijf.nl",
    password: "demo123",
    role: "security",
    roleColor: "bg-gray-100 text-gray-800",
    icon: Eye,
    bhvRoles: [],
    permissions: ["Bezoeker registratie", "Monteur registratie", "Toegangscontrole"],
    description: "Beveiliging/receptie - kan bezoekers registreren, GEEN BHV rechten",
  },
  {
    id: 6,
    name: "Partner Admin",
    email: "partner@safetyfirst.nl",
    password: "demo123",
    role: "partner_admin",
    roleColor: "bg-green-100 text-green-800",
    icon: Building,
    bhvRoles: ["BHV Coördinator"],
    permissions: ["Partner beheer", "Klanten beheren", "Whitelabel configuratie", "Rapportages"],
    description: "Partner niveau beheer voor whitelabel klanten",
  },
]

const roleHierarchy = [
  { level: 1, role: "Super Admin", description: "Volledige systeemtoegang", color: "bg-purple-100 text-purple-800" },
  { level: 2, role: "Partner Admin", description: "Partner niveau beheer", color: "bg-green-100 text-green-800" },
  { level: 3, role: "Admin", description: "Organisatie administrator", color: "bg-red-100 text-red-800" },
  {
    level: 4,
    role: "BHV Coördinator",
    description: "BHV coördinatie en beheer",
    color: "bg-orange-100 text-orange-800",
  },
  { level: 5, role: "Medewerker", description: "Standaard gebruiker", color: "bg-blue-100 text-blue-800" },
  { level: 6, role: "Beveiliging", description: "Bezoeker/monteur registratie", color: "bg-gray-100 text-gray-800" },
]

const permissions = [
  "Systeembeheer",
  "Klantbeheer",
  "Gebruikersbeheer",
  "BHV rollen toekennen",
  "Incidenten beheren",
  "Rapportages",
  "Bezoeker registratie",
  "Trainingen plannen",
  "Plotkaart bewerken",
  "Whitelabel configuratie",
]

const permissionMatrix = {
  super_admin: [true, true, true, true, true, true, true, true, true, true],
  partner_admin: [false, true, true, true, true, true, false, true, true, true],
  admin: [false, false, true, true, true, true, false, true, true, false],
  bhv_coordinator: [false, false, false, true, true, true, false, true, true, false],
  employee: [false, false, false, false, false, false, false, false, false, false],
  security: [false, false, false, false, false, false, true, false, false, false],
}

export default function AccountsOverzicht() {
  const { toast } = useToast()

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Gekopieerd!",
        description: `${type} is gekopieerd naar het klembord`,
      })
    } catch (err) {
      toast({
        title: "Fout",
        description: "Kon niet kopiëren naar klembord",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Accounts Overzicht</h1>
          <p className="text-gray-600">Alle demo accounts met inloggegevens en rechten</p>
        </div>

        <Tabs defaultValue="accounts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="accounts">Demo Accounts</TabsTrigger>
            <TabsTrigger value="hierarchy">Rol Hiërarchie</TabsTrigger>
            <TabsTrigger value="permissions">Rechten Matrix</TabsTrigger>
          </TabsList>

          <TabsContent value="accounts" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {demoAccounts.map((account) => {
                const IconComponent = account.icon
                return (
                  <Card key={account.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <IconComponent className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{account.name}</CardTitle>
                            <Badge className={account.roleColor}>{account.role.replace("_", " ")}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">Email:</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(account.email, "Email")}
                            className="h-auto p-1 text-blue-600 hover:text-blue-800"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            {account.email}
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">Wachtwoord:</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(account.password, "Wachtwoord")}
                            className="h-auto p-1 text-blue-600 hover:text-blue-800"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            {account.password}
                          </Button>
                        </div>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-gray-600 block mb-2">BHV Rollen:</span>
                        <div className="flex flex-wrap gap-1">
                          {account.bhvRoles.length > 0 ? (
                            account.bhvRoles.map((role, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {role}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="outline" className="text-xs text-gray-500">
                              Geen BHV rechten
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-gray-600 block mb-2">Beschrijving:</span>
                        <p className="text-xs text-gray-500">{account.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="hierarchy" className="space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Rol Hiërarchie</CardTitle>
                <CardDescription>Overzicht van alle rollen van hoog naar laag niveau</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {roleHierarchy.map((item) => (
                    <div key={item.level} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
                        {item.level}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <Badge className={item.color}>{item.role}</Badge>
                          <span className="text-sm text-gray-600">{item.description}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Rechten Matrix</CardTitle>
                <CardDescription>Overzicht van welke rol welke rechten heeft</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-40">Rol</TableHead>
                        {permissions.map((permission) => (
                          <TableHead key={permission} className="text-center min-w-24">
                            <div className="text-xs">{permission}</div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {demoAccounts.map((account) => (
                        <TableRow key={account.id}>
                          <TableCell>
                            <Badge className={account.roleColor}>{account.name}</Badge>
                          </TableCell>
                          {permissionMatrix[account.role as keyof typeof permissionMatrix].map(
                            (hasPermission, index) => (
                              <TableCell key={index} className="text-center">
                                {hasPermission ? (
                                  <span className="text-green-600 font-bold">✓</span>
                                ) : (
                                  <span className="text-red-400">✗</span>
                                )}
                              </TableCell>
                            ),
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
