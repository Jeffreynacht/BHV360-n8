import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function NFCScanLoading() {
  return (
    <div className="p-6 space-y-6">
      {/* Header Skeleton */}
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Main Card Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Skeleton className="w-24 h-24 mx-auto mb-6 rounded-full" />
            <Skeleton className="h-4 w-32 mx-auto mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions Card Skeleton */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Skeleton className="w-5 h-5 mt-0.5" />
            <div className="flex-1">
              <Skeleton className="h-5 w-24 mb-2" />
              <div className="space-y-1">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
