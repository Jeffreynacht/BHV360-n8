"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Building, Users, FileText, Settings, ShieldAlert, Tag, BarChart, Phone } from "lucide-react"
import Link from "next/link"

export default function BeheerPage() {
  const [activeTab, setActiveTab] = useState("gebruikers")

  return (
    <main className="container mx-auto p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">BHV Plotkaart Beheer</h1>
          <p className="text-muted-foreground">Provinciehuis Noord-Brabant</p>
        </div>
        <div className="flex gap-2">
          <Link href="/">
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Naar Plotkaart
            </Button>
          </Link>
          <Link href="/beheer/rapportages">
            <Button variant="default" size="sm">
              <BarChart className="mr-2 h-4 w-4" />
              Rapportages
            </Button>
          </Link>
          <Link href="/beheer/nfc-tags">
            <Button variant="default" size="sm">
              <Tag className="mr-2 h-4 w-4" />
              NFC Tags
            </Button>
          </Link>
          <Link href="/beheer/autorisaties">
            <Button variant="default" size="sm">
              <Phone className="mr-2 h-4 w-4" />
              Autorisaties
            </Button>
          </Link>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="gebruikers">
            <Users className="mr-2 h-4 w-4" />
            Gebruikers
          </TabsTrigger>
          <TabsTrigger value="gebouw">
            <Building className="mr-2 h-4 w-4" />
            Gebouw
          </TabsTrigger>
          <TabsTrigger value="apparatuur">
            <ShieldAlert className="mr-2 h-4 w-4" />
            BHV Apparatuur
          </TabsTrigger>
          <TabsTrigger value="instellingen">
            <Settings className="mr-2 h-4 w-4" />
            Instellingen
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gebruikers">
          <GebruikersBeheer />
        </TabsContent>

        <TabsContent value="gebouw">
          <GebouwBeheer />
        </TabsContent>

        <TabsContent value="apparatuur">
          <ApparatuurBeheer />
        </TabsContent>

        <TabsContent value="instellingen">
          <InstellingenBeheer />
        </TabsContent>
      </Tabs>
    </main>
  )
}

function GebruikersBeheer() {
  // Bestaande code behouden
  return <div>Gebruikersbeheer component</div>
}

function GebouwBeheer() {
  // Bestaande code behouden
  return <div>Gebouwbeheer component</div>
}

function ApparatuurBeheer() {
  // Bestaande code behouden
  return <div>Apparatuurbeheer component</div>
}

function InstellingenBeheer() {
  // Bestaande code behouden
  return <div>Instellingenbeheer component</div>
}
