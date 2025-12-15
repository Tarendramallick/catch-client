import { type NextRequest, NextResponse } from "next/server"

// GET /api/reports - Get reports data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") // sales, leads, customers
    const period = searchParams.get("period") || "last-6-months"
    const format = searchParams.get("format") // json, csv, pdf

    // Mock reports data
    const reports = {
      sales: {
        title: "Sales Performance Report",
        period,
        data: [
          { month: "Jan", revenue: 45000, deals_closed: 12, deals_lost: 3, win_rate: 80.0 },
          { month: "Feb", revenue: 52000, deals_closed: 15, deals_lost: 4, win_rate: 78.9 },
          { month: "Mar", revenue: 48000, deals_closed: 11, deals_lost: 2, win_rate: 84.6 },
          { month: "Apr", revenue: 61000, deals_closed: 18, deals_lost: 5, win_rate: 78.3 },
          { month: "May", revenue: 55000, deals_closed: 14, deals_lost: 3, win_rate: 82.4 },
          { month: "Jun", revenue: 67000, deals_closed: 20, deals_lost: 4, win_rate: 83.3 },
        ],
        summary: {
          totalRevenue: 328000,
          totalDeals: 90,
          avgWinRate: 81.1,
          avgDealSize: 3644,
        },
      },
      leads: {
        title: "Leads Report",
        period,
        data: [
          { source: "Website", leads: 45, conversions: 12, rate: 26.7 },
          { source: "Email Campaign", leads: 32, conversions: 8, rate: 25.0 },
          { source: "Social Media", leads: 28, conversions: 5, rate: 17.9 },
          { source: "Referrals", leads: 22, conversions: 9, rate: 40.9 },
          { source: "Cold Outreach", leads: 18, conversions: 3, rate: 16.7 },
        ],
        summary: {
          totalLeads: 145,
          totalConversions: 37,
          avgConversionRate: 25.5,
        },
      },
      customers: {
        title: "Customer Report",
        period,
        data: [
          { customer: "Acme Corp", revenue: 125000, deals: 8, status: "Active", ltv: 250000 },
          { customer: "TechStart Inc", revenue: 98000, deals: 6, status: "Active", ltv: 180000 },
          { customer: "Global Solutions", revenue: 87000, deals: 5, status: "Active", ltv: 200000 },
          { customer: "Innovation Labs", revenue: 65000, deals: 4, status: "Active", ltv: 150000 },
          { customer: "Future Systems", revenue: 45000, deals: 3, status: "Inactive", ltv: 90000 },
        ],
        summary: {
          totalCustomers: 5,
          totalRevenue: 420000,
          avgRevenuePerCustomer: 84000,
          totalLTV: 870000,
        },
      },
    }

    // Get specific report type
    const reportData = type && reports[type as keyof typeof reports] ? reports[type as keyof typeof reports] : reports

    // Handle different formats
    if (format === "csv") {
      // In a real app, you would generate CSV content
      return new NextResponse("CSV content would be generated here", {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${type || "report"}-${period}.csv"`,
        },
      })
    }

    if (format === "pdf") {
      // In a real app, you would generate PDF content
      return new NextResponse("PDF content would be generated here", {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${type || "report"}-${period}.pdf"`,
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: reportData,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to generate report" }, { status: 500 })
  }
}

// POST /api/reports - Generate custom report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, filters, dateRange, metrics, format } = body

    // Validate required fields
    if (!type || !metrics) {
      return NextResponse.json({ success: false, error: "Report type and metrics are required" }, { status: 400 })
    }

    // In a real app, you would generate the custom report based on parameters
    const customReport = {
      id: `report_${Date.now()}`,
      type,
      filters,
      dateRange,
      metrics,
      format: format || "json",
      status: "generating",
      createdAt: new Date().toISOString(),
      estimatedCompletion: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
    }

    return NextResponse.json(
      {
        success: true,
        data: customReport,
        message: "Custom report generation started",
      },
      { status: 202 },
    )
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to generate custom report" }, { status: 500 })
  }
}
