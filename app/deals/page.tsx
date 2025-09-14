"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Plus,
  MoreHorizontal,
  DollarSign,
  Calendar,
  User,
  Building2,
  Search,
  Filter,
  SortAsc,
  BarChart3,
  List,
  Kanban,
} from "lucide-react"
import { DealsStageChart } from "@/components/deals-stage-chart"
import { ClosedWonChart } from "@/components/closed-won-chart"
import useSWR from "swr"
import type React from "react"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch")
  const data = await res.json()
  return data.data || data
}

interface Deal {
  _id?: string
  id?: string
  title: string
  company: string
  value: number
  stage: string
  probability: number
  expectedCloseDate: string
  assignedTo: string
  description: string
  tags: string[]
  createdAt?: string
  updatedAt?: string
}

const stages = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"]

const stageColors = {
  Lead: "bg-gray-100 text-gray-800",
  Qualified: "bg-blue-100 text-blue-800",
  Proposal: "bg-yellow-100 text-yellow-800",
  Negotiation: "bg-orange-100 text-orange-800",
  "Closed Won": "bg-green-100 text-green-800",
  "Closed Lost": "bg-red-100 text-red-800",
}

const getStageColor = (stage: string) => {
  switch (stage) {
    case "Lead":
      return "bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
    case "Qualified":
      return "bg-blue-100 border-blue-200 dark:bg-blue-900 dark:border-blue-700"
    case "Proposal":
      return "bg-yellow-100 border-yellow-200 dark:bg-yellow-900 dark:border-yellow-700"
    case "Negotiation":
      return "bg-orange-100 border-orange-200 dark:bg-orange-900 dark:border-orange-700"
    case "Closed Won":
      return "bg-green-100 border-green-200 dark:bg-green-900 dark:border-green-700"
    case "Closed Lost":
      return "bg-red-100 border-red-200 dark:bg-red-900 dark:border-red-700"
    default:
      return "bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
  }
}

