import type { ObjectId } from "mongodb"

export interface QuoteItem {
  id: string
  name: string
  description?: string
  length?: string
  quantity: number
  rate: number
  total: number
}

export interface Quote {
  _id?: ObjectId
  quoteNumber: string
  clientCompany: string
  companyInfo: {
    name?: string
    address?: string
    phone?: string
    email?: string
    website?: string
  }
  items: QuoteItem[]
  subtotal: number
  // tax removed by request
  total: number
  attachedFiles?: string[]
  createdAt: Date
  updatedAt: Date
  status?: "draft" | "sent" | "accepted" | "declined"
}
