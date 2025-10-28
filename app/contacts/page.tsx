"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
  Search,
  MoreHorizontal,
  Mail,
  Phone,
  Building2,
  Filter,
  ArrowUpDown,
  User,
  Edit,
  Trash2,
  Eye,
  Grid3X3,
  List,
} from "lucide-react"
import { ContactProfileDialog } from "@/components/contact-profile-dialog"
import useSWR from "swr"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch")
  const data = await res.json()
  return data.data || data
}

const initialContacts = [
  {
    id: "c1",
    name: "John Smith",
    email: "john@acmecorp.com",
    phone: "+1 (555) 123-4567",
    company: "Acme Corp",
    jobTitle: "CEO",
    status: "Hot Lead",
    tags: ["Enterprise", "Decision Maker"],
    lastContact: "2 days ago",
    avatar: "/placeholder.svg?height=40&width=40",
    website: "https://acmecorp.com",
    createdDate: "2024-01-10",
  },
  {
    id: "c2",
    name: "Sarah Johnson",
    email: "sarah@techstart.io",
    phone: "+1 (555) 987-6543",
    company: "TechStart Inc",
    jobTitle: "CTO",
    status: "Qualified",
    tags: ["Tech", "Startup"],
    lastContact: "1 week ago",
    avatar: "/placeholder.svg?height=40&width=40",
    website: "https://techstart.io",
    createdDate: "2024-01-08",
  },
  {
    id: "c3",
    name: "Mike Chen",
    email: "mike@globalsolutions.com",
    phone: "+1 (555) 456-7890",
    company: "Global Solutions",
    jobTitle: "VP Sales",
    status: "Cold Lead",
    tags: ["Enterprise", "Sales"],
    lastContact: "3 weeks ago",
    avatar: "/placeholder.svg?height=40&width=40",
    website: "https://globalsolutions.com",
    createdDate: "2024-01-05",
  },
  {
    id: "c4",
    name: "Emma Davis",
    email: "emma@innovationlabs.com",
    phone: "+1 (555) 321-0987",
    company: "Innovation Labs",
    jobTitle: "Product Manager",
    status: "Nurturing",
    tags: ["Product", "Innovation"],
    lastContact: "5 days ago",
    avatar: "/placeholder.svg?height=40&width=40",
    website: "https://innovationlabs.com",
    createdDate: "2024-01-12",
  },
  {
    id: "c5",
    name: "Alex Rodriguez",
    email: "alex@futuresystems.com",
    phone: "+1 (555) 654-3210",
    company: "Future Systems",
    jobTitle: "Engineering Director",
    status: "Customer",
    tags: ["Technical", "Engineering"],
    lastContact: "Yesterday",
    avatar: "/placeholder.svg?height=40&width=40",
    website: "https://futuresystems.com",
    createdDate: "2024-01-15",
  },
]

const statusOptions = ["Hot Lead", "Qualified", "Cold Lead", "Nurturing", "Customer", "Lost"]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Hot Lead":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    case "Qualified":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "Cold Lead":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    case "Nurturing":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    case "Customer":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
    case "Lost":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }
}

