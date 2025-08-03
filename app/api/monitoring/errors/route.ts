import { type NextRequest, NextResponse } from "next/server"
import { errorTracker } from "@/lib/monitoring/error-tracker"

// In-memory error storage for demo (in production, use a database)
const errorGroups: Map<string, any> = new Map()
const errorEvents: any[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action") || "events"

    switch (action) {
      case "events": {
        const limit = Number.parseInt(searchParams.get("limit") || "50")
        const events = errorTracker.getRecentErrors(limit)
        return NextResponse.json({
          success: true,
          data: { events },
        })
      }

      case "groups": {
        const groups = errorTracker.getErrorGroups()
        return NextResponse.json({
          success: true,
          data: { groups },
        })
      }

      case "stats": {
        const stats = errorTracker.getErrorStats()
        return NextResponse.json({
          success: true,
          data: stats,
        })
      }

      default:
        return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Errors API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const errorId = errorTracker.recordError(body)

    return NextResponse.json({
      success: true,
      data: { errorId },
    })
  } catch (error) {
    console.error("Error recording error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { fingerprint, action } = body

    if (!fingerprint || !action) {
      return NextResponse.json(
        {
          success: false,
          error: "Fingerprint and action are required",
        },
        { status: 400 },
      )
    }

    if (action === "resolve") {
      if (errorGroups.has(fingerprint)) {
        const group = errorGroups.get(fingerprint)
        group.resolved = true
        group.resolvedAt = new Date().toISOString()

        return NextResponse.json({
          success: true,
          message: "Error group resolved",
        })
      } else {
        return NextResponse.json(
          {
            success: false,
            error: "Error group not found",
          },
          { status: 404 },
        )
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid action",
      },
      { status: 400 },
    )
  } catch (error) {
    console.error("Error updating error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update error",
      },
      { status: 500 },
    )
  }
}

function createFingerprint(message: string, stack?: string): string {
  // Simple fingerprinting based on error message and first line of stack
  const stackLine = stack ? stack.split("\n")[0] : ""
  const combined = `${message}:${stackLine}`

  // Simple hash function
  let hash = 0
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(16)
}

async function sendErrorAlert(errorEvent: any): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL
  if (!webhookUrl) return

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `🚨 BHV360 Error Alert`,
        attachments: [
          {
            color: "danger",
            fields: [
              { title: "Error", value: errorEvent.message, short: false },
              { title: "Level", value: errorEvent.level, short: true },
              { title: "Time", value: errorEvent.timestamp, short: true },
              ...(errorEvent.userId ? [{ title: "User ID", value: errorEvent.userId, short: true }] : []),
              ...(errorEvent.url ? [{ title: "URL", value: errorEvent.url, short: true }] : []),
            ],
          },
        ],
      }),
    })
  } catch (error) {
    console.error("Failed to send error alert:", error)
  }
}
