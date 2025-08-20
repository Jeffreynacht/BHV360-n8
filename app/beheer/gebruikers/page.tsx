"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PageHeader } from "@/components/page-header"
import { useToast } from "@/hooks/use-toast"
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Search,
  Mail,
  Phone,
  Shield,
  Calendar,
  MoreHorizontal,
  UserCheck,
  UserX,
  X,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: "admin" | "bhv-coordinator" | "employee"
  status: "active" | "inactive"
  lastLogin: string
  createdAt: string
  bhvCertified: boolean
  bhvExpiryDate?: string
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Jan de Vries",
    email: "j.devries@company.nl",
    phone: "+31 6 12345678",
    role: "admin",
    status: "active",
    lastLogin: "2024-01-20T10:30:00Z",
    createdAt: "2023-06-15T09:00:00Z",
    bhvCertified: true,
    bhvExpiryDate: "2025-06-15",
  },
  {
    id: "2",
    name: "Maria Janssen",
    email: "m.janssen@company.nl",
    phone: "+31 6 87654321",
    role: "bhv-coordinator",
    status: "active",
    lastLogin: "2024-01-19T14:15:00Z",
    createdAt: "2023-08-20T11:30:00Z",
    bhvCertified: true,
    bhvExpiryDate: "2024-08-20",
  },
  {
    id: "3",
    name: "Peter van der Berg",
    email: "p.vandenberg@company.nl",
    role: "employee",
    status: "active",
    lastLogin: "2024-01-18T16:45:00Z",
    createdAt: "2023-09-10T13:20:00Z",
    bhvCertified: false,
  },
  {
    id: "4",
    name: "Lisa de Jong",
    email: "l.dejong@company.nl",
    phone: "+31 6 11223344",
    role: "employee",
    status: "inactive",
    lastLogin: "2023-12-15T09:30:00Z",
    createdAt: "2023-05-01T10:00:00Z",
    bhvCertified: true,
    bhvExpiryDate: "2024-05-01",
  },
]

const roleLabels = {
  admin: "Administrator",
  "bhv-coordinator": "BHV Coördinator",
  employee: "Medewerker",
}

const roleColors = {
  admin: "bg-purple-100 text-purple-800",
  "bhv-coordinator": "bg-blue-100 text-blue-800",
  employee: "bg-green-100 text-green-800",
}

const statusColors = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-red-100 text-red-800",
}

const statusLabels = {
  active: "Actief",
  inactive: "Inactief",
}

