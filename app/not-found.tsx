import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, ArrowLeft, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Pagina niet gevonden</CardTitle>
          <CardDescription className="text-gray-600">
            De pagina die je zoekt bestaat niet of is verplaatst.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Terug naar home
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Naar dashboard
              </Link>
            </Button>
          </div>
          <div className="text-sm text-gray-500 mt-6">
            <p>Hulp nodig?</p>
            <Link href="/help" className="text-blue-600 hover:underline">
              Bekijk onze help pagina
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
