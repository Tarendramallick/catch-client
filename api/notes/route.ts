import { type NextRequest, NextResponse } from "next/server"

// GET /api/notes - Get all notes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const client = searchParams.get("client")
    const assignee = searchParams.get("assignee")
    const pinned = searchParams.get("pinned")
    const limit = searchParams.get("limit")
    const offset = searchParams.get("offset")

    // Mock notes data
    const notes = [
      {
        id: "n1",
        title: "Discovery Call Notes - Acme Corp",
        content:
          "Had an excellent discovery call with John Smith, CEO of Acme Corp. Key points discussed:\n\n• Company has 500+ employees\n• Current pain points with their existing system\n• Budget range: $40-50k\n• Decision timeline: Q1 2024\n• Next steps: Send proposal by Friday",
        client: "Acme Corp",
        assignedTo: "Sarah Johnson",
        assignedToId: "1",
        createdDate: "2024-01-13",
        dueDate: "2024-01-20",
        isPinned: true,
        tags: ["discovery", "proposal"],
        updatedDate: "2024-01-15",
      },
      {
        id: "n2",
        title: "Technical Requirements - TechStart",
        content:
          "Technical discussion with TechStart CTO:\n\n**Integration Requirements:**\n- API connectivity with existing systems\n- Single sign-on (SSO) implementation\n- Custom reporting dashboard\n- Mobile app compatibility\n\n**Timeline:** 3-month implementation\n**Budget:** $25-30k",
        client: "TechStart Inc",
        assignedTo: "Mike Chen",
        assignedToId: "2",
        createdDate: "2024-01-12",
        dueDate: "2024-01-18",
        isPinned: false,
        tags: ["technical", "requirements"],
        updatedDate: "2024-01-14",
      },
    ]

    // Apply filters
    let filteredNotes = notes
    if (client) {
      filteredNotes = filteredNotes.filter((note) => note.client.toLowerCase().includes(client.toLowerCase()))
    }
    if (assignee) {
      filteredNotes = filteredNotes.filter((note) => note.assignedToId === assignee)
    }
    if (pinned === "true") {
      filteredNotes = filteredNotes.filter((note) => note.isPinned)
    }

    // Apply pagination
    if (limit && offset) {
      const limitNum = Number.parseInt(limit)
      const offsetNum = Number.parseInt(offset)
      filteredNotes = filteredNotes.slice(offsetNum, offsetNum + limitNum)
    }

    // Calculate summary statistics
    const pinnedNotes = filteredNotes.filter((note) => note.isPinned).length
    const clientDistribution = filteredNotes.reduce(
      (acc, note) => {
        acc[note.client] = (acc[note.client] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return NextResponse.json({
      success: true,
      data: filteredNotes,
      total: notes.length,
      filtered: filteredNotes.length,
      summary: {
        pinnedNotes,
        clientDistribution,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch notes" }, { status: 500 })
  }
}

// POST /api/notes - Create a new note
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, client, assignedToId, dueDate, tags } = body

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json({ success: false, error: "Title and content are required" }, { status: 400 })
    }

    // In a real app, you would save to database
    const newNote = {
      id: `n${Date.now()}`,
      title,
      content,
      client: client || "Internal",
      assignedTo: "Sarah Johnson", // Would lookup from assignedToId
      assignedToId: assignedToId || "1",
      createdDate: new Date().toISOString().split("T")[0],
      dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      isPinned: false,
      tags: tags || [],
      updatedDate: new Date().toISOString().split("T")[0],
    }

    return NextResponse.json(
      {
        success: true,
        data: newNote,
        message: "Note created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create note" }, { status: 500 })
  }
}
