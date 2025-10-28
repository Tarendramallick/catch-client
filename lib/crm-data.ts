// Centralized data store with interconnected entities
export interface Contact {
  id: string
  name: string
  email: string
  phone: string
  company: string
  position: string
  status: "Hot Lead" | "Qualified" | "Cold Lead" | "Nurturing" | "Customer"
  tags: string[]
  lastContact: string
  avatar?: string
  website?: string
  notes: Note[]
  dealIds: string[] // Connected deals
  taskIds: string[] // Connected tasks
  activityHistory: Activity[]
}

export interface Deal {
  id: string
  title: string
  contactId: string // Connected contact
  client: string
  value: number
  stage: "Lead" | "Qualified" | "Proposal" | "Negotiation" | "Closed Won" | "Closed Lost"
  probability: number
  closeDate: string
  assigneeId: string
  assignee: string
  avatar?: string
  description: string
  notes: Note[]
  taskIds: string[] // Connected tasks
  activityHistory: Activity[]
}

export interface Task {
  id: string
  title: string
  description: string
  type: "call" | "email" | "meeting" | "task"
  priority: "high" | "medium" | "low"
  dueDate: string
  dueTime: string
  completed: boolean
  assigneeId: string
  assignee: string
  avatar?: string
  // Connections
  contactId?: string // Connected contact
  dealId?: string // Connected deal
  client: string
  notes: Note[]
}

export interface Note {
  id: string
  content: string
  createdAt: string
  createdBy: string
  type: "contact" | "deal" | "task" | "general"
  entityId: string // ID of the connected entity
}

export interface Activity {
  id: string
  type: "call" | "email" | "meeting" | "task" | "note" | "deal_update" | "contact_update"
  title: string
  description: string
  timestamp: string
  userId: string
  userName: string
  entityType: "contact" | "deal" | "task"
  entityId: string
  entityName: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "admin" | "manager" | "sales_rep"
}

// Sample interconnected data
export const users: User[] = [
  { id: "1", name: "Sarah Johnson", email: "sarah@company.com", role: "manager" },
  { id: "2", name: "Mike Chen", email: "mike@company.com", role: "sales_rep" },
  { id: "3", name: "Emma Davis", email: "emma@company.com", role: "sales_rep" },
  { id: "4", name: "Alex Rodriguez", email: "alex@company.com", role: "sales_rep" },
]

export const contacts: Contact[] = [
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
    website: "https://acmecorp.com",
    dealIds: ["d1"],
    taskIds: ["t1", "t5"],
    notes: [
      {
        id: "n1",
        content: "Very interested in enterprise package. Mentioned budget of $50k.",
        createdAt: "2024-01-13",
        createdBy: "Sarah Johnson",
        type: "contact",
        entityId: "c1",
      },
    ],
    activityHistory: [
      {
        id: "a1",
        type: "call",
        title: "Initial discovery call",
        description: "Discussed company needs and budget",
        timestamp: "2024-01-13T14:00:00Z",
        userId: "1",
        userName: "Sarah Johnson",
        entityType: "contact",
        entityId: "c1",
        entityName: "John Smith",
      },
    ],
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
    website: "https://techstart.io",
    dealIds: ["d2"],
    taskIds: ["t2"],
    notes: [],
    activityHistory: [],
  },
  {
    id: "c3",
    name: "Mike Chen",
    email: "mike@globalsolutions.com",
    phone: "+1 (555) 456-7890",
    company: "Global Solutions",
    position: "VP Sales",
    status: "Cold Lead",
    tags: ["Enterprise", "Sales"],
    lastContact: "3 weeks ago",
    website: "https://globalsolutions.com",
    dealIds: ["d3"],
    taskIds: ["t3"],
    notes: [],
    activityHistory: [],
  },
]

