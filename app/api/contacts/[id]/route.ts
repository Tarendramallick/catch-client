import { NextResponse, type NextRequest } from "next/server"
import { ObjectId } from "mongodb"
import { getContactsCollection } from "@/lib/database/collections"

export const dynamic = "force-dynamic"

function toObjectId(id: string) {
  if (!ObjectId.isValid(id)) return null
  return new ObjectId(id)
}

// GET /api/contacts/[id] - Get a specific contact from MongoDB
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const oid = toObjectId(params.id)
    if (!oid) return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 })

    const col = await getContactsCollection()
    const doc = await col.findOne({ _id: oid })
    if (!doc) return NextResponse.json({ success: false, error: "Contact not found" }, { status: 404 })

    return NextResponse.json({ success: true, data: { id: String(doc._id), ...doc } })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch contact" }, { status: 500 })
  }
}

// PUT /api/contacts/[id] - Update a contact in MongoDB
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const oid = toObjectId(params.id)
    if (!oid) return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 })

    const body = await request.json()
    const allowed = ["name", "email", "phone", "company", "position", "status", "tags", "website", "lastContact"]
    const $set: Record<string, any> = {}
    for (const k of allowed) if (k in body) $set[k] = body[k]
    $set.updatedDate = new Date()

    if (!$set.name || !$set.email) {
      return NextResponse.json({ success: false, error: "Name and email are required" }, { status: 400 })
    }

    const col = await getContactsCollection()
    const result = await col.findOneAndUpdate({ _id: oid }, { $set }, { returnDocument: "after" })

    const updated = result.value
    if (!updated) return NextResponse.json({ success: false, error: "Contact not found" }, { status: 404 })

    return NextResponse.json({
      success: true,
      data: { id: String(updated._id), ...updated },
      message: "Contact updated successfully",
    })
  } catch (error: any) {
    if (error?.code === 11000) {
      return NextResponse.json({ success: false, error: "A contact with this email already exists" }, { status: 409 })
    }
    return NextResponse.json({ success: false, error: "Failed to update contact" }, { status: 500 })
  }
}

// DELETE /api/contacts/[id] - Delete a contact in MongoDB
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const oid = toObjectId(params.id)
    if (!oid) return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 })

    const col = await getContactsCollection()
    const res = await col.deleteOne({ _id: oid })
    if (!res.deletedCount) return NextResponse.json({ success: false, error: "Contact not found" }, { status: 404 })

    return NextResponse.json({ success: true, message: "Contact deleted successfully" })
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete contact" }, { status: 500 })
  }
}
