import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getWorkspaceMessagesCollection } from "@/lib/database/collections"

export const dynamic = "force-dynamic"

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const col = await getWorkspaceMessagesCollection()
    const workspaceId = params.id
    const filter = { workspaceId: ObjectId.isValid(workspaceId) ? new ObjectId(workspaceId) : workspaceId }
    const docs = await col.find(filter).sort({ createdAt: 1 }).limit(200).toArray()
    const data = docs.map((d) => ({ id: d._id?.toString(), ...d }))
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[workspace-messages.GET] error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { text, userId, userName } = body
    if (!text || !userId) {
      return NextResponse.json({ success: false, error: "text and userId are required" }, { status: 400 })
    }

    const col = await getWorkspaceMessagesCollection()
    const doc = {
      workspaceId: ObjectId.isValid(params.id) ? new ObjectId(params.id) : params.id,
      text,
      userId: ObjectId.isValid(userId) ? new ObjectId(userId) : userId,
      userName: userName || "User",
      createdAt: new Date(),
    }
    const res = await col.insertOne(doc as any)
    const created = { id: res.insertedId.toString(), _id: res.insertedId, ...doc }
    return NextResponse.json({ success: true, data: created, message: "Message sent" }, { status: 201 })
  } catch (error) {
    console.error("[workspace-messages.POST] error:", error)
    return NextResponse.json({ success: false, error: "Failed to send message" }, { status: 500 })
  }
}
