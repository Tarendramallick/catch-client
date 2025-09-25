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
    console.log("=== [v0] COMPANIES PUT API CALLED ===")
    console.log("[v0] [companies.PUT] Updating company with ID:", params.id)
    console.log("[v0] [companies.PUT] ID length:", params.id.length)
    console.log("[v0] [companies.PUT] ID type:", typeof params.id)

    const oid = toObjectId(params.id)
    console.log("[v0] [companies.PUT] ObjectId validation result:", oid)
    console.log("[v0] [companies.PUT] ObjectId valid:", ObjectId.isValid(params.id))

    if (!oid) {
      console.log("[v0] [companies.PUT] Invalid ObjectId, returning 400")
      return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 })
    }

    const body = await request.json()
    console.log("[v0] [companies.PUT] Request body:", JSON.stringify(body, null, 2))

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
    console.log("[v0] [companies.PUT] Update data:", JSON.stringify($set, null, 2))

    console.log("[v0] [companies.PUT] Getting companies collection...")
    const col = await getCompaniesCollection()
    console.log("[v0] [companies.PUT] Got collection successfully")
    console.log("[v0] [companies.PUT] Searching for document with _id:", oid.toString())

    // Check if document exists first
    const existingDoc = await col.findOne({ _id: oid })
    console.log("[v0] [companies.PUT] Existing document found:", existingDoc ? "YES" : "NO")
    if (existingDoc) {
      console.log("[v0] [companies.PUT] Existing document _id:", existingDoc._id.toString())
      console.log("[v0] [companies.PUT] Existing document name:", existingDoc.name)
    } else {
      console.log("[v0] [companies.PUT] NO DOCUMENT FOUND - this is the problem!")
      // Let's also try to find any document to see if the collection is working
      const anyDoc = await col.findOne({})
      console.log("[v0] [companies.PUT] Any document in collection:", anyDoc ? "YES" : "NO")
      if (anyDoc) {
        console.log("[v0] [companies.PUT] Sample document _id:", anyDoc._id.toString())
      }
    }

    console.log("[v0] [companies.PUT] Performing findOneAndUpdate...")
    const result = await col.findOneAndUpdate({ _id: oid }, { $set }, { returnDocument: "after" })
    console.log("[v0] [companies.PUT] Update result:", result)
    console.log("[v0] [companies.PUT] Update result value:", result.value)

    const updated = result.value
    if (!updated) {
      console.log("[v0] [companies.PUT] No document returned from update - returning 404")
      return NextResponse.json({ success: false, error: "Company not found" }, { status: 404 })
    }

    const { _id, ...companyData } = updated
    console.log("[v0] [companies.PUT] Company updated successfully:", _id.toString())
    return NextResponse.json({
      success: true,
      data: { id: String(_id), ...companyData },
      message: "Company updated successfully",
    })
  } catch (error) {
    console.error("[v0] [companies.PUT] CRITICAL ERROR:", error)
    console.error("[v0] [companies.PUT] Error stack:", error instanceof Error ? error.stack : "No stack trace")
    return NextResponse.json({ success: false, error: "Failed to update company" }, { status: 500 })
  }
}

// PATCH /api/companies/[id]
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("[companies.PATCH] Updating company with ID:", params.id)
    const oid = toObjectId(params.id)
    console.log("[companies.PATCH] ObjectId validation result:", oid)
    console.log("[companies.PATCH] ObjectId valid:", ObjectId.isValid(params.id))

    if (!oid) {
      console.log("[companies.PATCH] Invalid ObjectId, returning 400")
      return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 })
    }

    const body = await request.json()
    console.log("[companies.PATCH] Request body:", JSON.stringify(body, null, 2))

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
    console.log("[companies.PATCH] Update data:", JSON.stringify($set, null, 2))

    console.log("[companies.PATCH] Getting companies collection...")
    const col = await getCompaniesCollection()
    console.log("[companies.PATCH] Got collection successfully")
    console.log("[companies.PATCH] Searching for document with _id:", oid.toString())

    // Check if document exists first
    const existingDoc = await col.findOne({ _id: oid })
    console.log("[companies.PATCH] Existing document found:", existingDoc ? "YES" : "NO")
    if (existingDoc) {
      console.log("[companies.PATCH] Existing document _id:", existingDoc._id.toString())
      console.log("[companies.PATCH] Existing document name:", existingDoc.name)
    } else {
      console.log("[companies.PATCH] NO DOCUMENT FOUND - this is the problem!")
      // Let's also try to find any document to see if the collection is working
      const anyDoc = await col.findOne({})
      console.log("[companies.PATCH] Any document in collection:", anyDoc ? "YES" : "NO")
      if (anyDoc) {
        console.log("[companies.PATCH] Sample document _id:", anyDoc._id.toString())
      }
    }

    console.log("[companies.PATCH] Performing findOneAndUpdate...")
    const result = await col.findOneAndUpdate({ _id: oid }, { $set }, { returnDocument: "after" })
    console.log("[companies.PATCH] Update result:", result)
    console.log("[companies.PATCH] Update result value:", result.value)

    const updated = result.value
    if (!updated) {
      console.log("[companies.PATCH] No document returned from update - returning 404")
      return NextResponse.json({ success: false, error: "Company not found" }, { status: 404 })
    }

    const { _id, ...companyData } = updated
    console.log("[companies.PATCH] Company updated successfully:", _id.toString())
    return NextResponse.json({
      success: true,
      data: { id: String(_id), ...companyData },
      message: "Company updated successfully",
    })
  } catch (error) {
    console.error("[companies.PATCH] CRITICAL ERROR:", error)
    console.error("[companies.PATCH] Error stack:", error instanceof Error ? error.stack : "No stack trace")
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
