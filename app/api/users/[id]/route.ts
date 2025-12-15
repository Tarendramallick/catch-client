import { NextResponse, type NextRequest } from "next/server"
import { ObjectId } from "mongodb"
import { getUsersCollection } from "@/lib/database/collections"

export const dynamic = "force-dynamic"

function toObjectId(id: string) {
  if (!ObjectId.isValid(id)) return null
  return new ObjectId(id)
}

// GET /api/users/[id] - Get a specific user
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const oid = toObjectId(params.id)
    if (!oid) return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 })

    const col = await getUsersCollection()
    const doc = await col.findOne({ _id: oid })
    if (!doc) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })

    return NextResponse.json({ success: true, data: { id: String(doc._id), ...doc } })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch user" }, { status: 500 })
  }
}

// PUT /api/users/[id] - Update a user
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const oid = toObjectId(params.id)
    if (!oid) return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 })

    const body = await request.json()
    const allowed = ["name", "email", "phone", "role", "department", "status", "avatar"]
    const $set: Record<string, any> = {}
    for (const k of allowed) if (k in body) $set[k] = body[k]
    $set.updatedDate = new Date()

    if (!$set.name || !$set.email) {
      return NextResponse.json({ success: false, error: "Name and email are required" }, { status: 400 })
    }

    const col = await getUsersCollection()
    const result = await col.findOneAndUpdate({ _id: oid }, { $set }, { returnDocument: "after" })

    const updated = result.value
    if (!updated) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })

    return NextResponse.json({
      success: true,
      data: { id: String(updated._id), ...updated },
      message: "User updated successfully",
    })
  } catch (error: any) {
    if (error?.code === 11000) {
      return NextResponse.json({ success: false, error: "A user with this email already exists" }, { status: 409 })
    }
    return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 })
  }
}

// PATCH /api/users/[id] - Partially update a user
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const oid = toObjectId(params.id)
    if (!oid) return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 })

    const body = await request.json()
    const allowed = ["name", "email", "phone", "role", "department", "status", "avatar"]
    const $set: Record<string, any> = {}
    for (const k of allowed) if (k in body) $set[k] = body[k]
    $set.updatedDate = new Date()

    if ($set.name && !$set.name.trim()) {
      return NextResponse.json({ success: false, error: "Name cannot be empty" }, { status: 400 })
    }
    if ($set.email && !$set.email.trim()) {
      return NextResponse.json({ success: false, error: "Email cannot be empty" }, { status: 400 })
    }

    const col = await getUsersCollection()
    const result = await col.findOneAndUpdate({ _id: oid }, { $set }, { returnDocument: "after" })

    const updated = result.value
    if (!updated) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })

    return NextResponse.json({
      success: true,
      data: { id: String(updated._id), ...updated },
      message: "User updated successfully",
    })
  } catch (error: any) {
    if (error?.code === 11000) {
      return NextResponse.json({ success: false, error: "A user with this email already exists" }, { status: 409 })
    }
    return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 })
  }
}

// DELETE /api/users/[id] - Delete a user
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const oid = toObjectId(params.id)
    if (!oid) return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 })

    const col = await getUsersCollection()
    const res = await col.deleteOne({ _id: oid })
    if (!res.deletedCount) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })

    return NextResponse.json({ success: true, message: "User deleted successfully" })
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete user" }, { status: 500 })
  }
}
