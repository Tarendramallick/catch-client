import type { ObjectId } from "mongodb"

export interface Activity {
  _id?: ObjectId
  type:
    | "contact_created"
    | "contact_updated"
    | "deal_created"
    | "deal_updated"
    | "deal_stage_changed"
    | "task_created"
    | "task_completed"
    | "note_added"
    | "call_logged"
    | "email_sent"
    | "meeting_scheduled"
    | "company_created"
    | "user_login"
    | "custom"
  title: string
  description: string
  timestamp: Date
  // User who performed the action
  userId: ObjectId
  userName: string
  userAvatar?: string
  // Entity the action was performed on
  entityType: "contact" | "deal" | "task" | "company" | "note" | "user" | "system"
  entityId: ObjectId
  entityName: string
  // Additional context
  previousValue?: any
  newValue?: any
  metadata?: Record<string, any>
  // Visibility
  isPublic: boolean
  visibleToUserIds?: ObjectId[]
}
