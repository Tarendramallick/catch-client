"use client"

import type React from "react"

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
  Building2,
  Users,
  MapPin,
  Calendar,
  ExternalLink,
  Search,
  Filter,
  SortAsc,
} from "lucide-react"
import useSWR from "swr"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch")
  const data = await res.json()
  return data.data || data
}

interface Company {
  _id?: string
  id?: string
  name: string
  industry: string
  estimatedARR: number
  linkedinUrl?: string
  domain?: string
  description?: string
  employees?: number
  location?: string
  foundedYear?: number
  status: string
  createdAt?: string
  updatedAt?: string
}

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

const statusOptions = ["Prospect", "Lead", "Qualified", "Customer", "Partner", "Inactive"]

const statusColors = {
  Prospect: "bg-gray-100 text-gray-800",
  Lead: "bg-blue-100 text-blue-800",
  Qualified: "bg-yellow-100 text-yellow-800",
  Customer: "bg-green-100 text-green-800",
  Partner: "bg-purple-100 text-purple-800",
  Inactive: "bg-red-100 text-red-800",
}

export default function CompaniesPage() {
  const { data: companies = [], error, mutate } = useSWR("/api/companies", fetcher)
  const { data: notes = [] } = useSWR("/api/notes", fetcher)

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [industryFilter, setIndustryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Company>>({
    name: "",
    industry: "Technology",
    estimatedARR: 0,
    linkedinUrl: "",
    domain: "",
    description: "",
    employees: 0,
    location: "",
    foundedYear: new Date().getFullYear(),
    status: "Prospect",
  })

  // Form state
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

  // Load companies and notes from localStorage
  // useEffect(() => {
  //   const savedCompanies = localStorage.getItem("catchclients-companies")
  //   if (savedCompanies) {
  //     setCompanies(JSON.parse(savedCompanies))
  //   }

  //   const savedNotes = localStorage.getItem("catchclients-notes")
  //   if (savedNotes) {
  //     setNotes(JSON.parse(savedNotes))
  //   }
  // }, [])

  // Save companies to localStorage
  // useEffect(() => {
  //   localStorage.setItem("catchclients-companies", JSON.stringify(companies))
  // }, [companies])

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
    setFormData({
      name: "",
      industry: "Technology",
      estimatedARR: 0,
      linkedinUrl: "",
      domain: "",
      description: "",
      employees: 0,
      location: "",
      foundedYear: new Date().getFullYear(),
      status: "Prospect",
    })
  }

  const openAddCompanyDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditCompanyDialog = (company: Company) => {
    setFormData({
      name: company.name,
      industry: company.industry,
      estimatedARR: company.estimatedARR,
      linkedinUrl: company.linkedinUrl,
      domain: company.domain,
      description: company.description,
      employees: company.employees,
      location: company.location,
      foundedYear: company.foundedYear,
      status: company.status,
    })
    setEditingCompany(company)
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingCompany) {
        // Update existing company
        const response = await fetch(`/api/companies/${editingCompany._id || editingCompany.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })

        if (!response.ok) throw new Error("Failed to update company")
      } else {
        // Create new company
        const response = await fetch("/api/companies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }),
        })

        if (!response.ok) throw new Error("Failed to create company")
      }

      // Refresh data
      mutate()

      // Reset form
      resetForm()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving company:", error)
      alert("Failed to save company")
    }
  }

  const handleDelete = async (companyId: string) => {
    if (!confirm("Are you sure you want to delete this company?")) return

    try {
      const response = await fetch(`/api/companies/${companyId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete company")

      // Refresh data
      mutate()
    } catch (error) {
      console.error("Error deleting company:", error)
    }
  }

  const handleSaveCompany = () => {
    if (!newCompany.name.trim()) {
      alert("Please enter a company name.")
      return
    }

    // const company = {
    //   id: `c${Date.now()}`,
    //   name: newCompany.name,
    //   industry: newCompany.industry,
    //   estimatedARR: newCompany.estimatedARR ? Number.parseInt(newCompany.estimatedARR) : 0,
    //   linkedinUrl: newCompany.linkedinUrl,
    //   domain: newCompany.domain,
    //   description: newCompany.description,
    //   employees: newCompany.employees ? Number.parseInt(newCompany.employees) : undefined,
    //   location: newCompany.location,
    //   foundedYear: newCompany.foundedYear ? Number.parseInt(newCompany.foundedYear) : undefined,
    //   status: newCompany.status,
    //   createdDate: new Date().toISOString().split("T")[0],
    //   lastUpdated: new Date().toISOString().split("T")[0],
    // }

    // if (editingCompany) {
    //   setCompanies(
    //     companies.map((c) =>
    //       c.id === editingCompany
    //         ? { ...company, id: editingCompany }
    //         : c,
    //     ),
    //   )
    // } else {
    //   setCompanies([company, ...companies])
    // }

    setIsDialogOpen(false)
    resetForm()
  }

  const deleteCompany = (companyId: string) => {
    if (confirm("Are you sure you want to delete this company?")) {
      // setCompanies(companies.filter((company) => company.id !== companyId))
    }
  }

  const getCompanyNotes = (companyId: string) => {
    return notes.filter(
      (note: any) =>
        note.type === "company" &&
        (note.companyId === companyId ||
          note.company === companies.find((c: any) => c._id === companyId || c.id === companyId)?.name),
    )
  }

  const filteredAndSortedCompanies = companies
    .filter((company: Company) => {
      const matchesSearch =
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (company.location && company.location.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesStatus = statusFilter === "all" || company.status === statusFilter
      const matchesIndustry = industryFilter === "all" || company.industry === industryFilter
      return matchesSearch && matchesStatus && matchesIndustry
    })
    .sort((a: Company, b: Company) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "industry":
          return a.industry.localeCompare(b.industry)
        case "estimatedARR":
          return b.estimatedARR - a.estimatedARR
        case "employees":
          return (b.employees || 0) - (a.employees || 0)
        case "createdAt":
        default:
          return new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
      }
    })

  if (error) return <div>Failed to load companies</div>
  if (!companies) return <div>Loading...</div>

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Companies</h2>
        <div className="flex items-center space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddCompanyDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add Company
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingCompany ? "Edit Company" : "Add New Company"}</DialogTitle>
                <DialogDescription>
                  {editingCompany ? "Update the company information." : "Add a new company to your database."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="industry" className="text-right">
                      Industry
                    </Label>
                    <Select
                      value={formData.industry}
                      onValueChange={(value) => setFormData({ ...formData, industry: value })}
                    >
                      <SelectTrigger className="col-span-3">
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
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="estimatedARR" className="text-right">
                      Estimated ARR ($)
                    </Label>
                    <Input
                      id="estimatedARR"
                      type="number"
                      value={formData.estimatedARR}
                      onChange={(e) => setFormData({ ...formData, estimatedARR: Number(e.target.value) })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="employees" className="text-right">
                      Employees
                    </Label>
                    <Input
                      id="employees"
                      type="number"
                      value={formData.employees}
                      onChange={(e) => setFormData({ ...formData, employees: Number(e.target.value) })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right">
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="foundedYear" className="text-right">
                      Founded Year
                    </Label>
                    <Input
                      id="foundedYear"
                      type="number"
                      value={formData.foundedYear}
                      onChange={(e) => setFormData({ ...formData, foundedYear: Number(e.target.value) })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger className="col-span-3">
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
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="domain" className="text-right">
                      Website
                    </Label>
                    <Input
                      id="domain"
                      value={formData.domain}
                      onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                      className="col-span-3"
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="linkedinUrl" className="text-right">
                      LinkedIn
                    </Label>
                    <Input
                      id="linkedinUrl"
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      className="col-span-3"
                      placeholder="https://linkedin.com/company/..."
                    />
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
                  <Button type="submit">{editingCompany ? "Update Company" : "Create Company"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={industryFilter} onValueChange={setIndustryFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            {industryOptions.map((industry) => (
              <SelectItem key={industry} value={industry}>
                {industry}
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
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="industry">Industry</SelectItem>
            <SelectItem value="estimatedARR">ARR</SelectItem>
            <SelectItem value="employees">Employees</SelectItem>
            <SelectItem value="createdAt">Date Added</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Companies Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAndSortedCompanies.map((company: Company) => {
          const companyNotes = getCompanyNotes(company._id || company.id || "")

          return (
            <Card key={company._id || company.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{company.name}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEditCompanyDialog(company)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(company._id || company.id || "")}
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
                    <span className="text-sm text-muted-foreground">{company.industry}</span>
                  </div>
                  {company.estimatedARR > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">ARR: ${company.estimatedARR.toLocaleString()}</span>
                    </div>
                  )}
                  {company.employees && (
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{company.employees} employees</span>
                    </div>
                  )}
                  {company.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{company.location}</span>
                    </div>
                  )}
                  {company.foundedYear && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Founded {company.foundedYear}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <Badge className={statusColors[company.status as keyof typeof statusColors]}>
                      {company.status}
                    </Badge>
                    {companyNotes.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {companyNotes.length} note{companyNotes.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  {company.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{company.description}</p>
                  )}
                  {(company.domain || company.linkedinUrl) && (
                    <div className="flex items-center space-x-2 pt-2">
                      {company.domain && (
                        <a
                          href={company.domain.startsWith("http") ? company.domain : `https://${company.domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Website
                        </a>
                      )}
                      {company.linkedinUrl && (
                        <a
                          href={company.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          LinkedIn
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredAndSortedCompanies.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No companies found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
