"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Plus,
  Search,
  MoreHorizontal,
  Mail,
  Phone,
  User,
  Filter,
  ArrowUpDown,
  Edit,
  Trash2,
  Eye,
  CheckSquare,
} from "lucide-react"
import useSWR from "swr"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch")
  const data = await res.json()
  return data.data || data
}

const roleOptions = ["Manager", "Sales Rep", "Admin", "Analyst", "Coordinator"]
const departmentOptions = ["Sales", "Marketing", "Support", "Operations", "Management"]
const statusOptions = ["Active", "Inactive", "On Leave"]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800"
    case "Inactive":
      return "bg-red-100 text-red-800"
    case "On Leave":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getRoleColor = (role: string) => {
  switch (role) {
    case "Manager":
      return "bg-purple-100 text-purple-800"
    case "Admin":
      return "bg-blue-100 text-blue-800"
    case "Sales Rep":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function UsersPage() {
  const { data: users = [], error, mutate } = useSWR("/api/users", fetcher)
  const { data: tasks = [] } = useSWR("/api/tasks", fetcher)

  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Sales Rep",
    department: "Sales",
    status: "Active",
  })

  // Form state
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Sales Rep",
    department: "Sales",
    status: "Active",
  })

  // Load users and tasks from localStorage
  // useEffect(() => {
  //   const savedUsers = localStorage.getItem("catchclients-users")
  //   if (savedUsers) {
  //     setUsers(JSON.parse(savedUsers))
  //   }

  //   const savedTasks = localStorage.getItem("catchclients-tasks")
  //   if (savedTasks) {
  //     setTasks(JSON.parse(savedTasks))
  //   }
  // }, [])

  // Save users to localStorage
  // useEffect(() => {
  //   localStorage.setItem("catchclients-users", JSON.stringify(users))
  // }, [users])

  // Update user task counts based on tasks
  // useEffect(() => {
  //   const updatedUsers = users.map((user) => {
  //     const userTasks = tasks.filter((task) => task.assigneeId === user.id)
  //     const completedTasks = userTasks.filter((task) => task.completed)

  //     return {
  //       ...user,
  //       tasksAssigned: userTasks.length,
  //       tasksCompleted: completedTasks.length,
  //     }
  //   })

  //   if (JSON.stringify(updatedUsers) !== JSON.stringify(users)) {
  //     setUsers(updatedUsers)
  //   }
  // }, [tasks])

  const resetForm = () => {
    setNewUser({
      name: "",
      email: "",
      phone: "",
      role: "Sales Rep",
      department: "Sales",
      status: "Active",
    })
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "Sales Rep",
      department: "Sales",
      status: "Active",
    })
    setEditingUser(null)
  }

  const openAddUserDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditUserDialog = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      department: user.department,
      status: user.status,
    })
    setEditingUser(user)
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name?.trim() || !formData.email?.trim()) {
      alert("Please fill in the name and email fields.")
      return
    }

    try {
      if (editingUser) {
        // Update existing user
        const response = await fetch(`/api/users/${editingUser._id || editingUser.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to update user")
        }

        const result = await response.json()
        console.log("User updated successfully:", result)
      } else {
        // Create new user
        const response = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            avatar: "/placeholder.svg?height=40&width=40",
            joinDate: new Date().toISOString().split("T")[0],
            lastActive: new Date().toISOString().split("T")[0],
            tasksAssigned: 0,
            tasksCompleted: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to create user")
        }

        const result = await response.json()
        console.log("User created successfully:", result)
      }

      // Refresh data
      mutate()

      // Reset form
      resetForm()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving user:", error)
      alert(`Error: ${error.message}`)
    }
  }

  const handleDelete = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete user")
      }

      const result = await response.json()
      console.log("User deleted successfully:", result)

      // Refresh data
      mutate()
    } catch (error) {
      console.error("Error deleting user:", error)
      alert(`Error: ${error.message}`)
    }
  }

  const handleSaveUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim()) {
      alert("Please fill in the name and email fields.")
      return
    }

    // if (editingUser) {
    //   // Update existing user
    //   setUsers(
    //     users.map((user) =>
    //       user.id === editingUser
    //         ? {
    //             ...user,
    //             name: newUser.name,
    //             email: newUser.email,
    //             phone: newUser.phone,
    //             role: newUser.role,
    //             department: newUser.department,
    //             status: newUser.status,
    //             lastActive: new Date().toISOString().split("T")[0],
    //           }
    //         : user,
    //     ),
    //   )
    // } else {
    //   // Create new user
    //   const user = {
    //     id: `u${Date.now()}`,
    //     name: newUser.name,
    //     email: newUser.email,
    //     phone: newUser.phone,
    //     role: newUser.role,
    //     department: newUser.department,
    //     status: newUser.status,
    //     avatar: "/placeholder.svg?height=40&width=40",
    //     joinDate: new Date().toISOString().split("T")[0],
    //     lastActive: new Date().toISOString().split("T")[0],
    //     tasksAssigned: 0,
    //     tasksCompleted: 0,
    //   }

    //   setUsers([user, ...users])
    // }

    setIsDialogOpen(false)
    resetForm()
  }

  const deleteUser = (userId) => {
    if (confirm("Are you sure you want to delete this user?")) {
      // setUsers(users.filter((user) => user.id !== userId))
    }
  }

  const sortUsers = (usersToSort) => {
    return [...usersToSort].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "role":
          return a.role.localeCompare(b.role)
        case "department":
          return a.department.localeCompare(b.department)
        case "joinDate":
          return new Date(b.joinDate || "").getTime() - new Date(a.joinDate || "").getTime()
        case "lastActive":
          return new Date(b.lastActive || "").getTime() - new Date(a.lastActive || "").getTime()
        default:
          return 0
      }
    })
  }

  const getUserTaskCounts = (userId) => {
    const userTasks = tasks.filter(
      (task) =>
        task.assignedTo === users.find((u) => u._id === userId || u.id === userId)?.name || task.assigneeId === userId,
    )
    const completedTasks = userTasks.filter((task) => task.status === "completed" || task.completed)

    return {
      tasksAssigned: userTasks.length,
      tasksCompleted: completedTasks.length,
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  const sortedUsers = sortUsers(filteredUsers)

  if (error) return <div>Failed to load users</div>
  if (!users) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground">Manage your team members, roles, and task assignments</p>
        </div>
        <Button onClick={openAddUserDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Team Member
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Team Members</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{users.filter((u) => u.status === "Active").length}</span> active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Managers</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.role === "Manager").length}</div>
            <p className="text-xs text-muted-foreground">Leadership team</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.reduce((sum, u) => {
                const { tasksAssigned } = getUserTaskCounts(u._id || u.id || "")
                return sum + tasksAssigned
              }, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">
                {users.reduce((sum, u) => {
                  const { tasksCompleted } = getUserTaskCounts(u._id || u.id || "")
                  return sum + tasksCompleted
                }, 0)}
              </span>{" "}
              completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(users.map((u) => u.department)).size}</div>
            <p className="text-xs text-muted-foreground">Active departments</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search team members by name, email, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {roleOptions.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="role">Role</SelectItem>
                  <SelectItem value="department">Department</SelectItem>
                  <SelectItem value="joinDate">Join Date</SelectItem>
                  <SelectItem value="lastActive">Last Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Team Members ({sortedUsers.length})</CardTitle>
          <CardDescription>Manage your team members, their roles, and track their task performance.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team Member</TableHead>
                <TableHead>Role & Department</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Tasks</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUsers.map((user) => {
                const { tasksAssigned, tasksCompleted } = getUserTaskCounts(user._id || user.id || "")

                return (
                  <TableRow key={user._id || user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={user.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Joined {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : "N/A"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                        <div className="text-sm text-muted-foreground">{user.department}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm flex items-center space-x-2">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span>{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="text-sm flex items-center space-x-2">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="font-medium">{tasksCompleted}</span>
                          <span className="text-muted-foreground">/{tasksAssigned} completed</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-green-500 h-1.5 rounded-full transition-all"
                            style={{
                              width: tasksAssigned > 0 ? `${(tasksCompleted / tasksAssigned) * 100}%` : "0%",
                            }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditUserDialog(user)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CheckSquare className="mr-2 h-4 w-4" />
                            View Tasks
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(user._id || user.id || "")}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit Team Member" : "Add New Team Member"}</DialogTitle>
            <DialogDescription>
              {editingUser ? "Update team member information" : "Enter the details for the new team member"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Company Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter company email address"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {departmentOptions.map((department) => (
                        <SelectItem key={department} value={department}>
                          {department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingUser ? "Update Team Member" : "Add Team Member"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
