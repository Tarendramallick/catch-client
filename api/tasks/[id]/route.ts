import { type NextRequest, NextResponse } from "next/server"

// GET /api/tasks/[id] - Get a specific task
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Mock task data with full details
    const task = {
      id,
      title: "Follow up with Acme Corp",
      description: "Discuss pricing and implementation timeline",
      type: "call",
      priority: "high",
      dueDate: "2024-01-15",
      dueTime: "2:00 PM",
      completed: false,
      assigneeId: "1",
      assignee: "Sarah Johnson",
      contactId: "c1",
      dealId: "d1",
      client: "Acme Corp",
      createdDate: "2024-01-10",
      updatedDate: "2024-01-15",
      contact: {
        id: "c1",
        name: "John Smith",
        email: "john@acmecorp.com",
      },
      deal: {
        id: "d1",
        title: "Enterprise Package",
        value: 45000,
        stage: "Proposal",
      },
      notes: [
        {
          id: "n1",
          content: "Need to discuss implementation timeline and pricing structure",
          createdAt: "2024-01-10",
          createdBy: "Sarah Johnson",
        },
      ],
    }

    return NextResponse.json({
      success: true,
      data: task,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch task" }, { status: 500 })
  }
}

// PUT /api/tasks/[id] - Update a task
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { title, description, type, priority, dueDate, dueTime, completed, assigneeId, contactId, dealId, client } =
      body

    // In a real app, update in database
    const updatedTask = {
      id,
      title,
      description,
      type,
      priority,
      dueDate,
      dueTime,
      completed: completed || false,
      assigneeId,
      assignee: "Sarah Johnson", // Would lookup from assigneeId
      contactId,
      dealId,
      client,
      createdDate: "2024-01-10", // Would come from database
      updatedDate: new Date().toISOString().split("T")[0],
    }

    return NextResponse.json({
      success: true,
      data: updatedTask,
      message: "Task updated successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update task" }, { status: 500 })
  }
}

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // In a real app, delete from database
    return NextResponse.json({
      success: true,
      message: "Task deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete task" }, { status: 500 })
  }
}
