import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { sendPasswordResetEmail } from "@/lib/email"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const db = await getDatabase()
    const user = await db.collection("users").findOne({ email })

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        message: "If an account exists, a password reset email has been sent",
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetPasswordExpires = new Date(Date.now() + 3600000) // 1 hour

    // Store reset token
    await db.collection("users").updateOne(
      { email },
      {
        $set: {
          resetPasswordToken: resetToken,
          resetPasswordExpires,
          updatedDate: new Date(),
        },
      },
    )

    // Send email
    await sendPasswordResetEmail(email, resetToken)

    return NextResponse.json({
      message: "If an account exists, a password reset email has been sent",
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
