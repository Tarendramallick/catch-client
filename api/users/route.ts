import { type NextRequest, NextResponse } from "next/server"

// GET /api/users - Get all users/team members
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")
    const department = searchParams.get("department")
    const status = searchParams.get("status")
    const limit = searchParams.get("limit")
    const offset = searchParams.get("offset")

    // Mock users data
    const users = [
      {
        id: "1",
        name: "Sarah Johnson",
        email: "sarah@company.com",
        phone: "+1 (555) 123-4567",
        role: "Manager",
        department: "Sales",
        status: "Active",
        avatar: "/placeholder.svg?height=40&width=40",
        joinDate: "2023-06-15",
        lastActive: "2024-01-15",
        tasksAssigned: 12,
        tasksCompleted: 8,
        dealsAssigned: 5,
        totalRevenue: 145000,
      },
      {
        id: "2",
        name: "Mike Chen",
        email: "mike@company.com",
        phone: "+1 (555) 987-6543",
        role: "Sales Rep",
        department: "Sales",
        status: "Active",
        avatar: "/placeholder.svg?height=40&width=40",
        joinDate: "2023-08-20",
        lastActive: "2024-01-14",
        tasksAssigned: 15,
        tasksCompleted: 12,
        dealsAssigned: 3,
        totalRevenue: 98000,
      },
    ]

    // Apply filters
    let filteredUsers = users
    if (role) {
      filteredUsers = filteredUsers.filter((user) => user.role === role)
    }
    if (department) {
      filteredUsers = filteredUsers.filter((user) => user.department === department)
    }
    if (status) {
      filteredUsers = filteredUsers.filter((user) => user.status === status)
    }

    // Apply pagination
    if (limit && offset) {
      const limitNum = Number.parseInt(limit)
      const offsetNum = Number.parseInt(offset)
      filteredUsers = filteredUsers.slice(offsetNum, offsetNum + limitNum)
    }

    // Calculate summary statistics
    const totalRevenue = filteredUsers.reduce((sum, user) => sum + user.totalRevenue, 0)
    const totalTasks = filteredUsers.reduce((sum, user) => sum + user.tasksAssigned, 0)
    const completedTasks = filteredUsers.reduce((sum, user) => sum + user.tasksCompleted, 0)
    const roleDistribution = filteredUsers.reduce(
      (acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return NextResponse.json({
      success: true,
      data: filteredUsers,
      total: users.length,
      filtered: filteredUsers.length,
      summary: {
        totalRevenue,
        totalTasks,
        completedTasks,
        roleDistribution,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 })
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, role, department, status } = body

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json({ success: false, error: "Name and email are required" }, { status: 400 })
    }

    // In a real app, you would save to database
    const newUser = {
      id: `u${Date.now()}`,
      name,
      email,
      phone: phone || "",
      role: role || "Sales Rep",
      department: department || "Sales",
      status: status || "Active",
      avatar: "/placeholder.svg?height=40&width=40",
      joinDate: new Date().toISOString().split("T")[0],
      lastActive: new Date().toISOString().split("T")[0],
      tasksAssigned: 0,
      tasksCompleted: 0,
      dealsAssigned: 0,
      totalRevenue: 0,
    }

    return NextResponse.json(
      {
        success: true,
        data: newUser,
        message: "User created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create user" }, { status: 500 })
  }
}