export default function ContactsPage() {
  const { data: contacts = [], error, mutate } = useSWR("/api/contacts", fetcher)

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<any>(null)
  const [selectedContact, setSelectedContact] = useState<any>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
    status: "Cold Lead",
    website: "",
    tags: "",
  })

  // Load contacts from localStorage
  // useEffect(() => {
  //   const savedContacts = localStorage.getItem("catchclients-contacts")
  //   if (savedContacts) {
  //     setContacts(JSON.parse(savedContacts))
  //   }
  // }, [])

  // Save contacts to localStorage
  // useEffect(() => {
  //   localStorage.setItem("catchclients-contacts", JSON.stringify(contacts))
  // }, [contacts])

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      jobTitle: "",
      status: "Cold Lead",
      website: "",
      tags: "",
    })
    setEditingContact(null)
  }

  const openAddContactDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditContactDialog = (contact: any) => {
    setFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      company: contact.company,
      jobTitle: contact.jobTitle,
      status: contact.status,
      website: contact.website || "",
      tags: contact.tags ? contact.tags.join(", ") : "",
    })
    setEditingContact(contact)
    setIsDialogOpen(true)
  }

  const openContactProfile = (contact: any) => {
    setSelectedContact(contact)
    setIsProfileOpen(true)
  }

  const handleSaveContact = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      alert("Please fill in the name and email fields.")
      return
    }

    const tags = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)

    const contactData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      jobTitle: formData.jobTitle,
      status: formData.status,
      website: formData.website,
      tags: tags,
    }

    try {
      if (editingContact) {
        // Update existing contact
        const response = await fetch(`/api/contacts/${editingContact._id || editingContact.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(contactData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to update contact")
        }

        const result = await response.json()
        console.log("Contact updated successfully:", result)
      } else {
        // Create new contact
        const response = await fetch("/api/contacts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...contactData,
            avatar: "/placeholder.svg?height=40&width=40",
            lastContact: "Just added",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to create contact")
        }

        const result = await response.json()
        console.log("Contact created successfully:", result)
      }

      // Refresh data
      mutate()

      // Reset form
      resetForm()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving contact:", error)
      alert(`Error: ${error.message}`)
    }
  }

  const deleteContact = async (contactId: string) => {
    if (!confirm("Are you sure you want to delete this contact?")) return

    try {
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete contact")
      }

      const result = await response.json()
      console.log("Contact deleted successfully:", result)

      // Refresh data
      mutate()
    } catch (error) {
      console.error("Error deleting contact:", error)
      alert(`Error: ${error.message}`)
    }
  }

  const sortContacts = (contactsToSort: any[]) => {
    return [...contactsToSort].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "company":
          return a.company.localeCompare(b.company)
        case "status":
          return a.status.localeCompare(b.status)
        case "createdDate":
          return (
            new Date(b.createdAt || b.createdDate || "").getTime() -
            new Date(a.createdAt || a.createdDate || "").getTime()
          )
        default:
          return 0
      }
    })
  }

  const filteredContacts = contacts.filter((contact: any) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || contact.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const sortedContacts = sortContacts(filteredContacts)

  if (error) return <div>Failed to load contacts</div>
  if (!contacts) return <div>Loading...</div>

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Mobile-optimized header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">People (Contacts, Clients)</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Manage your client relationships and contact information
          </p>
        </div>
        <Button onClick={openAddContactDialog} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Person
        </Button>
      </div>

      {/* Mobile-responsive Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="p-3 md:p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
            <CardTitle className="text-xs md:text-sm font-medium">Total Contacts</CardTitle>
            <User className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="text-lg md:text-2xl font-bold">{contacts.length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{contacts.filter((c: any) => c.status === "Customer").length}</span>{" "}
              customers
            </p>
          </CardContent>
        </Card>

        <Card className="p-3 md:p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
            <CardTitle className="text-xs md:text-sm font-medium">Hot Leads</CardTitle>
            <User className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="text-lg md:text-2xl font-bold">
              {contacts.filter((c: any) => c.status === "Hot Lead").length}
            </div>
            <p className="text-xs text-muted-foreground">High priority contacts</p>
          </CardContent>
        </Card>

        <Card className="p-3 md:p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
            <CardTitle className="text-xs md:text-sm font-medium">Companies</CardTitle>
            <Building2 className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="text-lg md:text-2xl font-bold">{new Set(contacts.map((c: any) => c.company)).size}</div>
            <p className="text-xs text-muted-foreground">Unique organizations</p>
          </CardContent>
        </Card>

        <Card className="p-3 md:p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
            <CardTitle className="text-xs md:text-sm font-medium">This Month</CardTitle>
            <User className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="text-lg md:text-2xl font-bold">
              {
                contacts.filter(
                  (c: any) =>
                    new Date(c.createdAt || c.createdDate || "") > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">New contacts added</p>
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
                placeholder="Search contacts by name, company, email, or job title..."
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
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="createdDate">Date Added</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex rounded-lg border p-1 bg-muted">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-7 px-3"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-7 px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacts Display */}
      <Card>
        <CardHeader>
          <CardTitle>All Contacts ({sortedContacts.length})</CardTitle>
          <CardDescription>
            A comprehensive list of all your contacts including their company and contact information.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 md:p-6">
          {viewMode === "grid" ? (
            /* Grid View - Mobile Responsive */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sortedContacts.map((contact: any) => (
                <Card key={contact._id || contact.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={contact.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {contact.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">{contact.name}</h3>
                          <p className="text-xs text-muted-foreground truncate">{contact.jobTitle}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openContactProfile(contact)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditContactDialog(contact)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Contact
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Deal
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => deleteContact(contact._id || contact.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Contact
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-medium truncate">{contact.company}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs truncate">{contact.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">{contact.phone}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <Badge className={`${getStatusColor(contact.status)} whitespace-nowrap`} variant="secondary">
                        {contact.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{contact.lastContact}</span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1">
                      {(contact.tags || []).slice(0, 2).map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {(contact.tags || []).length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{(contact.tags || []).length - 2}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* List View - Mobile Responsive Table */
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Contact</TableHead>
                    <TableHead className="hidden md:table-cell min-w-[200px]">Company & Role</TableHead>
                    <TableHead className="hidden lg:table-cell min-w-[200px]">Contact Info</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="hidden xl:table-cell min-w-[150px]">Tags</TableHead>
                    <TableHead className="hidden sm:table-cell min-w-[100px]">Last Contact</TableHead>
                    <TableHead className="min-w-[50px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedContacts.map((contact: any) => (
                    <TableRow key={contact._id || contact.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8 md:h-10 md:w-10">
                            <AvatarImage src={contact.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs">
                              {contact.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="font-medium text-sm">{contact.name}</div>
                            <div className="text-xs text-muted-foreground md:hidden">
                              {contact.company} • {contact.jobTitle}
                            </div>
                            <div className="text-xs text-muted-foreground lg:hidden">
                              Added {new Date(contact.createdAt || contact.createdDate || "").toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-sm">{contact.company}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">{contact.jobTitle}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="space-y-1">
                          <div className="text-xs flex items-center space-x-2">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span>{contact.email}</span>
                          </div>
                          <div className="text-xs flex items-center space-x-2">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span>{contact.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(contact.status)} whitespace-nowrap`} variant="secondary">
                          {contact.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {(contact.tags || []).slice(0, 2).map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {(contact.tags || []).length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{(contact.tags || []).length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                        {contact.lastContact}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openContactProfile(contact)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEditContactDialog(contact)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Contact
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Plus className="mr-2 h-4 w-4" />
                              Create Deal
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => deleteContact(contact._id || contact.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Contact
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Profile Dialog */}
      <ContactProfileDialog contact={selectedContact} isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

      {/* Add/Edit Contact Dialog - Mobile Responsive */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle>{editingContact ? "Edit Contact" : "Add New Person"}</DialogTitle>
            <DialogDescription>
              {editingContact ? "Update contact information" : "Enter the contact details for the new person"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter full name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Enter company name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                placeholder="Enter job title or position"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter phone number"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
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
              <div className="grid gap-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://company.com"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g. Enterprise, Decision Maker, Technical"
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleSaveContact} className="w-full sm:w-auto">
              {editingContact ? "Update Contact" : "Add Person"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
