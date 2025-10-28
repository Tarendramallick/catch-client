"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, TrendingUp, Users, Target, Calendar, Phone, Mail, Plus, MoreHorizontal } from "lucide-react"
import { PipelineChart } from "@/components/pipeline-chart"
import { RevenueChart } from "@/components/revenue-chart"
import { NotificationsPanel } from "@/components/notifications-panel"

export function Dashboard() {
  const [deals, setDeals] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [contacts, setContacts] = useState<any[]>([])

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      const savedDeals = localStorage.getItem("catchclients-deals")
      const savedTasks = localStorage.getItem("catchclients-tasks")
      const savedContacts = localStorage.getItem("catchclients-contacts")

      if (savedDeals) setDeals(JSON.parse(savedDeals))
      if (savedTasks) setTasks(JSON.parse(savedTasks))
      if (savedContacts) setContacts(JSON.parse(savedContacts))
    }

    loadData()

    // Set up interval to check for updates
    const interval = setInterval(loadData, 2000)

    return () => clearInterval(interval)
  }, [])

  // Calculate interconnected metrics
  const totalRevenue = deals.reduce((sum, deal) => sum + deal.value, 0)
  const activeDeals = deals.filter((deal) => !["Closed Won", "Closed Lost"].includes(deal.stage))
  const closedWonDeals = deals.filter((deal) => deal.stage === "Closed Won")
  const pendingTasks = tasks.filter((task) => !task.completed)
  const todayTasks = tasks.filter((task) => new Date(task.dueDate).toDateString() === new Date().toDateString())

  const recentDeals = activeDeals.slice(0, 4).map((deal) => ({
    id: deal.id,
    title: deal.title,
    company: deal.company,
    value: `$${deal.value.toLocaleString()}`,
    stage: deal.stage.charAt(0).toUpperCase() + deal.stage.slice(1).replace("-", " "),
    probability: deal.probability,
    assignee: deal.assignee,
    avatar: deal.avatar || "/placeholder.svg?height=32&width=32",
  }))

  const upcomingTasks = pendingTasks.slice(0, 4).map((task) => ({
    id: task.id,
    title: task.title,
    type: task.type,
    dueDate: task.dueDate,
    dueTime: task.dueTime,
    client: task.client,
    assignee: task.assignee,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your sales today.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Quick Add
        </Button>
      </div>

      {/* KPI Cards with Interconnected Data */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{closedWonDeals.length}</span> deals won this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDeals.length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{closedWonDeals.length}</span> recently won
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts.length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{contacts.filter((c) => c.status === "Hot Lead").length}</span> hot
              leads
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks.length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-orange-600">{todayTasks.length}</span> due today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue for the past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Sales Pipeline</CardTitle>
            <CardDescription>Deals by stage</CardDescription>
          </CardHeader>
          <CardContent>
            <PipelineChart />
          </CardContent>
        </Card>
      </div>

      {/* Notifications Panel */}
      <NotificationsPanel />

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Deals</CardTitle>
            <CardDescription>Latest deals in your pipeline with connected contacts</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Deal</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Probability</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentDeals.map((deal) => (
                  <TableRow key={deal.id}>
                    <TableCell className="font-medium">{deal.title}</TableCell>
                    <TableCell>{deal.company}</TableCell>
                    <TableCell>{deal.value}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{deal.stage}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={deal.probability} className="w-16" />
                        <span className="text-sm text-muted-foreground">{deal.probability}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={deal.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {deal.assignee
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{deal.assignee}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Your schedule for today and upcoming</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="flex items-center space-x-3 p-3 rounded-lg border">
                <div className="flex-shrink-0">
                  {task.type === "call" && <Phone className="h-4 w-4 text-blue-500" />}
                  {task.type === "email" && <Mail className="h-4 w-4 text-green-500" />}
                  {task.type === "meeting" && <Calendar className="h-4 w-4 text-purple-500" />}
                  {task.type === "task" && <Target className="h-4 w-4 text-orange-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.client}</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  <div>{new Date(task.dueDate).toLocaleDateString()}</div>
                  <div>{task.dueTime}</div>
                </div>
              </div>
            ))}
            {upcomingTasks.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">No upcoming tasks</p>
              </div>
            )}
            <Button variant="outline" className="w-full bg-transparent">
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
