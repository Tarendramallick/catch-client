import type { ObjectId } from "mongodb"

export interface Task {
  _id?: ObjectId
  title: string
  description?: string
  type: "call" | "email" | "meeting" | "task" | "follow_up" | "demo" | "proposal"
  priority: "low" | "medium" | "high" | "urgent"
  status: "pending" | "in_progress" | "completed" | "cancelled"
  dueDate: Date
  dueTime?: string
  completedDate?: Date
  createdDate: Date
  updatedDate: Date
  // Relationships
  assigneeId: ObjectId
  createdById: ObjectId
  contactId?: ObjectId
  dealId?: ObjectId
  companyId?: ObjectId
  // Additional fields
  estimatedDuration?: number // in minutes
  actualDuration?: number // in minutes
  location?: string
  meetingUrl?: string
  reminderSent: boolean
  customFields?: Record<string, any>
}

export interface TaskNote {
  _id?: ObjectId
  taskId: ObjectId
  content: string
  createdAt: Date
  createdBy: ObjectId
  createdByName: string
  isPrivate: boolean
}