export default function DealsPage() {
  const { data: deals = [], error, mutate } = useSWR("/api/deals", fetcher)
  const { data: users = [] } = useSWR("/api/users", fetcher)
  const { data: companies = [] } = useSWR("/api/companies", fetcher)

  const [searchTerm, setSearchTerm] = useState("")
  const [filterStage, setFilterStage] = useState("all")
  const [sortBy, setSortBy] = useState("createdAt")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null)
  const [formData, setFormData] = useState<Partial<Deal>>({
    title: "",
    company: "",
    value: 0,
    stage: "Lead",
    probability: 0,
    expectedCloseDate: "",
    assignedTo: "",
    description: "",
    tags: [],
  })
  const [draggedDeal, setDraggedDeal] = useState<string | null>(null)
  const [dragOverStage, setDragOverStage] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"kanban" | "list" | "charts">("kanban")

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    setDraggedDeal(dealId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, stage: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverStage(stage)
  }

  const handleDragLeave = () => {
    setDragOverStage(null)
  }

  const handleDrop = async (e: React.DragEvent, targetStage: string) => {
    e.preventDefault()
    setDragOverStage(null)

    if (draggedDeal && targetStage !== draggedDeal) {
      try {
        const response = await fetch(`/api/deals/${draggedDeal}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stage: targetStage }),
        })

        if (!response.ok) throw new Error("Failed to update deal stage")

        // Refresh data
        mutate()
      } catch (error) {
        console.error("Error updating deal stage:", error)
      }
    }
    setDraggedDeal(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingDeal) {
        // Update existing deal
        const response = await fetch(`/api/deals/${editingDeal._id || editingDeal.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })

        if (!response.ok) throw new Error("Failed to update deal")
      } else {
        // Create new deal
        const response = await fetch("/api/deals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }),
        })

        if (!response.ok) throw new Error("Failed to create deal")
      }

      // Refresh data
      mutate()

      // Reset form
      setFormData({
        title: "",
        company: "",
        value: 0,
        stage: "Lead",
        probability: 0,
        expectedCloseDate: "",
        assignedTo: "",
        description: "",
        tags: [],
      })
      setEditingDeal(null)
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving deal:", error)
      alert("Failed to save deal")
    }
  }

  const handleDelete = async (dealId: string) => {
    if (!confirm("Are you sure you want to delete this deal?")) return

    try {
      const response = await fetch(`/api/deals/${dealId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete deal")

      // Refresh data
      mutate()
    } catch (error) {
      console.error("Error deleting deal:", error)
      alert("Failed to delete deal")
    }
  }

  const handleEdit = (deal: Deal) => {
    setEditingDeal(deal)
    setFormData({
      title: deal.title,
      company: deal.company,
      value: deal.value,
      stage: deal.stage,
      probability: deal.probability,
      expectedCloseDate: deal.expectedCloseDate,
      assignedTo: deal.assignedTo,
      description: deal.description,
      tags: deal.tags,
    })
    setIsDialogOpen(true)
  }

  // Calculate metrics
  const activeDeals = deals.filter((deal: any) => !["Closed Won", "Closed Lost"].includes(deal.stage))
  const closedWonDeals = deals.filter((deal: any) => deal.stage === "Closed Won")
  const closedLostDeals = deals.filter((deal: any) => deal.stage === "Closed Lost")

  const pipelineValue = activeDeals.reduce((sum: any, deal: any) => sum + deal.value, 0)
  const averageDealSize = activeDeals.length > 0 ? pipelineValue / activeDeals.length : 0
  const closedWonValue = closedWonDeals.reduce((sum: any, deal: any) => sum + deal.value, 0)
  const winRate =
    closedWonDeals.length + closedLostDeals.length > 0
      ? (closedWonDeals.length / (closedWonDeals.length + closedLostDeals.length)) * 100
      : 0

  const dealsByStage = stages.reduce(
    (acc, stage) => {
      acc[stage] = deals.filter((deal: any) => deal.stage === stage)
      return acc
    },
    {} as Record<string, typeof deals>,
  )

  const filteredAndSortedDeals = deals
    .filter((deal: Deal) => {
      const matchesSearch =
        deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.company.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStage = filterStage === "all" || deal.stage === filterStage
      return matchesSearch && matchesStage
    })
    .sort((a: Deal, b: Deal) => {
      switch (sortBy) {
        case "value":
          return b.value - a.value
        case "stage":
          return a.stage.localeCompare(b.stage)
        case "createdAt":
        default:
          return new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
      }
    })

  if (error) return <div>Failed to load deals</div>
  if (!deals) return <div>Loading...</div>

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Deals Pipeline</h2>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === "kanban" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("kanban")}
            >
              <Kanban className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "charts" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("charts")}
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingDeal(null)
                  setFormData({
                    title: "",
                    company: "",
                    value: 0,
                    stage: "Lead",
                    probability: 0,
                    expectedCloseDate: "",
                    assignedTo: "",
                    description: "",
                    tags: [],
                  })
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Deal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingDeal ? "Edit Deal" : "Add New Deal"}</DialogTitle>
                <DialogDescription>
                  {editingDeal ? "Update the deal information." : "Create a new deal opportunity."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="company" className="text-right">
                      Company
                    </Label>
                    <Select
                      value={formData.company}
                      onValueChange={(value) => setFormData({ ...formData, company: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map((company: any) => (
                          <SelectItem key={company._id || company.id} value={company.name}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="value" className="text-right">
                      Value ($)
                    </Label>
                    <Input
                      id="value"
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="stage" className="text-right">
                      Stage
                    </Label>
                    <Select
                      value={formData.stage}
                      onValueChange={(value) => setFormData({ ...formData, stage: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {stages.map((stage) => (
                          <SelectItem key={stage} value={stage}>
                            {stage}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="probability" className="text-right">
                      Probability (%)
                    </Label>
                    <Input
                      id="probability"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.probability}
                      onChange={(e) => setFormData({ ...formData, probability: Number(e.target.value) })}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="expectedCloseDate" className="text-right">
                      Expected Close
                    </Label>
                    <Input
                      id="expectedCloseDate"
                      type="date"
                      value={formData.expectedCloseDate}
                      onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="assignedTo" className="text-right">
                      Assigned To
                    </Label>
                    <Select
                      value={formData.assignedTo}
                      onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user: any) => (
                          <SelectItem key={user._id || user.id} value={user.name}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="col-span-3"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">{editingDeal ? "Update Deal" : "Create Deal"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Pipeline Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pipelineValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{activeDeals.length} active deals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Deal Size</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Math.round(averageDealSize).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Per active deal</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed Won</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${closedWonValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{closedWonDeals.length} deals won</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(winRate)}%</div>
            <p className="text-xs text-muted-foreground">Closed deals</p>
          </CardContent>
        </Card>
      </div>

      {viewMode === "charts" && (
        <div className="grid gap-4 md:grid-cols-2">
          <DealsStageChart deals={deals} />
          <ClosedWonChart deals={deals} />
        </div>
      )}

      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {stages.map((stage) => (
            <div
              key={stage}
              className={`min-h-[500px] rounded-lg border-2 border-dashed p-4 ${
                dragOverStage === stage ? "border-blue-500 bg-blue-50" : "border-gray-200"
              } ${getStageColor(stage)}`}
              onDragOver={(e) => handleDragOver(e, stage)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">{stage}</h3>
                <Badge variant="secondary" className="text-xs">
                  {dealsByStage[stage]?.length || 0}
                </Badge>
              </div>
              <div className="space-y-3">
                {dealsByStage[stage]?.map((deal: any) => (
                  <Card
                    key={deal._id || deal.id}
                    className="cursor-move hover:shadow-md transition-shadow"
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal._id || deal.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium truncate">{deal.title}</CardTitle>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-6 w-6 p-0">
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(deal)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(deal._id || deal.id)}
                              className="text-red-600"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-1">
                          <Building2 className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground truncate">{deal.company}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs font-medium">${deal.value.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground truncate">{deal.assignedTo}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {new Date(deal.expectedCloseDate).toLocaleDateString()}
                            </span>
                          </div>
                          <span className="text-xs font-medium">{deal.probability}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button
                variant="ghost"
                className="w-full mt-4 border-dashed border-2 border-gray-300 hover:border-gray-400"
                onClick={() => {
                  setFormData({ ...formData, stage })
                  setIsDialogOpen(true)
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Deal
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <>
          {/* Filters and Search */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search deals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={filterStage} onValueChange={setFilterStage}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {stages.map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    {stage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SortAsc className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Date Created</SelectItem>
                <SelectItem value="value">Deal Value</SelectItem>
                <SelectItem value="stage">Stage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Deals Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedDeals.map((deal: Deal) => (
              <Card key={deal._id || deal.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{deal.title}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(deal)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(deal._id || deal.id || "")}
                        className="text-red-600"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{deal.company}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">${deal.value.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{deal.assignedTo}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {new Date(deal.expectedCloseDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge className={stageColors[deal.stage as keyof typeof stageColors]}>{deal.stage}</Badge>
                      <span className="text-sm font-medium">{deal.probability}%</span>
                    </div>
                    {deal.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{deal.description}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAndSortedDeals.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No deals found matching your criteria.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
