import type { ObjectId } from "mongodb"

export interface Contact {
  _id?: ObjectId
  name: string
  email: string
  phone?: string
  company?: string
  position?: string
  status: "Hot Lead" | "Qualified" | "Cold Lead" | "Nurturing" | "Customer" | "Lost"
  tags: string[]
  website?: string
  avatar?: string
  lastContact?: Date
  createdDate: Date
  updatedDate: Date
  // Relationships
  dealIds: ObjectId[]
  taskIds: ObjectId[]
  companyId?: ObjectId
  assignedToId: ObjectId
  // Additional fields
  source?: string
  leadScore?: number
  notes?: string
  socialProfiles?: {
    linkedin?: string
    twitter?: string
    facebook?: string
  }
  address?: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }
}

export interface ContactNote {
  _id?: ObjectId
  contactId: ObjectId
  content: string
  createdAt: Date
  createdBy: ObjectId
  createdByName: string
  type: "call" | "email" | "meeting" | "note" | "other"
  isPrivate: boolean
}

export interface ContactActivity {
  _id?: ObjectId
  contactId: ObjectId
  type: "call" | "email" | "meeting" | "task" | "note" | "deal_update" | "status_change"
  title: string
  description: string
  timestamp: Date
  userId: ObjectId
  userName: string
  metadata?: Record<string, any>
}
