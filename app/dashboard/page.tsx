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

// Sample data
const recentDeals = [
  {
    id: 1,
    name: "Enterprise Software License",
    company: "TechCorp Inc",
    value: 45000,
    stage: "negotiation",
    probability: 75,
    contact: "Sarah Johnson",
    phone: "+1 (555) 123-4567",
    email: "sarah@techcorp.com",
  },
  {
    id: 2,
    name: "Marketing Campaign",
    company: "StartupXYZ",
    value: 12000,
    stage: "proposal",
    probability: 60,
    contact: "Mike Chen",
    phone: "+1 (555) 987-6543",
    email: "mike@startupxyz.com",
  },
  {
    id: 3,
    name: "Consulting Services",
    company: "Global Solutions",
    value: 28000,
    stage: "qualified",
    probability: 40,
    contact: "Emily Davis",
    phone: "+1 (555) 456-7890",
    email: "emily@globalsolutions.com",
  },
]

const upcomingTasks = [
  {
    id: 1,
    title: "Follow up with TechCorp",
    dueDate: "Today",
    priority: "high",
    assignee: "John Doe",
    company: "TechCorp Inc",
  },
  {
    id: 2,
    title: "Send proposal to StartupXYZ",
    dueDate: "Tomorrow",
    priority: "medium",
    assignee: "Jane Smith",
    company: "StartupXYZ",
  },
  {
    id: 3,
    title: "Schedule demo call",
    dueDate: "Friday",
    priority: "low",
    assignee: "Mike Johnson",
    company: "Global Solutions",
  },
]

const teamPerformance = [
  { name: "Sarah Johnson", deals: 12, revenue: 145000, target: 150000 },
  { name: "Mike Chen", deals: 8, revenue: 98000, target: 120000 },
  { name: "Emily Davis", deals: 15, revenue: 187000, target: 180000 },
  { name: "John Smith", deals: 6, revenue: 76000, target: 100000 },
]

export default function Dashboard() {
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
      case "lead":
        return "bg-blue-100 text-blue-800"
      case "qualified":
        return "bg-green-100 text-green-800"
      case "proposal":
        return "bg-yellow-100 text-yellow-800"
      case "negotiation":
        return "bg-orange-100 text-orange-800"
      case "closed-won":
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
            <div className="text-lg md:text-2xl font-bold">$45,231</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+20.1%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Active Deals</CardTitle>
            <Target className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2</span> from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">24.5%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+4.2%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Team Members</CardTitle>
            <Users className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">2</span> new this month
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
                      <span className="text-xs text-muted-foreground">{deal.contact}</span>
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
                      <User className="h-4 w-4" />
                      <span>{deal.contact}</span>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Upcoming Tasks</CardTitle>
            <CardDescription className="text-sm">Tasks that need your attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4">
            {upcomingTasks.map((task) => (
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
            ))}
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
            {teamPerformance.map((member, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 md:h-10 md:w-10">
                      <AvatarImage
                        src={`/placeholder.svg?height=40&width=40&text=${member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}`}
                      />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
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
