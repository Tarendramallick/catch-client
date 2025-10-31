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
import { Plus, Calendar, Phone, Mail, Target, Clock, CheckCircle, AlertCircle, Filter, Search } from "lucide-react"

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
  const [viewMode, setViewMode] = useState<"kanban" | "list">("list")

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

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create task")
      }

      const result = await response.json()
      console.log("Task created successfully:", result)
      mutateTasks() // Refresh tasks data
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error creating task:", error)
      alert(`Error: ${error.message}`)
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

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update task")
      }

      const result = await response.json()
      console.log("Task updated successfully:", result)
      mutateTasks() // Refresh tasks data
    } catch (error) {
      console.error("Error updating task:", error)
      alert(`Error: ${error.message}`)
    }
  }

  const deleteTask = async (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        const response = await fetch(`/api/tasks/${taskId}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to delete task")
        }

        const result = await response.json()
        console.log("Task deleted successfully:", result)
        mutateTasks() // Refresh tasks data
      } catch (error) {
        console.error("Error deleting task:", error)
        alert(`Error: ${error.message}`)
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
      className={`hover:shadow-md transition-shadow ${task.completed || task.status === "completed" ? "opacity-60 bg-muted/30" : ""}`}
    >
      <CardContent className="p-4 md:p-5">
        {/* Header: Title, Priority, Status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="mt-1 flex-shrink-0">{getTaskIcon(task.type)}</div>
            <div className="min-w-0 flex-1">
              <h4
                className={`font-semibold text-sm md:text-base leading-snug ${
                  task.completed || task.status === "completed" ? "line-through text-muted-foreground" : ""
                }`}
              >
                {task.title}
              </h4>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge className={getPriorityColor(task.priority)} variant="outline">
              {task.priority}
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => toggleTask(task.id)} className="h-6 w-6 p-0 flex-shrink-0">
              {task.completed || task.status === "completed" ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <div className="h-4 w-4 border-2 border-gray-300 rounded" />
              )}
            </Button>
          </div>
        </div>

        {/* Description */}
        {task.description && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{task.description}</p>}

        {/* Metadata: Assignee, Due Date, Time */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 pb-3 border-t border-border/50">
          {/* Assignee */}
          <div className="pt-3 md:pt-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Assigned To</p>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6 flex-shrink-0">
                <AvatarImage src={task.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-xs font-medium">
                  {(task.assignee || "U")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium truncate">{task.assignee || "Unassigned"}</span>
            </div>
          </div>

          {/* Due Date */}
          <div className="pt-3 md:pt-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Due Date</p>
            <p className="text-sm font-medium">
              {new Date(task.dueDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Due Time */}
          <div className="pt-3 md:pt-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Time</p>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm font-medium">{task.dueTime}</span>
            </div>
          </div>

          {/* Client */}
          <div className="pt-3 md:pt-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Client</p>
            <p className="text-sm font-medium truncate">{task.client || task.companyId || "Internal"}</p>
          </div>
        </div>

        {/* Task Type Badge */}
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="capitalize">
            {task.type}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteTask(task.id)}
            className="text-destructive hover:text-destructive h-8 px-2"
          >
            Delete
          </Button>
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
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className={`text-base flex items-center gap-2 text-blue-600`}>
                <Calendar className="h-5 w-5" />
                <Badge className={`bg-blue-500 text-white`}>{taskColumns.today.length || 0}</Badge>
                Today
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {taskColumns.today.map((task: any) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {taskColumns.today.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No tasks</p>
            )}
          </CardContent>
        </Card>
        <Card className="p-3 md:p-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className={`text-base flex items-center gap-2 text-yellow-600`}>
                <Clock className="h-5 w-5" />
                <Badge className={`bg-yellow-500 text-white`}>{taskColumns.thisWeek.length || 0}</Badge>
                This Week
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {taskColumns.thisWeek.map((task: any) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {taskColumns.thisWeek.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No tasks</p>
            )}
          </CardContent>
        </Card>
        <Card className="p-3 md:p-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className={`text-base flex items-center gap-2 text-green-600`}>
                <Target className="h-5 w-5" />
                <Badge className={`bg-green-500 text-white`}>{taskColumns.upcoming.length || 0}</Badge>
                Upcoming
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {taskColumns.upcoming.map((task: any) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {taskColumns.upcoming.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No tasks</p>
            )}
          </CardContent>
        </Card>
        <Card className="p-3 md:p-6 col-span-2 md:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className={`text-base flex items-center gap-2 text-purple-600`}>
                <CheckCircle className="h-5 w-5" />
                <Badge className={`bg-purple-500 text-white`}>{taskColumns.completed.length || 0}</Badge>
                Completed
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {taskColumns.completed.map((task: any) => (
                <TaskCard key={task.id} task={task} />
              ))}
              {taskColumns.completed.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No completed tasks yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* List View - Mobile Responsive */}
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
