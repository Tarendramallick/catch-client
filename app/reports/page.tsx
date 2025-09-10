"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Download, TrendingUp, Target, DollarSign, BarChart3, TrendingDown, Filter } from "lucide-react"
import { jsPDF } from "jspdf"
import * as XLSX from "xlsx"

// Sample data for reports
const salesPerformanceData = [
  { month: "Jan", revenue: 45000, deals_closed: 12, deals_lost: 3 },
  { month: "Feb", revenue: 52000, deals_closed: 15, deals_lost: 4 },
  { month: "Mar", revenue: 48000, deals_closed: 11, deals_lost: 2 },
  { month: "Apr", revenue: 61000, deals_closed: 18, deals_lost: 5 },
  { month: "May", revenue: 55000, deals_closed: 14, deals_lost: 3 },
  { month: "Jun", revenue: 67000, deals_closed: 20, deals_lost: 4 },
]

const leadsSourceData = [
  { source: "Website", leads: 45, conversions: 12, rate: 26.7 },
  { source: "Email Campaign", leads: 32, conversions: 8, rate: 25.0 },
  { source: "Social Media", leads: 28, conversions: 5, rate: 17.9 },
  { source: "Referrals", leads: 22, conversions: 9, rate: 40.9 },
  { source: "Cold Outreach", leads: 18, conversions: 3, rate: 16.7 },
]

const leadStageData = [
  { stage: "Lead", count: 12, color: "#8884d8" },
  { stage: "Qualified", count: 8, color: "#82ca9d" },
  { stage: "Proposal", count: 6, color: "#ffc658" },
  { stage: "Negotiation", count: 4, color: "#ff7300" },
  { stage: "Closed Won", count: 3, color: "#00ff00" },
]

const topCustomersData = [
  { customer: "Acme Corp", revenue: 125000, deals: 8, status: "Active" },
  { customer: "TechStart Inc", revenue: 98000, deals: 6, status: "Active" },
  { customer: "Global Solutions", revenue: 87000, deals: 5, status: "Active" },
  { customer: "Innovation Labs", revenue: 65000, deals: 4, status: "Active" },
  { customer: "Future Systems", revenue: 45000, deals: 3, status: "Inactive" },
]

