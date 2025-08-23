import { type NextRequest, NextResponse } from "next/server"

// GET /api/contacts/[id] - Get a specific contact
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // In a real app, query database by ID
    const contact = {
      id,
      name: "John Smith",
      email: "john@acmecorp.com",
      phone: "+1 (555) 123-4567",
      company: "Acme Corp",
      position: "CEO",
      status: "Hot Lead",
      tags: ["Enterprise", "Decision Maker"],
      lastContact: "2 days ago",
      avatar: "/placeholder.svg?height=40&width=40",
      website: "https://acmecorp.com",
      createdDate: "2024-01-10",
      updatedDate: "2024-01-15",
      notes: [
        {
          id: "n1",
          content: "Very interested in enterprise package. Mentioned budget of $50k.",
          createdAt: "2024-01-13",
          createdBy: "Sarah Johnson",
        },
      ],
      deals: [
        {
          id: "d1",
          title: "Enterprise Package",
          value: 45000,
          stage: "Proposal",
          probability: 75,
        },
      ],
      activities: [
        {
          id: "a1",
          type: "call",
          description: "Initial discovery call completed",
          timestamp: "2024-01-13T14:00:00Z",
          user: "Sarah Johnson",
        },
      ],
    }

    if (!contact) {
      return NextResponse.json({ success: false, error: "Contact not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: contact,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch contact" }, { status: 500 })
  }
}

// PUT /api/contacts/[id] - Update a contact
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, email, phone, company, position, status, tags, website } = body

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json({ success: false, error: "Name and email are required" }, { status: 400 })
    }

    // In a real app, update in database
    const updatedContact = {
      id,
      name,
      email,
      phone: phone || "",
      company: company || "",
      position: position || "",
      status: status || "Cold Lead",
      tags: tags || [],
      website: website || "",
      lastContact: "Just updated",
      avatar: "/placeholder.svg?height=40&width=40",
      createdDate: "2024-01-10", // Would come from database
      updatedDate: new Date().toISOString().split("T")[0],
    }

    return NextResponse.json({
      success: true,
      data: updatedContact,
      message: "Contact updated successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update contact" }, { status: 500 })
  }
}

// DELETE /api/contacts/[id] - Delete a contact
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // In a real app, delete from database
    // Also handle cascading deletes for related data

    return NextResponse.json({
      success: true,
      message: "Contact deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete contact" }, { status: 500 })
  }
}
