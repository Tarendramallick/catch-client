import { type NextRequest, NextResponse } from "next/server"

// GET /api/analytics - Get analytics data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "last-6-months"
    const metric = searchParams.get("metric") // revenue, deals, contacts, etc.

    // Mock analytics data
    const analytics = {
      revenue: {
        current: 328000,
        previous: 285000,
        growth: 15.1,
        monthly: [
          { month: "Jan", value: 45000 },
          { month: "Feb", value: 52000 },
          { month: "Mar", value: 48000 },
          { month: "Apr", value: 61000 },
          { month: "May", value: 55000 },
          { month: "Jun", value: 67000 },
        ],
      },
      deals: {
        total: 45,
        won: 12,
        lost: 8,
        active: 25,
        winRate: 60.0,
        avgDealSize: 27333,
        stageDistribution: {
          Lead: 8,
          Qualified: 6,
          Proposal: 5,
          Negotiation: 4,
          "Closed Won": 12,
          "Closed Lost": 8,
        },
      },
      contacts: {
        total: 156,
        new: 23,
        active: 134,
        statusDistribution: {
          "Hot Lead": 15,
          Qualified: 28,
          "Cold Lead": 45,
          Nurturing: 32,
          Customer: 24,
          Lost: 12,
        },
      },
      tasks: {
        total: 89,
        completed: 67,
        pending: 22,
        overdue: 5,
        completionRate: 75.3,
        typeDistribution: {
          call: 25,
          email: 32,
          meeting: 18,
          task: 14,
        },
      },
      team: {
        totalMembers: 8,
        activeMembers: 7,
        performance: [
          { name: "Sarah Johnson", deals: 12, revenue: 145000, target: 150000 },
          { name: "Mike Chen", deals: 8, revenue: 98000, target: 120000 },
          { name: "Emily Davis", deals: 15, revenue: 187000, target: 180000 },
          { name: "John Smith", deals: 6, revenue: 76000, target: 100000 },
        ],
      },
      pipeline: {
        totalValue: 1250000,
        weightedValue: 875000,
        avgDealSize: 50000,
        avgSalesCycle: 45, // days
        conversionRate: 24.5,
      },
    }

    // Filter by specific metric if requested
    if (metric && analytics[metric as keyof typeof analytics]) {
      return NextResponse.json({
        success: true,
        data: analytics[metric as keyof typeof analytics],
        period,
      })
    }

    return NextResponse.json({
      success: true,
      data: analytics,
      period,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch analytics" }, { status: 500 })
  }
}
