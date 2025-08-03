import { type NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getUser(request)
    const token = request.cookies.get("auth-token")?.value

    return NextResponse.json({
      isAuthenticated: !!user,
      user: user,
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : null,
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        hasAuthPassword: !!process.env.AUTH_PASSWORD,
        hasJwtSecret: !!process.env.JWT_SECRET,
      },
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
      isAuthenticated: false,
      timestamp: new Date().toISOString(),
    })
  }
}
