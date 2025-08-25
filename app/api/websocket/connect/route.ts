import { type NextRequest, NextResponse } from "next/server"
import { WebSocketServer } from "ws"
import { createServer } from "http"
import { supabase } from "@/lib/supabase"

interface WebSocketConnection {
  userId: number | null
  connectionId: string
  customerId: number | null
  role: string | null
  connectedAt: Date
  lastActivity: Date
  rooms: Set<string>
  ws: any
}

interface WebSocketMessage {
  action: "join_room" | "leave_room" | "send_message" | "broadcast_to_room" | "send_direct_message" | "ping"
  roomId?: string
  targetUserId?: number
  data?: any
  connectionId?: string
}

// WebSocket server instance
let wss: WebSocketServer | null = null
const connections = new Map<string, WebSocketConnection>()
const rooms = new Map<string, Set<string>>()

// WebSocket connection manager
class WebSocketManager {
  private static instance: WebSocketManager

  static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager()
    }
    return WebSocketManager.instance
  }

  initialize() {
    if (this.wss) return

    const server = createServer()
    this.wss = new WebSocketServer({ server })

    this.wss.on("connection", (ws, req) => {
      const connectionId = this.generateConnectionId()
      const url = new URL(req.url!, `http://${req.headers.host}`)
      const userId = url.searchParams.get("userId")
      const customerId = url.searchParams.get("customerId")
      const role = url.searchParams.get("role")

      // Store connection info
      const connection: WebSocketConnection = {
        userId: userId ? Number.parseInt(userId) : null,
        connectionId,
        customerId: customerId ? Number.parseInt(customerId) : null,
        role,
        connectedAt: new Date(),
        lastActivity: new Date(),
        rooms: new Set(),
        ws,
      }
      connections.set(connectionId, connection)

      console.log(`WebSocket connected: ${connectionId} (User: ${userId}, Customer: ${customerId})`)

      // Send welcome message
      ws.send(
        JSON.stringify({
          type: "connection_established",
          connectionId,
          timestamp: new Date().toISOString(),
          message: "WebSocket connection established successfully",
        }),
      )

      // Handle messages
      ws.on("message", async (data) => {
        try {
          const message = JSON.parse(data.toString())
          await this.handleMessage(connectionId, message)
        } catch (error) {
          console.error("WebSocket message parse error:", error)
          ws.send(JSON.stringify({ type: "error", message: "Invalid message format" }))
        }
      })

      // Handle disconnect
      ws.on("close", () => {
        this.handleDisconnect(connectionId)
      })

      // Handle connection errors
      ws.on("error", (error: Error) => {
        console.error(`WebSocket error for connection ${connectionId}:`, error)
        connections.delete(connectionId)
      })

      // Ping/Pong for connection health
      const pingInterval = setInterval(() => {
        if (ws.readyState === ws.OPEN) {
          ws.ping()
          connection.lastActivity = new Date()
        } else {
          clearInterval(pingInterval)
        }
      }, 30000) // Ping every 30 seconds
    })

    server.listen(process.env.WEBSOCKET_PORT || 3001)
    console.log("WebSocket server started on port", process.env.WEBSOCKET_PORT || 3001)
  }

  private generateConnectionId(): string {
    return `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private async handleMessage(connectionId: string, message: any) {
    const connection = connections.get(connectionId)
    if (!connection) return

    connection.lastActivity = new Date()

    switch (message.type) {
      case "join_room":
        await this.joinRoom(connectionId, message.roomId)
        break

      case "leave_room":
        await this.leaveRoom(connectionId, message.roomId)
        break

      case "room_message":
        await this.sendRoomMessage(connectionId, message.roomId, message.message)
        break

      case "direct_message":
        await this.sendDirectMessage(connectionId, message.targetUserId, message.message)
        break

      case "ping":
        connection.ws.send(
          JSON.stringify({
            type: "pong",
            timestamp: new Date().toISOString(),
          }),
        )
        break

      default:
        connection.ws.send(
          JSON.stringify({
            type: "error",
            message: "Unknown message type",
          }),
        )
    }
  }

  private handleDisconnect(connectionId: string) {
    const connection = connections.get(connectionId)
    if (!connection) return

    // Remove from all rooms
    connection.rooms.forEach((roomId: string) => {
      const room = rooms.get(roomId)
      if (room) {
        room.delete(connectionId)
        if (room.size === 0) {
          rooms.delete(roomId)
        }
      }
    })

    connections.delete(connectionId)
    console.log(`WebSocket disconnected: ${connectionId}`)
  }

  private async joinRoom(connectionId: string, roomId: string) {
    const connection = connections.get(connectionId)
    if (!connection) return

    // Add to room
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set())
    }
    rooms.get(roomId).add(connectionId)
    connection.rooms.add(roomId)

    // Notify user
    connection.ws.send(
      JSON.stringify({
        type: "room_joined",
        roomId,
        timestamp: new Date().toISOString(),
      }),
    )

    // Notify other room members
    this.broadcastToRoom(
      roomId,
      {
        type: "user_joined_room",
        userId: connection.userId,
        roomId,
        timestamp: new Date().toISOString(),
      },
      connectionId,
    )

    // Log activity
    await this.logActivity(connection.userId, connection.customerId, "joined_room", { roomId })
  }

  private async leaveRoom(connectionId: string, roomId: string) {
    const connection = connections.get(connectionId)
    if (!connection) return

    // Remove from room
    const room = rooms.get(roomId)
    if (room) {
      room.delete(connectionId)
      if (room.size === 0) {
        rooms.delete(roomId)
      }
    }
    connection.rooms.delete(roomId)

    // Notify user
    connection.ws.send(
      JSON.stringify({
        type: "room_left",
        roomId,
        timestamp: new Date().toISOString(),
      }),
    )

    // Notify other room members
    this.broadcastToRoom(
      roomId,
      {
        type: "user_left_room",
        userId: connection.userId,
        roomId,
        timestamp: new Date().toISOString(),
      },
      connectionId,
    )

    // Log activity
    await this.logActivity(connection.userId, connection.customerId, "left_room", { roomId })
  }

  private async sendRoomMessage(connectionId: string, roomId: string, message: any) {
    const connection = connections.get(connectionId)
    if (!connection || !connection.rooms.has(roomId)) return

    const messageData = {
      type: "room_message",
      roomId,
      fromUserId: connection.userId,
      message,
      timestamp: new Date().toISOString(),
    }

    // Broadcast to all room members
    this.broadcastToRoom(roomId, messageData)

    // Store message in database
    await supabase.from("websocket_messages").insert({
      room_id: roomId,
      from_user_id: connection.userId,
      customer_id: connection.customerId,
      message_type: "room_message",
      content: message,
      timestamp: new Date().toISOString(),
    })

    // Log activity
    await this.logActivity(connection.userId, connection.customerId, "sent_room_message", { roomId, message })
  }

  private async sendDirectMessage(connectionId: string, targetUserId: number, message: any) {
    const connection = connections.get(connectionId)
    if (!connection) return

    // Find target user's connections
    const targetConnections = Array.from(connections.values()).filter((conn) => conn.userId === targetUserId)

    const messageData = {
      type: "direct_message",
      fromUserId: connection.userId,
      toUserId: targetUserId,
      message,
      timestamp: new Date().toISOString(),
    }

    // Send to all target user's connections
    targetConnections.forEach((targetConn) => {
      if (targetConn.ws.readyState === targetConn.ws.OPEN) {
        targetConn.ws.send(JSON.stringify(messageData))
      }
    })

    // Send confirmation to sender
    connection.ws.send(
      JSON.stringify({
        type: "message_sent",
        toUserId: targetUserId,
        timestamp: new Date().toISOString(),
      }),
    )

    // Store message in database
    await supabase.from("websocket_messages").insert({
      from_user_id: connection.userId,
      to_user_id: targetUserId,
      customer_id: connection.customerId,
      message_type: "direct_message",
      content: message,
      timestamp: new Date().toISOString(),
    })

    // Log activity
    await this.logActivity(connection.userId, connection.customerId, "sent_direct_message", { targetUserId, message })
  }

  private broadcastToRoom(roomId: string, message: any, excludeConnectionId?: string) {
    const room = rooms.get(roomId)
    if (!room) return

    room.forEach((connectionId: string) => {
      if (connectionId === excludeConnectionId) return

      const connection = connections.get(connectionId)
      if (connection && connection.ws.readyState === connection.ws.OPEN) {
        connection.ws.send(JSON.stringify(message))
      }
    })
  }

  private async logActivity(userId: number | null, customerId: number | null, action: string, details: any) {
    if (!userId || !customerId) return

    try {
      await supabase.from("activity_logs").insert({
        user_id: userId,
        customer_id: customerId,
        action: `websocket_${action}`,
        details,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Error logging WebSocket activity:", error)
    }
  }
}

// Initialize WebSocket server
const wsManager = WebSocketManager.getInstance()
wsManager.initialize()

export async function GET(request: NextRequest) {
  try {
    // Initialize WebSocket server if not already running
    if (!wss) {
      const port = Number.parseInt(process.env.WEBSOCKET_PORT || "3001")
      wss = new WebSocketServer({ port })

      console.log(`🔌 WebSocket server started on port ${port}`)

      wss.on("connection", wsManager.wss.listeners("connection")[0])
    }

    // Return WebSocket server status
    return NextResponse.json({
      success: true,
      message: "WebSocket server is running",
      port: process.env.WEBSOCKET_PORT || "3001",
      connections: connections.size,
      rooms: rooms.size,
      status: "active",
    })
  } catch (error) {
    console.error("Error starting WebSocket server:", error)
    return NextResponse.json({ error: "Failed to start WebSocket server" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case "broadcast":
        return await handleBroadcast(data)
      case "direct_message":
        return await handleDirectMessage(data)
      case "join_room":
        return await handleJoinRoom(data)
      case "leave_room":
        return await handleLeaveRoom(data)
      case "get_status":
        return getServerStatus()
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error handling WebSocket action:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function handleBroadcast(data: any) {
  const { message, targetAudience, priority = "normal" } = data

  let targetConnections = Array.from(connections.values())

  // Filter by audience
  if (targetAudience) {
    if (targetAudience.customerId) {
      targetConnections = targetConnections.filter((conn) => conn.customerId === targetAudience.customerId)
    }
    if (targetAudience.role) {
      targetConnections = targetConnections.filter((conn) => conn.role === targetAudience.role)
    }
  }

  const broadcastMessage = {
    type: "broadcast",
    message,
    priority,
    timestamp: new Date().toISOString(),
  }

  // Send to all target connections
  let sentCount = 0
  targetConnections.forEach((connection) => {
    if (connection.ws.readyState === connection.ws.OPEN) {
      connection.ws.send(JSON.stringify(broadcastMessage))
      sentCount++
    }
  })

  return NextResponse.json({
    success: true,
    message: "Broadcast sent successfully",
    sentTo: sentCount,
    totalConnections: connections.size,
  })
}

async function handleDirectMessage(data: any) {
  const { fromUserId, toUserId, message } = data

  const targetConnections = Array.from(connections.values()).filter((conn) => conn.userId === toUserId)

  const messageData = {
    type: "direct_message",
    fromUserId,
    toUserId,
    message,
    timestamp: new Date().toISOString(),
  }

  let sentCount = 0
  targetConnections.forEach((connection) => {
    if (connection.ws.readyState === connection.ws.OPEN) {
      connection.ws.send(JSON.stringify(messageData))
      sentCount++
    }
  })

  return NextResponse.json({
    success: true,
    message: "Direct message sent successfully",
    sentTo: sentCount,
  })
}

async function handleJoinRoom(data: any) {
  const { connectionId, roomId } = data
  await wsManager.joinRoom(connectionId, roomId)

  return NextResponse.json({
    success: true,
    message: "Joined room successfully",
  })
}

async function handleLeaveRoom(data: any) {
  const { connectionId, roomId } = data
  await wsManager.leaveRoom(connectionId, roomId)

  return NextResponse.json({
    success: true,
    message: "Left room successfully",
  })
}

function getServerStatus() {
  const connectionStats = Array.from(connections.values()).reduce(
    (stats, conn) => {
      const role = conn.role || "unknown"
      stats[role] = (stats[role] || 0) + 1
      return stats
    },
    {} as Record<string, number>,
  )

  return NextResponse.json({
    success: true,
    status: {
      totalConnections: connections.size,
      totalRooms: rooms.size,
      connectionsByRole: connectionStats,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  })
}
