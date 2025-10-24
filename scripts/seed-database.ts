import { ObjectId } from "mongodb"
import {
  getContactsCollection,
  getDealsCollection,
  getTasksCollection,
  getCompaniesCollection,
  getUsersCollection,
  getNotesCollection,
  getActivitiesCollection,
} from "../lib/database/collections"

export async function seedDatabase() {
  try {
    // Clear existing data (optional - remove in production)
    console.log("🧹 Clearing existing data...")
    const contactsCol = await getContactsCollection()
    const dealsCol = await getDealsCollection()
    const tasksCol = await getTasksCollection()
    const companiesCol = await getCompaniesCollection()
    const usersCol = await getUsersCollection()
    const notesCol = await getNotesCollection()
    const activitiesCol = await getActivitiesCollection()

    await Promise.all([
      contactsCol.deleteMany({}),
      dealsCol.deleteMany({}),
      tasksCol.deleteMany({}),
      companiesCol.deleteMany({}),
      usersCol.deleteMany({}),
      notesCol.deleteMany({}),
      activitiesCol.deleteMany({}),
    ])

    // Create users first
    console.log("👥 Creating users...")
    const userIds = {
      sarah: new ObjectId(),
      mike: new ObjectId(),
      emma: new ObjectId(),
      alex: new ObjectId(),
    }

    await usersCol.insertMany([
      {
        _id: userIds.sarah,
        name: "Sarah Johnson",
        email: "sarah@catchclients.com",
        phone: "+1 (555) 123-4567",
        role: "manager",
        department: "Sales",
        status: "Active",
        joinDate: new Date("2023-06-15"),
        lastActive: new Date(),
        createdDate: new Date("2023-06-15"),
        updatedDate: new Date(),
        emailVerified: true,
        avatar: "/placeholder.svg?height=40&width=40",
        timezone: "America/New_York",
        language: "en",
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
        targets: {
          monthly_revenue: 150000,
          monthly_deals: 10,
          monthly_calls: 50,
        },
        permissions: ["read_all", "write_all", "manage_team"],
      },
      {
        _id: userIds.mike,
        name: "Mike Chen",
        email: "mike@catchclients.com",
        phone: "+1 (555) 987-6543",
        role: "sales_rep",
        department: "Sales",
        status: "Active",
        joinDate: new Date("2023-08-20"),
        lastActive: new Date(),
        createdDate: new Date("2023-08-20"),
        updatedDate: new Date(),
        emailVerified: true,
        avatar: "/placeholder.svg?height=40&width=40",
        timezone: "America/Los_Angeles",
        language: "en",
        notifications: {
          email: true,
          push: true,
          sms: true,
        },
        targets: {
          monthly_revenue: 120000,
          monthly_deals: 8,
          monthly_calls: 40,
        },
        permissions: ["read_assigned", "write_assigned"],
      },
      {
        _id: userIds.emma,
        name: "Emma Davis",
        email: "emma@catchclients.com",
        phone: "+1 (555) 456-7890",
        role: "sales_rep",
        department: "Sales",
        status: "Active",
        joinDate: new Date("2023-09-10"),
        lastActive: new Date(),
        createdDate: new Date("2023-09-10"),
        updatedDate: new Date(),
        emailVerified: true,
        avatar: "/placeholder.svg?height=40&width=40",
        timezone: "America/Chicago",
        language: "en",
        notifications: {
          email: true,
          push: false,
          sms: false,
        },
        targets: {
          monthly_revenue: 100000,
          monthly_deals: 6,
          monthly_calls: 35,
        },
        permissions: ["read_assigned", "write_assigned"],
      },
      {
        _id: userIds.alex,
        name: "Alex Rodriguez",
        email: "alex@catchclients.com",
        phone: "+1 (555) 321-0987",
        role: "sales_rep",
        department: "Sales",
        status: "Active",
        joinDate: new Date("2023-10-05"),
        lastActive: new Date(),
        createdDate: new Date("2023-10-05"),
        updatedDate: new Date(),
        emailVerified: true,
        avatar: "/placeholder.svg?height=40&width=40",
        timezone: "America/Denver",
        language: "en",
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
        targets: {
          monthly_revenue: 80000,
          monthly_deals: 5,
          monthly_calls: 30,
        },
        permissions: ["read_assigned", "write_assigned"],
      },
    ])

    // Create companies
    console.log("🏢 Creating companies...")
    const companyIds = {
      acme: new ObjectId(),
      techstart: new ObjectId(),
      global: new ObjectId(),
      innovation: new ObjectId(),
    }

    await companiesCol.insertMany([
      {
        _id: companyIds.acme,
        name: "Acme Corp",
        domain: "acmecorp.com",
        industry: "Technology",
        description: "Leading enterprise software company specializing in workflow automation",
        website: "https://acmecorp.com",
        phone: "+1 (555) 100-2000",
        email: "info@acmecorp.com",
        employees: 500,
        estimatedARR: 2500000,
        foundedYear: 2015,
        status: "Active Customer",
        createdDate: new Date("2024-01-01"),
        updatedDate: new Date(),
        contactIds: [],
        dealIds: [],
        assignedToId: userIds.sarah,
        tags: ["Enterprise", "Technology", "High Value"],
        address: {
          street: "123 Business Ave",
          city: "San Francisco",
          state: "CA",
          zipCode: "94105",
          country: "USA",
        },
        socialProfiles: {
          linkedin: "https://linkedin.com/company/acme-corp",
          twitter: "https://twitter.com/acmecorp",
          crunchbase: "https://crunchbase.com/organization/acme-corp",
        },
      },
      {
        _id: companyIds.techstart,
        name: "TechStart Inc",
        domain: "techstart.io",
        industry: "Technology",
        description: "Fast-growing startup focused on mobile app development",
        website: "https://techstart.io",
        phone: "+1 (555) 200-3000",
        email: "hello@techstart.io",
        employees: 75,
        estimatedARR: 850000,
        foundedYear: 2020,
        status: "Prospect",
        createdDate: new Date("2024-01-05"),
        updatedDate: new Date(),
        contactIds: [],
        dealIds: [],
        assignedToId: userIds.mike,
        tags: ["Startup", "Mobile", "Growth"],
        address: {
          street: "456 Innovation Dr",
          city: "Austin",
          state: "TX",
          zipCode: "78701",
          country: "USA",
        },
        socialProfiles: {
          linkedin: "https://linkedin.com/company/techstart-inc",
          twitter: "https://twitter.com/techstartinc",
        },
      },
      {
        _id: companyIds.global,
        name: "Global Solutions",
        domain: "globalsolutions.com",
        industry: "Consulting",
        description: "International consulting firm specializing in digital transformation",
        website: "https://globalsolutions.com",
        phone: "+1 (555) 300-4000",
        email: "contact@globalsolutions.com",
        employees: 1200,
        estimatedARR: 5000000,
        foundedYear: 2010,
        status: "Prospect",
        createdDate: new Date("2024-01-08"),
        updatedDate: new Date(),
        contactIds: [],
        dealIds: [],
        assignedToId: userIds.emma,
        tags: ["Enterprise", "Consulting", "International"],
        address: {
          street: "789 Corporate Blvd",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "USA",
        },
        socialProfiles: {
          linkedin: "https://linkedin.com/company/global-solutions",
          twitter: "https://twitter.com/globalsolutions",
        },
      },
    ])

    // Create contacts
    console.log("👤 Creating contacts...")
    const contactIds = {
      john: new ObjectId(),
      sarah_contact: new ObjectId(),
      mike_contact: new ObjectId(),
      lisa: new ObjectId(),
    }

    await contactsCol.insertMany([
      {
        _id: contactIds.john,
        name: "John Smith",
        email: "john@acmecorp.com",
        phone: "+1 (555) 123-4567",
        company: "Acme Corp",
        position: "CEO",
        status: "Hot Lead",
        tags: ["Enterprise", "Decision Maker", "C-Level"],
        website: "https://acmecorp.com",
        avatar: "/placeholder.svg?height=40&width=40",
        lastContact: new Date("2024-01-13"),
        createdDate: new Date("2024-01-10"),
        updatedDate: new Date("2024-01-15"),
        dealIds: [],
        taskIds: [],
        companyId: companyIds.acme,
        assignedToId: userIds.sarah,
        source: "Website",
        leadScore: 95,
        notes: "Very interested in enterprise package. Mentioned budget of $50k.",
        socialProfiles: {
          linkedin: "https://linkedin.com/in/johnsmith-ceo",
          twitter: "https://twitter.com/johnsmith",
        },
        address: {
          city: "San Francisco",
          state: "CA",
          country: "USA",
        },
      },
      {
        _id: contactIds.sarah_contact,
        name: "Sarah Wilson",
        email: "sarah@techstart.io",
        phone: "+1 (555) 987-6543",
        company: "TechStart Inc",
        position: "CTO",
        status: "Qualified",
        tags: ["Tech", "Startup", "Technical"],
        website: "https://techstart.io",
        avatar: "/placeholder.svg?height=40&width=40",
        lastContact: new Date("2024-01-12"),
        createdDate: new Date("2024-01-08"),
        updatedDate: new Date("2024-01-14"),
        dealIds: [],
        taskIds: [],
        companyId: companyIds.techstart,
        assignedToId: userIds.mike,
        source: "LinkedIn",
        leadScore: 78,
        notes: "Technical decision maker. Interested in API integrations.",
        socialProfiles: {
          linkedin: "https://linkedin.com/in/sarahwilson-cto",
        },
        address: {
          city: "Austin",
          state: "TX",
          country: "USA",
        },
      },
      {
        _id: contactIds.mike_contact,
        name: "Mike Thompson",
        email: "mike@globalsolutions.com",
        phone: "+1 (555) 456-7890",
        company: "Global Solutions",
        position: "VP Sales",
        status: "Cold Lead",
        tags: ["Enterprise", "Sales", "VP Level"],
        website: "https://globalsolutions.com",
        avatar: "/placeholder.svg?height=40&width=40",
        lastContact: new Date("2024-01-05"),
        createdDate: new Date("2024-01-03"),
        updatedDate: new Date("2024-01-10"),
        dealIds: [],
        taskIds: [],
        companyId: companyIds.global,
        assignedToId: userIds.emma,
        source: "Cold Outreach",
        leadScore: 45,
        notes: "Initial contact made. Need to understand their current challenges.",
        socialProfiles: {
          linkedin: "https://linkedin.com/in/mikethompson-vp",
        },
        address: {
          city: "New York",
          state: "NY",
          country: "USA",
        },
      },
    ])

    // Create deals
    console.log("💰 Creating deals...")
    const dealIds = {
      acme_enterprise: new ObjectId(),
      techstart_startup: new ObjectId(),
      global_integration: new ObjectId(),
    }

    await dealsCol.insertMany([
      {
        _id: dealIds.acme_enterprise,
        title: "Acme Corp - Enterprise Package",
        description:
          "Enterprise software solution for 500+ employees including advanced analytics and custom integrations",
        value: 45000,
        currency: "USD",
        stage: "Proposal",
        probability: 75,
        closeDate: new Date("2024-02-15"),
        createdDate: new Date("2024-01-10"),
        updatedDate: new Date("2024-01-15"),
        contactId: contactIds.john,
        companyId: companyIds.acme,
        assigneeId: userIds.sarah,
        taskIds: [],
        source: "Website",
        products: ["Enterprise Suite", "Analytics Module", "API Access"],
        customFields: {
          implementation_timeline: "3 months",
          training_required: true,
          support_level: "Premium",
        },
      },
      {
        _id: dealIds.techstart_startup,
        title: "TechStart - Startup Plan",
        description: "Custom development and consulting services for mobile app integration",
        value: 28500,
        currency: "USD",
        stage: "Negotiation",
        probability: 90,
        closeDate: new Date("2024-02-10"),
        createdDate: new Date("2024-01-08"),
        updatedDate: new Date("2024-01-14"),
        contactId: contactIds.sarah_contact,
        companyId: companyIds.techstart,
        assigneeId: userIds.mike,
        taskIds: [],
        source: "LinkedIn",
        products: ["Startup Package", "Mobile SDK", "Consulting Hours"],
        customFields: {
          implementation_timeline: "6 weeks",
          training_required: false,
          support_level: "Standard",
        },
      },
      {
        _id: dealIds.global_integration,
        title: "Global Solutions - System Integration",
        description: "Large-scale system integration and migration project for international operations",
        value: 67200,
        currency: "USD",
        stage: "Qualified",
        probability: 60,
        closeDate: new Date("2024-03-01"),
        createdDate: new Date("2024-01-03"),
        updatedDate: new Date("2024-01-10"),
        contactId: contactIds.mike_contact,
        companyId: companyIds.global,
        assigneeId: userIds.emma,
        taskIds: [],
        source: "Cold Outreach",
        products: ["Enterprise Suite", "Migration Tools", "Professional Services"],
        customFields: {
          implementation_timeline: "6 months",
          training_required: true,
          support_level: "Enterprise",
        },
      },
    ])

    // Create tasks
    console.log("✅ Creating tasks...")
    const taskIds = {
      followup_acme: new ObjectId(),
      proposal_techstart: new ObjectId(),
      demo_global: new ObjectId(),
      contract_acme: new ObjectId(),
    }

    await tasksCol.insertMany([
      {
        _id: taskIds.followup_acme,
        title: "Follow up with Acme Corp",
        description: "Discuss pricing feedback and implementation timeline with John Smith",
        type: "call",
        priority: "high",
        status: "pending",
        dueDate: new Date("2024-01-20"),
        dueTime: "2:00 PM",
        createdDate: new Date("2024-01-15"),
        updatedDate: new Date("2024-01-15"),
        assigneeId: userIds.sarah,
        createdById: userIds.sarah,
        contactId: contactIds.john,
        dealId: dealIds.acme_enterprise,
        companyId: companyIds.acme,
        estimatedDuration: 30,
        reminderSent: false,
        customFields: {
          call_agenda: ["Pricing discussion", "Timeline confirmation", "Next steps"],
        },
      },
      {
        _id: taskIds.proposal_techstart,
        title: "Send proposal to TechStart",
        description: "Include custom development package details and API documentation",
        type: "email",
        priority: "high",
        status: "pending",
        dueDate: new Date("2024-01-18"),
        dueTime: "4:30 PM",
        createdDate: new Date("2024-01-14"),
        updatedDate: new Date("2024-01-14"),
        assigneeId: userIds.mike,
        createdById: userIds.mike,
        contactId: contactIds.sarah_contact,
        dealId: dealIds.techstart_startup,
        companyId: companyIds.techstart,
        estimatedDuration: 60,
        reminderSent: false,
        customFields: {
          proposal_sections: ["Technical specs", "Pricing", "Timeline", "Support"],
        },
      },
      {
        _id: taskIds.demo_global,
        title: "Demo meeting with Global Solutions",
        description: "Product demonstration and Q&A session with technical team",
        type: "meeting",
        priority: "medium",
        status: "pending",
        dueDate: new Date("2024-01-22"),
        dueTime: "10:00 AM",
        createdDate: new Date("2024-01-10"),
        updatedDate: new Date("2024-01-10"),
        assigneeId: userIds.emma,
        createdById: userIds.emma,
        contactId: contactIds.mike_contact,
        dealId: dealIds.global_integration,
        companyId: companyIds.global,
        estimatedDuration: 90,
        location: "Virtual - Zoom",
        meetingUrl: "https://zoom.us/j/123456789",
        reminderSent: false,
        customFields: {
          demo_focus: ["Integration capabilities", "Scalability", "Security features"],
        },
      },
      {
        _id: taskIds.contract_acme,
        title: "Prepare contract for Acme Corp",
        description: "Draft contract based on approved proposal terms",
        type: "task",
        priority: "high",
        status: "pending",
        dueDate: new Date("2024-01-25"),
        dueTime: "12:00 PM",
        createdDate: new Date("2024-01-15"),
        updatedDate: new Date("2024-01-15"),
        assigneeId: userIds.sarah,
        createdById: userIds.sarah,
        contactId: contactIds.john,
        dealId: dealIds.acme_enterprise,
        companyId: companyIds.acme,
        estimatedDuration: 120,
        reminderSent: false,
        customFields: {
          contract_type: "Enterprise Agreement",
          legal_review_required: true,
        },
      },
    ])

    // Create notes
    console.log("📝 Creating notes...")
    await notesCol.insertMany([
      {
        _id: new ObjectId(),
        title: "Discovery Call Notes - Acme Corp",
        content: `Had an excellent discovery call with John Smith, CEO of Acme Corp. Key points discussed:

• Company has 500+ employees across 3 locations
• Current pain points with their existing system:
  - Lack of real-time analytics
  - Poor integration with existing tools
  - Limited scalability
• Budget range: $40-50k for initial implementation
• Decision timeline: Q1 2024
• Key stakeholders: John (CEO), Lisa (CTO), Mark (CFO)
• Next steps: Send detailed proposal by Friday

**Technical Requirements:**
- Single sign-on (SSO) integration
- API access for custom integrations
- Advanced reporting and analytics
- Mobile app compatibility
- 99.9% uptime SLA

**Competition:**
- Currently evaluating 2 other vendors
- Price is important but not the primary factor
- Looking for long-term partnership

**Follow-up Actions:**
1. Send proposal with technical specifications
2. Schedule technical demo with CTO
3. Provide customer references in similar industry`,
        type: "call",
        priority: "high",
        isPinned: true,
        isPrivate: false,
        tags: ["discovery", "proposal", "enterprise"],
        createdDate: new Date("2024-01-13"),
        updatedDate: new Date("2024-01-15"),
        createdById: userIds.sarah,
        assignedToId: userIds.sarah,
        contactId: contactIds.john,
        dealId: dealIds.acme_enterprise,
        companyId: companyIds.acme,
      },
      {
        _id: new ObjectId(),
        title: "Technical Requirements - TechStart",
        content: `Technical discussion with Sarah Wilson, CTO of TechStart:

**Integration Requirements:**
- REST API connectivity with existing mobile apps
- Webhook support for real-time notifications
- Custom authentication system integration
- Data export capabilities (JSON, CSV)

**Current Tech Stack:**
- React Native for mobile apps
- Node.js backend
- PostgreSQL database
- AWS infrastructure

**Timeline:** 
- Phase 1: Basic integration (3 weeks)
- Phase 2: Advanced features (3 weeks)
- Total: 6 weeks implementation

**Budget:** $25-30k
- Development: $20k
- Consulting: $5k
- Training: $3k

**Decision Process:**
- Technical evaluation: Sarah (CTO)
- Budget approval: Mike (CEO)
- Final decision: Next week

**Concerns:**
- Data migration complexity
- Minimal downtime during transition
- Learning curve for development team`,
        type: "meeting",
        priority: "medium",
        isPinned: false,
        isPrivate: false,
        tags: ["technical", "requirements", "integration"],
        createdDate: new Date("2024-01-12"),
        updatedDate: new Date("2024-01-14"),
        createdById: userIds.mike,
        assignedToId: userIds.mike,
        contactId: contactIds.sarah_contact,
        dealId: dealIds.techstart_startup,
        companyId: companyIds.techstart,
      },
    ])

    // Create activities
    console.log("📊 Creating activities...")
    await activitiesCol.insertMany([
      {
        _id: new ObjectId(),
        type: "contact_created",
        title: "New contact added",
        description: "John Smith from Acme Corp added to CRM",
        timestamp: new Date("2024-01-10T09:00:00Z"),
        userId: userIds.sarah,
        userName: "Sarah Johnson",
        userAvatar: "/placeholder.svg?height=40&width=40",
        entityType: "contact",
        entityId: contactIds.john,
        entityName: "John Smith",
        isPublic: true,
        metadata: {
          source: "Website",
          initial_status: "Cold Lead",
        },
      },
      {
        _id: new ObjectId(),
        type: "deal_created",
        title: "New deal created",
        description: "Enterprise Package deal created for Acme Corp",
        timestamp: new Date("2024-01-10T10:30:00Z"),
        userId: userIds.sarah,
        userName: "Sarah Johnson",
        userAvatar: "/placeholder.svg?height=40&width=40",
        entityType: "deal",
        entityId: dealIds.acme_enterprise,
        entityName: "Acme Corp - Enterprise Package",
        isPublic: true,
        metadata: {
          initial_value: 45000,
          initial_stage: "Lead",
        },
      },
      {
        _id: new ObjectId(),
        type: "deal_stage_changed",
        title: "Deal stage updated",
        description: "Acme Corp deal moved from Qualified to Proposal",
        timestamp: new Date("2024-01-14T14:15:00Z"),
        userId: userIds.sarah,
        userName: "Sarah Johnson",
        userAvatar: "/placeholder.svg?height=40&width=40",
        entityType: "deal",
        entityId: dealIds.acme_enterprise,
        entityName: "Acme Corp - Enterprise Package",
        previousValue: "Qualified",
        newValue: "Proposal",
        isPublic: true,
        metadata: {
          probability_change: { from: 50, to: 75 },
          reason: "Positive response to initial proposal",
        },
      },
      {
        _id: new ObjectId(),
        type: "task_created",
        title: "Task assigned",
        description: "Follow up call scheduled with Acme Corp",
        timestamp: new Date("2024-01-15T11:00:00Z"),
        userId: userIds.sarah,
        userName: "Sarah Johnson",
        userAvatar: "/placeholder.svg?height=40&width=40",
        entityType: "task",
        entityId: taskIds.followup_acme,
        entityName: "Follow up with Acme Corp",
        isPublic: true,
        metadata: {
          due_date: "2024-01-20",
          priority: "high",
          type: "call",
        },
      },
    ])

    // Update relationships
    console.log("🔗 Updating relationships...")

    // Update contact with deal and task IDs
    await contactsCol.updateOne(
      { _id: contactIds.john },
      {
        $set: {
          dealIds: [dealIds.acme_enterprise],
          taskIds: [taskIds.followup_acme, taskIds.contract_acme],
        },
      },
    )

    await contactsCol.updateOne(
      { _id: contactIds.sarah_contact },
      {
        $set: {
          dealIds: [dealIds.techstart_startup],
          taskIds: [taskIds.proposal_techstart],
        },
      },
    )

    await contactsCol.updateOne(
      { _id: contactIds.mike_contact },
      {
        $set: {
          dealIds: [dealIds.global_integration],
          taskIds: [taskIds.demo_global],
        },
      },
    )

    // Update deals with task IDs
    await dealsCol.updateOne(
      { _id: dealIds.acme_enterprise },
      { $set: { taskIds: [taskIds.followup_acme, taskIds.contract_acme] } },
    )

    await dealsCol.updateOne({ _id: dealIds.techstart_startup }, { $set: { taskIds: [taskIds.proposal_techstart] } })

    await dealsCol.updateOne({ _id: dealIds.global_integration }, { $set: { taskIds: [taskIds.demo_global] } })

    // Update companies with contact and deal IDs
    await companiesCol.updateOne(
      { _id: companyIds.acme },
      {
        $set: {
          contactIds: [contactIds.john],
          dealIds: [dealIds.acme_enterprise],
        },
      },
    )

    await companiesCol.updateOne(
      { _id: companyIds.techstart },
      {
        $set: {
          contactIds: [contactIds.sarah_contact],
          dealIds: [dealIds.techstart_startup],
        },
      },
    )

    await companiesCol.updateOne(
      { _id: companyIds.global },
      {
        $set: {
          contactIds: [contactIds.mike_contact],
          dealIds: [dealIds.global_integration],
        },
      },
    )

    console.log("✅ Database seeded successfully!")
    console.log(`
📊 Created:
   👥 ${Object.keys(userIds).length} users
   🏢 ${Object.keys(companyIds).length} companies  
   👤 ${Object.keys(contactIds).length} contacts
   💰 ${Object.keys(dealIds).length} deals
   ✅ ${Object.keys(taskIds).length} tasks
   📝 2 notes
   📊 4 activities
`)
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    throw error
  }
}
