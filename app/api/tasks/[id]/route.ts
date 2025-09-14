import { NextResponse, type NextRequest } from "next/server"
import { ObjectId } from "mongodb"
import { getTasksCollection } from "@/lib/database/collections"

export const dynamic = "force-dynamic"

function toObjectId(id: string) {
  if (!ObjectId.isValid(id)) return null
  return new ObjectId(id)
}

// GET /api/tasks/[id]
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const oid = toObjectId(params.id)
    if (!oid) return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 })

    const col = await getTasksCollection()
    const doc = await col.findOne({ _id: oid })
    if (!doc) return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 })

    return NextResponse.json({ success: true, data: { id: String(doc._id), ...doc } })
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch task" }, { status: 500 })
  }
}

// PUT /api/tasks/[id]
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const oid = toObjectId(params.id)
    if (!oid) return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 })

    const body = await request.json()
    const $set: Record<string, any> = {}

    // Allow partial updates
    const fields = ["title", "description", "type", "priority", "status", "dueTime", "client", "completed"]
    for (const f of fields) if (f in body) $set[f] = body[f]

    if ("dueDate" in body) $set.dueDate = body.dueDate ? new Date(body.dueDate) : null
    if ("assigneeId" in body)
      $set.assigneeId = ObjectId.isValid(body.assigneeId) ? new ObjectId(body.assigneeId) : body.assigneeId
    if ("contactId" in body)
      $set.contactId = ObjectId.isValid(body.contactId) ? new ObjectId(body.contactId) : body.contactId || null
    if ("dealId" in body) $set.dealId = ObjectId.isValid(body.dealId) ? new ObjectId(body.dealId) : body.dealId || null
    if ("companyId" in body)
      $set.companyId = ObjectId.isValid(body.companyId) ? new ObjectId(body.companyId) : body.companyId || null

    $set.updatedDate = new Date()

    const col = await getTasksCollection()
    const result = await col.findOneAndUpdate({ _id: oid }, { $set }, { returnDocument: "after" })
    const updated = result.value
    if (!updated) return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 })

    return NextResponse.json({
      success: true,
      data: { id: String(updated._id), ...updated },
      message: "Task updated successfully",
    })
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update task" }, { status: 500 })
  }
}

// PATCH /api/tasks/[id]
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const oid = toObjectId(params.id)
    if (!oid) return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 })

    const body = await request.json()
    const $set: Record<string, any> = {}

    // Allow partial updates
    const fields = ["title", "description", "type", "priority", "status", "dueTime", "client", "completed"]
    for (const f of fields) if (f in body) $set[f] = body[f]

    if ("dueDate" in body) $set.dueDate = body.dueDate ? new Date(body.dueDate) : null
    if ("assigneeId" in body)
      $set.assigneeId = ObjectId.isValid(body.assigneeId) ? new ObjectId(body.assigneeId) : body.assigneeId
    if ("contactId" in body)
      $set.contactId = ObjectId.isValid(body.contactId) ? new ObjectId(body.contactId) : body.contactId || null
    if ("dealId" in body) $set.dealId = ObjectId.isValid(body.dealId) ? new ObjectId(body.dealId) : body.dealId || null
    if ("companyId" in body)
      $set.companyId = ObjectId.isValid(body.companyId) ? new ObjectId(body.companyId) : body.companyId || null

    $set.updatedDate = new Date()

    const col = await getTasksCollection()
    const result = await col.findOneAndUpdate({ _id: oid }, { $set }, { returnDocument: "after" })
    const updated = result.value
    if (!updated) return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 })

    return NextResponse.json({
      success: true,
      data: { id: String(updated._id), ...updated },
      message: "Task updated successfully",
    })
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update task" }, { status: 500 })
  }
}

// DELETE /api/tasks/[id]
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const oid = toObjectId(params.id)
    if (!oid) return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 })

    const col = await getTasksCollection()
    const res = await col.deleteOne({ _id: oid })
    if (!res.deletedCount) return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 })

    return NextResponse.json({ success: true, message: "Task deleted successfully" })
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete task" }, { status: 500 })
  }
}
