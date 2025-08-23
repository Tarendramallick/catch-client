import { type NextRequest, NextResponse } from "next/server"

// GET /api/activities - Get activity feed
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const entityType = searchParams.get("entityType") // contact, deal, task
    const entityId = searchParams.get("entityId")
    const userId = searchParams.get("userId")
    const type = searchParams.get("type") // call, email, meeting, note, etc.
    const limit = searchParams.get("limit") || "20"
    const offset = searchParams.get("offset") || "0"

    // Mock activities data
    const activities = [
      {
        id: "a1",
        type: "call",
        title: "Initial discovery call",
        description: "Discussed company needs and budget with John Smith",
        timestamp: "2024-01-15T14:00:00Z",
        userId: "1",
        userName: "Sarah Johnson",
        entityType: "contact",
        entityId: "c1",
        entityName: "John Smith",
        metadata: {
          duration: "45 minutes",
          outcome: "positive",
          nextSteps: "Send proposal",
        },
      },
      {
        id: "a2",
        type: "deal_update",
        title: "Deal moved to Proposal stage",
        description: "Enterprise Package deal progressed from Qualified to Proposal",
        timestamp: "2024-01-14T10:00:00Z",
        userId: "1",
        userName: "Sarah Johnson",
        entityType: "deal",
        entityId: "d1",
        entityName: "Enterprise Package - Acme Corp",
        metadata: {
          previousStage: "Qualified",
          newStage: "Proposal",
          probability: 75,
        },
      },
      {
        id: "a3",
        type: "task_completed",
        title: "Task completed",
        description: "Follow up call with TechStart completed successfully",
        timestamp: "2024-01-13T16:30:00Z",
        userId: "2",
        userName: "Mike Chen",
        entityType: "task",
        entityId: "t2",
        entityName: "Follow up with TechStart",
        metadata: {
          completedOnTime: true,
          result: "Scheduled demo for next week",
        },
      },
      {
        id: "a4",
        type: "note_added",
        title: "Note added",
        description: "Added technical requirements note for Global Solutions",
        timestamp: "2024-01-12T11:15:00Z",
        userId: "3",
        userName: "Emma Davis",
        entityType: "contact",
        entityId: "c3",
        entityName: "Global Solutions",
        metadata: {
          noteLength: 245,
          tags: ["technical", "requirements"],
        },
      },
    ]

    // Apply filters
    let filteredActivities = activities
    if (entityType) {
      filteredActivities = filteredActivities.filter((activity) => activity.entityType === entityType)
    }
    if (entityId) {
      filteredActivities = filteredActivities.filter((activity) => activity.entityId === entityId)
    }
    if (userId) {
      filteredActivities = filteredActivities.filter((activity) => activity.userId === userId)
    }
    if (type) {
      filteredActivities = filteredActivities.filter((activity) => activity.type === type)
    }

    // Apply pagination
    const limitNum = Number.parseInt(limit)
    const offsetNum = Number.parseInt(offset)
    const paginatedActivities = filteredActivities.slice(offsetNum, offsetNum + limitNum)

    return NextResponse.json({
      success: true,
      data: paginatedActivities,
      total: activities.length,
      filtered: filteredActivities.length,
      hasMore: offsetNum + limitNum < filteredActivities.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch activities" }, { status: 500 })
  }
}

// POST /api/activities - Create a new activity
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, title, description, entityType, entityId, entityName, userId, userName, metadata } = body

    // Validate required fields
    if (!type || !title || !entityType || !entityId) {
      return NextResponse.json(
        { success: false, error: "Type, title, entityType, and entityId are required" },
        { status: 400 },
      )
    }

    // In a real app, you would save to database
    const newActivity = {
      id: `a${Date.now()}`,
      type,
      title,
      description: description || "",
      timestamp: new Date().toISOString(),
      userId: userId || "1",
      userName: userName || "Current User",
      entityType,
      entityId,
      entityName: entityName || "Unknown Entity",
      metadata: metadata || {},
    }

    return NextResponse.json(
      {
        success: true,
        data: newActivity,
        message: "Activity created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create activity" }, { status: 500 })
  }
}
