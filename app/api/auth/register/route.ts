import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import { sendWelcomeEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDatabase()

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email })

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const result = await db.collection("users").insertOne({
      name,
      email,
      passwordHash,
      role: "sales_rep",
      department: "Sales",
      status: "Active",
      joinDate: new Date(),
      createdDate: new Date(),
      updatedDate: new Date(),
      emailVerified: false,
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
    })

    // Send welcome email
    try {
      await sendWelcomeEmail(email, name)
    } catch (error) {
      console.error("Failed to send welcome email:", error)
      // Don't fail registration if email fails
    }

    return NextResponse.json({
      message: "User created successfully",
      userId: result.insertedId,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
