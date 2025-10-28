import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDealsCollection, getActivitiesCollection } from "@/lib/database/collections"

export const dynamic = "force-dynamic"

// GET /api/deals - Get all deals
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const stage = searchParams.get("stage")
    const assignee = searchParams.get("assignee")
    const minValue = searchParams.get("minValue")
    const maxValue = searchParams.get("maxValue")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const dealsCol = await getDealsCollection()
    const query: Record<string, any> = {}
    if (stage) query.stage = stage
    if (assignee) query.assigneeId = ObjectId.isValid(assignee) ? new ObjectId(assignee) : assignee
    if (minValue) query.value = { ...(query.value || {}), $gte: Number.parseInt(minValue) }
    if (maxValue) query.value = { ...(query.value || {}), $lte: Number.parseInt(maxValue) }

    const total = await dealsCol.countDocuments(query)
    const docs = await dealsCol.find(query).sort({ createdDate: -1 }).skip(offset).limit(limit).toArray()

    const data = docs.map((d) => ({ id: d._id?.toString(), ...d }))
    const totalValue = data.reduce((sum, d) => sum + (d.value || 0), 0)
    const avgDealSize = data.length ? totalValue / data.length : 0
    const stageDistribution = data.reduce((acc: Record<string, number>, d) => {
      acc[d.stage || "Unknown"] = (acc[d.stage || "Unknown"] || 0) + 1
      return acc
    }, {})

    return NextResponse.json({
      success: true,
      data,
      total,
      filtered: data.length,
      summary: { totalValue, avgDealSize, stageDistribution },
    })
  } catch (error) {
    console.error("[deals.GET] error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch deals" }, { status: 500 })
  }
}

// POST /api/deals - Create a new deal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      company,
      industry,
      contactId,
      value,
      stage,
      probability,
      closeDate,
      expectedCloseDate,
      assigneeId,
      assignedTo,
      avatar,
      description,
    } = body

    if (!title || !company || value === undefined) {
      return NextResponse.json({ success: false, error: "Title, company, and value are required" }, { status: 400 })
    }

    const dealsCol = await getDealsCollection()
    const now = new Date()

    const doc = {
      title,
      company,
      industry: industry || "N/A",
      contactId: contactId && ObjectId.isValid(contactId) ? new ObjectId(contactId) : contactId || null,
      value: Number.isFinite(+value) ? +value : 0,
      stage: stage || "Lead",
      probability: Number.isFinite(+probability) ? +probability : 25,
      closeDate: closeDate
        ? new Date(closeDate)
        : expectedCloseDate
          ? new Date(expectedCloseDate)
          : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      expectedCloseDate: expectedCloseDate
        ? new Date(expectedCloseDate)
        : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      assigneeId: assigneeId && ObjectId.isValid(assigneeId) ? new ObjectId(assigneeId) : assigneeId || null,
      assignedTo: assignedTo || "Unassigned",
      avatar: avatar || "/placeholder.svg?height=32&width=32",
      description: description || "",
      createdDate: now,
      updatedDate: now,
      taskIds: [],
      source: "app",
    }

    const res = await dealsCol.insertOne(doc as any)
    const created = { id: res.insertedId.toString(), _id: res.insertedId, ...doc }

    try {
      const activitiesCol = await getActivitiesCollection()
      await activitiesCol.insertOne({
        type: "deal_created",
        title: "New deal created",
        description: `${title} created for ${company} - $${value.toLocaleString()}`,
        timestamp: now,
        userId: assigneeId && ObjectId.isValid(assigneeId) ? new ObjectId(assigneeId) : "1",
        userName: assignedTo || "System",
        userAvatar: avatar || "/placeholder.svg?height=40&width=40",
        entityType: "deal",
        entityId: res.insertedId,
        entityName: title,
        metadata: { company, value, stage },
        isPublic: true,
      } as any)
    } catch (activityError) {
      console.error("[deals.POST] Failed to log activity:", activityError)
    }

    return NextResponse.json({ success: true, data: created, message: "Deal created successfully" }, { status: 201 })
  } catch (error) {
    console.error("[deals.POST] error:", error)
    return NextResponse.json({ success: false, error: "Failed to create deal" }, { status: 500 })
  }
}
