import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getNotesCollection } from "@/lib/database/collections"

export const dynamic = "force-dynamic"
export const revalidate = 0

// PATCH /api/notes/[id] - Update fields on a note
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid note id" }, { status: 400 })
    }
    const body = await request.json()

    const allowed = ["title", "content", "client", "assignedToId", "dueDate", "isPinned", "tags"]
    const update: Record<string, any> = {}
    for (const k of allowed) {
      if (k in body) update[k] = body[k]
    }

    if ("assignedToId" in update && update.assignedToId && ObjectId.isValid(update.assignedToId)) {
      update.assignedToId = new ObjectId(update.assignedToId)
    }
    if ("dueDate" in update && update.dueDate) {
      update.dueDate = new Date(update.dueDate)
    }

    update.updatedDate = new Date()

    const col = await getNotesCollection()
    const res = await col.updateOne({ _id: new ObjectId(id) }, { $set: update })

    if (res.matchedCount === 0) {
      return NextResponse.json({ success: false, error: "Note not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Note updated" })
  } catch (error) {
    console.error("[notes.[id].PATCH] error:", error)
    return NextResponse.json({ success: false, error: "Failed to update note" }, { status: 500 })
  }
}

// DELETE /api/notes/[id] - Delete a note
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid note id" }, { status: 400 })
    }

    const col = await getNotesCollection()
    const res = await col.deleteOne({ _id: new ObjectId(id) })

    if (res.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "Note not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Note deleted" })
  } catch (error) {
    console.error("[notes.[id].DELETE] error:", error)
    return NextResponse.json({ success: false, error: "Failed to delete note" }, { status: 500 })
  }
}
