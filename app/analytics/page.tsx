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
import { TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react"

const monthlyRevenue = [
  { month: "Jul", revenue: 45000, deals: 12 },
  { month: "Aug", revenue: 52000, deals: 15 },
  { month: "Sep", revenue: 48000, deals: 11 },
  { month: "Oct", revenue: 61000, deals: 18 },
  { month: "Nov", revenue: 55000, deals: 14 },
  { month: "Dec", revenue: 67000, deals: 20 },
]

const salesByRep = [
  { name: "Sarah Johnson", deals: 8, revenue: 125000 },
  { name: "Mike Chen", deals: 6, revenue: 98000 },
  { name: "Emma Davis", deals: 5, revenue: 87000 },
  { name: "Alex Rodriguez", deals: 4, revenue: 65000 },
]

const pipelineData = [
  { stage: "Lead", count: 12, value: 180000, color: "#8884d8" },
  { stage: "Qualified", count: 8, value: 240000, color: "#82ca9d" },
  { stage: "Proposal", count: 6, value: 320000, color: "#ffc658" },
  { stage: "Negotiation", count: 4, value: 280000, color: "#ff7300" },
  { stage: "Closed Won", count: 3, value: 150000, color: "#00ff00" },
]

const conversionRates = [
  { stage: "Lead to Qualified", rate: 67 },
  { stage: "Qualified to Proposal", rate: 75 },
  { stage: "Proposal to Negotiation", rate: 67 },
  { stage: "Negotiation to Closed", rate: 75 },
]

export default function AnalyticsPage() {
  const totalRevenue = monthlyRevenue.reduce((sum, month) => sum + month.revenue, 0)
  const totalDeals = monthlyRevenue.reduce((sum, month) => sum + month.deals, 0)
  const avgDealSize = totalRevenue / totalDeals

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
              <span className="text-green-600">+12.5%</span> from last period
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
              <span className="text-green-600">+8</span> this month
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
              <span className="text-green-600">+15.2%</span> improvement
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              <span className="text-red-600">-2.1%</span> from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue over the past 6 months</CardDescription>
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
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesByRep}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
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
                  <div className="font-medium">${Math.round(stage.value / stage.count).toLocaleString()}</div>
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
