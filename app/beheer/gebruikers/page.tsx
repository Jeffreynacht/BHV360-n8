"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { User } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

async function getUsers(): Promise<User[]> {
  try {
    const res = await fetch("/api/users", {
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch users: ${res.status} ${res.statusText}`)
    }

    const users = await res.json()
    return users
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

async function deleteUser(id: string): Promise<void> {
  try {
    const res = await fetch(`/api/users/${id}`, {
      method: "DELETE",
    })

    if (!res.ok) {
      throw new Error(`Failed to delete user: ${res.status} ${res.statusText}`)
    }

    toast.success("Gebruiker succesvol verwijderd")
  } catch (error) {
    console.error("Error deleting user:", error)
    toast.error("Er is een fout opgetreden bij het verwijderen van de gebruiker")
  }
}

export default function GebruikersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getUsers()
      setUsers(fetchedUsers)
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(search.toLowerCase()))

  const handleDelete = async (id: string) => {
    await deleteUser(id)
    const updatedUsers = users.filter((user) => user.id !== id)
    setUsers(updatedUsers)
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">BHV360 Gebruikers</h1>
      <div className="flex justify-between items-center mb-4">
        <Input
          type="text"
          placeholder="Zoek gebruikers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button>
          <a href="/beheer/gebruikers/aanmaken">Nieuwe gebruiker aanmaken</a>
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Naam</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead className="text-right">Acties</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm">
                      <a href={`/beheer/gebruikers/aanpassen/${user.id}`}>Aanpassen</a>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          Verwijderen
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Weet je het zeker?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Weet je zeker dat je deze gebruiker wilt verwijderen? Deze actie kan niet ongedaan worden
                            gemaakt.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuleren</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(user.id)}>Verwijderen</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Geen gebruikers gevonden.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
