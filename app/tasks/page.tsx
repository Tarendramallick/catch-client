"use client"

import { useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Plus,
  Calendar,
  Phone,
  Mail,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Filter,
  Search,
} from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const initialTasks = [
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
    avatar: "/placeholder.svg?height=32&width=32",
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
    avatar: "/placeholder.svg?height=32&width=32",
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
    avatar: "/placeholder.svg?height=32&width=32",
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
    avatar: "/placeholder.svg?height=32&width=32",
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
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

const teamMembers = [
  { id: "1", name: "Sarah Johnson", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "2", name: "Mike Chen", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "3", name: "Emma Davis", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "4", name: "Alex Rodriguez", avatar: "/placeholder.svg?height=32&width=32" },
]

const taskTypes = ["call", "email", "meeting", "task"]
const priorities = ["high", "medium", "low"]

const getTaskIcon = (type: string) => {
  switch (type) {
    case "call":
      return <Phone className="h-4 w-4 text-blue-500" />
    case "email":
      return <Mail className="h-4 w-4 text-green-500" />
    case "meeting":
      return <Calendar className="h-4 w-4 text-purple-500" />
    case "task":
      return <Target className="h-4 w-4 text-orange-500" />
    default:
      return <Target className="h-4 w-4 text-gray-500" />
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    case "low":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }
}

const getColumnForTask = (task: any) => {
  if (task.completed || task.status === "completed") return "completed"

  const today = new Date()
  const taskDate = new Date(task.dueDate)
  const diffTime = taskDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return "overdue"
  if (diffDays === 0) return "today"
  if (diffDays <= 7) return "thisWeek"
  return "upcoming"
}

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((json) => json.data || [])

export default function TasksPage() {
  const { data: tasks = [], error: tasksError, mutate: mutateTasks } = useSWR("/api/tasks", fetcher)
  const { data: users = [], error: usersError } = useSWR("/api/users", fetcher)
  const { data: contacts = [], error: contactsError } = useSWR("/api/contacts", fetcher)
  const { data: companies = [], error: companiesError } = useSWR("/api/companies", fetcher)

  const [sortBy, setSortBy] = useState("dueDate")
  const [filterBy, setFilterBy] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null)
  const [isCompletedOpen, setIsCompletedOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban")

  // Form state
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    type: "task",
    priority: "medium",
    dueDate: "",
    dueTime: "",
    assigneeId: "1",
    client: "",
  })

  const resetForm = () => {
    setNewTask({
      title: "",
      description: "",
      type: "task",
      priority: "medium",
      dueDate: "",
      dueTime: "",
      assigneeId: "1",
      client: "",
    })
    setSelectedColumn(null)
  }

  const openAddTaskDialog = (column?: string) => {
    resetForm()
    setSelectedColumn(column || null)

    // Set appropriate due date based on column
    const today = new Date()
    let defaultDate = today.toISOString().split("T")[0]

    if (column === "today") {
      defaultDate = today.toISOString().split("T")[0]
    } else if (column === "thisWeek") {
      const nextWeek = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)
      defaultDate = nextWeek.toISOString().split("T")[0]
    } else if (column === "upcoming") {
      const nextMonth = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000)
      defaultDate = nextMonth.toISOString().split("T")[0]
    }

    setNewTask((prev) => ({ ...prev, dueDate: defaultDate }))
    setIsDialogOpen(true)
  }

  const handleSaveTask = async () => {
    if (!newTask.title.trim()) {
      alert("Please enter a task title.")
      return
    }

    const assignee = [...teamMembers, ...users].find((member) => member.id === newTask.assigneeId)

    const taskData = {
      title: newTask.title,
      description: newTask.description,
      type: newTask.type,
      priority: newTask.priority,
      dueDate: newTask.dueDate || new Date().toISOString().split("T")[0],
      dueTime: newTask.dueTime || "End of day",
      assigneeId: newTask.assigneeId,
    }

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      })

      if (response.ok) {
        mutateTasks() // Refresh tasks data
        setIsDialogOpen(false)
        resetForm()
      } else {
        const errorData = await response.json()
        alert(`Failed to create task: ${errorData.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error creating task:", error)
      alert("Failed to create task")
    }
  }

  const toggleTask = async (taskId: string) => {
    const task = tasks.find((t: any) => t.id === taskId)
    if (!task) return

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: task.completed || task.status === "completed" ? "pending" : "completed" }),
      })

      if (response.ok) {
        mutateTasks() // Refresh tasks data
      } else {
        const errorData = await response.json()
        alert(`Failed to update task: ${errorData.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error updating task:", error)
      alert("Failed to update task")
    }
  }

  const deleteTask = async (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        const response = await fetch(`/api/tasks/${taskId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          mutateTasks() // Refresh tasks data
        } else {
          alert("Failed to delete task")
        }
      } catch (error) {
        console.error("Error deleting task:", error)
        alert("Failed to delete task")
      }
    }
  }

  const companyNames = companies.map((c: any) => c.name || c.company || c).filter(Boolean)
  const contactCompanies = contacts.map((c: any) => c.company).filter(Boolean)
  const allCompanies = [...new Set([...companyNames, ...contactCompanies])]

  const filteredTasks = tasks.filter((task: any) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.client || task.companyId || "Internal").toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      filterBy === "all" ||
      (filterBy === "completed" && (task.completed || task.status === "completed")) ||
      (filterBy === "pending" && !(task.completed || task.status === "completed")) ||
      (filterBy === "high" && task.priority === "high") ||
      (filterBy === "today" && getColumnForTask(task) === "today") ||
      (filterBy === "overdue" && getColumnForTask(task) === "overdue")

    return matchesSearch && matchesFilter
  })

  const taskColumns = {
    overdue: filteredTasks.filter((task: any) => getColumnForTask(task) === "overdue"),
    today: filteredTasks.filter((task: any) => getColumnForTask(task) === "today"),
    thisWeek: filteredTasks.filter((task: any) => getColumnForTask(task) === "thisWeek"),
    upcoming: filteredTasks.filter((task: any) => getColumnForTask(task) === "upcoming"),
    completed: filteredTasks.filter((task: any) => task.completed || task.status === "completed"),
  }

  const TaskCard = ({ task }: { task: any }) => (
    <Card
      className={`mb-3 hover:shadow-md transition-shadow ${task.completed || task.status === "completed" ? "opacity-75" : ""}`}
    >
      <CardContent className="p-3 md:p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {getTaskIcon(task.type)}
            <h4
              className={`font-medium text-sm ${task.completed || task.status === "completed" ? "line-through" : ""} truncate`}
            >
              {task.title}
            </h4>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge className={getPriorityColor(task.priority)} variant="outline">
              {task.priority}
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => toggleTask(task.id)} className="h-6 w-6 p-0">
              {task.completed || task.status === "completed" ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <div className="h-4 w-4 border-2 border-gray-300 rounded" />
              )}
            </Button>
          </div>
        </div>

        {task.description && <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{task.description}</p>}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Avatar className="h-5 w-5 flex-shrink-0">
              <AvatarImage src={task.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-xs">
                {(task.assignee || "Unknown")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span className="truncate">{task.assignee || "Unknown"}</span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Clock className="h-3 w-3" />
            <span>{task.dueTime}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 text-xs">
          <span className="text-muted-foreground truncate flex-1">{task.client || task.companyId || "Internal"}</span>
          <span className="text-muted-foreground flex-shrink-0 ml-2">
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Mobile-optimized header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Tasks Dashboard</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Organize and track your tasks across different time periods
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex rounded-lg border p-1 bg-muted">
            <Button
              variant={viewMode === "kanban" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("kanban")}
              className="h-7 px-3 text-xs"
            >
              Kanban
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-7 px-3 text-xs"
            >
              List
            </Button>
          </div>
          <Button onClick={() => openAddTaskDialog()} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Mobile-responsive search and filters */}
      <Card>
        <CardContent className="p-3 md:p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tasks</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="today">Due Today</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        <Card className="p-3 md:p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
            <CardTitle className="text-xs md:text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-3 w-3 md:h-4 md:w-4 text-red-500" />
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="text-lg md:text-2xl font-bold text-red-600">{taskColumns.overdue.length}</div>
          </CardContent>
        </Card>
        <Card className="p-3 md:p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
            <CardTitle className="text-xs md:text-sm font-medium">Today</CardTitle>
            <Calendar className="h-3 w-3 md:h-4 md:w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="text-lg md:text-2xl font-bold text-blue-600">{taskColumns.today.length}</div>
          </CardContent>
        </Card>
        <Card className="p-3 md:p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
            <CardTitle className="text-xs md:text-sm font-medium">This Week</CardTitle>
            <Clock className="h-3 w-3 md:h-4 md:w-4 text-yellow-500" />
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="text-lg md:text-2xl font-bold text-yellow-600">{taskColumns.thisWeek.length}</div>
          </CardContent>
        </Card>
        <Card className="p-3 md:p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
            <CardTitle className="text-xs md:text-sm font-medium">Upcoming</CardTitle>
            <Target className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="text-lg md:text-2xl font-bold text-green-600">{taskColumns.upcoming.length}</div>
          </CardContent>
        </Card>
        <Card className="p-3 md:p-6 col-span-2 md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
            <CardTitle className="text-xs md:text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-purple-500" />
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="text-lg md:text-2xl font-bold text-purple-600">{taskColumns.completed.length}</div>
          </CardContent>
        </Card>
      </div>

      {viewMode === "kanban" ? (
        <>
          {/* Mobile: Horizontal scroll for task columns */}
          <div className="block lg:hidden">
            <div className="flex gap-4 overflow-x-auto pb-4">
              {["overdue", "today", "thisWeek", "upcoming"].map((column) => (
                <Card
                  key={column}
                  className={`flex-shrink-0 w-72 ${
                    column === "overdue"
                      ? "border-red-200"
                      : column === "today"
                        ? "border-blue-200"
                        : column === "thisWeek"
                          ? "border-yellow-200"
                          : "border-green-200"
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle
                        className={`text-base flex items-center gap-2 ${
                          column === "overdue"
                            ? "text-red-600"
                            : column === "today"
                              ? "text-blue-600"
                              : column === "thisWeek"
                                ? "text-yellow-600"
                                : "text-green-600"
                        }`}
                      >
                        {column === "overdue" && <AlertCircle className="h-5 w-5" />}
                        {column === "today" && <Calendar className="h-5 w-5" />}
                        {column === "thisWeek" && <Clock className="h-5 w-5" />}
                        {column === "upcoming" && <Target className="h-5 w-5" />}
                        <Badge
                          className={`${
                            column === "overdue"
                              ? "bg-red-500"
                              : column === "today"
                                ? "bg-blue-500"
                                : column === "thisWeek"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                          } text-white`}
                        >
                          {taskColumns[column as keyof typeof taskColumns]?.length || 0}
                        </Badge>
                        {column.charAt(0).toUpperCase() + column.slice(1).replace(/([A-Z])/g, " $1")}
                      </CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => openAddTaskDialog(column)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                    {taskColumns[column as keyof typeof taskColumns]?.map((task: any) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                    {taskColumns[column as keyof typeof taskColumns]?.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No tasks</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Desktop: Grid layout for task columns */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-4">
            {["overdue", "today", "thisWeek", "upcoming"].map((column) => (
              <Card
                key={column}
                className={`${
                  column === "overdue"
                    ? "border-red-200"
                    : column === "today"
                      ? "border-blue-200"
                      : column === "thisWeek"
                        ? "border-yellow-200"
                        : "border-green-200"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle
                      className={`text-lg flex items-center gap-2 ${
                        column === "overdue"
                          ? "text-red-600"
                          : column === "today"
                            ? "text-blue-600"
                            : column === "thisWeek"
                              ? "text-yellow-600"
                              : "text-green-600"
                      }`}
                    >
                      {column === "overdue" && <AlertCircle className="h-5 w-5" />}
                      {column === "today" && <Calendar className="h-5 w-5" />}
                      {column === "thisWeek" && <Clock className="h-5 w-5" />}
                      {column === "upcoming" && <Target className="h-5 w-5" />}
                      <Badge
                        className={`${
                          column === "overdue"
                            ? "bg-red-500"
                            : column === "today"
                              ? "bg-blue-500"
                              : column === "thisWeek"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                        } text-white`}
                      >
                        {taskColumns[column as keyof typeof taskColumns]?.length || 0}
                      </Badge>
                      {column.charAt(0).toUpperCase() + column.slice(1).replace(/([A-Z])/g, " $1")}
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => openAddTaskDialog(column)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                  {taskColumns[column as keyof typeof taskColumns]?.map((task: any) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                  {taskColumns[column as keyof typeof taskColumns]?.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No tasks</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        /* List View - Mobile Responsive */
        <Card>
          <CardHeader>
            <CardTitle>All Tasks ({filteredTasks.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredTasks.map((task: any) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {filteredTasks.length === 0 && (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">No tasks found</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Completed Tasks - Collapsible */}
      <Collapsible open={isCompletedOpen} onOpenChange={setIsCompletedOpen}>
        <Card className="border-purple-200">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-purple-600 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Completed Tasks ({taskColumns.completed.length})
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-purple-100 text-purple-800">
                    {taskColumns.completed.length} completed
                  </Badge>
                  {isCompletedOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </div>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 max-h-96 overflow-y-auto">
                {taskColumns.completed.map((task: any) => (
                  <TaskCard key={task.id} task={task} />
                ))}
                {taskColumns.completed.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4 col-span-full">No completed tasks yet</p>
                )}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Add Task Dialog - Mobile Responsive */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Create a new task and assign it to a team member
              {selectedColumn && ` for ${selectedColumn.replace(/([A-Z])/g, " $1").toLowerCase()}`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Enter task title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Enter task description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select value={newTask.type} onValueChange={(value) => setNewTask({ ...newTask, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {taskTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        <div className="flex items-center gap-2">
                          {getTaskIcon(type)}
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dueTime">Due Time</Label>
                <Input
                  id="dueTime"
                  value={newTask.dueTime}
                  onChange={(e) => setNewTask({ ...newTask, dueTime: e.target.value })}
                  placeholder="e.g. 2:00 PM"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="assignee">Assigned To</Label>
                <Select
                  value={newTask.assigneeId}
                  onValueChange={(value) => setNewTask({ ...newTask, assigneeId: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...teamMembers, ...users].map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="client">Client/Company</Label>
                <Select value={newTask.client} onValueChange={(value) => setNewTask({ ...newTask, client: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Internal">Internal</SelectItem>
                    {allCompanies.map((company) => (
                      <SelectItem key={company} value={company}>
                        {company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleSaveTask} className="w-full sm:w-auto">
              Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
