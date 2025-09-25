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
    console.log("[companies.GET] Fetching company with ID:", params.id)
    const oid = toObjectId(params.id)
    if (!oid) return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 })

    const col = await getCompaniesCollection()
    const doc = await col.findOne({ _id: oid })
    if (!doc) return NextResponse.json({ success: false, error: "Company not found" }, { status: 404 })

    const { _id, ...companyData } = doc
    console.log("[companies.GET] Company found successfully:", _id)
    return NextResponse.json({ success: true, data: { id: String(_id), ...companyData } })
  } catch (error) {
    console.error("[companies.GET] error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch company" }, { status: 500 })
  }
}

// PUT /api/companies/[id]
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("[companies.PUT] Updating company with ID:", params.id)
    const oid = toObjectId(params.id)
    if (!oid) return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 })

    const body = await request.json()
    const $set: Record<string, any> = {}

    // Allow partial updates
    const fields = [
      "name",
      "industry",
      "size",
      "website",
      "phone",
      "email",
      "address",
      "status",
      "description",
      "estimatedARR",
      "employees",
      "location",
      "foundedYear",
      "linkedinUrl",
      "domain",
    ]
    for (const f of fields) if (f in body) $set[f] = body[f]

    $set.updatedDate = new Date()

    const col = await getCompaniesCollection()
    const result = await col.findOneAndUpdate({ _id: oid }, { $set }, { returnDocument: "after" })
    const updated = result.value
    if (!updated) return NextResponse.json({ success: false, error: "Company not found" }, { status: 404 })

    const { _id, ...companyData } = updated
    console.log("[companies.PUT] Company updated successfully:", _id)
    return NextResponse.json({
      success: true,
      data: { id: String(_id), ...companyData },
      message: "Company updated successfully",
    })
  } catch (error) {
    console.error("[companies.PUT] error:", error)
    return NextResponse.json({ success: false, error: "Failed to update company" }, { status: 500 })
  }
}

// PATCH /api/companies/[id]
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("[companies.PATCH] Updating company with ID:", params.id)
    const oid = toObjectId(params.id)
    if (!oid) return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 })

    const body = await request.json()
    const $set: Record<string, any> = {}

    // Allow partial updates
    const fields = [
      "name",
      "industry",
      "size",
      "website",
      "phone",
      "email",
      "address",
      "status",
      "description",
      "estimatedARR",
      "employees",
      "location",
      "foundedYear",
      "linkedinUrl",
      "domain",
    ]
    for (const f of fields) if (f in body) $set[f] = body[f]

    $set.updatedDate = new Date()

    const col = await getCompaniesCollection()
    const result = await col.findOneAndUpdate({ _id: oid }, { $set }, { returnDocument: "after" })
    const updated = result.value
    if (!updated) return NextResponse.json({ success: false, error: "Company not found" }, { status: 404 })

    const { _id, ...companyData } = updated
    console.log("[companies.PATCH] Company updated successfully:", _id)
    return NextResponse.json({
      success: true,
      data: { id: String(_id), ...companyData },
      message: "Company updated successfully",
    })
  } catch (error) {
    console.error("[companies.PATCH] error:", error)
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

    console.log("[companies.DELETE] Company deleted successfully:", params.id)
    return NextResponse.json({ success: true, message: "Company deleted successfully" })
  } catch (error) {
    console.error("[companies.DELETE] error:", error)
    return NextResponse.json({ success: false, error: "Failed to delete company" }, { status: 500 })
  }
}
