import { type NextRequest, NextResponse } from "next/server"
import { getUsersCollection } from "@/lib/database/collections"

export const dynamic = "force-dynamic"

// GET /api/users - Get all users/team members
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")
    const department = searchParams.get("department")
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const usersCol = await getUsersCollection()
    const query: Record<string, any> = {}
    if (role) query.role = role
    if (department) query.department = department
    if (status) query.status = status

    const total = await usersCol.countDocuments(query)
    const docs = await usersCol.find(query).sort({ createdDate: -1 }).skip(offset).limit(limit).toArray()

    const data = docs.map((d) => ({ id: d._id?.toString(), ...d }))
    const totalRevenue = data.reduce((sum, u: any) => sum + (u.totalRevenue || 0), 0)
    const totalTasks = data.reduce((sum, u: any) => sum + (u.tasksAssigned || 0), 0)
    const completedTasks = data.reduce((sum, u: any) => sum + (u.tasksCompleted || 0), 0)
    const roleDistribution = data.reduce((acc: Record<string, number>, u: any) => {
      acc[u.role || "Unknown"] = (acc[u.role || "Unknown"] || 0) + 1
      return acc
    }, {})

    return NextResponse.json({
      success: true,
      data,
      total,
      filtered: data.length,
      summary: { totalRevenue, totalTasks, completedTasks, roleDistribution },
    })
  } catch (error) {
    console.error("[users.GET] error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 })
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, role, department, status } = body

    if (!name || !email) {
      return NextResponse.json({ success: false, error: "Name and email are required" }, { status: 400 })
    }

    const usersCol = await getUsersCollection()
    const now = new Date()
    const doc = {
      name,
      email,
      phone: phone || "",
      role: role || "sales_rep",
      department: department || "Sales",
      status: status || "Active",
      avatar: "/placeholder.svg?height=40&width=40",
      joinDate: now,
      lastActive: now,
      createdDate: now,
      updatedDate: now,
      tasksAssigned: 0,
      tasksCompleted: 0,
      dealsAssigned: 0,
      totalRevenue: 0,
      emailVerified: true,
      notifications: { email: true, push: true, sms: false },
    }

    const res = await usersCol.insertOne(doc as any)
    const created = { id: res.insertedId.toString(), _id: res.insertedId, ...doc }

    return NextResponse.json({ success: true, data: created, message: "User created successfully" }, { status: 201 })
  } catch (error: any) {
    if (error?.code === 11000) {
      return NextResponse.json({ success: false, error: "A user with this email already exists" }, { status: 409 })
    }
    console.error("[users.POST] error:", error)
    return NextResponse.json({ success: false, error: "Failed to create user" }, { status: 500 })
  }
}
