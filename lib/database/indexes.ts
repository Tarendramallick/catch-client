import { getDatabase } from "../mongodb"
import { COLLECTIONS } from "./collections"

export async function createIndexes() {
  const db = await getDatabase()

  try {
    // Contacts indexes
    await db.collection(COLLECTIONS.CONTACTS).createIndexes([
      { key: { email: 1 }, unique: true },
      { key: { name: 1 } },
      { key: { company: 1 } },
      { key: { status: 1 } },
      { key: { assignedToId: 1 } },
      { key: { createdDate: -1 } },
      { key: { updatedDate: -1 } },
      { key: { tags: 1 } },
      // Text search index
      { key: { name: "text", email: "text", company: "text" } },
    ])

    // Deals indexes
    await db.collection(COLLECTIONS.DEALS).createIndexes([
      { key: { contactId: 1 } },
      { key: { companyId: 1 } },
      { key: { assigneeId: 1 } },
      { key: { stage: 1 } },
      { key: { closeDate: 1 } },
      { key: { value: -1 } },
      { key: { createdDate: -1 } },
      { key: { updatedDate: -1 } },
      // Text search index
      { key: { title: "text", description: "text" } },
    ])

    // Tasks indexes
    await db.collection(COLLECTIONS.TASKS).createIndexes([
      { key: { assigneeId: 1 } },
      { key: { contactId: 1 } },
      { key: { dealId: 1 } },
      { key: { companyId: 1 } },
      { key: { status: 1 } },
      { key: { priority: 1 } },
      { key: { dueDate: 1 } },
      { key: { type: 1 } },
      { key: { createdDate: -1 } },
      // Compound index for overdue tasks
      { key: { status: 1, dueDate: 1 } },
      // Text search index
      { key: { title: "text", description: "text" } },
    ])

    // Companies indexes
    await db.collection(COLLECTIONS.COMPANIES).createIndexes([
      { key: { name: 1 }, unique: true },
      { key: { domain: 1 }, unique: true, sparse: true },
      { key: { industry: 1 } },
      { key: { status: 1 } },
      { key: { assignedToId: 1 } },
      { key: { employees: 1 } },
      { key: { estimatedARR: -1 } },
      { key: { createdDate: -1 } },
      { key: { tags: 1 } },
      // Text search index
      { key: { name: "text", description: "text", industry: "text" } },
    ])

    // Users indexes
    await db
      .collection(COLLECTIONS.USERS)
      .createIndexes([
        { key: { email: 1 }, unique: true },
        { key: { role: 1 } },
        { key: { department: 1 } },
        { key: { status: 1 } },
        { key: { lastActive: -1 } },
        { key: { createdDate: -1 } },
      ])

    // Notes indexes
    await db.collection(COLLECTIONS.NOTES).createIndexes([
      { key: { createdById: 1 } },
      { key: { assignedToId: 1 } },
      { key: { contactId: 1 } },
      { key: { dealId: 1 } },
      { key: { companyId: 1 } },
      { key: { taskId: 1 } },
      { key: { type: 1 } },
      { key: { isPinned: 1 } },
      { key: { createdDate: -1 } },
      { key: { dueDate: 1 } },
      { key: { tags: 1 } },
      // Text search index
      { key: { title: "text", content: "text" } },
    ])

    // Activities indexes
    await db.collection(COLLECTIONS.ACTIVITIES).createIndexes([
      { key: { userId: 1 } },
      { key: { entityType: 1, entityId: 1 } },
      { key: { type: 1 } },
      { key: { timestamp: -1 } },
      { key: { isPublic: 1 } },
      // Compound index for entity activities
      { key: { entityType: 1, entityId: 1, timestamp: -1 } },
      // Compound index for user activities
      { key: { userId: 1, timestamp: -1 } },
    ])

    // Contact Notes indexes
    await db
      .collection(COLLECTIONS.CONTACT_NOTES)
      .createIndexes([
        { key: { contactId: 1 } },
        { key: { createdBy: 1 } },
        { key: { createdAt: -1 } },
        { key: { type: 1 } },
        { key: { isPrivate: 1 } },
      ])

    // Deal Notes indexes
    await db
      .collection(COLLECTIONS.DEAL_NOTES)
      .createIndexes([
        { key: { dealId: 1 } },
        { key: { createdBy: 1 } },
        { key: { createdAt: -1 } },
        { key: { type: 1 } },
        { key: { isPrivate: 1 } },
      ])

    // Task Notes indexes
    await db
      .collection(COLLECTIONS.TASK_NOTES)
      .createIndexes([
        { key: { taskId: 1 } },
        { key: { createdBy: 1 } },
        { key: { createdAt: -1 } },
        { key: { isPrivate: 1 } },
      ])

    // Company Notes indexes
    await db
      .collection(COLLECTIONS.COMPANY_NOTES)
      .createIndexes([
        { key: { companyId: 1 } },
        { key: { createdBy: 1 } },
        { key: { createdAt: -1 } },
        { key: { type: 1 } },
        { key: { isPrivate: 1 } },
      ])

    // User Sessions indexes
    await db.collection(COLLECTIONS.USER_SESSIONS).createIndexes([
      { key: { userId: 1 } },
      { key: { sessionToken: 1 }, unique: true },
      { key: { expires: 1 }, expireAfterSeconds: 0 }, // TTL index
    ])

    console.log("✅ Database indexes created successfully")
  } catch (error) {
    console.error("❌ Error creating indexes:", error)
    throw error
  }
}
