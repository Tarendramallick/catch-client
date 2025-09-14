"use client"

import { Progress } from "@/components/ui/progress"

import { AvatarFallback } from "@/components/ui/avatar"

import { AvatarImage } from "@/components/ui/avatar"

import { Avatar } from "@/components/ui/avatar"

import { CardContent } from "@/components/ui/card"

import { CardDescription } from "@/components/ui/card"

import { CardTitle } from "@/components/ui/card"

import { CardHeader } from "@/components/ui/card"

import { Card } from "@/components/ui/card"
;```tsx file="app/dashboard/page.tsx"
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Plus, TrendingUp, Users, DollarSign, Target, Calendar, User, Building2, Loader2 } from 'lucide-react'
import { PipelineChart } from "@/components/pipeline-chart"
import { RevenueChart } from "@/components/revenue-chart"
import { ActivityFeed } from "@/components/activity-feed"

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [recentDeals, setRecentDeals] = useState<any[]>([])
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        
        // Fetch analytics data
        const analyticsResponse = await fetch("/api/analytics")
        const analyticsResult = await analyticsResponse.json()
        
        // Fetch recent deals
        const dealsResponse = await fetch("/api/deals?limit=5&sort=updatedDate")
        const dealsResult = await dealsResponse.json()
        
        // Fetch upcoming tasks
        const tasksResponse = await fetch("/api/tasks?completed=false&limit=5&sort=dueDate")
        const tasksResult = await tasksResponse.json()
        
        if (analyticsResult.success) {
          setAnalytics(analyticsResult.data)
        }
        
        if (dealsResult.success) {
          setRecentDeals(dealsResult.data || [])
        }
        
        if (tasksResult.success) {
          setUpcomingTasks(tasksResult.data || [])
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

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
    switch (stage) {
      case "Lead":
        return "bg-blue-100 text-blue-800"
      case "Qualified":
        return "bg-green-100 text-green-800"
      case "Proposal":
        return "bg-yellow-100 text-yellow-800"
      case "Negotiation":
        return "bg-orange-100 text-orange-800"
      case "Closed Won":
        return "bg-emerald-100 text-emerald-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    )
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
            <div className="text-lg md:text-2xl font-bold">
              ${analytics?.revenue?.current?.toLocaleString() || "0"}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{analytics?.revenue?.growth || 0}%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Active Deals</CardTitle>
            <Target className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">{analytics?.deals?.active || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{analytics?.deals?.won || 0}</span> won this period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Win Rate</CardTitle>
            <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">{analytics?.deals?.winRate || 0}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+4.2%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">{analytics?.contacts?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">{analytics?.contacts?.new || 0}</span> new this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Revenue Overview</CardTitle>
            <CardDescription className="text-sm">Monthly revenue for the past 6 months</CardDescription>
          </CardHeader>
          <CardContent className="p-2 md:p-6">
            <div className="h-[250px] md:h-[300px] w-full">
              <RevenueChart />
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
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent deals found</p>
                <p className="text-sm">Create your first deal to get started</p>
              </div>
            ) : (
              <>
                {recentDeals.slice(0, 3).map((deal) => (
                  <div key={deal.id} className="block md:hidden">
                    <Card className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-sm truncate pr-2">{deal.title}</h4>
                          <Badge variant="secondary" className={\`text-xs ${getStageColor(deal.stage)} shrink-0\`}>
                            {deal.stage}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="truncate">{deal.client || deal.company}</span>
                          <span className="font-medium text-foreground">${(deal.value || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{deal.assignee}</span>
                          <span className="text-xs text-green-600">{deal.probability || 0}%</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
                <div className="hidden md:block space-y-4">
                  {recentDeals.slice(0, 3).map((deal) => (
                    <div key={deal.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">{deal.title}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building2 className="h-4 w-4" />
                          <span>{deal.client || deal.company}</span>
                          <span>•</span>
                          <User className="h-4 w-4" />
                          <span>{deal.assignee}</span>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-medium">${(deal.value || 0).toLocaleString()}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={getStageColor(deal.stage)}>
                            {deal.stage}
                          </Badge>
                          <span className="text-sm text-green-600">{deal.probability || 0}%</span>
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
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No upcoming tasks</p>
                <p className="text-sm">You're all caught up!</p>
              </div>
            ) : (
              upcomingTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="mt-1">
                    <div
                      className={\`w-2 h-2 rounded-full ${
                        task.priority === "high"
                          ? "bg-red-500"
                          : task.priority === "medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }\`}\
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="font-medium text-sm truncate">{task.title}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}</span>
                      </div>
                      <span className="hidden sm:inline">•</span>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span className="truncate">{task.assignee}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{task.client}</p>
                  </div>
                  <Badge variant="outline" className={\`text-xs shrink-0 ${getPriorityColor(task.priority)}`
}>\
{
  task.priority
}
</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

{
  /* Team Performance */
}
{
  analytics?.team?.performance && analytics.team.performance.length > 0 && (
    <Card>
      <CardHeader>
        <CardTitle className="text-base md:text-lg">Team Performance</CardTitle>
        <CardDescription className="text-sm">Individual performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 md:space-y-6">
          {analytics.team.performance.map((member: any, index: number) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 md:h-10 md:w-10">
                    <AvatarImage
                      src={`/placeholder-40x40.png?height=40&width=40&text=${member.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}`}
                    />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm md:text-base">{member.name}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">{member.deals} deals</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm md:text-base">${member.revenue.toLocaleString()}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">of ${member.target.toLocaleString()}</p>
                </div>
              </div>
              <Progress value={(member.revenue / member.target) * 100} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

{
  /* Activity Feed */
}
;<Card>
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
