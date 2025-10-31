"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Plus, TrendingUp, Users, DollarSign, Target, Calendar, User, Building2 } from "lucide-react"
import { PipelineChart } from "@/components/pipeline-chart"
import { RevenueChart } from "@/components/revenue-chart"
import { ActivityFeed } from "@/components/activity-feed"
import useSWR from "swr"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch")
  const data = await res.json()
  return data.data || data
}

export default function Dashboard() {
  const {
    data: deals = [],
    isLoading: dealsLoading,
    isValidating: dealsValidating,
  } = useSWR("/api/deals", fetcher, { revalidateOnFocus: true })
  const { data: tasks = [] } = useSWR("/api/tasks", fetcher, { revalidateOnFocus: true })
  const { data: contacts = [] } = useSWR("/api/contacts", fetcher, { revalidateOnFocus: true })
  const { data: users = [] } = useSWR("/api/users", fetcher, { revalidateOnFocus: true })
  const { data: companies = [] } = useSWR("/api/companies", fetcher, { revalidateOnFocus: true })

  const activeDeals = deals.filter(
    (deal: any) =>
      deal &&
      !["closed-won", "closed won", "closed-lost", "closed lost"].includes((deal.stage || "").toLowerCase().trim()),
  )
  const closedWonDeals = deals.filter((deal: any) => {
    if (!deal) return false
    const stage = (deal.stage || "").toLowerCase().trim()
    return stage === "closed-won" || stage === "closed won"
  })
  const closedLostDeals = deals.filter((deal: any) => {
    if (!deal) return false
    const stage = (deal.stage || "").toLowerCase().trim()
    return stage === "closed-lost" || stage === "closed lost"
  })

  const totalRevenue = closedWonDeals.reduce((sum: number, deal: any) => {
    const value = deal.value || deal.dealValue || 0
    return sum + (Number.isFinite(value) ? Number(value) : 0)
  }, 0)

  const conversionRate = deals.length > 0 ? (closedWonDeals.length / deals.length) * 100 : 0

  const userMap = new Map(users.map((user: any) => [user._id || user.id, user]))

  const recentDeals = deals
    .sort(
      (a: any, b: any) =>
        new Date(b.updatedAt || b.createdAt || "").getTime() - new Date(a.updatedAt || a.createdAt || "").getTime(),
    )
    .slice(0, 3)
    .map((deal: any) => {
      const assignedUser = userMap.get(deal.assigneeId) || null
      return {
        id: deal._id || deal.id,
        name: deal.title || deal.name,
        company: deal.client || deal.company,
        value: deal.value || 0,
        stage: deal.stage || "lead",
        probability: deal.probability || 0,
        assignee: assignedUser?.name || deal.assignee || "Unassigned",
        assigneeAvatar: assignedUser?.avatar || "/placeholder-40x40.png",
        assigneeId: deal.assigneeId,
      }
    })

  const upcomingTasks = tasks
    .filter((task: any) => !task.completed && task.status !== "completed")
    .sort((a: any, b: any) => new Date(a.dueDate || "").getTime() - new Date(b.dueDate || "").getTime())
    .slice(0, 3)
    .map((task: any) => ({
      id: task._id || task.id,
      title: task.title,
      dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date",
      priority: task.priority || "medium",
      assignee: task.assignee || "Unassigned",
      company: task.client || "Unknown",
    }))

  const taskCountsByUserId = new Map<string, { assigned: number; completed: number }>()
  ;(tasks || []).forEach((t: any) => {
    const userId = t.assigneeId || t.assignee || ""
    const entry = taskCountsByUserId.get(userId) || { assigned: 0, completed: 0 }
    entry.assigned += 1
    if (t.completed || t.status === "completed") entry.completed += 1
    taskCountsByUserId.set(userId, entry)
  })

  const teamPerformance = users
    .map((user: any) => {
      const userDeals = deals.filter(
        (deal: any) => deal && (deal.assigneeId === user._id || deal.assignee === user.name),
      )
      const userRevenue = userDeals
        .filter((deal: any) => {
          if (!deal) return false
          const stage = (deal.stage || "").toLowerCase().trim()
          return stage === "closed-won" || stage === "closed won"
        })
        .reduce((sum: number, deal: any) => {
          const value = deal.value || deal.dealValue || 0
          return sum + (Number.isFinite(value) ? Number(value) : 0)
        }, 0)
      const tasksForUser = taskCountsByUserId.get(user._id || user.id) || { assigned: 0, completed: 0 }
      const tasksNeeded = Math.max(0, tasksForUser.assigned - tasksForUser.completed)
      return {
        name: user.name,
        deals: userDeals.length,
        revenue: userRevenue,
        tasksCompleted: tasksForUser.completed,
        tasksAssigned: tasksForUser.assigned,
        tasksNeeded: tasksNeeded,
        target: 150000,
        avatar: user.avatar || "/placeholder-40x40.png",
      }
    })
    .slice(0, 4)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getStageColor = (stage: string) => {
    const stageKey = stage?.toLowerCase() || ""
    switch (stageKey) {
      case "lead":
        return "bg-blue-100 text-blue-800"
      case "qualified":
        return "bg-green-100 text-green-800"
      case "proposal":
        return "bg-yellow-100 text-yellow-800"
      case "negotiation":
        return "bg-orange-100 text-orange-800"
      case "closed-won":
      case "closed won":
        return "bg-emerald-100 text-emerald-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Welcome back! Here's what's happening with your sales today.
          </p>
        </div>
        <Button size="sm" className="shrink-0">
          <Plus className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Quick Add</span>
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">From {closedWonDeals.length} deals</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Active Deals</CardTitle>
            <Target className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">{activeDeals.length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">{deals.length} total deals</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">{conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{closedWonDeals.length} won</span> /{" "}
              <span className="text-red-600">{closedLostDeals.length} lost</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Team Members</CardTitle>
            <Users className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">{contacts.length} contacts</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Revenue Overview</CardTitle>
            <CardDescription className="text-sm">Monthly closed-won revenue for the past 6 months</CardDescription>
          </CardHeader>
          <CardContent className="p-2 md:p-6">
            <div className="h-[250px] md:h-[300px] w-full">
              {activeDeals.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No Deals in Pipeline
                </div>
              ) : (
                <RevenueChart />
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Sales Pipeline</CardTitle>
            <CardDescription className="text-sm">Deals by stage</CardDescription>
          </CardHeader>
          <CardContent className="p-2 md:p-6">
            <div className="h-[250px] md:h-[300px] w-full">
              <PipelineChart />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Recent Deals</CardTitle>
            <CardDescription className="text-sm">Latest deals in your pipeline</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4">
            {recentDeals.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No deals found</p>
            ) : (
              <>
                {recentDeals.map((deal) => (
                  <div key={deal.id} className="block md:hidden">
                    <Card className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-sm truncate pr-2">{deal.name}</h4>
                          <Badge variant="secondary" className={`text-xs ${getStageColor(deal.stage)} shrink-0`}>
                            {deal.stage}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="truncate">{deal.company}</span>
                          <span className="font-medium text-foreground">${deal.value.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={deal.assigneeAvatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs">
                                {deal.assignee
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground">{deal.assignee}</span>
                          </div>
                          <span className="text-xs text-green-600">{deal.probability}%</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
                <div className="hidden md:block space-y-4">
                  {recentDeals.map((deal) => (
                    <div key={deal.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">{deal.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building2 className="h-4 w-4" />
                          <span>{deal.company}</span>
                          <span>•</span>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={deal.assigneeAvatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs">
                                {deal.assignee
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span>{deal.assignee}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-medium">${deal.value.toLocaleString()}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={getStageColor(deal.stage)}>
                            {deal.stage}
                          </Badge>
                          <span className="text-sm text-green-600">{deal.probability}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Upcoming Tasks</CardTitle>
            <CardDescription className="text-sm">Tasks that need your attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4">
            {upcomingTasks.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No upcoming tasks</p>
            ) : (
              upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="mt-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        task.priority === "high"
                          ? "bg-red-500"
                          : task.priority === "medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="font-medium text-sm truncate">{task.title}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{task.dueDate}</span>
                      </div>
                      <span className="hidden sm:inline">•</span>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span className="truncate">{task.assignee}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{task.company}</p>
                  </div>
                  <Badge variant="outline" className={`text-xs shrink-0 ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Team Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Team Performance</CardTitle>
          <CardDescription className="text-sm">Individual performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 md:space-y-6">
            {teamPerformance.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No team members found</p>
            ) : (
              teamPerformance.map((member, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 md:h-10 md:w-10">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm md:text-base">{member.name}</p>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          {member.deals} deals • {member.tasksCompleted}/{member.tasksAssigned} tasks completed
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm md:text-lg text-green-600">${member.revenue.toLocaleString()}</p>
                      <p className="text-xs md:text-sm text-muted-foreground">of ${member.target.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Progress value={(member.revenue / member.target) * 100} className="h-2" />
                    <p className="text-xs text-right text-muted-foreground">
                      {member.tasksNeeded > 0
                        ? `${member.tasksNeeded} task${member.tasksNeeded !== 1 ? "s" : ""} needed`
                        : "All tasks completed"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Recent Activity</CardTitle>
          <CardDescription className="text-sm">Latest updates across your CRM</CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityFeed />
        </CardContent>
      </Card>
    </div>
  )
}
