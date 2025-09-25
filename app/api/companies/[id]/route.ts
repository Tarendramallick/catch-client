import { NextResponse, type NextRequest } from "next/server"
import { ObjectId } from "mongodb"
import { getCompaniesCollection } from "@/lib/database/collections"

export const dynamic = "force-dynamic"

// Helper that works with both ObjectId and string IDs
function parseId(id: string) {
  if (ObjectId.isValid(id)) {
    console.log("[parseId] Detected valid ObjectId:", id)
    return new ObjectId(id)
  }
  console.log("[parseId] Treating id as plain string:", id)
  return id
}

// GET /api/companies/[id]
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("[companies.GET] Fetching company with ID:", params.id)

    const parsedId = parseId(params.id)
    console.log("[companies.GET] Parsed ID type:", typeof parsedId)

    const col = await getCompaniesCollection()
    console.log("[companies.GET] Got companies collection")

    const doc = await col.findOne({ _id: parsedId })
    console.log("[companies.GET] Document found:", doc ? "YES" : "NO")

    if (!doc) {
      return NextResponse.json({ success: false, error: "Company not found" }, { status: 404 })
    }

    const { _id, ...companyData } = doc
    console.log("[companies.GET] Company fetched successfully:", _id.toString())

    return NextResponse.json({ success: true, data: { id: String(_id), ...companyData } })
  } catch (error) {
    console.error("[companies.GET] CRITICAL ERROR:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch company" }, { status: 500 })
  }
}

// PUT /api/companies/[id]
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("=== [v0] COMPANIES PUT API CALLED ===")
    console.log("[companies.PUT] Updating company with ID:", params.id)

    const parsedId = parseId(params.id)

    const body = await request.json()
    console.log("[companies.PUT] Request body:", JSON.stringify(body, null, 2))

    const $set: Record<string, any> = {}
    const fields = [
      "name", "industry", "size", "website", "phone", "email", "address",
      "status", "description", "estimatedARR", "employees", "location",
      "foundedYear", "linkedinUrl", "domain",
    ]
    for (const f of fields) if (f in body) $set[f] = body[f]

    $set.updatedDate = new Date()
    console.log("[companies.PUT] Update data:", JSON.stringify($set, null, 2))

    const col = await getCompaniesCollection()
    console.log("[companies.PUT] Got companies collection")

    const existingDoc = await col.findOne({ _id: parsedId })
    console.log("[companies.PUT] Existing document found:", existingDoc ? "YES" : "NO")

    if (!existingDoc) {
      console.log("[companies.PUT] No document found with ID:", params.id)
      return NextResponse.json({ success: false, error: "Company not found" }, { status: 404 })
    }

    const result = await col.findOneAndUpdate(
      { _id: parsedId },
      { $set },
      { returnDocument: "after" }
    )
    console.log("[companies.PUT] Update result value:", result.value ? "FOUND" : "NOT FOUND")

    if (!result.value) {
      return NextResponse.json({ success: false, error: "Company not found" }, { status: 404 })
    }

    const { _id, ...companyData } = result.value
    console.log("[companies.PUT] Company updated successfully:", _id.toString())

    return NextResponse.json({
      success: true,
      data: { id: String(_id), ...companyData },
      message: "Company updated successfully",
    })
  } catch (error) {
    console.error("[companies.PUT] CRITICAL ERROR:", error)
    return NextResponse.json({ success: false, error: "Failed to update company" }, { status: 500 })
  }
}

// PATCH /api/companies/[id]
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("[companies.PATCH] Updating company with ID:", params.id)

    const parsedId = parseId(params.id)

    const body = await request.json()
    console.log("[companies.PATCH] Request body:", JSON.stringify(body, null, 2))

    const $set: Record<string, any> = {}
    const fields = [
      "name", "industry", "size", "website", "phone", "email", "address",
      "status", "description", "estimatedARR", "employees", "location",
      "foundedYear", "linkedinUrl", "domain",
    ]
    for (const f of fields) if (f in body) $set[f] = body[f]

    $set.updatedDate = new Date()
    console.log("[companies.PATCH] Update data:", JSON.stringify($set, null, 2))

    const col = await getCompaniesCollection()
    console.log("[companies.PATCH] Got companies collection")

    const existingDoc = await col.findOne({ _id: parsedId })
    console.log("[companies.PATCH] Existing document found:", existingDoc ? "YES" : "NO")

    if (!existingDoc) {
      console.log("[companies.PATCH] No document found with ID:", params.id)
      return NextResponse.json({ success: false, error: "Company not found" }, { status: 404 })
    }

    const result = await col.findOneAndUpdate(
      { _id: parsedId },
      { $set },
      { returnDocument: "after" }
    )
    console.log("[companies.PATCH] Update result value:", result.value ? "FOUND" : "NOT FOUND")

    if (!result.value) {
      return NextResponse.json({ success: false, error: "Company not found" }, { status: 404 })
    }

    const { _id, ...companyData } = result.value
    console.log("[companies.PATCH] Company updated successfully:", _id.toString())

    return NextResponse.json({
      success: true,
      data: { id: String(_id), ...companyData },
      message: "Company updated successfully",
    })
  } catch (error) {
    console.error("[companies.PATCH] CRITICAL ERROR:", error)
    return NextResponse.json({ success: false, error: "Failed to update company" }, { status: 500 })
  }
}

// DELETE /api/companies/[id]
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("[companies.DELETE] Deleting company with ID:", params.id)

    const parsedId = parseId(params.id)

    const col = await getCompaniesCollection()
    console.log("[companies.DELETE] Got companies collection")

    const res = await col.deleteOne({ _id: parsedId })
    console.log("[companies.DELETE] Delete result:", res.deletedCount)

    if (!res.deletedCount) {
      return NextResponse.json({ success: false, error: "Company not found" }, { status: 404 })
    }

    console.log("[companies.DELETE] Company deleted successfully:", params.id)
    return NextResponse.json({ success: true, message: "Company deleted successfully" })
  } catch (error) {
    console.error("[companies.DELETE] CRITICAL ERROR:", error)
    return NextResponse.json({ success: false, error: "Failed to delete company" }, { status: 500 })
  }
}
