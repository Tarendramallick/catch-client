import { NextResponse, type NextRequest } from "next/server"
import { ObjectId } from "mongodb"
import { getCompaniesCollection } from "@/lib/database/collections"

export const dynamic = "force-dynamic"

function toObjectId(id: string) {
  if (!ObjectId.isValid(id)) return null
  return new ObjectId(id)
}

// GET /api/companies/[id]
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const oid = toObjectId(params.id)
    if (!oid) return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 })

    const col = await getCompaniesCollection()
    const doc = await col.findOne({ _id: oid })
    if (!doc) return NextResponse.json({ success: false, error: "Company not found" }, { status: 404 })

    return NextResponse.json({ success: true, data: { id: String(doc._id), ...doc } })
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch company" }, { status: 500 })
  }
}

// PUT /api/companies/[id]
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const oid = toObjectId(params.id)
    if (!oid) return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 })

    const body = await request.json()
    const $set: Record<string, any> = {}

    // Allow partial updates
    const fields = ["name", "industry", "size", "website", "phone", "email", "address", "status", "description"]
    for (const f of fields) if (f in body) $set[f] = body[f]

    $set.updatedDate = new Date()

    const col = await getCompaniesCollection()
    const result = await col.findOneAndUpdate({ _id: oid }, { $set }, { returnDocument: "after" })
    const updated = result.value
    if (!updated) return NextResponse.json({ success: false, error: "Company not found" }, { status: 404 })

    return NextResponse.json({
      success: true,
      data: { id: String(updated._id), ...updated },
      message: "Company updated successfully",
    })
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update company" }, { status: 500 })
  }
}

// PATCH /api/companies/[id]
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const oid = toObjectId(params.id)
    if (!oid) return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 })

    const body = await request.json()
    const $set: Record<string, any> = {}

    // Allow partial updates
    const fields = ["name", "industry", "size", "website", "phone", "email", "address", "status", "description"]
    for (const f of fields) if (f in body) $set[f] = body[f]

    $set.updatedDate = new Date()

    const col = await getCompaniesCollection()
    const result = await col.findOneAndUpdate({ _id: oid }, { $set }, { returnDocument: "after" })
    const updated = result.value
    if (!updated) return NextResponse.json({ success: false, error: "Company not found" }, { status: 404 })

    return NextResponse.json({
      success: true,
      data: { id: String(updated._id), ...updated },
      message: "Company updated successfully",
    })
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update company" }, { status: 500 })
  }
}

// DELETE /api/companies/[id]
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const oid = toObjectId(params.id)
    if (!oid) return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 })

    const col = await getCompaniesCollection()
    const res = await col.deleteOne({ _id: oid })
    if (!res.deletedCount) return NextResponse.json({ success: false, error: "Company not found" }, { status: 404 })

    return NextResponse.json({ success: true, message: "Company deleted successfully" })
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete company" }, { status: 500 })
  }
}
