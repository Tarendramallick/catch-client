import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getNotesCollection } from "@/lib/database/collections"

export const dynamic = "force-dynamic"

// GET /api/notes - Get all notes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const client = searchParams.get("client")
    const assignee = searchParams.get("assignee")
    const pinned = searchParams.get("pinned")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const notesCol = await getNotesCollection()
    const query: Record<string, any> = {}
    if (client) query.client = { $regex: client, $options: "i" }
    if (assignee) query.assignedToId = ObjectId.isValid(assignee) ? new ObjectId(assignee) : assignee
    if (pinned === "true") query.isPinned = true

    const total = await notesCol.countDocuments(query)
    const docs = await notesCol.find(query).sort({ createdDate: -1 }).skip(offset).limit(limit).toArray()

    const data = docs.map((d) => ({ id: d._id?.toString(), ...d }))

    const pinnedNotes = data.filter((n: any) => n.isPinned).length
    const clientDistribution = data.reduce((acc: Record<string, number>, n: any) => {
      const key = n.client || "Internal"
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})

    return NextResponse.json({
      success: true,
      data,
      total,
      filtered: data.length,
      summary: { pinnedNotes, clientDistribution },
    })
  } catch (error) {
    console.error("[notes.GET] error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch notes" }, { status: 500 })
  }
}

// POST /api/notes - Create a new note
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, client, assignedToId, dueDate, tags } = body

    if (!title || !content) {
      return NextResponse.json({ success: false, error: "Title and content are required" }, { status: 400 })
    }

    const notesCol = await getNotesCollection()
    const now = new Date()
    const doc = {
      title,
      content,
      client: client || "Internal",
      assignedToId: assignedToId && ObjectId.isValid(assignedToId) ? new ObjectId(assignedToId) : assignedToId || null,
      createdDate: now,
      dueDate: dueDate ? new Date(dueDate) : new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      isPinned: false,
      tags: Array.isArray(tags) ? tags : [],
      updatedDate: now,
    }

    const res = await notesCol.insertOne(doc as any)
    const created = { id: res.insertedId.toString(), _id: res.insertedId, ...doc }

    return NextResponse.json({ success: true, data: created, message: "Note created successfully" }, { status: 201 })
  } catch (error) {
    console.error("[notes.POST] error:", error)
    return NextResponse.json({ success: false, error: "Failed to create note" }, { status: 500 })
  }
}
