import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getQuotesCollection } from "@/lib/database/collections"

export const dynamic = "force-dynamic"

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const col = await getQuotesCollection()
    const id = params.id
    const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id }
    const res = await col.deleteOne(filter as any)
    if (res.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "Quote not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, message: "Quote deleted" })
  } catch (error) {
    console.error("[quotes.DELETE] error:", error)
    return NextResponse.json({ success: false, error: "Failed to delete quote" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { status } = body
    const allowedStatuses = ["draft", "sent", "accepted", "declined", "withdrawn"]
    const normalizedStatus = (status || "").toString().toLowerCase()
    if (!allowedStatuses.includes(normalizedStatus)) {
      return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 })
    }

    const col = await getQuotesCollection()
    const id = params.id
    const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id }
    const res = await col.findOneAndUpdate(filter as any, { $set: { status: normalizedStatus, updatedAt: new Date() } })
    if (!res.value) {
      return NextResponse.json({ success: false, error: "Quote not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: { id, status: normalizedStatus } })
  } catch (error) {
    console.error("[quotes.PATCH] error:", error)
    return NextResponse.json({ success: false, error: "Failed to update quote" }, { status: 500 })
  }
}
