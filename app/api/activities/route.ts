import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getActivitiesCollection } from "@/lib/database/collections"

export const dynamic = "force-dynamic"

// GET /api/activities - Get activity feed
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const entityType = searchParams.get("entityType") // contact, deal, task
    const entityId = searchParams.get("entityId")
    const userId = searchParams.get("userId")
    const type = searchParams.get("type") // call, email, meeting, note, etc.
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const activitiesCol = await getActivitiesCollection()
    const query: Record<string, any> = {}
    if (entityType) query.entityType = entityType
    if (entityId) query.entityId = ObjectId.isValid(entityId) ? new ObjectId(entityId) : entityId
    if (userId) query.userId = ObjectId.isValid(userId) ? new ObjectId(userId) : userId
    if (type) query.type = type

    const total = await activitiesCol.countDocuments(query)
    const docs = await activitiesCol.find(query).sort({ timestamp: -1 }).skip(offset).limit(limit).toArray()

    const data = docs.map((d) => ({ id: d._id?.toString(), ...d }))

    return NextResponse.json({
      success: true,
      data,
      total,
      filtered: data.length,
      hasMore: offset + limit < total,
    })
  } catch (error) {
    console.error("[activities.GET] error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch activities" }, { status: 500 })
  }
}

// POST /api/activities - Create a new activity
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, title, description, entityType, entityId, entityName, userId, userName, metadata } = body

    if (!type || !title || !entityType || !entityId) {
      return NextResponse.json(
        { success: false, error: "Type, title, entityType, and entityId are required" },
        { status: 400 },
      )
    }

    const activitiesCol = await getActivitiesCollection()
    const now = new Date()
    const doc = {
      type,
      title,
      description: description || "",
      timestamp: now,
      userId: userId && ObjectId.isValid(userId) ? new ObjectId(userId) : userId || "1",
      userName: userName || "Current User",
      entityType,
      entityId: ObjectId.isValid(entityId) ? new ObjectId(entityId) : entityId,
      entityName: entityName || "Unknown Entity",
      metadata: metadata || {},
      isPublic: true,
      userAvatar: "/placeholder.svg?height=40&width=40",
    }

    const res = await activitiesCol.insertOne(doc as any)
    const created = { id: res.insertedId.toString(), _id: res.insertedId, ...doc }

    return NextResponse.json(
      { success: true, data: created, message: "Activity created successfully" },
      { status: 201 },
    )
  } catch (error) {
    console.error("[activities.POST] error:", error)
    return NextResponse.json({ success: false, error: "Failed to create activity" }, { status: 500 })
  }
}
