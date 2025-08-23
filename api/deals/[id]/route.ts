import { type NextRequest, NextResponse } from "next/server"

// GET /api/deals/[id] - Get a specific deal
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Mock deal data with full details
    const deal = {
      id,
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
      contact: {
        id: "c1",
        name: "John Smith",
        email: "john@acmecorp.com",
        phone: "+1 (555) 123-4567",
      },
      tasks: [
        {
          id: "t1",
          title: "Follow up with decision maker",
          dueDate: "2024-01-20",
          completed: false,
        },
      ],
      notes: [
        {
          id: "n1",
          content: "Proposal sent. Waiting for feedback on pricing.",
          createdAt: "2024-01-14",
          createdBy: "Sarah Johnson",
        },
      ],
      activities: [
        {
          id: "a1",
          type: "deal_update",
          description: "Deal moved to Proposal stage",
          timestamp: "2024-01-14T10:00:00Z",
          user: "Sarah Johnson",
        },
      ],
    }

    return NextResponse.json({
      success: true,
      data: deal,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch deal" }, { status: 500 })
  }
}

// PUT /api/deals/[id] - Update a deal
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { title, company, contactId, value, stage, probability, closeDate, assigneeId, description } = body

    // In a real app, update in database
    const updatedDeal = {
      id,
      title,
      company,
      contactId,
      value: Number.parseInt(value),
      stage,
      probability: Number.parseInt(probability),
      closeDate,
      assigneeId,
      assignee: "Sarah Johnson", // Would lookup from assigneeId
      description,
      createdDate: "2024-01-10", // Would come from database
      updatedDate: new Date().toISOString().split("T")[0],
    }

    return NextResponse.json({
      success: true,
      data: updatedDeal,
      message: "Deal updated successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update deal" }, { status: 500 })
  }
}

// DELETE /api/deals/[id] - Delete a deal
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // In a real app, delete from database
    return NextResponse.json({
      success: true,
      message: "Deal deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete deal" }, { status: 500 })
  }
}
