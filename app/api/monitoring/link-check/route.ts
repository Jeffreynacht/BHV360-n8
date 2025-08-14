import { type NextRequest, NextResponse } from "next/server"
import { linkAssetChecker } from "@/lib/monitoring/link-asset-checker"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "all"
    const url = searchParams.get("url")

    if (url) {
      // Check a specific URL
      const result = await linkAssetChecker.checkLink(url)
      return NextResponse.json({ success: true, result })
    }

    switch (type) {
      case "assets":
        const assets = await linkAssetChecker.checkBHV360Assets()
        return NextResponse.json({ success: true, assets })

      case "links":
        const links = await linkAssetChecker.checkExternalLinks()
        return NextResponse.json({ success: true, links })

      case "all":
      default:
        const report = await linkAssetChecker.generateReport()
        return NextResponse.json({ success: true, report })
    }
  } catch (error) {
    console.error("Link check error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { urls, assets } = body

    const results: any = {}

    if (urls && Array.isArray(urls)) {
      results.links = await linkAssetChecker.checkMultipleLinks(urls)
    }

    if (assets && Array.isArray(assets)) {
      results.assets = await linkAssetChecker.checkMultipleAssets(assets)
    }

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error("Bulk link check error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}
