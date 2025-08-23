import { type NextRequest, NextResponse } from "next/server"

// GET /api/companies - Get all companies
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const industry = searchParams.get("industry")
    const status = searchParams.get("status")
    const minEmployees = searchParams.get("minEmployees")
    const maxEmployees = searchParams.get("maxEmployees")
    const limit = searchParams.get("limit")
    const offset = searchParams.get("offset")

    // Mock companies data
    const companies = [
      {
        id: "comp1",
        name: "Acme Corp",
        industry: "Technology",
        estimatedARR: 2500000,
        linkedinUrl: "https://linkedin.com/company/acme-corp",
        domain: "acmecorp.com",
        description: "Leading enterprise software company specializing in workflow automation",
        employees: 500,
        location: "San Francisco, CA",
        foundedYear: 2015,
        status: "Active Customer",
        lastActivity: "2024-01-15",
        totalDeals: 3,
        totalContacts: 5,
        createdDate: "2024-01-01",
        updatedDate: "2024-01-15",
      },
      {
        id: "comp2",
        name: "TechStart Inc",
        industry: "Technology",
        estimatedARR: 850000,
        linkedinUrl: "https://linkedin.com/company/techstart-inc",
        domain: "techstart.io",
        description: "Fast-growing startup focused on mobile app development",
        employees: 75,
        location: "Austin, TX",
        foundedYear: 2020,
        status: "Prospect",
        lastActivity: "2024-01-12",
        totalDeals: 1,
        totalContacts: 3,
        createdDate: "2024-01-05",
        updatedDate: "2024-01-12",
      },
    ]

    // Apply filters
    let filteredCompanies = companies
    if (industry) {
      filteredCompanies = filteredCompanies.filter((company) => company.industry === industry)
    }
    if (status) {
      filteredCompanies = filteredCompanies.filter((company) => company.status === status)
    }
    if (minEmployees) {
      filteredCompanies = filteredCompanies.filter((company) => company.employees >= Number.parseInt(minEmployees))
    }
    if (maxEmployees) {
      filteredCompanies = filteredCompanies.filter((company) => company.employees <= Number.parseInt(maxEmployees))
    }

    // Apply pagination
    if (limit && offset) {
      const limitNum = Number.parseInt(limit)
      const offsetNum = Number.parseInt(offset)
      filteredCompanies = filteredCompanies.slice(offsetNum, offsetNum + limitNum)
    }

    // Calculate summary statistics
    const totalARR = filteredCompanies.reduce((sum, company) => sum + company.estimatedARR, 0)
    const avgEmployees =
      filteredCompanies.length > 0
        ? filteredCompanies.reduce((sum, company) => sum + company.employees, 0) / filteredCompanies.length
        : 0
    const industryDistribution = filteredCompanies.reduce(
      (acc, company) => {
        acc[company.industry] = (acc[company.industry] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return NextResponse.json({
      success: true,
      data: filteredCompanies,
      total: companies.length,
      filtered: filteredCompanies.length,
      summary: {
        totalARR,
        avgEmployees,
        industryDistribution,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch companies" }, { status: 500 })
  }
}

// POST /api/companies - Create a new company
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, industry, estimatedARR, linkedinUrl, domain, description, employees, location, foundedYear, status } =
      body

    // Validate required fields
    if (!name) {
      return NextResponse.json({ success: false, error: "Company name is required" }, { status: 400 })
    }

    // In a real app, you would save to database
    const newCompany = {
      id: `comp${Date.now()}`,
      name,
      industry: industry || "Other",
      estimatedARR: Number.parseInt(estimatedARR) || 0,
      linkedinUrl: linkedinUrl || "",
      domain: domain || "",
      description: description || "",
      employees: Number.parseInt(employees) || 0,
      location: location || "",
      foundedYear: Number.parseInt(foundedYear) || new Date().getFullYear(),
      status: status || "Prospect",
      lastActivity: new Date().toISOString().split("T")[0],
      totalDeals: 0,
      totalContacts: 0,
      createdDate: new Date().toISOString().split("T")[0],
      updatedDate: new Date().toISOString().split("T")[0],
    }

    return NextResponse.json(
      {
        success: true,
        data: newCompany,
        message: "Company created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create company" }, { status: 500 })
  }
}
