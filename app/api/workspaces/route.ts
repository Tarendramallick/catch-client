import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getUsersCollection, getWorkspacesCollection } from "@/lib/database/collections"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const col = await getWorkspacesCollection()
    const total = await col.countDocuments({})
    const docs = await col.find({}).sort({ updatedAt: -1 }).skip(offset).limit(limit).toArray()
    const data = docs.map((d) => ({ id: d._id?.toString(), ...d }))
    return NextResponse.json({ success: true, data, total, filtered: data.length })
  } catch (error) {
    console.error("[workspaces.GET] error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch workspaces" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, memberIds = [], createdByUserId } = body

    if (!name || !createdByUserId) {
      return NextResponse.json({ success: false, error: "name and createdByUserId are required" }, { status: 400 })
    }

    const usersCol = await getUsersCollection()
    const creator = await usersCol.findOne(
      ObjectId.isValid(createdByUserId) ? { _id: new ObjectId(createdByUserId) } : { _id: createdByUserId },
    )
    if (!creator || (creator.role || "").toLowerCase() !== "admin") {
      return NextResponse.json({ success: false, error: "Only admins can create workspaces" }, { status: 403 })
    }

    const now = new Date()
    const col = await getWorkspacesCollection()
    const doc = {
      name,
      memberIds: memberIds.filter(Boolean).map((id: string) => (ObjectId.isValid(id) ? new ObjectId(id) : id)),
      createdByUserId: ObjectId.isValid(createdByUserId) ? new ObjectId(createdByUserId) : createdByUserId,
      createdAt: now,
      updatedAt: now,
    }
    const res = await col.insertOne(doc as any)
    const created = { id: res.insertedId.toString(), _id: res.insertedId, ...doc }
    return NextResponse.json({ success: true, data: created, message: "Workspace created" }, { status: 201 })
  } catch (error) {
    console.error("[workspaces.POST] error:", error)
    return NextResponse.json({ success: false, error: "Failed to create workspace" }, { status: 500 })
  }
}
