import type { ObjectId } from "mongodb"

export interface Deal {
  _id?: ObjectId
  title: string
  description?: string
  value: number
  currency: string
  stage: "Lead" | "Qualified" | "Proposal" | "Negotiation" | "Closed Won" | "Closed Lost"
  probability: number
  closeDate: Date
  actualCloseDate?: Date
  createdDate: Date
  updatedDate: Date
  // Relationships
  contactId: ObjectId
  companyId?: ObjectId
  assigneeId: ObjectId
  taskIds: ObjectId[]
  // Additional fields
  source?: string
  lostReason?: string
  competitorInfo?: string
  products?: string[]
  customFields?: Record<string, any>
}

export interface DealNote {
  _id?: ObjectId
  dealId: ObjectId
  content: string
  createdAt: Date
  createdBy: ObjectId
  createdByName: string
  type: "note" | "proposal" | "contract" | "meeting" | "other"
  isPrivate: boolean
}

export interface DealActivity {
  _id?: ObjectId
  dealId: ObjectId
  type: "stage_change" | "value_change" | "note_added" | "task_created" | "meeting_scheduled"
  title: string
  description: string
  timestamp: Date
  userId: ObjectId
  userName: string
  previousValue?: any
  newValue?: any
  metadata?: Record<string, any>
}
