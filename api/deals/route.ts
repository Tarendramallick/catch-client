import { type NextRequest, NextResponse } from "next/server"

// GET /api/deals - Get all deals
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const stage = searchParams.get("stage")
    const assignee = searchParams.get("assignee")
    const minValue = searchParams.get("minValue")
    const maxValue = searchParams.get("maxValue")
    const limit = searchParams.get("limit")
    const offset = searchParams.get("offset")

    // Mock deals data
    const deals = [
      {
        id: "d1",
        title: "Enterprise Package",
        company: "Acme Corp",
        contactId: "c1",
        value: 45000,
        stage: "Proposal",
        probability: 75,
        closeDate: "2024-02-15",
        assigneeId: "1",
        assignee: "Sarah Johnson",
        description: "Enterprise software solution for 500+ employees",
        createdDate: "2024-01-10",
        updatedDate: "2024-01-15",
      },
      {
        id: "d2",
        title: "Startup Plan",
        company: "TechStart Inc",
        contactId: "c2",
        value: 28500,
        stage: "Negotiation",
        probability: 90,
        closeDate: "2024-02-10",
        assigneeId: "2",
        assignee: "Mike Chen",
        description: "Custom development and consulting services",
        createdDate: "2024-01-08",
        updatedDate: "2024-01-14",
      },
    ]

    // Apply filters
    let filteredDeals = deals
    if (stage) {
      filteredDeals = filteredDeals.filter((deal) => deal.stage === stage)
    }
    if (assignee) {
      filteredDeals = filteredDeals.filter((deal) => deal.assigneeId === assignee)
    }
    if (minValue) {
      filteredDeals = filteredDeals.filter((deal) => deal.value >= Number.parseInt(minValue))
    }
    if (maxValue) {
      filteredDeals = filteredDeals.filter((deal) => deal.value <= Number.parseInt(maxValue))
    }

    // Apply pagination
    if (limit && offset) {
      const limitNum = Number.parseInt(limit)
      const offsetNum = Number.parseInt(offset)
      filteredDeals = filteredDeals.slice(offsetNum, offsetNum + limitNum)
    }

    // Calculate summary statistics
    const totalValue = filteredDeals.reduce((sum, deal) => sum + deal.value, 0)
    const avgDealSize = filteredDeals.length > 0 ? totalValue / filteredDeals.length : 0
    const stageDistribution = filteredDeals.reduce(
      (acc, deal) => {
        acc[deal.stage] = (acc[deal.stage] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return NextResponse.json({
      success: true,
      data: filteredDeals,
      total: deals.length,
      filtered: filteredDeals.length,
      summary: {
        totalValue,
        avgDealSize,
        stageDistribution,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch deals" }, { status: 500 })
  }
}

// POST /api/deals - Create a new deal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, company, contactId, value, stage, probability, closeDate, assigneeId, description } = body

    // Validate required fields
    if (!title || !company || !value) {
      return NextResponse.json({ success: false, error: "Title, company, and value are required" }, { status: 400 })
    }

    // In a real app, you would save to database
    const newDeal = {
      id: `d${Date.now()}`,
      title,
      company,
      contactId: contactId || null,
      value: Number.parseInt(value),
      stage: stage || "Lead",
      probability: Number.parseInt(probability) || 25,
      closeDate: closeDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      assigneeId: assigneeId || "1",
      assignee: "Sarah Johnson", // Would lookup from assigneeId
      description: description || "",
      createdDate: new Date().toISOString().split("T")[0],
      updatedDate: new Date().toISOString().split("T")[0],
    }

    return NextResponse.json(
      {
        success: true,
        data: newDeal,
        message: "Deal created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create deal" }, { status: 500 })
  }
}
