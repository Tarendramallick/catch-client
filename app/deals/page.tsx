"use client"

import type React from "react"
import { useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  MoreHorizontal,
  DollarSign,
  Target,
  TrendingUp,
  Calendar,
  Building2,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  GripVertical,
  Search,
  Filter,
  SortAsc,
  BarChart3,
  List,
  Kanban,
  User,
} from "lucide-react"
import { DealsStageChart } from "@/components/deals-stage-chart"
import { ClosedWonChart } from "@/components/closed-won-chart"

const industryOptions = [
  "Technology",
  "Healthcare",
  "Finance",
  "Manufacturing",
  "Retail",
  "Education",
  "Real Estate",
  "Consulting",
  "Media",
  "Transportation",
  "Energy",
  "Agriculture",
  "Construction",
  "Entertainment",
  "Food & Beverage",
  "Government",
  "Insurance",
  "Legal",
  "Non-profit",
  "Pharmaceutical",
  "Telecommunications",
  "Other",
]

const teamMembers = [
  { id: "1", name: "Sarah Johnson", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "2", name: "Mike Chen", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "3", name: "Emma Davis", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "4", name: "Alex Rodriguez", avatar: "/placeholder.svg?height=32&width=32" },
]

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

const getStageBadgeColor = (stage: string) => {
  switch (stage) {
    case "Lead":
      return "bg-gray-500"
    case "Qualified":
      return "bg-blue-500"
    case "Proposal":
      return "bg-yellow-500"
    case "Negotiation":
      return "bg-orange-500"
    case "Closed Won":
      return "bg-green-500"
    case "Closed Lost":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

const fetcher = (url: string) => {
  console.log("[v0] Fetching from:", url)
  return fetch(url).then((res) => {
    console.log("[v0] Response status:", res.status)
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    return res.json().then((data) => data.data || data)
  })
}

export default function DealsPage() {
  console.log("[v0] DealsPage component rendering...")

  const {
    data: deals = [],
    error,
    mutate,
  } = useSWR("/api/deals", fetcher, {
    onError: (error) => {
      console.error("[v0] Deals SWR error:", error)
    },
    onSuccess: (data) => {
      console.log("[v0] Deals loaded successfully:", data?.length || 0, "items")
    },
  })

  const { data: users = [] } = useSWR("/api/users", fetcher)
  const { data: companies = [] } = useSWR("/api/companies", fetcher)

  const [draggedDeal, setDraggedDeal] = useState<string | null>(null)
  const [dragOverStage, setDragOverStage] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStage, setFilterStage] = useState("all")
  const [sortBy, setSortBy] = useState("createdAt")
  const [stageFilter, setStageFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDeal, setEditingDeal] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"kanban" | "list" | "charts">("kanban")

  const [newDeal, setNewDeal] = useState({
    title: "",
    company: "",
    industry: "",
    description: "",
    value: "",
    stage: "Lead",
    probability: "25",
    expectedCloseDate: "",
    assignedTo: "",
  })

  const resetForm = () => {
    setNewDeal({
      title: "",
      company: "",
      industry: "",
      description: "",
      value: "",
      stage: "Lead",
      probability: "25",
      expectedCloseDate: "",
      assignedTo: "",
    })
    setEditingDeal(null)
  }

  const handleSaveDeal = async () => {
    if (!newDeal.title.trim() || !newDeal.company.trim() || !newDeal.value.trim()) {
      alert("Please fill in the title, company, and value fields.")
      return
    }

    const assignee = users.find((user: any) => user._id === newDeal.assignedTo || user.id === newDeal.assignedTo)

    const dealData = {
      title: newDeal.title,
      company: newDeal.company,
      industry: newDeal.industry,
      description: newDeal.description,
      value: Number.parseInt(newDeal.value),
      stage: newDeal.stage,
      probability: Number.parseInt(newDeal.probability),
      expectedCloseDate:
        newDeal.expectedCloseDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      assignedTo: assignee?.name || undefined,
      assigneeId: newDeal.assignedTo || undefined,
      closeDate: newDeal.expectedCloseDate || undefined,
      avatar: assignee?.avatar || "/placeholder.svg?height=32&width=32",
    }

    try {
      let response
      if (editingDeal) {
        response = await fetch(`/api/deals/${editingDeal}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dealData),
        })
      } else {
        response = await fetch("/api/deals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dealData),
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save deal")
      }

      console.log("Deal saved successfully")
      mutate() // Refresh data
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error saving deal:", error)
      alert("Failed to save deal")
    }
  }

  const deleteDeal = async (dealId: string) => {
    if (confirm("Are you sure you want to delete this deal?")) {
      try {
        const response = await fetch(`/api/deals/${dealId}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to delete deal")
        }

        console.log("Deal deleted successfully")
        mutate() // Refresh data
      } catch (error) {
        console.error("Error deleting deal:", error)
        alert("Failed to delete deal")
      }
    }
  }

  const closeDealWon = async (dealId: string) => {
    if (confirm("Mark this deal as Closed Won?")) {
      try {
        const response = await fetch(`/api/deals/${dealId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stage: "Closed Won",
            probability: 100,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to update deal")
        }

        console.log("Deal marked as Closed Won")
        mutate() // Refresh data
      } catch (error) {
        console.error("Error updating deal:", error)
        alert("Failed to update deal")
      }
    }
  }

  const closeDealLost = async (dealId: string) => {
    if (confirm("Mark this deal as Closed Lost?")) {
      try {
        const response = await fetch(`/api/deals/${dealId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stage: "Closed Lost",
            probability: 0,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to update deal")
        }

        console.log("Deal marked as Closed Lost")
        mutate() // Refresh data
      } catch (error) {
        console.error("Error updating deal:", error)
        alert("Failed to update deal")
      }
    }
  }

  const handleDragStart = (dealId: string) => {
    setDraggedDeal(dealId)
  }

  const handleDragOver = (e: React.DragEvent, stage: string) => {
    e.preventDefault()
    if (stage !== "Closed Won" && stage !== "Closed Lost") {
      setDragOverStage(stage)
    }
  }

  const handleDragLeave = () => {
    setDragOverStage(null)
  }

  const handleDrop = async (e: React.DragEvent, targetStage: string) => {
    e.preventDefault()
    setDragOverStage(null)

    if (draggedDeal && targetStage !== "Closed Won" && targetStage !== "Closed Lost") {
      try {
        const response = await fetch(`/api/deals/${draggedDeal}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stage: targetStage,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to update deal stage")
        }

        console.log("Deal stage updated successfully")
        mutate() // Refresh data
      } catch (error) {
        console.error("Error updating deal stage:", error)
      }
    }
    setDraggedDeal(null)
  }

  const openAddDealDialog = (stage?: string) => {
    setNewDeal({
      title: "",
      company: "",
      industry: "",
      description: "",
      value: "",
      stage: stage || "Lead",
      probability: "25",
      expectedCloseDate: "",
      assignedTo: "",
    })
    setIsDialogOpen(true)
  }

  const openEditDealDialog = (deal: any) => {
    setNewDeal({
      title: deal.title,
      company: deal.company,
      industry: deal.industry || "",
      description: deal.description,
      value: deal.value.toString(),
      stage: deal.stage,
      probability: deal.probability.toString(),
      expectedCloseDate: deal.expectedCloseDate,
      assignedTo: deal.assigneeId || deal.assignedTo, // Use assigneeId if available, fallback to assignedTo
    })
    setEditingDeal(deal._id || deal.id)
    setIsDialogOpen(true)
  }

  if (error) {
    console.error("[v0] Deals page error:", error)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Failed to load deals</h2>
          <p className="text-muted-foreground mb-4">Error: {error.message || "Unknown error"}</p>
          <Button onClick={() => mutate()}>Try Again</Button>
        </div>
      </div>
    )
  }

  if (!deals && !error) {
    console.log("[v0] Deals still loading...")
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading deals...</p>
        </div>
      </div>
    )
  }

  const activeDeals = Array.isArray(deals)
    ? deals.filter((deal) => {
        if (!deal) {
          console.warn("[v0] Found null/undefined deal:", deal)
          return false
        }
        return !["Closed Won", "Closed Lost"].includes(deal.stage)
      })
    : []

  const closedWonDeals = Array.isArray(deals) ? deals.filter((deal) => deal && deal.stage === "Closed Won") : []

  const closedLostDeals = Array.isArray(deals) ? deals.filter((deal) => deal && deal.stage === "Closed Lost") : []

  const pipelineValue = activeDeals.reduce((sum, deal) => sum + (deal.value || 0), 0)
  const averageDealSize = activeDeals.length > 0 ? pipelineValue / activeDeals.length : 0
  const closedWonValue = closedWonDeals.reduce((sum, deal) => sum + (deal.value || 0), 0)
  const winRate =
    closedWonDeals.length + closedLostDeals.length > 0
      ? (closedWonDeals.length / (closedWonDeals.length + closedLostDeals.length)) * 100
      : 0

  const dealsByStage = stages.reduce(
    (acc, stage) => {
      acc[stage] = Array.isArray(deals) ? deals.filter((deal) => deal && deal.stage === stage) : []
      return acc
    },
    {} as Record<string, any>,
  )

  const filteredAndSortedDeals = deals
    .filter((deal: any) => {
      const matchesSearch =
        deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.company.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStage = filterStage === "all" || deal.stage === filterStage
      return matchesSearch && matchesStage
    })
    .sort((a: any, b: any) => {
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

  console.log("[v0] Rendering deals page with", deals?.length || 0, "total deals")

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Mobile-optimized header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Deals Pipeline</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Manage your sales pipeline and track deal progress
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
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
          <Button onClick={() => openAddDealDialog()} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Deal
          </Button>
        </div>
      </div>

      {/* Mobile-responsive Pipeline Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="p-3 md:p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
            <CardTitle className="text-xs md:text-sm font-medium">Pipeline Value</CardTitle>
            <DollarSign className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="text-lg md:text-2xl font-bold">${pipelineValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current active deals</p>
          </CardContent>
        </Card>

        <Card className="p-3 md:p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
            <CardTitle className="text-xs md:text-sm font-medium">Avg Deal Size</CardTitle>
            <Target className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="text-lg md:text-2xl font-bold">${Math.round(averageDealSize).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Per active deal</p>
          </CardContent>
        </Card>

        <Card className="p-3 md:p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
            <CardTitle className="text-xs md:text-sm font-medium">Win Rate</CardTitle>
            <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="text-lg md:text-2xl font-bold">{winRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {closedWonDeals.length} won, {closedLostDeals.length} lost
            </p>
          </CardContent>
        </Card>

        <Card className="p-3 md:p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
            <CardTitle className="text-xs md:text-sm font-medium">Closed Won</CardTitle>
            <DollarSign className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="text-lg md:text-2xl font-bold">${closedWonValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total revenue</p>
          </CardContent>
        </Card>
      </div>

      {viewMode === "charts" && (
        <div className="grid gap-4 md:grid-cols-2">
          <DealsStageChart deals={deals} />
          <ClosedWonChart deals={deals} />
        </div>
      )}

      {/* Pipeline Stages - Mobile Responsive */}
      {viewMode === "kanban" && (
        <>
          {/* Mobile: Horizontal scroll for pipeline stages */}
          <div className="block lg:hidden">
            <div className="flex gap-4 overflow-x-auto pb-4">
              {stages
                .filter((stage) => !["Closed Won", "Closed Lost"].includes(stage))
                .map((stage) => (
                  <Card
                    key={stage}
                    className={`flex-shrink-0 w-72 ${getStageColor(stage)} ${
                      dragOverStage === stage ? "ring-2 ring-blue-500" : ""
                    }`}
                    onDragOver={(e) => handleDragOver(e, stage)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, stage)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Badge className={`${getStageBadgeColor(stage)} text-white text-xs`}>
                            {dealsByStage[stage]?.length || 0}
                          </Badge>
                          {stage}
                        </CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => openAddDealDialog(stage)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardDescription className="text-sm">
                        ${dealsByStage[stage]?.reduce((sum, deal) => sum + deal.value, 0).toLocaleString() || 0}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                      {dealsByStage[stage]?.map((deal) => (
                        <Card
                          key={deal._id || deal.id}
                          className={`cursor-move hover:shadow-md transition-all ${
                            draggedDeal === (deal._id || deal.id) ? "opacity-50 rotate-2" : ""
                          }`}
                          draggable
                          onDragStart={() => handleDragStart(deal._id || deal.id)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm line-clamp-1">{deal.title}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <Building2 className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">{deal.company}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {deal.industry || "Industry"}
                                  </Badge>
                                </div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => openEditDealDialog(deal)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Deal
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => closeDealWon(deal._id || deal.id)}>
                                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                    Close Won
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => closeDealLost(deal._id || deal.id)}>
                                    <XCircle className="mr-2 h-4 w-4 text-red-600" />
                                    Close Lost
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => deleteDeal(deal._id || deal.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Deal
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{deal.description}</p>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">${deal.value.toLocaleString()}</span>
                                <span className="text-muted-foreground">{deal.probability}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                  className="bg-blue-500 h-1.5 rounded-full transition-all"
                                  style={{ width: `${deal.probability}%` }}
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={deal.avatar || "/placeholder.svg"} />
                                    <AvatarFallback className="text-xs">
                                      {deal.assignedTo
                                        ? deal.assignedTo
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                        : "?"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs text-muted-foreground">{deal.assignedTo}</span>
                                </div>
                                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  <span>{new Date(deal.expectedCloseDate).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>

          {/* Desktop: Grid layout for pipeline stages */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-4">
            {stages
              .filter((stage) => !["Closed Won", "Closed Lost"].includes(stage))
              .map((stage) => (
                <Card
                  key={stage}
                  className={`${getStageColor(stage)} ${dragOverStage === stage ? "ring-2 ring-blue-500" : ""}`}
                  onDragOver={(e) => handleDragOver(e, stage)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, stage)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Badge className={`${getStageBadgeColor(stage)} text-white`}>
                          {dealsByStage[stage]?.length || 0}
                        </Badge>
                        {stage}
                      </CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => openAddDealDialog(stage)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>
                      ${dealsByStage[stage]?.reduce((sum, deal) => sum + deal.value, 0).toLocaleString() || 0}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                    {dealsByStage[stage]?.map((deal) => (
                      <Card
                        key={deal._id || deal.id}
                        className={`cursor-move hover:shadow-md transition-all ${
                          draggedDeal === (deal._id || deal.id) ? "opacity-50 rotate-2" : ""
                        }`}
                        draggable
                        onDragStart={() => handleDragStart(deal._id || deal.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm line-clamp-1">{deal.title}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Building2 className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{deal.company}</span>
                                <Badge variant="outline" className="text-xs">
                                  {deal.industry || "Industry"}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => openEditDealDialog(deal)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Deal
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => closeDealWon(deal._id || deal.id)}>
                                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                    Close Won
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => closeDealLost(deal._id || deal.id)}>
                                    <XCircle className="mr-2 h-4 w-4 text-red-600" />
                                    Close Lost
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => deleteDeal(deal._id || deal.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Deal
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{deal.description}</p>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium">${deal.value.toLocaleString()}</span>
                              <span className="text-muted-foreground">{deal.probability}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-blue-500 h-1.5 rounded-full transition-all"
                                style={{ width: `${deal.probability}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={deal.avatar || "/placeholder.svg"} />
                                  <AvatarFallback className="text-xs">
                                    {deal.assignedTo
                                      ? deal.assignedTo
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")
                                      : "?"}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-muted-foreground">{deal.assignedTo}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(deal.expectedCloseDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              ))}
          </div>
        </>
      )}

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
            {filteredAndSortedDeals.map((deal: any) => (
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
                      <DropdownMenuItem onClick={() => openEditDealDialog(deal)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => deleteDeal(deal._id || deal.id || "")} className="text-red-600">
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

      {/* Closed Deals - Mobile Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Closed Won */}
        <Card className="bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Badge className="bg-green-500 text-white">{dealsByStage["Closed Won"]?.length || 0}</Badge>
              Closed Won
            </CardTitle>
            <CardDescription>
              ${dealsByStage["Closed Won"]?.reduce((sum, deal) => sum + deal.value, 0).toLocaleString() || 0}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 max-h-64 overflow-y-auto">
            {dealsByStage["Closed Won"]?.map((deal) => (
              <Card key={deal._id || deal.id}>
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{deal.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Building2 className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{deal.company}</span>
                        <Badge variant="outline" className="text-xs">
                          {deal.industry || "Industry"}
                        </Badge>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDealDialog(deal)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Deal
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteDeal(deal._id || deal.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Deal
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium text-green-600">${deal.value.toLocaleString()}</span>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={deal.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">
                          {deal.assignedTo ? deal.assignedTo.split(" ").map((n) => n[0]) : "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">{deal.assignedTo}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Closed Lost */}
        <Card className="bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Badge className="bg-red-500 text-white">{dealsByStage["Closed Lost"]?.length || 0}</Badge>
              Closed Lost
            </CardTitle>
            <CardDescription>
              ${dealsByStage["Closed Lost"]?.reduce((sum, deal) => sum + deal.value, 0).toLocaleString() || 0}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 max-h-64 overflow-y-auto">
            {dealsByStage["Closed Lost"]?.map((deal) => (
              <Card key={deal._id || deal.id}>
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{deal.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Building2 className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{deal.company}</span>
                        <Badge variant="outline" className="text-xs">
                          {deal.industry || "Industry"}
                        </Badge>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDealDialog(deal)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Deal
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteDeal(deal._id || deal.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Deal
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium text-red-600">${deal.value.toLocaleString()}</span>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={deal.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">
                          {deal.assignedTo ? deal.assignedTo.split(" ").map((n) => n[0]) : "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">{deal.assignedTo}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Deal Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle>{editingDeal ? "Edit Deal" : "Add New Deal"}</DialogTitle>
            <DialogDescription>
              {editingDeal ? "Update deal information" : "Enter the deal details and opportunity information"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Deal Title *</Label>
              <Input
                id="title"
                value={newDeal.title}
                onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
                placeholder="Enter deal title"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="company">Company *</Label>
                <Select value={newDeal.company} onValueChange={(value) => setNewDeal({ ...newDeal, company: value })}>
                  <SelectTrigger>
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
              <div className="grid gap-2">
                <Label htmlFor="value">Deal Value ($) *</Label>
                <Input
                  id="value"
                  type="number"
                  value={newDeal.value}
                  onChange={(e) => setNewDeal({ ...newDeal, value: e.target.value })}
                  placeholder="Deal value"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="stage">Stage</Label>
                <Select value={newDeal.stage} onValueChange={(value) => setNewDeal({ ...newDeal, stage: value })}>
                  <SelectTrigger>
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
              <div className="grid gap-2">
                <Label htmlFor="probability">Probability (%)</Label>
                <Input
                  id="probability"
                  type="number"
                  min="0"
                  max="100"
                  value={newDeal.probability}
                  onChange={(e) => setNewDeal({ ...newDeal, probability: e.target.value })}
                  placeholder="Win probability"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
                <Input
                  id="expectedCloseDate"
                  type="date"
                  value={newDeal.expectedCloseDate}
                  onChange={(e) => setNewDeal({ ...newDeal, expectedCloseDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="assignedTo">Assigned To</Label>
                <Select
                  value={newDeal.assignedTo}
                  onValueChange={(value) => setNewDeal({ ...newDeal, assignedTo: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user: any) => (
                      <SelectItem key={user._id || user.id} value={user._id || user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="industry">Industry</Label>
              <Select value={newDeal.industry} onValueChange={(value) => setNewDeal({ ...newDeal, industry: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industryOptions.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newDeal.description}
                onChange={(e) => setNewDeal({ ...newDeal, description: e.target.value })}
                placeholder="Deal description and notes"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveDeal}>
              {editingDeal ? "Update Deal" : "Create Deal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
