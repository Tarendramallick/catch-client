import { type NextRequest, NextResponse } from "next/server"
import { getQuotesCollection } from "@/lib/database/collections"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const col = await getQuotesCollection()
    const total = await col.countDocuments({})
    const docs = await col.find({}).sort({ createdAt: -1 }).skip(offset).limit(limit).toArray()
    const data = docs.map((d) => ({ id: d._id?.toString(), ...d }))
    return NextResponse.json({ success: true, data, total, filtered: data.length })
  } catch (error) {
    console.error("[quotes.GET] error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch quotes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      quoteNumber,
      clientCompany,
      companyInfo,
      items,
      subtotal,
      total,
      attachedFiles = [],
      status = "draft",
    } = body

    const allowedStatuses = ["draft", "sent", "accepted", "declined", "withdrawn"]
    const normalizedStatus = (status || "draft").toString().toLowerCase()
    if (!allowedStatuses.includes(normalizedStatus)) {
      return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 })
    }

    if (!quoteNumber || !clientCompany || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "quoteNumber, clientCompany and at least one item are required" },
        { status: 400 },
      )
    }

    const now = new Date()
    const doc = {
      quoteNumber,
      clientCompany,
      companyInfo: companyInfo || {},
      items,
      subtotal: Number.isFinite(+subtotal) ? +subtotal : 0,
      total: Number.isFinite(+total) ? +total : 0,
      attachedFiles,
      status: normalizedStatus,
      createdAt: now,
      updatedAt: now,
    }

    const col = await getQuotesCollection()
    const res = await col.insertOne(doc as any)
    const created = { id: res.insertedId.toString(), _id: res.insertedId, ...doc }
    return NextResponse.json({ success: true, data: created, message: "Quote created successfully" }, { status: 201 })
  } catch (error) {
    console.error("[quotes.POST] error:", error)
    return NextResponse.json({ success: false, error: "Failed to create quote" }, { status: 500 })
  }
}
