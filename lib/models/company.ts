import type { ObjectId } from "mongodb"

export interface Company {
  _id?: ObjectId
  name: string
  domain?: string
  industry?: string
  description?: string
  website?: string
  phone?: string
  email?: string
  employees?: number
  estimatedARR?: number
  foundedYear?: number
  status: "Prospect" | "Active Customer" | "Former Customer" | "Partner" | "Competitor"
  createdDate: Date
  updatedDate: Date
  // Relationships
  contactIds: ObjectId[]
  dealIds: ObjectId[]
  assignedToId?: ObjectId
  // Additional fields
  linkedinUrl?: string
  twitterHandle?: string
  parentCompanyId?: ObjectId
  subsidiaryIds: ObjectId[]
  tags: string[]
  customFields?: Record<string, any>
  address?: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }
  socialProfiles?: {
    linkedin?: string
    twitter?: string
    facebook?: string
    crunchbase?: string
  }
}

export interface CompanyNote {
  _id?: ObjectId
  companyId: ObjectId
  content: string
  createdAt: Date
  createdBy: ObjectId
  createdByName: string
  type: "research" | "meeting" | "proposal" | "contract" | "other"
  isPrivate: boolean
}
