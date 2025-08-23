import { type NextRequest, NextResponse } from "next/server"

// GET /api/tasks - Get all tasks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const assignee = searchParams.get("assignee")
    const status = searchParams.get("status") // completed, pending, overdue
    const priority = searchParams.get("priority")
    const type = searchParams.get("type")
    const dueDate = searchParams.get("dueDate")
    const limit = searchParams.get("limit")
    const offset = searchParams.get("offset")

    // Mock tasks data
    const tasks = [
      {
        id: "t1",
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
      },
      {
        id: "t2",
        title: "Send proposal to TechStart",
        description: "Include custom development package details",
        type: "email",
        priority: "high",
        dueDate: "2024-01-15",
        dueTime: "4:30 PM",
        completed: false,
        assigneeId: "2",
        assignee: "Mike Chen",
        contactId: "c2",
        dealId: "d2",
        client: "TechStart Inc",
        createdDate: "2024-01-12",
        updatedDate: "2024-01-14",
      },
    ]

    // Apply filters
    let filteredTasks = tasks
    if (assignee) {
      filteredTasks = filteredTasks.filter((task) => task.assigneeId === assignee)
    }
    if (status) {
      if (status === "completed") {
        filteredTasks = filteredTasks.filter((task) => task.completed)
      } else if (status === "pending") {
        filteredTasks = filteredTasks.filter((task) => !task.completed)
      } else if (status === "overdue") {
        const today = new Date()
        filteredTasks = filteredTasks.filter((task) => !task.completed && new Date(task.dueDate) < today)
      }
    }
    if (priority) {
      filteredTasks = filteredTasks.filter((task) => task.priority === priority)
    }
    if (type) {
      filteredTasks = filteredTasks.filter((task) => task.type === type)
    }
    if (dueDate) {
      filteredTasks = filteredTasks.filter((task) => task.dueDate === dueDate)
    }

    // Apply pagination
    if (limit && offset) {
      const limitNum = Number.parseInt(limit)
      const offsetNum = Number.parseInt(offset)
      filteredTasks = filteredTasks.slice(offsetNum, offsetNum + limitNum)
    }

    // Calculate summary statistics
    const completedTasks = filteredTasks.filter((task) => task.completed).length
    const pendingTasks = filteredTasks.filter((task) => !task.completed).length
    const overdueTasks = filteredTasks.filter((task) => {
      const today = new Date()
      return !task.completed && new Date(task.dueDate) < today
    }).length

    return NextResponse.json({
      success: true,
      data: filteredTasks,
      total: tasks.length,
      filtered: filteredTasks.length,
      summary: {
        completed: completedTasks,
        pending: pendingTasks,
        overdue: overdueTasks,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch tasks" }, { status: 500 })
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, type, priority, dueDate, dueTime, assigneeId, contactId, dealId, client } = body

    // Validate required fields
    if (!title || !assigneeId) {
      return NextResponse.json({ success: false, error: "Title and assignee are required" }, { status: 400 })
    }

    // In a real app, you would save to database
    const newTask = {
      id: `t${Date.now()}`,
      title,
      description: description || "",
      type: type || "task",
      priority: priority || "medium",
      dueDate: dueDate || new Date().toISOString().split("T")[0],
      dueTime: dueTime || "End of day",
      completed: false,
      assigneeId,
      assignee: "Sarah Johnson", // Would lookup from assigneeId
      contactId: contactId || null,
      dealId: dealId || null,
      client: client || "Internal",
      createdDate: new Date().toISOString().split("T")[0],
      updatedDate: new Date().toISOString().split("T")[0],
    }

    return NextResponse.json(
      {
        success: true,
        data: newTask,
        message: "Task created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create task" }, { status: 500 })
  }
}