export default function GebruikersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "employee" as User["role"],
    bhvCertified: false,
    bhvExpiryDate: "",
  })

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  const handleNewUser = () => {
    setEditingUser(null)
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "employee",
      bhvCertified: false,
      bhvExpiryDate: "",
    })
    setIsDialogOpen(true)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      bhvCertified: user.bhvCertified,
      bhvExpiryDate: user.bhvExpiryDate || "",
    })
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingUser(null)
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "employee",
      bhvCertified: false,
      bhvExpiryDate: "",
    })
  }

  const handleSaveUser = () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Fout",
        description: "Naam en email zijn verplicht",
        variant: "destructive",
      })
      return
    }

    if (editingUser) {
      // Update existing user
      setUsers(users.map((user) => (user.id === editingUser.id ? { ...user, ...formData } : user)))
      toast({
        title: "Gebruiker bijgewerkt",
        description: `${formData.name} is succesvol bijgewerkt`,
      })
    } else {
      // Add new user
      const newUser: User = {
        id: Date.now().toString(),
        ...formData,
        status: "active",
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      }
      setUsers([...users, newUser])
      toast({
        title: "Gebruiker toegevoegd",
        description: `${formData.name} is succesvol toegevoegd`,
      })
    }

    handleCloseDialog()
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId))
    toast({
      title: "Gebruiker verwijderd",
      description: "De gebruiker is succesvol verwijderd",
    })
  }

  const handleToggleStatus = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: user.status === "active" ? "inactive" : "active" } : user,
      ),
    )
    toast({
      title: "Status gewijzigd",
      description: "De gebruikersstatus is bijgewerkt",
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("nl-NL")
  }

  const isBhvExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false
    const expiry = new Date(expiryDate)
    const today = new Date()
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 30 && diffDays > 0
  }

  const isBhvExpired = (expiryDate?: string) => {
    if (!expiryDate) return false
    const expiry = new Date(expiryDate)
    const today = new Date()
    return expiry < today
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gebruikers Beheer"
        description="Beheer gebruikers, rollen en BHV certificeringen"
        showBackButton={true}
        backUrl="/dashboard"
      >
        <Button onClick={handleNewUser} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nieuwe Gebruiker
        </Button>
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totaal Gebruikers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actieve Gebruikers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.status === "active").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">BHV Gecertificeerd</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.bhvCertified).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verlopen Certificaten</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => isBhvExpired(u.bhvExpiryDate)).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Zoeken</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Zoek op naam of email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Label htmlFor="role">Rol</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Alle rollen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle rollen</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="bhv-coordinator">BHV Coördinator</SelectItem>
                  <SelectItem value="employee">Medewerker</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-48">
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Alle statussen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle statussen</SelectItem>
                  <SelectItem value="active">Actief</SelectItem>
                  <SelectItem value="inactive">Inactief</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Gebruikers ({filteredUsers.length})</CardTitle>
          <CardDescription>Overzicht van alle gebruikers en hun gegevens</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gebruiker</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>BHV Certificaat</TableHead>
                <TableHead>Laatste Login</TableHead>
                <TableHead className="text-right">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {user.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={roleColors[user.role]}>{roleLabels[user.role]}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[user.status]}>{statusLabels[user.status]}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {user.bhvCertified ? (
                        <>
                          <Badge
                            className={
                              isBhvExpired(user.bhvExpiryDate)
                                ? "bg-red-100 text-red-800"
                                : isBhvExpiringSoon(user.bhvExpiryDate)
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                            }
                          >
                            {isBhvExpired(user.bhvExpiryDate)
                              ? "Verlopen"
                              : isBhvExpiringSoon(user.bhvExpiryDate)
                                ? "Verloopt binnenkort"
                                : "Geldig"}
                          </Badge>
                          {user.bhvExpiryDate && (
                            <div className="text-xs text-muted-foreground">Tot: {formatDate(user.bhvExpiryDate)}</div>
                          )}
                        </>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">Niet gecertificeerd</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{formatDate(user.lastLogin)}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Bewerken
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(user.id)}>
                          {user.status === "active" ? (
                            <>
                              <UserX className="mr-2 h-4 w-4" />
                              Deactiveren
                            </>
                          ) : (
                            <>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Activeren
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Verwijderen
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Geen gebruikers gevonden</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || roleFilter !== "all" || statusFilter !== "all"
                  ? "Probeer je zoekfilters aan te passen"
                  : "Voeg je eerste gebruiker toe om te beginnen"}
              </p>
              {!searchTerm && roleFilter === "all" && statusFilter === "all" && (
                <Button onClick={handleNewUser}>
                  <Plus className="mr-2 h-4 w-4" />
                  Eerste Gebruiker Toevoegen
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>{editingUser ? "Gebruiker Bewerken" : "Nieuwe Gebruiker Toevoegen"}</DialogTitle>
                <DialogDescription>
                  {editingUser ? "Wijzig de gebruikersgegevens" : "Voer de gegevens in voor de nieuwe gebruiker"}
                </DialogDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={handleCloseDialog}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Naam *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Bijv. Jan de Vries"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Adres *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="j.devries@company.nl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefoonnummer</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+31 6 12345678"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Select
                value={formData.role}
                onValueChange={(value: User["role"]) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Medewerker</SelectItem>
                  <SelectItem value="bhv-coordinator">BHV Coördinator</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="bhvCertified"
                  checked={formData.bhvCertified}
                  onChange={(e) => setFormData({ ...formData, bhvCertified: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="bhvCertified">BHV Gecertificeerd</Label>
              </div>

              {formData.bhvCertified && (
                <div className="space-y-2">
                  <Label htmlFor="bhvExpiryDate">Certificaat Vervaldatum</Label>
                  <Input
                    id="bhvExpiryDate"
                    type="date"
                    value={formData.bhvExpiryDate}
                    onChange={(e) => setFormData({ ...formData, bhvExpiryDate: e.target.value })}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handleCloseDialog}>
              Annuleren
            </Button>
            <Button onClick={handleSaveUser}>{editingUser ? "Bijwerken" : "Toevoegen"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
