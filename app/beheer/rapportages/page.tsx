"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const demoData = [
  {
    id: 1,
    name: "BHV360 - Test Organisatie 1",
    date: "2024-01-01",
    status: "Completed",
  },
  {
    id: 2,
    name: "BHV360 - Test Organisatie 2",
    date: "2024-02-15",
    status: "Pending",
  },
  {
    id: 3,
    name: "BHV360 - Test Organisatie 3",
    date: "2024-03-20",
    status: "In Progress",
  },
]

const RapportagesPage = () => {
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>BHV360 Rapportages</CardTitle>
          <CardDescription>Overzicht van alle rapportages.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Organisatie</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {demoData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default RapportagesPage