const funnelData = [
  { stage: "Leads", value: 145, fill: "#8884d8" },
  { stage: "Qualified", value: 42, fill: "#82ca9d" },
  { stage: "Proposal", value: 28, fill: "#ffc658" },
  { stage: "Negotiation", value: 15, fill: "#ff7300" },
  { stage: "Closed Won", value: 8, fill: "#00ff00" },
]

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("last-6-months")
  const [selectedReport, setSelectedReport] = useState("sales")

  const exportReport = (format: "pdf" | "excel" | "csv") => {
    const reportData = getReportData()

    switch (format) {
      case "pdf":
        exportToPDF(reportData)
        break
      case "excel":
        exportToExcel(reportData)
        break
      case "csv":
        exportToCSV(reportData)
        break
    }
  }

  const getReportData = () => {
    switch (selectedReport) {
      case "sales":
        return {
          title: "Sales Performance Report",
          data: salesPerformanceData,
          headers: ["Month", "Revenue", "Deals Closed", "Deals Lost"],
        }
      case "leads":
        return {
          title: "Leads Report",
          data: leadsSourceData,
          headers: ["Source", "Leads", "Conversions", "Rate (%)"],
        }
      case "customers":
        return {
          title: "Customer Report",
          data: topCustomersData,
          headers: ["Customer", "Revenue", "Deals", "Status"],
        }
      default:
        return { title: "", data: [], headers: [] }
    }
  }

  const exportToPDF = (reportData: any) => {
    const doc = new jsPDF()

    // Add title
    doc.setFontSize(20)
    doc.text(reportData.title, 20, 20)

    // Add date and period
    doc.setFontSize(12)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 35)
    doc.text(`Period: ${selectedPeriod.replace("-", " ")}`, 20, 45)

    // Add table headers
    doc.setFontSize(10)
    let yPosition = 65
    const columnWidth = 40
    const startX = 20

    // Draw headers
    doc.setFont(undefined, "bold")
    reportData.headers.forEach((header: string, index: number) => {
      doc.text(header, startX + index * columnWidth, yPosition)
    })

    // Draw header line
    yPosition += 5
    doc.line(startX, yPosition, startX + reportData.headers.length * columnWidth, yPosition)
    yPosition += 10

    // Add data rows
    doc.setFont(undefined, "normal")
    if (selectedReport === "sales") {
      salesPerformanceData.forEach((item) => {
        doc.text(item.month, startX, yPosition)
        doc.text(`$${item.revenue.toLocaleString()}`, startX + columnWidth, yPosition)
        doc.text(item.deals_closed.toString(), startX + columnWidth * 2, yPosition)
        doc.text(item.deals_lost.toString(), startX + columnWidth * 3, yPosition)
        yPosition += 15
      })
    } else if (selectedReport === "leads") {
      leadsSourceData.forEach((item) => {
        doc.text(item.source, startX, yPosition)
        doc.text(item.leads.toString(), startX + columnWidth, yPosition)
        doc.text(item.conversions.toString(), startX + columnWidth * 2, yPosition)
        doc.text(`${item.rate}%`, startX + columnWidth * 3, yPosition)
        yPosition += 15
      })
    } else if (selectedReport === "customers") {
      topCustomersData.forEach((item) => {
        doc.text(item.customer, startX, yPosition)
        doc.text(`$${item.revenue.toLocaleString()}`, startX + columnWidth, yPosition)
        doc.text(item.deals.toString(), startX + columnWidth * 2, yPosition)
        doc.text(item.status, startX + columnWidth * 3, yPosition)
        yPosition += 15
      })
    }

    // Save the PDF
    doc.save(`${reportData.title.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.pdf`)
  }

  const exportToExcel = (reportData: any) => {
    let worksheetData: any[] = []

    if (selectedReport === "sales") {
      worksheetData = salesPerformanceData.map((item) => ({
        Month: item.month,
        Revenue: item.revenue,
        "Deals Closed": item.deals_closed,
        "Deals Lost": item.deals_lost,
        "Win Rate": `${((item.deals_closed / (item.deals_closed + item.deals_lost)) * 100).toFixed(1)}%`,
      }))
    } else if (selectedReport === "leads") {
      worksheetData = leadsSourceData.map((item) => ({
        Source: item.source,
        Leads: item.leads,
        Conversions: item.conversions,
        "Conversion Rate": `${item.rate}%`,
      }))
    } else if (selectedReport === "customers") {
      worksheetData = topCustomersData.map((item) => ({
        Customer: item.customer,
        Revenue: item.revenue,
        Deals: item.deals,
        "Avg Deal Size": Math.round(item.revenue / item.deals),
        Status: item.status,
      }))
    }

    const worksheet = XLSX.utils.json_to_sheet(worksheetData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, reportData.title)

    // Generate Excel file as binary string
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })

    // Create blob and download
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute(
      "download",
      `${reportData.title.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.xlsx`,
    )
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const exportToCSV = (reportData: any) => {
    let csvContent = `${reportData.title}\n`
    csvContent += `Generated: ${new Date().toLocaleDateString()}\n`
    csvContent += `Period: ${selectedPeriod.replace("-", " ")}\n\n`

    if (selectedReport === "sales") {
      csvContent += "Month,Revenue,Deals Closed,Deals Lost,Win Rate\n"
      salesPerformanceData.forEach((item) => {
        const winRate = ((item.deals_closed / (item.deals_closed + item.deals_lost)) * 100).toFixed(1)
        csvContent += `${item.month},${item.revenue},${item.deals_closed},${item.deals_lost},${winRate}%\n`
      })
    } else if (selectedReport === "leads") {
      csvContent += "Source,Leads,Conversions,Conversion Rate\n"
      leadsSourceData.forEach((item) => {
        csvContent += `${item.source},${item.leads},${item.conversions},${item.rate}%\n`
      })
    } else if (selectedReport === "customers") {
      csvContent += "Customer,Revenue,Deals,Avg Deal Size,Status\n"
      topCustomersData.forEach((item) => {
        csvContent += `${item.customer},${item.revenue},${item.deals},${Math.round(item.revenue / item.deals)},${item.status}\n`
      })
    }

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute(
      "download",
      `${reportData.title.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.csv`,
    )
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">Pre-built reports with comprehensive analytics and visualizations</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-30-days">Last 30 Days</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
              <SelectItem value="last-6-months">Last 6 Months</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Report Categories */}
      <Tabs value={selectedReport} onValueChange={setSelectedReport} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sales">Sales Performance</TabsTrigger>
          <TabsTrigger value="leads">Leads Report</TabsTrigger>
          <TabsTrigger value="customers">Customer Report</TabsTrigger>
        </TabsList>

        {/* Sales Performance Report */}
        <TabsContent value="sales" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Sales Performance Report</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => exportReport("pdf")}>
                <Download className="mr-2 h-4 w-4" />
                PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportReport("excel")}>
                <Download className="mr-2 h-4 w-4" />
                Excel
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportReport("csv")}>
                <Download className="mr-2 h-4 w-4" />
                CSV
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$328,000</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-600">+15.2%</span> vs previous period
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Deals Closed</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">90</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-600">+12</span> vs previous period
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">81.1%</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-600">+5.3%</span> improvement
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Deal Size</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$3,644</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                  <span className="text-red-600">-2.1%</span> vs previous period
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Month</CardTitle>
                <CardDescription>Monthly revenue trend over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]} />
                    <Bar dataKey="revenue" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Deals Closed vs Lost</CardTitle>
                <CardDescription>Win/loss comparison by month</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="deals_closed" stroke="#00ff00" name="Closed" />
                    <Line type="monotone" dataKey="deals_lost" stroke="#ff0000" name="Lost" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Leads Report */}
        <TabsContent value="leads" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Leads Report</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => exportReport("pdf")}>
                <Download className="mr-2 h-4 w-4" />
                PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportReport("excel")}>
                <Download className="mr-2 h-4 w-4" />
                Excel
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportReport("csv")}>
                <Download className="mr-2 h-4 w-4" />
                CSV
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Lead Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Leads by Source</CardTitle>
                <CardDescription>Number of new leads and conversion rates by source</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source</TableHead>
                      <TableHead>Leads</TableHead>
                      <TableHead>Conversions</TableHead>
                      <TableHead>Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leadsSourceData.map((source) => (
                      <TableRow key={source.source}>
                        <TableCell className="font-medium">{source.source}</TableCell>
                        <TableCell>{source.leads}</TableCell>
                        <TableCell>{source.conversions}</TableCell>
                        <TableCell>
                          <Badge variant={source.rate > 25 ? "default" : "secondary"}>{source.rate}%</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Lead Stage Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Lead Stage Distribution</CardTitle>
                <CardDescription>Current distribution of leads across pipeline stages</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={leadStageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {leadStageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Funnel Visualization */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Funnel</CardTitle>
              <CardDescription>Lead progression through the sales pipeline</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={funnelData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="stage" type="category" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customer Report */}
        <TabsContent value="customers" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Customer Report</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => exportReport("pdf")}>
                <Download className="mr-2 h-4 w-4" />
                PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportReport("excel")}>
                <Download className="mr-2 h-4 w-4" />
                Excel
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportReport("csv")}>
                <Download className="mr-2 h-4 w-4" />
                CSV
              </Button>
            </div>
          </div>

          {/* Top Customers Table */}
          <Card>
            <CardHeader>
              <CardTitle>Top Customers by Revenue</CardTitle>
              <CardDescription>Your highest value customers and their contribution</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total Revenue</TableHead>
                    <TableHead>Deals</TableHead>
                    <TableHead>Avg Deal Size</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topCustomersData.map((customer) => (
                    <TableRow key={customer.customer}>
                      <TableCell className="font-medium">{customer.customer}</TableCell>
                      <TableCell>${customer.revenue.toLocaleString()}</TableCell>
                      <TableCell>{customer.deals}</TableCell>
                      <TableCell>${Math.round(customer.revenue / customer.deals).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={customer.status === "Active" ? "default" : "secondary"}>
                          {customer.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Customer Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Revenue Distribution</CardTitle>
              <CardDescription>Revenue contribution by top customers</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topCustomersData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="customer" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]} />
                  <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
