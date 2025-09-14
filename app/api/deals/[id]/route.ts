import { NextResponse, type NextRequest } from "next/server"
import { ObjectId } from "mongodb"
import { getDealsCollection } from "@/lib/database/collections"

export const dynamic = "force-dynamic"

function toObjectId(id: string) {
  if (!ObjectId.isValid(id)) return null
  return new ObjectId(id)
}

// GET /api/deals/[id]
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const oid = toObjectId(params.id)
    if (!oid) return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 })

    const col = await getDealsCollection()
    const doc = await col.findOne({ _id: oid })
    if (!doc) return NextResponse.json({ success: false, error: "Deal not found" }, { status: 404 })

    return NextResponse.json({ success: true, data: { id: String(doc._id), ...doc } })
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch deal" }, { status: 500 })
  }
}

// PUT /api/deals/[id]
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const oid = toObjectId(params.id)
    if (!oid) return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 })

    const body = await request.json()
    const parseNumber = (v: any, fallback?: number) =>
      Number.isFinite(+v) ? +v : typeof fallback === "number" ? fallback : undefined

    const $set: Record<string, any> = {}

    if ("title" in body) $set.title = body.title
    if ("company" in body) $set.company = body.company
    if ("contactId" in body)
      $set.contactId = ObjectId.isValid(body.contactId) ? new ObjectId(body.contactId) : body.contactId || null
    if ("value" in body) $set.value = parseNumber(body.value, 0)
    if ("stage" in body) $set.stage = body.stage
    if ("probability" in body) $set.probability = parseNumber(body.probability, 0)
    if ("expectedCloseDate" in body)
      $set.expectedCloseDate = body.expectedCloseDate ? new Date(body.expectedCloseDate) : undefined
    if ("closeDate" in body) $set.closeDate = body.closeDate ? new Date(body.closeDate) : undefined
    if ("assignedTo" in body) $set.assignedTo = body.assignedTo
    if ("assigneeId" in body)
      $set.assigneeId = ObjectId.isValid(body.assigneeId) ? new ObjectId(body.assigneeId) : body.assigneeId || null
    if ("description" in body) $set.description = body.description ?? ""
    if ("tags" in body) $set.tags = Array.isArray(body.tags) ? body.tags : []

    $set.updatedDate = new Date()

    if (("title" in body && !$set.title) || ("company" in body && !$set.company)) {
      return NextResponse.json({ success: false, error: "Title and company cannot be empty" }, { status: 400 })
    }

    const col = await getDealsCollection()
    const result = await col.findOneAndUpdate({ _id: oid }, { $set }, { returnDocument: "after" })
    const updated = result.value
    if (!updated) return NextResponse.json({ success: false, error: "Deal not found" }, { status: 404 })

    return NextResponse.json({
      success: true,
      data: { id: String(updated._id), ...updated },
      message: "Deal updated successfully",
    })
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update deal" }, { status: 500 })
  }
}

// PATCH /api/deals/[id]
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const oid = toObjectId(params.id)
    if (!oid) return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 })

    const body = await request.json()
    const parseNumber = (v: any, fallback?: number) =>
      Number.isFinite(+v) ? +v : typeof fallback === "number" ? fallback : undefined

    const $set: Record<string, any> = {}

    // Allow partial updates
    if ("title" in body) $set.title = body.title
    if ("company" in body) $set.company = body.company
    if ("contactId" in body)
      $set.contactId = ObjectId.isValid(body.contactId) ? new ObjectId(body.contactId) : body.contactId || null
    if ("value" in body) $set.value = parseNumber(body.value, 0)
    if ("stage" in body) $set.stage = body.stage
    if ("probability" in body) $set.probability = parseNumber(body.probability, 0)
    if ("expectedCloseDate" in body)
      $set.expectedCloseDate = body.expectedCloseDate ? new Date(body.expectedCloseDate) : undefined
    if ("closeDate" in body) $set.closeDate = body.closeDate ? new Date(body.closeDate) : undefined
    if ("assignedTo" in body) $set.assignedTo = body.assignedTo
    if ("assigneeId" in body)
      $set.assigneeId = ObjectId.isValid(body.assigneeId) ? new ObjectId(body.assigneeId) : body.assigneeId || null
    if ("description" in body) $set.description = body.description ?? ""
    if ("tags" in body) $set.tags = Array.isArray(body.tags) ? body.tags : []

    $set.updatedDate = new Date()

    // Only validate non-empty values if they're being explicitly set
    if (("title" in body && !$set.title) || ("company" in body && !$set.company)) {
      return NextResponse.json({ success: false, error: "Title and company cannot be empty" }, { status: 400 })
    }

    const col = await getDealsCollection()
    const result = await col.findOneAndUpdate({ _id: oid }, { $set }, { returnDocument: "after" })
    const updated = result.value
    if (!updated) return NextResponse.json({ success: false, error: "Deal not found" }, { status: 404 })

    return NextResponse.json({
      success: true,
      data: { id: String(updated._id), ...updated },
      message: "Deal updated successfully",
    })
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update deal" }, { status: 500 })
  }
}

// DELETE /api/deals/[id]
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const oid = toObjectId(params.id)
    if (!oid) return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 })

    const col = await getDealsCollection()
    const res = await col.deleteOne({ _id: oid })
    if (!res.deletedCount) return NextResponse.json({ success: false, error: "Deal not found" }, { status: 404 })

    return NextResponse.json({ success: true, message: "Deal deleted successfully" })
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete deal" }, { status: 500 })
  }
}
