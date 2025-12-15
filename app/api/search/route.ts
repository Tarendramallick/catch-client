import { type NextRequest, NextResponse } from "next/server"

// GET /api/search - Global search across all entities
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const type = searchParams.get("type") // contacts, deals, tasks, companies, notes
    const limit = searchParams.get("limit") || "10"

    if (!query) {
      return NextResponse.json({ success: false, error: "Search query is required" }, { status: 400 })
    }

    // Mock search results
    const searchResults = {
      contacts: [
        {
          id: "c1",
          type: "contact",
          title: "John Smith",
          subtitle: "CEO at Acme Corp",
          description: "john@acmecorp.com • +1 (555) 123-4567",
          url: "/contacts/c1",
          relevance: 0.95,
        },
      ],
      deals: [
        {
          id: "d1",
          type: "deal",
          title: "Enterprise Package - Acme Corp",
          subtitle: "$45,000 • Proposal Stage",
          description: "Enterprise software solution for 500+ employees",
          url: "/deals/d1",
          relevance: 0.88,
        },
      ],
      tasks: [
        {
          id: "t1",
          type: "task",
          title: "Follow up with Acme Corp",
          subtitle: "Due Jan 15 • High Priority",
          description: "Discuss pricing and implementation timeline",
          url: "/tasks/t1",
          relevance: 0.82,
        },
      ],
      companies: [
        {
          id: "comp1",
          type: "company",
          title: "Acme Corp",
          subtitle: "Technology • 500 employees",
          description: "Leading enterprise software company",
          url: "/companies/comp1",
          relevance: 0.92,
        },
      ],
      notes: [
        {
          id: "n1",
          type: "note",
          title: "Discovery Call Notes - Acme Corp",
          subtitle: "Created Jan 13 by Sarah Johnson",
          description: "Had an excellent discovery call with John Smith...",
          url: "/notes/n1",
          relevance: 0.78,
        },
      ],
    }

    // Filter by type if specified
    let results: any[] = []
    if (type && searchResults[type as keyof typeof searchResults]) {
      results = searchResults[type as keyof typeof searchResults]
    } else {
      // Combine all results and sort by relevance
      results = Object.values(searchResults)
        .flat()
        .sort((a, b) => b.relevance - a.relevance)
    }

    // Apply limit
    const limitNum = Number.parseInt(limit)
    results = results.slice(0, limitNum)

    return NextResponse.json({
      success: true,
      query,
      results,
      total: results.length,
      searchTime: Math.random() * 100 + 50, // Mock search time in ms
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Search failed" }, { status: 500 })
  }
}
