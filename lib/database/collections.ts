import { getDatabase } from "../mongodb"
import type { Contact, ContactNote, ContactActivity } from "../models/contact"
import type { Deal, DealNote, DealActivity } from "../models/deal"
import type { Task, TaskNote } from "../models/task"
import type { Company, CompanyNote } from "../models/company"
import type { User, UserSession } from "../models/user"
import type { Note } from "../models/note"
import type { Activity } from "../models/activity"

// Collection names
export const COLLECTIONS = {
  CONTACTS: "contacts",
  CONTACT_NOTES: "contact_notes",
  CONTACT_ACTIVITIES: "contact_activities",
  DEALS: "deals",
  DEAL_NOTES: "deal_notes",
  DEAL_ACTIVITIES: "deal_activities",
  TASKS: "tasks",
  TASK_NOTES: "task_notes",
  COMPANIES: "companies",
  COMPANY_NOTES: "company_notes",
  USERS: "users",
  USER_SESSIONS: "user_sessions",
  NOTES: "notes",
  ACTIVITIES: "activities",
  QUOTES: "quotes",
  WORKSPACES: "workspaces",
  WORKSPACE_MESSAGES: "workspace_messages",
} as const

// Helper functions to get typed collections
export async function getContactsCollection() {
  const db = await getDatabase()
  return db.collection<Contact>(COLLECTIONS.CONTACTS)
}

export async function getContactNotesCollection() {
  const db = await getDatabase()
  return db.collection<ContactNote>(COLLECTIONS.CONTACT_NOTES)
}

export async function getContactActivitiesCollection() {
  const db = await getDatabase()
  return db.collection<ContactActivity>(COLLECTIONS.CONTACT_ACTIVITIES)
}

export async function getDealsCollection() {
  const db = await getDatabase()
  return db.collection<Deal>(COLLECTIONS.DEALS)
}

export async function getDealNotesCollection() {
  const db = await getDatabase()
  return db.collection<DealNote>(COLLECTIONS.DEAL_NOTES)
}

export async function getDealActivitiesCollection() {
  const db = await getDatabase()
  return db.collection<DealActivity>(COLLECTIONS.DEAL_ACTIVITIES)
}

export async function getTasksCollection() {
  const db = await getDatabase()
  return db.collection<Task>(COLLECTIONS.TASKS)
}

export async function getTaskNotesCollection() {
  const db = await getDatabase()
  return db.collection<TaskNote>(COLLECTIONS.TASK_NOTES)
}

export async function getCompaniesCollection() {
  const db = await getDatabase()
  return db.collection<Company>(COLLECTIONS.COMPANIES)
}

export async function getCompanyNotesCollection() {
  const db = await getDatabase()
  return db.collection<CompanyNote>(COLLECTIONS.COMPANY_NOTES)
}

export async function getUsersCollection() {
  const db = await getDatabase()
  return db.collection<User>(COLLECTIONS.USERS)
}

export async function getUserSessionsCollection() {
  const db = await getDatabase()
  return db.collection<UserSession>(COLLECTIONS.USER_SESSIONS)
}

export async function getNotesCollection() {
  const db = await getDatabase()
  return db.collection<Note>(COLLECTIONS.NOTES)
}

export async function getActivitiesCollection() {
  const db = await getDatabase()
  return db.collection<Activity>(COLLECTIONS.ACTIVITIES)
}

export async function getQuotesCollection() {
  const db = await getDatabase()
  return db.collection<any>(COLLECTIONS.QUOTES)
}

export async function getWorkspacesCollection() {
  const db = await getDatabase()
  return db.collection<any>(COLLECTIONS.WORKSPACES)
}

export async function getWorkspaceMessagesCollection() {
  const db = await getDatabase()
  return db.collection<any>(COLLECTIONS.WORKSPACE_MESSAGES)
}
