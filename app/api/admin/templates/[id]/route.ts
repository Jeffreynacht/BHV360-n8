import { type NextRequest, NextResponse } from "next/server"

interface Template {
  id: string
  name: string
  category: "messaging" | "email" | "notification" | "report" | "form"
  type: "sms" | "email" | "push" | "system" | "pdf" | "html"
  subject?: string
  content: string
  variables: string[]
  isActive: boolean
  isSystem: boolean
  createdAt: string
  updatedAt: string
  usageCount: number
  description?: string
  priority?: "low" | "normal" | "high" | "urgent"
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // In production, fetch from database
    // const template = await db.templates.findUnique({ where: { id } })

    // Mock response
    const mockTemplate: Template = {
      id,
      name: "Sample Template",
      category: "messaging",
      type: "sms",
      content: "Hello {{name}}!",
      variables: ["{{name}}"],
      isActive: true,
      isSystem: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0,
      priority: "normal",
    }

    return NextResponse.json({
      success: true,
      template: mockTemplate,
    })
  } catch (error) {
    console.error("Error fetching template:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch template" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.content || !body.category || !body.type) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // In production, update in database
    // const updatedTemplate = await db.templates.update({
    //   where: { id },
    //   data: {
    //     name: body.name,
    //     category: body.category,
    //     type: body.type,
    //     subject: body.subject,
    //     content: body.content,
    //     variables: body.variables,
    //     isActive: body.isActive,
    //     description: body.description,
    //     priority: body.priority,
    //     updatedAt: new Date().toISOString()
    //   }
    // })

    const updatedTemplate: Template = {
      id,
      name: body.name,
      category: body.category,
      type: body.type,
      subject: body.subject,
      content: body.content,
      variables: body.variables || [],
      isActive: body.isActive ?? true,
      isSystem: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0,
      description: body.description,
      priority: body.priority || "normal",
    }

    return NextResponse.json({
      success: true,
      template: updatedTemplate,
    })
  } catch (error) {
    console.error("Error updating template:", error)
    return NextResponse.json({ success: false, error: "Failed to update template" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Check if template is system template
    // In production, fetch from database first
    // const template = await db.templates.findUnique({ where: { id } })
    // if (template?.isSystem) {
    //   return NextResponse.json(
    //     { success: false, error: "Cannot delete system template" },
    //     { status: 403 }
    //   )
    // }

    // In production, delete from database
    // await db.templates.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: "Template deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting template:", error)
    return NextResponse.json({ success: false, error: "Failed to delete template" }, { status: 500 })
  }
}
