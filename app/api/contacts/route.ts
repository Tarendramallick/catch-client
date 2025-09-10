import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getContactsCollection, getActivitiesCollection } from "@/lib/database/collections"

export const dynamic = "force-dynamic"

// GET /api/contacts - Get all contacts (from MongoDB)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const company = searchParams.get("company")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const contactsCol = await getContactsCollection()

    const query: Record<string, any> = {}
    if (status) query.status = status
    if (company) query.company = { $regex: company, $options: "i" }

    const total = await contactsCol.countDocuments(query)
    const docs = await contactsCol.find(query).sort({ createdDate: -1 }).skip(offset).limit(limit).toArray()

    const data = docs.map((d) => ({
      id: d._id?.toString(),
      ...d,
    }))

    return NextResponse.json({
      success: true,
      data,
      total,
      filtered: data.length,
    })
  } catch (error) {
    console.error("[contacts.GET] error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch contacts" }, { status: 500 })
  }
}

// POST /api/contacts - Create a new contact (writes to MongoDB)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, company, position, status, tags, website, assignedToId } = body

    if (!name || !email) {
      return NextResponse.json({ success: false, error: "Name and email are required" }, { status: 400 })
    }

    const contactsCol = await getContactsCollection()
    const now = new Date()

    const doc = {
      name,
      email,
      phone: phone || "",
      company: company || "",
      position: position || "",
      status: status || "Cold Lead",
      tags: Array.isArray(tags) ? tags : [],
      website: website || "",
      lastContact: now,
      avatar: "/placeholder.svg?height=40&width=40",
      createdDate: now,
      updatedDate: now,
      assignedToId: assignedToId ? new ObjectId(assignedToId) : undefined,
    }

    const res = await contactsCol.insertOne(doc as any)

    // Optional: log an activity for audit trail
    try {
      const activitiesCol = await getActivitiesCollection()
      await activitiesCol.insertOne({
        type: "contact_created",
        title: "New contact added",
        description: `${doc.name} added to CRM`,
        timestamp: now,
        userId: assignedToId ? new ObjectId(assignedToId) : undefined,
        userName: "System",
        userAvatar: "/placeholder.svg?height=40&width=40",
        entityType: "contact",
        entityId: res.insertedId,
        entityName: doc.name,
        isPublic: true,
        metadata: { source: "app" },
      })
    } catch (e) {
      console.warn("[contacts.POST] activity log failed:", e)
    }

    const created = { id: res.insertedId.toString(), _id: res.insertedId, ...doc }

    return NextResponse.json(
      {
        success: true,
        data: created,
        message: "Contact created successfully",
      },
      { status: 201 },
    )
  } catch (error: any) {
    // Handle duplicate email (unique index) gracefully
    if (error?.code === 11000) {
      return NextResponse.json({ success: false, error: "A contact with this email already exists" }, { status: 409 })
    }
    console.error("[contacts.POST] error:", error)
    return NextResponse.json({ success: false, error: "Failed to create contact" }, { status: 500 })
  }
}
