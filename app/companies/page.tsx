"use client"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  MoreHorizontal,
  Building2,
  Users,
  TrendingUp,
  Search,
  Filter,
  ArrowUpDown,
  Globe,
  Eye,
  Edit,
  ExternalLink,
  Linkedin,
  Trash2,
  MessageSquare,
  Activity,
} from "lucide-react"

const fetcher = (url: string) => {
  return fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    return res.json().then((data) => data.data || data)
  })
}

const industryCategories = [
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

const statusOptions = ["Prospect", "Lead", "Qualified", "Active Customer", "Partner", "Inactive"]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Prospect":
      return "bg-gray-100 text-gray-800"
    case "Lead":
      return "bg-blue-100 text-blue-800"
    case "Qualified":
      return "bg-yellow-100 text-yellow-800"
    case "Active Customer":
      return "bg-green-100 text-green-800"
    case "Partner":
      return "bg-purple-100 text-purple-800"
    case "Inactive":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case "company":
      return <Building2 className="h-4 w-4 text-blue-500" />
    case "note":
      return <MessageSquare className="h-4 w-4 text-green-500" />
    case "activity":
      return <Activity className="h-4 w-4 text-orange-500" />
    default:
      return <Activity className="h-4 w-4 text-gray-500" />
  }
}

export default function CompaniesPage() {
  const { data: companies = [], error, mutate } = useSWR("/api/companies", fetcher)
  const { data: notes = [] } = useSWR("/api/notes", fetcher)

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [industryFilter, setIndustryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<string | null>(null)
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)

  const [newCompany, setNewCompany] = useState({
    name: "",
    industry: "Technology",
    estimatedARR: "",
    linkedinUrl: "",
    domain: "",
    description: "",
    employees: "",
    location: "",
    foundedYear: "",
    status: "Prospect",
  })

  const resetForm = () => {
    setNewCompany({
      name: "",
      industry: "Technology",
      estimatedARR: "",
      linkedinUrl: "",
      domain: "",
      description: "",
      employees: "",
      location: "",
      foundedYear: "",
      status: "Prospect",
    })
    setEditingCompany(null)
  }

  const openAddCompanyDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditCompanyDialog = (company: any) => {
    setNewCompany({
      name: company.name,
      industry: company.industry,
      estimatedARR: company.estimatedARR.toString(),
      linkedinUrl: company.linkedinUrl || "",
      domain: company.domain || "",
      description: company.description || "",
      employees: company.employees?.toString() || "",
      location: company.location || "",
      foundedYear: company.foundedYear?.toString() || "",
      status: company.status,
    })
    setEditingCompany(company._id || company.id)
    setIsDialogOpen(true)
  }

  const handleSaveCompany = async () => {
    if (!newCompany.name.trim()) {
      alert("Please enter a company name.")
      return
    }

    const companyData = {
      name: newCompany.name,
      industry: newCompany.industry,
      estimatedARR: Number.parseInt(newCompany.estimatedARR) || 0,
      linkedinUrl: newCompany.linkedinUrl,
      domain: newCompany.domain,
      description: newCompany.description,
      employees: Number.parseInt(newCompany.employees) || 0,
      location: newCompany.location,
      foundedYear: Number.parseInt(newCompany.foundedYear) || new Date().getFullYear(),
      status: newCompany.status,
    }

    try {
      let response
      if (editingCompany) {
        response = await fetch(`/api/companies/${editingCompany}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(companyData),
        })
      } else {
        response = await fetch("/api/companies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(companyData),
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save company")
      }

      console.log("Company saved successfully")
      mutate() // Refresh data
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error saving company:", error)
      alert("Failed to save company")
    }
  }

  const deleteCompany = async (companyId: string) => {
    if (confirm("Are you sure you want to delete this company?")) {
      try {
        const response = await fetch(`/api/companies/${companyId}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to delete company")
        }

        console.log("Company deleted successfully")
        mutate() // Refresh data
      } catch (error) {
        console.error("Error deleting company:", error)
        alert("Failed to delete company")
      }
    }
  }

  const sortCompanies = (companiesToSort: any[]) => {
    return [...companiesToSort].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "industry":
          return a.industry.localeCompare(b.industry)
        case "arr":
          return b.estimatedARR - a.estimatedARR
        case "employees":
          return (b.employees || 0) - (a.employees || 0)
        case "lastActivity":
          return (
            new Date(b.updatedAt || b.createdAt || "").getTime() - new Date(a.updatedAt || a.createdAt || "").getTime()
          )
        default:
          return 0
      }
    })
  }

  const filteredCompanies = companies.filter((company: any) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.domain && company.domain.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (company.description && company.description.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || company.status === statusFilter
    const matchesIndustry = industryFilter === "all" || company.industry === industryFilter

    return matchesSearch && matchesStatus && matchesIndustry
  })

  const sortedCompanies = sortCompanies(filteredCompanies)
  const selectedCompanyData = companies.find((c: any) => (c._id || c.id) === selectedCompany)

  // Get notes for selected company
  const companyNotes = selectedCompanyData
    ? notes.filter(
        (note: any) =>
          note.type === "company" && (note.companyId === selectedCompany || note.company === selectedCompanyData.name),
      )
    : []

  const totalARR = companies.reduce((sum: number, company: any) => sum + (company.estimatedARR || 0), 0)
  const activeCustomers = companies.filter((c: any) => c.status === "Active Customer").length

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Failed to load companies</h2>
          <p className="text-muted-foreground mb-4">Error: {error.message || "Unknown error"}</p>
          <Button onClick={() => mutate()}>Try Again</Button>
        </div>
      </div>
    )
  }

  if (!companies && !error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading companies...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Mobile-optimized header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Companies Dashboard</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Manage company profiles, track ARR, and monitor business relationships
          </p>
        </div>
        <Button onClick={openAddCompanyDialog} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Company
        </Button>
      </div>

      {/* Mobile-responsive Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="p-3 md:p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
            <CardTitle className="text-xs md:text-sm font-medium">Total Companies</CardTitle>
            <Building2 className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="text-lg md:text-2xl font-bold">{companies.length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{activeCustomers}</span> active customers
            </p>
          </CardContent>
        </Card>
        <Card className="p-3 md:p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
            <CardTitle className="text-xs md:text-sm font-medium">Avg Company Size</CardTitle>
            <Users className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="text-lg md:text-2xl font-bold">
              {Math.round(companies.reduce((sum: number, c: any) => sum + (c.employees || 0), 0) / companies.length) ||
                0}
            </div>
            <p className="text-xs text-muted-foreground">Employees per company</p>
          </CardContent>
        </Card>
        <Card className="p-3 md:p-6 col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
            <CardTitle className="text-xs md:text-sm font-medium">Industries</CardTitle>
            <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="text-lg md:text-2xl font-bold">{new Set(companies.map((c: any) => c.industry)).size}</div>
            <p className="text-xs text-muted-foreground">Unique sectors</p>
          </CardContent>
        </Card>
      </div>

      {/* Mobile-responsive Search and Filters */}
      <Card>
        <CardContent className="p-3 md:p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search companies by name, domain, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Select value={industryFilter} onValueChange={setIndustryFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    {industryCategories.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="industry">Industry</SelectItem>
                    <SelectItem value="arr">ARR</SelectItem>
                    <SelectItem value="employees">Size</SelectItem>
                    <SelectItem value="lastActivity">Activity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content - Mobile Responsive */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Companies List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>All Companies ({sortedCompanies.length})</CardTitle>
              <CardDescription>Comprehensive company profiles with business intelligence</CardDescription>
            </CardHeader>
            <CardContent className="p-3 md:p-6">
              {/* Mobile: Card view */}
              <div className="block lg:hidden space-y-4">
                {sortedCompanies.map((company: any) => (
                  <Card
                    key={company._id || company.id}
                    className={`cursor-pointer hover:shadow-md transition-shadow ${selectedCompany === (company._id || company.id) ? "ring-2 ring-blue-500" : ""}`}
                    onClick={() => setSelectedCompany(company._id || company.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarImage src="/placeholder.svg?height=40&width=40" />
                            <AvatarFallback>
                              {company.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm truncate">{company.name}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              <span className="truncate">{company.domain || "No website"}</span>
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="flex-shrink-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedCompany(company._id || company.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEditCompanyDialog(company)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Company
                            </DropdownMenuItem>
                            {company.domain && (
                              <DropdownMenuItem>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Visit Website
                              </DropdownMenuItem>
                            )}
                            {company.linkedinUrl && (
                              <DropdownMenuItem>
                                <Linkedin className="mr-2 h-4 w-4" />
                                LinkedIn
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => deleteCompany(company._id || company.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Company
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <Badge variant="outline" className="text-xs">
                            {company.industry}
                          </Badge>
                        </div>
                        <div>
                          <Badge className={getStatusColor(company.status)} variant="secondary">
                            {company.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <div className="font-medium">ARR</div>
                          <div className="text-muted-foreground">
                            ${((company.estimatedARR || 0) / 1000000).toFixed(1)}M
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">Employees</div>
                          <div className="text-muted-foreground">{company.employees || "N/A"}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Desktop: Table view */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Industry</TableHead>
                      <TableHead>ARR</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedCompanies.map((company: any) => (
                      <TableRow
                        key={company._id || company.id}
                        className={`cursor-pointer hover:bg-muted/50 ${selectedCompany === (company._id || company.id) ? "bg-muted" : ""}`}
                        onClick={() => setSelectedCompany(company._id || company.id)}
                      >
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src="/placeholder.svg?height=40&width=40" />
                              <AvatarFallback>
                                {company.name
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{company.name}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <Globe className="h-3 w-3" />
                                {company.domain || "No website"}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{company.industry}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">${((company.estimatedARR || 0) / 1000000).toFixed(1)}M</div>
                          <div className="text-sm text-muted-foreground">ARR</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{company.employees || "N/A"}</div>
                          <div className="text-sm text-muted-foreground">employees</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(company.status)}>{company.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedCompany(company._id || company.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditCompanyDialog(company)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Company
                              </DropdownMenuItem>
                              {company.domain && (
                                <DropdownMenuItem>
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  Visit Website
                                </DropdownMenuItem>
                              )}
                              {company.linkedinUrl && (
                                <DropdownMenuItem>
                                  <Linkedin className="mr-2 h-4 w-4" />
                                  LinkedIn
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => deleteCompany(company._id || company.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Company
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Company Profile Sidebar - Mobile Responsive */}
        <div className="space-y-4">
          {selectedCompanyData ? (
            <>
              {/* Company Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 md:h-10 md:w-10">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback>
                        {selectedCompanyData.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate">{selectedCompanyData.name}</span>
                  </CardTitle>
                  <CardDescription>{selectedCompanyData.industry}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium">ARR</div>
                      <div className="text-muted-foreground">
                        ${((selectedCompanyData.estimatedARR || 0) / 1000000).toFixed(1)}M
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Employees</div>
                      <div className="text-muted-foreground">{selectedCompanyData.employees || "N/A"}</div>
                    </div>
                    <div>
                      <div className="font-medium">Founded</div>
                      <div className="text-muted-foreground">{selectedCompanyData.foundedYear || "N/A"}</div>
                    </div>
                    <div>
                      <div className="font-medium">Location</div>
                      <div className="text-muted-foreground truncate">{selectedCompanyData.location || "N/A"}</div>
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-sm mb-2">Description</div>
                    <p className="text-sm text-muted-foreground">
                      {selectedCompanyData.description || "No description available"}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    {selectedCompanyData.domain && (
                      <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                        <a href={`https://${selectedCompanyData.domain}`} target="_blank" rel="noopener noreferrer">
                          <Globe className="mr-2 h-4 w-4" />
                          Website
                        </a>
                      </Button>
                    )}
                    {selectedCompanyData.linkedinUrl && (
                      <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                        <a href={selectedCompanyData.linkedinUrl} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="mr-2 h-4 w-4" />
                          LinkedIn
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Notes and Activity Tabs - Mobile Responsive */}
              <Card>
                <Tabs defaultValue="notes" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="notes">Notes ({companyNotes.length})</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                  </TabsList>
                  <TabsContent value="notes" className="space-y-4 p-4">
                    <div className="space-y-3">
                      {companyNotes.map((note: any) => (
                        <div key={note._id || note.id} className="p-3 border rounded-lg">
                          <h4 className="font-medium text-sm mb-2 line-clamp-1">{note.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-3">{note.content}</p>
                          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                            <span className="truncate">{note.assignedTo || "Unknown"}</span>
                            <span>{new Date(note.createdAt || note.createdDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                      {companyNotes.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No notes found for this company
                        </p>
                      )}
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Note
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="activity" className="space-y-4 p-4">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">{getActivityIcon("company")}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-2">Company profile created</p>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mt-1 text-xs text-muted-foreground">
                            <span className="truncate">System</span>
                            <span className="hidden sm:inline">•</span>
                            <span>{new Date(selectedCompanyData.createdAt || "").toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a Company</h3>
                <p className="text-muted-foreground">
                  Click on a company from the list to view its profile and activity
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add/Edit Company Dialog - Mobile Responsive */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle>{editingCompany ? "Edit Company" : "Add New Company"}</DialogTitle>
            <DialogDescription>
              {editingCompany ? "Update company information" : "Enter the company details and business information"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                value={newCompany.name}
                onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                placeholder="Enter company name"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="industry">Company's Industry Category</Label>
                <Select
                  value={newCompany.industry}
                  onValueChange={(value) => setNewCompany({ ...newCompany, industry: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {industryCategories.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="arr">Estimated ARR ($)</Label>
                <Input
                  id="arr"
                  type="number"
                  value={newCompany.estimatedARR}
                  onChange={(e) => setNewCompany({ ...newCompany, estimatedARR: e.target.value })}
                  placeholder="Annual recurring revenue"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="linkedin">LinkedIn (link)</Label>
                <Input
                  id="linkedin"
                  type="url"
                  value={newCompany.linkedinUrl}
                  onChange={(e) => setNewCompany({ ...newCompany, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/company/..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="domain">Domain</Label>
                <Input
                  id="domain"
                  value={newCompany.domain}
                  onChange={(e) => setNewCompany({ ...newCompany, domain: e.target.value })}
                  placeholder="company.com"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Company Description</Label>
              <Textarea
                id="description"
                value={newCompany.description}
                onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })}
                placeholder="Brief description of the company's business and services"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="employees">Employees</Label>
                <Input
                  id="employees"
                  type="number"
                  value={newCompany.employees}
                  onChange={(e) => setNewCompany({ ...newCompany, employees: e.target.value })}
                  placeholder="Number of employees"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="founded">Founded Year</Label>
                <Input
                  id="founded"
                  type="number"
                  value={newCompany.foundedYear}
                  onChange={(e) => setNewCompany({ ...newCompany, foundedYear: e.target.value })}
                  placeholder="2020"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newCompany.status}
                  onValueChange={(value) => setNewCompany({ ...newCompany, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={newCompany.location}
                onChange={(e) => setNewCompany({ ...newCompany, location: e.target.value })}
                placeholder="City, State/Country"
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleSaveCompany} className="w-full sm:w-auto">
              {editingCompany ? "Update Company" : "Add Company"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
