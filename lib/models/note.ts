import type { ObjectId } from "mongodb"

export interface Note {
  _id?: ObjectId
  title: string
  content: string
  type: "general" | "meeting" | "call" | "research" | "proposal" | "contract"
  priority: "low" | "medium" | "high"
  isPinned: boolean
  isPrivate: boolean
  tags: string[]
  createdDate: Date
  updatedDate: Date
  dueDate?: Date
  // Relationships
  createdById: ObjectId
  assignedToId?: ObjectId
  contactId?: ObjectId
  dealId?: ObjectId
  companyId?: ObjectId
  taskId?: ObjectId
  // Additional fields
  attachments?: {
    filename: string
    url: string
    size: number
    type: string
  }[]
  mentions?: ObjectId[] // User IDs mentioned in the note
  customFields?: Record<string, any>
}
