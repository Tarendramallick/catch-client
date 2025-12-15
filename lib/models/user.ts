import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  name: string
  email: string
  phone?: string
  avatar?: string
  role: "admin" | "manager" | "sales_rep" | "marketing" | "support"
  department: "Sales" | "Marketing" | "Support" | "Management" | "IT"
  status: "Active" | "Inactive" | "Pending"
  joinDate: Date
  lastActive?: Date
  createdDate: Date
  updatedDate: Date
  // Authentication
  passwordHash?: string
  emailVerified: boolean
  resetPasswordToken?: string
  resetPasswordExpires?: Date
  // Preferences
  timezone?: string
  language?: string
  notifications?: {
    email: boolean
    push: boolean
    sms: boolean
  }
  // Performance tracking
  targets?: {
    monthly_revenue?: number
    monthly_deals?: number
    monthly_calls?: number
  }
  permissions?: string[]
  customFields?: Record<string, any>
}

export interface UserSession {
  _id?: ObjectId
  userId: ObjectId
  sessionToken: string
  expires: Date
  createdAt: Date
  ipAddress?: string
  userAgent?: string
}
