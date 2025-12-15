"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, DollarSign, Target } from "lucide-react"
import useSWR from "swr"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch")
  const data = await res.json()
  return data.data || data
}

const isClosedWon = (stage: any): boolean => {
  if (!stage) return false
  const normalized = String(stage).toLowerCase().trim().replace(/\s+/g, "-")
  return normalized === "closed-won" || normalized === "closed won" || normalized === "closedwon"
}

export default function AnalyticsPage() {
  const { data: deals = [] } = useSWR("/api/deals", fetcher)
  const { data: users = [] } = useSWR("/api/users", fetcher)

  const closedWonDeals = deals.filter((deal: any) => isClosedWon(deal.stage))
  const totalRevenue = closedWonDeals.reduce((sum: number, deal: any) => {
    const value = deal.value || deal.dealValue || 0
    return sum + (typeof value === "number" ? value : Number.parseFloat(value) || 0)
  }, 0)
  const totalDeals = closedWonDeals.length
  const avgDealSize = totalDeals > 0 ? totalRevenue / totalDeals : 0

  // Generate monthly revenue from closed deals
  const monthlyRevenue = (() => {
    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const now = new Date()
    const months = []

    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthIndex = date.getMonth()
      const year = date.getFullYear()
      months.push({ month: monthLabels[monthIndex], monthIndex, year, date })
    }

    // Calculate revenue for each month
    return months.map(({ month, monthIndex, year }) => {
      const monthDeals = closedWonDeals.filter((deal: any) => {
        const dealDate = new Date(deal.updatedAt || deal.createdAt || "")
        return !isNaN(dealDate.getTime()) && dealDate.getMonth() === monthIndex && dealDate.getFullYear() === year
      })
      const revenue = monthDeals.reduce((sum: number, deal: any) => {
        const value = deal.value || deal.dealValue || 0
        return sum + (typeof value === "number" ? value : Number.parseFloat(value) || 0)
      }, 0)
      return { month, revenue, deals: monthDeals.length }
    })
  })()

  // Sales rep performance from real data
  const salesByRep = users
    .map((user: any) => {
      const userDeals = closedWonDeals.filter(
        (deal: any) => deal.assigneeId === user._id || deal.assignee === user.name,
      )
      const revenue = userDeals.reduce((sum: number, deal: any) => {
        const value = deal.value || deal.dealValue || 0
        return sum + (typeof value === "number" ? value : Number.parseFloat(value) || 0)
      }, 0)
      return {
        name: user.name,
        deals: userDeals.length,
        revenue,
      }
    })
    .filter((rep) => rep.deals > 0)

  // Pipeline distribution from real data
  const pipelineData = (() => {
    const stages = [
      { stage: "Lead", color: "#8884d8" },
      { stage: "Qualified", color: "#82ca9d" },
      { stage: "Proposal", color: "#ffc658" },
      { stage: "Negotiation", color: "#ff7300" },
      { stage: "Closed Won", color: "#00ff00" },
    ]

    return stages
      .map(({ stage, color }) => {
        const stageDeals = deals.filter((deal: any) => {
          const dealStage = String(deal.stage || "")
            .toLowerCase()
            .trim()
          const checkStage = stage.toLowerCase().replace(/\s+/g, "-").trim()
          return (
            dealStage.includes(checkStage.replace(/-/g, " ")) ||
            dealStage.includes(checkStage) ||
            dealStage === checkStage.replace(/-/g, " ")
          )
        })
        const value = stageDeals.reduce((sum: number, deal: any) => {
          const dealValue = deal.value || deal.dealValue || 0
          return sum + (typeof dealValue === "number" ? dealValue : Number.parseFloat(dealValue) || 0)
        }, 0)
        return {
          stage,
          count: stageDeals.length,
          value,
          color,
        }
      })
      .filter((stage) => stage.count > 0)
  })()

  // Conversion rates calculation
  const conversionRates = (() => {
    const stages = ["Lead", "Qualified", "Proposal", "Negotiation"]
    return stages.map((stage, index) => {
      const currentStage = deals.filter((deal: any) => {
        const dealStage = String(deal.stage || "")
          .toLowerCase()
          .trim()
        return dealStage.includes(stage.toLowerCase())
      }).length
      const nextStage =
        index < stages.length - 1
          ? deals.filter((deal: any) => {
              const dealStage = String(deal.stage || "")
                .toLowerCase()
                .trim()
              return dealStage.includes(stages[index + 1].toLowerCase())
            }).length
          : closedWonDeals.length

      const rate = currentStage > 0 ? Math.round((nextStage / currentStage) * 100) : 0
      return {
        stage: `${stage} to ${index < stages.length - 1 ? stages[index + 1] : "Closed"}`,
        rate: Math.min(rate, 100),
      }
    })
  })()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
        <p className="text-muted-foreground">Comprehensive insights into your sales performance and pipeline health</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-600">From {totalDeals} deals</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deals Closed</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeals}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-600">Closed won deals</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Deal Size</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Math.round(avgDealSize).toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-600">Average value</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {deals.length > 0 ? Math.round((closedWonDeals.length / deals.length) * 100) : 0}%
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-600">Conversion rate</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue from closed deals</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]} />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} dot={{ fill: "#8884d8" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pipeline Distribution</CardTitle>
            <CardDescription>Current deals by pipeline stage</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pipelineData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {pipelineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Sales Performance */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales Rep Performance</CardTitle>
            <CardDescription>Individual performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            {salesByRep.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesByRep}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]} />
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No sales data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Rates</CardTitle>
            <CardDescription>Pipeline stage conversion performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {conversionRates.map((conversion, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{conversion.stage}</span>
                  <span className="text-muted-foreground">{conversion.rate}%</span>
                </div>
                <Progress value={conversion.rate} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Pipeline Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Health</CardTitle>
          <CardDescription>Detailed breakdown of your sales pipeline</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pipelineData.map((stage, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: stage.color }} />
                  <div>
                    <h4 className="font-medium">{stage.stage}</h4>
                    <p className="text-sm text-muted-foreground">
                      {stage.count} deals • ${stage.value.toLocaleString()} total value
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    ${stage.count > 0 ? Math.round(stage.value / stage.count).toLocaleString() : "0"}
                  </div>
                  <div className="text-sm text-muted-foreground">avg deal size</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
