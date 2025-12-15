import { type NextRequest, NextResponse } from "next/server"
import { getCompaniesCollection } from "@/lib/database/collections"

export const dynamic = "force-dynamic"

// GET /api/companies - Get all companies
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const industry = searchParams.get("industry")
    const status = searchParams.get("status")
    const minEmployees = searchParams.get("minEmployees")
    const maxEmployees = searchParams.get("maxEmployees")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const companiesCol = await getCompaniesCollection()
    const query: Record<string, any> = {}
    if (industry) query.industry = industry
    if (status) query.status = status
    if (minEmployees) query.employees = { ...(query.employees || {}), $gte: Number.parseInt(minEmployees) }
    if (maxEmployees) query.employees = { ...(query.employees || {}), $lte: Number.parseInt(maxEmployees) }

    const total = await companiesCol.countDocuments(query)
    const docs = await companiesCol.find(query).sort({ createdDate: -1 }).skip(offset).limit(limit).toArray()

    const data = docs.map((d) => ({ id: d._id?.toString(), ...d }))

    return NextResponse.json({ success: true, data, total, filtered: data.length })
  } catch (error) {
    console.error("[companies.GET] error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch companies" }, { status: 500 })
  }
}

// POST /api/companies - Create a new company
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, industry, estimatedARR, linkedinUrl, domain, description, employees, location, foundedYear, status } =
      body

    if (!name) {
      return NextResponse.json({ success: false, error: "Company name is required" }, { status: 400 })
    }

    const companiesCol = await getCompaniesCollection()
    const now = new Date()
    const doc = {
      name,
      industry: industry || "Other",
      estimatedARR: Number.isFinite(+estimatedARR) ? +estimatedARR : 0,
      linkedinUrl: linkedinUrl || "",
      domain: domain || "",
      description: description || "",
      employees: Number.isFinite(+employees) ? +employees : 0,
      location: location || "",
      foundedYear: Number.isFinite(+foundedYear) ? +foundedYear : new Date().getFullYear(),
      status: status || "Prospect",
      createdDate: now,
      updatedDate: now,
      tags: [],
      contactIds: [],
      dealIds: [],
    }

    const res = await companiesCol.insertOne(doc as any)
    const created = { id: res.insertedId.toString(), _id: res.insertedId, ...doc }

    return NextResponse.json({ success: true, data: created, message: "Company created successfully" }, { status: 201 })
  } catch (error: any) {
    if (error?.code === 11000) {
      return NextResponse.json({ success: false, error: "Duplicate company (name/domain)" }, { status: 409 })
    }
    console.error("[companies.POST] error:", error)
    return NextResponse.json({ success: false, error: "Failed to create company" }, { status: 500 })
  }
}
