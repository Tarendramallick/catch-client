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

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function DealsPage() {
  const { data: deals = [], error, mutate } = useSWR("/api/deals", fetcher)
  const [draggedDeal, setDraggedDeal] = useState<string | null>(null)
  const [dragOverStage, setDragOverStage] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [stageFilter, setStageFilter] = useState("all")
  const [sortBy, setSortBy] = useState("value")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDeal, setEditingDeal] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban")

  const [newDeal, setNewDeal] = useState({
    title: "",
    company: "",
    industry: "",
    description: "",
    value: "",
    stage: "Lead",
    probability: "25",
    closeDate: "",
    assigneeId: "1",
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
      closeDate: "",
      assigneeId: "1",
    })
    setEditingDeal(null)
  }

  const handleSaveDeal = async () => {
    if (!newDeal.title.trim() || !newDeal.company.trim() || !newDeal.value.trim()) {
      alert("Please fill in the title, company, and value fields.")
      return
    }

    const assignee = teamMembers.find((member) => member.id === newDeal.assigneeId)

    const dealData = {
      title: newDeal.title,
      company: newDeal.company,
      industry: newDeal.industry,
      description: newDeal.description,
      value: Number.parseInt(newDeal.value),
      stage: newDeal.stage,
      probability: Number.parseInt(newDeal.probability),
      closeDate: newDeal.closeDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      assigneeId: newDeal.assigneeId,
      assignee: assignee?.name || "Unknown",
      avatar: assignee?.avatar || "/placeholder.svg?height=32&width=32",
    }

    try {
      if (editingDeal) {
        await fetch(`/api/deals/${editingDeal}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dealData),
        })
      } else {
        await fetch("/api/deals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dealData),
        })
      }

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
        await fetch(`/api/deals/${dealId}`, {
          method: "DELETE",
        })
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
        await fetch(`/api/deals/${dealId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stage: "Closed Won",
            probability: 100,
          }),
        })
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
        await fetch(`/api/deals/${dealId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stage: "Closed Lost",
            probability: 0,
          }),
        })
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
        await fetch(`/api/deals/${draggedDeal}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stage: targetStage,
          }),
        })
        mutate() // Refresh data
      } catch (error) {
        console.error("Error updating deal stage:", error)
      }
    }
    setDraggedDeal(null)
  }

  if (error) return <div>Failed to load deals</div>
  if (!deals) return <div>Loading...</div>

  const openAddDealDialog = (stage?: string) => {
    resetForm()
    if (stage) {
      setNewDeal((prev) => ({ ...prev, stage }))
    }
    setIsDialogOpen(true)
  }

  const openEditDealDialog = (deal: any) => {
    setNewDeal({
      title: deal.title,
      company: deal.company,
      industry: deal.industry,
      description: deal.description,
      value: deal.value.toString(),
      stage: deal.stage,
      probability: deal.probability.toString(),
      closeDate: deal.closeDate,
      assigneeId: deal.assigneeId,
    })
    setEditingDeal(deal._id)
    setIsDialogOpen(true)
  }

  const activeDeals = Array.isArray(deals)
    ? deals.filter((deal) => !["Closed Won", "Closed Lost"].includes(deal.stage))
    : []
  const closedWonDeals = Array.isArray(deals) ? deals.filter((deal) => deal.stage === "Closed Won") : []
  const closedLostDeals = Array.isArray(deals) ? deals.filter((deal) => deal.stage === "Closed Lost") : []

  const pipelineValue = activeDeals.reduce((sum, deal) => sum + (deal.value || 0), 0)
  const averageDealSize = activeDeals.length > 0 ? pipelineValue / activeDeals.length : 0
  const closedWonValue = closedWonDeals.reduce((sum, deal) => sum + (deal.value || 0), 0)
  const winRate =
    closedWonDeals.length + closedLostDeals.length > 0
      ? (closedWonDeals.length / (closedWonDeals.length + closedLostDeals.length)) * 100
      : 0

  const dealsByStage = stages.reduce(
    (acc, stage) => {
      acc[stage] = Array.isArray(deals) ? deals.filter((deal) => deal.stage === stage) : []
      return acc
    },
    {} as Record<string, any>,
  )

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
          <div className="flex rounded-lg border p-1 bg-muted">
            <Button
              variant={viewMode === "kanban" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("kanban")}
              className="h-7 px-3"
            >
              Kanban
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-7 px-3"
            >
              List
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

      {/* Mobile-responsive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <DealsStageChart deals={deals} />
        <ClosedWonChart deals={deals} />
      </div>

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
                          key={deal._id}
                          className={`cursor-move hover:shadow-md transition-all ${
                            draggedDeal === deal._id ? "opacity-50 rotate-2" : ""
                          }`}
                          draggable
                          onDragStart={() => handleDragStart(deal._id)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm line-clamp-1">{deal.title}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <Building2 className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">{deal.company}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {deal.industry}
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
                                  <DropdownMenuItem onClick={() => closeDealWon(deal._id)}>
                                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                    Close Won
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => closeDealLost(deal._id)}>
                                    <XCircle className="mr-2 h-4 w-4 text-red-600" />
                                    Close Lost
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => deleteDeal(deal._id)} className="text-red-600">
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
                                  <Avatar className="h-5 w-5">
                                    <AvatarImage src={deal.avatar || "/placeholder.svg"} />
                                    <AvatarFallback className="text-xs">
                                      {deal.assignee
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs text-muted-foreground">{deal.assignee}</span>
                                </div>
                                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  <span>{new Date(deal.closeDate).toLocaleDateString()}</span>
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
                        key={deal._id}
                        className={`cursor-move hover:shadow-md transition-all ${
                          draggedDeal === deal._id ? "opacity-50 rotate-2" : ""
                        }`}
                        draggable
                        onDragStart={() => handleDragStart(deal._id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm line-clamp-1">{deal.title}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Building2 className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{deal.company}</span>
                                <Badge variant="outline" className="text-xs">
                                  {deal.industry}
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
                                  <DropdownMenuItem onClick={() => closeDealWon(deal._id)}>
                                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                    Close Won
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => closeDealLost(deal._id)}>
                                    <XCircle className="mr-2 h-4 w-4 text-red-600" />
                                    Close Lost
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => deleteDeal(deal._id)} className="text-red-600">
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
                                <Avatar className="h-5 w-5">
                                  <AvatarImage src={deal.avatar || "/placeholder.svg"} />
                                  <AvatarFallback className="text-xs">
                                    {deal.assignee
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-muted-foreground">{deal.assignee}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(deal.closeDate).toLocaleDateString()}</span>
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
              <Card key={deal._id}>
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{deal.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Building2 className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{deal.company}</span>
                        <Badge variant="outline" className="text-xs">
                          {deal.industry}
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
                        <DropdownMenuItem onClick={() => deleteDeal(deal._id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Deal
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium text-green-600">${deal.value.toLocaleString()}</span>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={deal.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">
                          {deal.assignee
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">{deal.assignee}</span>
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
              <Card key={deal._id}>
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{deal.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Building2 className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{deal.company}</span>
                        <Badge variant="outline" className="text-xs">
                          {deal.industry}
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
                        <DropdownMenuItem onClick={() => deleteDeal(deal._id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Deal
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium text-red-600">${deal.value.toLocaleString()}</span>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={deal.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">
                          {deal.assignee
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">{deal.assignee}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Deal Dialog - Mobile Responsive */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle>{editingDeal ? "Edit Deal" : "Add New Deal"}</DialogTitle>
            <DialogDescription>
              {editingDeal ? "Update deal information" : "Enter the deal details and pipeline information"}
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
                <Label htmlFor="company">Company Name *</Label>
                <Input
                  id="company"
                  value={newDeal.company}
                  onChange={(e) => setNewDeal({ ...newDeal, company: e.target.value })}
                  placeholder="Enter company name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="industry">Industry</Label>
                <Select value={newDeal.industry} onValueChange={(value) => setNewDeal({ ...newDeal, industry: value })}>
                  <SelectTrigger>
                    <SelectValue />
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
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Deal Description</Label>
              <Textarea
                id="description"
                value={newDeal.description}
                onChange={(e) => setNewDeal({ ...newDeal, description: e.target.value })}
                placeholder="Describe the deal, requirements, and key details"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <div className="grid gap-2">
                <Label htmlFor="stage">Deal Stage</Label>
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="closeDate">Expected Close Date</Label>
                <Input
                  id="closeDate"
                  type="date"
                  value={newDeal.closeDate}
                  onChange={(e) => setNewDeal({ ...newDeal, closeDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="assignee">Assigned To</Label>
                <Select
                  value={newDeal.assigneeId}
                  onValueChange={(value) => setNewDeal({ ...newDeal, assigneeId: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleSaveDeal} className="w-full sm:w-auto">
              {editingDeal ? "Update Deal" : "Add Deal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
