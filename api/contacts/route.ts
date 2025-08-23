import { type NextRequest, NextResponse } from "next/server"

// GET /api/contacts - Get all contacts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const company = searchParams.get("company")
    const limit = searchParams.get("limit")
    const offset = searchParams.get("offset")

    // In a real app, this would query your database
    // For now, we'll return mock data that matches the structure
    const contacts = [
      {
        id: "c1",
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
      },
      {
        id: "c2",
        name: "Sarah Johnson",
        email: "sarah@techstart.io",
        phone: "+1 (555) 987-6543",
        company: "TechStart Inc",
        position: "CTO",
        status: "Qualified",
        tags: ["Tech", "Startup"],
        lastContact: "1 week ago",
        avatar: "/placeholder.svg?height=40&width=40",
        website: "https://techstart.io",
        createdDate: "2024-01-08",
        updatedDate: "2024-01-12",
      },
    ]

    // Apply filters
    let filteredContacts = contacts
    if (status) {
      filteredContacts = filteredContacts.filter((contact) => contact.status === status)
    }
    if (company) {
      filteredContacts = filteredContacts.filter((contact) =>
        contact.company.toLowerCase().includes(company.toLowerCase()),
      )
    }

    // Apply pagination
    if (limit && offset) {
      const limitNum = Number.parseInt(limit)
      const offsetNum = Number.parseInt(offset)
      filteredContacts = filteredContacts.slice(offsetNum, offsetNum + limitNum)
    }

    return NextResponse.json({
      success: true,
      data: filteredContacts,
      total: contacts.length,
      filtered: filteredContacts.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch contacts" }, { status: 500 })
  }
}

// POST /api/contacts - Create a new contact
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, company, position, status, tags, website } = body

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json({ success: false, error: "Name and email are required" }, { status: 400 })
    }

    // In a real app, you would save to database
    const newContact = {
      id: `c${Date.now()}`,
      name,
      email,
      phone: phone || "",
      company: company || "",
      position: position || "",
      status: status || "Cold Lead",
      tags: tags || [],
      website: website || "",
      lastContact: "Just added",
      avatar: "/placeholder.svg?height=40&width=40",
      createdDate: new Date().toISOString().split("T")[0],
      updatedDate: new Date().toISOString().split("T")[0],
    }

    return NextResponse.json(
      {
        success: true,
        data: newContact,
        message: "Contact created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create contact" }, { status: 500 })
  }
}