export const deals: Deal[] = [
  {
    id: "d1",
    title: "Acme Corp - Enterprise Package",
    contactId: "c1",
    client: "Acme Corp",
    value: 45000,
    stage: "Proposal",
    probability: 75,
    closeDate: "2024-02-15",
    assigneeId: "1",
    assignee: "Sarah Johnson",
    description: "Enterprise software solution for 500+ employees",
    taskIds: ["t1", "t5"],
    notes: [
      {
        id: "n2",
        content: "Proposal sent. Waiting for feedback on pricing.",
        createdAt: "2024-01-14",
        createdBy: "Sarah Johnson",
        type: "deal",
        entityId: "d1",
      },
    ],
    activityHistory: [
      {
        id: "a2",
        type: "deal_update",
        title: "Deal moved to Proposal stage",
        description: "Proposal document prepared and sent",
        timestamp: "2024-01-14T10:00:00Z",
        userId: "1",
        userName: "Sarah Johnson",
        entityType: "deal",
        entityId: "d1",
        entityName: "Acme Corp - Enterprise Package",
      },
    ],
  },
  {
    id: "d2",
    title: "TechStart - Startup Plan",
    contactId: "c2",
    client: "TechStart Inc",
    value: 28500,
    stage: "Negotiation",
    probability: 90,
    closeDate: "2024-02-10",
    assigneeId: "2",
    assignee: "Mike Chen",
    description: "Custom development and consulting services",
    taskIds: ["t2"],
    notes: [],
    activityHistory: [],
  },
  {
    id: "d3",
    title: "Global Solutions - Integration",
    contactId: "c3",
    client: "Global Solutions",
    value: 67200,
    stage: "Qualified",
    probability: 60,
    closeDate: "2024-03-01",
    assigneeId: "3",
    assignee: "Emma Davis",
    description: "System integration and migration project",
    taskIds: ["t3"],
    notes: [],
    activityHistory: [],
  },
]

export const tasks: Task[] = [
  {
    id: "t1",
    title: "Follow up with Acme Corp",
    description: "Discuss pricing and implementation timeline",
    type: "call",
    priority: "high",
    dueDate: "2024-01-15",
    dueTime: "2:00 PM",
    completed: false,
    assigneeId: "1",
    assignee: "Sarah Johnson",
    contactId: "c1",
    dealId: "d1",
    client: "Acme Corp",
    notes: [],
  },
  {
    id: "t2",
    title: "Send proposal to TechStart",
    description: "Include custom development package details",
    type: "email",
    priority: "high",
    dueDate: "2024-01-15",
    dueTime: "4:30 PM",
    completed: false,
    assigneeId: "2",
    assignee: "Mike Chen",
    contactId: "c2",
    dealId: "d2",
    client: "TechStart Inc",
    notes: [],
  },
  {
    id: "t3",
    title: "Demo meeting with Global Solutions",
    description: "Product demonstration and Q&A session",
    type: "meeting",
    priority: "medium",
    dueDate: "2024-01-16",
    dueTime: "10:00 AM",
    completed: false,
    assigneeId: "3",
    assignee: "Emma Davis",
    contactId: "c3",
    dealId: "d3",
    client: "Global Solutions",
    notes: [],
  },
  {
    id: "t4",
    title: "Update CRM records",
    description: "Add notes from last week's client meetings",
    type: "task",
    priority: "low",
    dueDate: "2024-01-17",
    dueTime: "End of day",
    completed: true,
    assigneeId: "4",
    assignee: "Alex Rodriguez",
    client: "Internal",
    notes: [],
  },
  {
    id: "t5",
    title: "Prepare contract for Acme Corp",
    description: "Draft contract based on approved proposal",
    type: "task",
    priority: "high",
    dueDate: "2024-01-18",
    dueTime: "12:00 PM",
    completed: false,
    assigneeId: "1",
    assignee: "Sarah Johnson",
    contactId: "c1",
    dealId: "d1",
    client: "Acme Corp",
    notes: [],
  },
]

// Helper functions to get interconnected data
export const getContactById = (id: string): Contact | undefined => {
  return contacts.find((contact) => contact.id === id)
}

export const getDealById = (id: string): Deal | undefined => {
  return deals.find((deal) => deal.id === id)
}

export const getTaskById = (id: string): Task | undefined => {
  return tasks.find((task) => task.id === id)
}

export const getUserById = (id: string): User | undefined => {
  return users.find((user) => user.id === id)
}

export const getContactDeals = (contactId: string): Deal[] => {
  return deals.filter((deal) => deal.contactId === contactId)
}

export const getContactTasks = (contactId: string): Task[] => {
  return tasks.filter((task) => task.contactId === contactId)
}

export const getDealTasks = (dealId: string): Task[] => {
  return tasks.filter((task) => task.dealId === dealId)
}

export const getTasksForUser = (userId: string): Task[] => {
  return tasks.filter((task) => task.assigneeId === userId)
}

export const getDealsForUser = (userId: string): Deal[] => {
  return deals.filter((deal) => deal.assigneeId === userId)
}

export const getActivityFeed = (): Activity[] => {
  const allActivities: Activity[] = []

  contacts.forEach((contact) => {
    allActivities.push(...contact.activityHistory)
  })

  deals.forEach((deal) => {
    allActivities.push(...deal.activityHistory)
  })

  return allActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}
