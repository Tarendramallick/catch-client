import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getTasksCollection } from "@/lib/database/collections"

export const dynamic = "force-dynamic"

// GET /api/tasks - Get all tasks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const assignee = searchParams.get("assignee")
    const status = searchParams.get("status") // completed, pending, overdue
    const priority = searchParams.get("priority")
    const type = searchParams.get("type")
    const dueDate = searchParams.get("dueDate")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const tasksCol = await getTasksCollection()
    const query: Record<string, any> = {}
    if (assignee) query.assigneeId = ObjectId.isValid(assignee) ? new ObjectId(assignee) : assignee
    if (status) query.status = status
    if (priority) query.priority = priority
    if (type) query.type = type
    if (dueDate) query.dueDate = new Date(dueDate)

    const total = await tasksCol.countDocuments(query)
    const docs = await tasksCol.find(query).sort({ createdDate: -1 }).skip(offset).limit(limit).toArray()

    const data = docs.map((d) => ({ id: d._id?.toString(), ...d }))

    const completedTasks = data.filter((t) => t.status === "completed").length
    const pendingTasks = data.filter((t) => t.status !== "completed").length
    const today = new Date()
    const overdueTasks = data.filter((t) => t.status !== "completed" && t.dueDate && new Date(t.dueDate) < today).length

    return NextResponse.json({
      success: true,
      data,
      total,
      filtered: data.length,
      summary: { completed: completedTasks, pending: pendingTasks, overdue: overdueTasks },
    })
  } catch (error) {
    console.error("[tasks.GET] error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch tasks" }, { status: 500 })
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, type, priority, dueDate, dueTime, assigneeId, contactId, dealId, companyId } = body

    if (!title || !assigneeId) {
      return NextResponse.json({ success: false, error: "Title and assignee are required" }, { status: 400 })
    }

    const tasksCol = await getTasksCollection()
    const now = new Date()
    const doc = {
      title,
      description: description || "",
      type: type || "task",
      priority: priority || "medium",
      status: "pending",
      dueDate: dueDate ? new Date(dueDate) : now,
      dueTime: dueTime || "End of day",
      assigneeId: ObjectId.isValid(assigneeId) ? new ObjectId(assigneeId) : assigneeId,
      contactId: contactId && ObjectId.isValid(contactId) ? new ObjectId(contactId) : contactId || null,
      dealId: dealId && ObjectId.isValid(dealId) ? new ObjectId(dealId) : dealId || null,
      companyId: companyId && ObjectId.isValid(companyId) ? new ObjectId(companyId) : companyId || null,
      createdDate: now,
      updatedDate: now,
      completed: false,
    }

    const res = await tasksCol.insertOne(doc as any)
    const created = { id: res.insertedId.toString(), _id: res.insertedId, ...doc }

    return NextResponse.json({ success: true, data: created, message: "Task created successfully" }, { status: 201 })
  } catch (error) {
    console.error("[tasks.POST] error:", error)
    return NextResponse.json({ success: false, error: "Failed to create task" }, { status: 500 })
  }
}
