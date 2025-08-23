"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Plus,
  FileText,
  Calendar,
  ArrowUpDown,
  Filter,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Pin,
  PinOff,
  Grid3X3,
  List,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const initialNotes = [
  {
    id: "n1",
    title: "Discovery Call Notes - Acme Corp",
    content:
      "Had an excellent discovery call with John Smith, CEO of Acme Corp. Key points discussed:\n\n• Company has 500+ employees\n• Current pain points with their existing system\n• Budget range: $40-50k\n• Decision timeline: Q1 2024\n• Next steps: Send proposal by Friday",
    client: "Acme Corp",
    assignedTo: "Sarah Johnson",
    assignedToId: "1",
    createdDate: "2024-01-13",
    dueDate: "2024-01-20",
    isPinned: true,
    tags: ["discovery", "proposal"],
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "n2",
    title: "Technical Requirements - TechStart",
    content:
      "Technical discussion with TechStart CTO:\n\n**Integration Requirements:**\n- API connectivity with existing systems\n- Single sign-on (SSO) implementation\n- Custom reporting dashboard\n- Mobile app compatibility\n\n**Timeline:** 3-month implementation\n**Budget:** $25-30k",
    client: "TechStart Inc",
    assignedTo: "Mike Chen",
    assignedToId: "2",
    createdDate: "2024-01-12",
    dueDate: "2024-01-18",
    isPinned: false,
    tags: ["technical", "requirements"],
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "n3",
    title: "Competitive Analysis - Global Solutions",
    content:
      "Research on Global Solutions' current vendor:\n\n**Current Solution:** CompetitorX\n**Pain Points:**\n- Limited customization options\n- Poor customer support\n- High maintenance costs\n\n**Our Advantages:**\n- Better pricing model\n- Superior customer service\n- More flexible customization\n\n**Action Items:**\n- Prepare competitive comparison sheet\n- Schedule demo focusing on customization",
    client: "Global Solutions",
    assignedTo: "Emma Davis",
    assignedToId: "3",
    createdDate: "2024-01-11",
    dueDate: "2024-01-25",
    isPinned: false,
    tags: ["competitive", "research"],
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "n4",
    title: "Meeting Summary - Innovation Labs",
    content:
      "Product demo meeting recap:\n\n**Attendees:**\n- Alex Rodriguez (Product Manager)\n- Jennifer Kim (Tech Lead)\n- David Park (VP Engineering)\n\n**Demo Highlights:**\n- Workflow automation features\n- Real-time collaboration tools\n- Advanced analytics dashboard\n\n**Feedback:**\n- Impressed with automation capabilities\n- Requested custom integration demo\n- Concerns about data migration\n\n**Next Steps:**\n- Technical deep-dive session\n- Migration plan document",
    client: "Innovation Labs",
    assignedTo: "Alex Rodriguez",
    assignedToId: "4",
    createdDate: "2024-01-10",
    dueDate: "2024-01-22",
    isPinned: false,
    tags: ["demo", "meeting"],
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "n5",
    title: "Internal Strategy Meeting",
    content:
      "Q1 2024 Sales Strategy Discussion:\n\n**Key Decisions:**\n- Focus on enterprise clients (500+ employees)\n- Develop industry-specific solutions\n- Increase demo-to-close conversion rate\n\n**Action Items:**\n- Update sales playbook\n- Create industry case studies\n- Implement new CRM workflows\n\n**Metrics to Track:**\n- Lead response time\n- Demo completion rate\n- Proposal win rate",
    client: "Internal",
    assignedTo: "Sarah Johnson",
    assignedToId: "1",
    createdDate: "2024-01-09",
    dueDate: "2024-01-30",
    isPinned: true,
    tags: ["strategy", "internal"],
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

const teamMembers = [
  { id: "1", name: "Sarah Johnson", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "2", name: "Mike Chen", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "3", name: "Emma Davis", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "4", name: "Alex Rodriguez", avatar: "/placeholder.svg?height=32&width=32" },
]

export default function NotesPage() {
  const [notes, setNotes] = useState(initialNotes)
  const [companies, setCompanies] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("createdDate")
  const [filterBy, setFilterBy] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Form state
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    client: "",
    assignedToId: "1",
    dueDate: "",
    tags: "",
  })

  // Load companies from localStorage and extract unique clients
  useEffect(() => {
    const savedCompanies = localStorage.getItem("catchclients-companies")
    const savedContacts = localStorage.getItem("catchclients-contacts")

    const companyNames = new Set<string>()

    if (savedCompanies) {
      const companiesData = JSON.parse(savedCompanies)
      companiesData.forEach((company: any) => companyNames.add(company.name))
    }

    if (savedContacts) {
      const contactsData = JSON.parse(savedContacts)
      contactsData.forEach((contact: any) => companyNames.add(contact.company))
    }

    // Add default clients
    companyNames.add("Acme Corp")
    companyNames.add("TechStart Inc")
    companyNames.add("Global Solutions")
    companyNames.add("Innovation Labs")
    companyNames.add("Future Systems")
    companyNames.add("Internal")

    setCompanies(Array.from(companyNames).sort())
  }, [])

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem("catchclients-notes")
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
  }, [])

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem("catchclients-notes", JSON.stringify(notes))
  }, [notes])

  const resetForm = () => {
    setNewNote({
      title: "",
      content: "",
      client: "",
      assignedToId: "1",
      dueDate: "",
      tags: "",
    })
    setEditingNote(null)
  }

  const openAddNoteDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditNoteDialog = (note: (typeof initialNotes)[0]) => {
    setNewNote({
      title: note.title,
      content: note.content,
      client: note.client,
      assignedToId: note.assignedToId,
      dueDate: note.dueDate,
      tags: note.tags.join(", "),
    })
    setEditingNote(note.id)
    setIsDialogOpen(true)
  }

  const handleSaveNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      alert("Please fill in the note title and content.")
      return
    }

    const assignee = teamMembers.find((member) => member.id === newNote.assignedToId)
    const tags = newNote.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)

    if (editingNote) {
      // Update existing note
      setNotes(
        notes.map((note) =>
          note.id === editingNote
            ? {
                ...note,
                title: newNote.title,
                content: newNote.content,
                client: newNote.client || "Internal",
                assignedTo: assignee?.name || "Unknown",
                assignedToId: newNote.assignedToId,
                dueDate: newNote.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                tags: tags,
              }
            : note,
        ),
      )
    } else {
      // Create new note
      const note = {
        id: `n${Date.now()}`,
        title: newNote.title,
        content: newNote.content,
        client: newNote.client || "Internal",
        assignedTo: assignee?.name || "Unknown",
        assignedToId: newNote.assignedToId,
        createdDate: new Date().toISOString().split("T")[0],
        dueDate: newNote.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        isPinned: false,
        tags: tags,
        avatar: assignee?.avatar || "/placeholder.svg?height=32&width=32",
      }

      setNotes([note, ...notes])
    }

    setIsDialogOpen(false)
    resetForm()
  }

  const togglePin = (noteId: string) => {
    setNotes(notes.map((note) => (note.id === noteId ? { ...note, isPinned: !note.isPinned } : note)))
  }

  const deleteNote = (noteId: string) => {
    if (confirm("Are you sure you want to delete this note?")) {
      setNotes(notes.filter((note) => note.id !== noteId))
    }
  }

  const sortNotes = (notesToSort: typeof initialNotes) => {
    return [...notesToSort].sort((a, b) => {
      // Always show pinned notes first
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1

      switch (sortBy) {
        case "dueDate":
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        case "assignedTo":
          return a.assignedTo.localeCompare(b.assignedTo)
        case "createdDate":
          return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        case "client":
          return a.client.localeCompare(b.client)
        default:
          return 0
      }
    })
  }

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.client.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      filterBy === "all" ||
      (filterBy === "pinned" && note.isPinned) ||
      (filterBy === "client" && note.client !== "Internal") ||
      (filterBy === "internal" && note.client === "Internal")

    return matchesSearch && matchesFilter
  })

  const sortedNotes = sortNotes(filteredNotes)

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Mobile-optimized header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Notes Dashboard</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Organize and manage your client notes and internal documentation
          </p>
        </div>
        <Button onClick={openAddNoteDialog} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Note
        </Button>
      </div>

      {/* Mobile-responsive Controls */}
      <Card>
        <CardContent className="p-3 md:p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              {/* Sort */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium hidden sm:inline">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdDate">Created Date</SelectItem>
                    <SelectItem value="dueDate">Due Date</SelectItem>
                    <SelectItem value="assignedTo">Assigned To</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Notes</SelectItem>
                    <SelectItem value="pinned">Pinned</SelectItem>
                    <SelectItem value="client">Client Notes</SelectItem>
                    <SelectItem value="internal">Internal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* View Mode Toggle */}
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

          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <span>Total: {notes.length}</span>
            <span>Pinned: {notes.filter((n) => n.isPinned).length}</span>
            <span>Showing: {sortedNotes.length}</span>
          </div>
        </CardContent>
      </Card>

      {/* Notes Display */}
      {viewMode === "grid" ? (
        /* Grid View - Mobile Responsive */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedNotes.map((note) => (
            <Card
              key={note.id}
              className={`hover:shadow-md transition-shadow ${note.isPinned ? "ring-2 ring-blue-200 bg-blue-50/30 dark:bg-blue-950/20 dark:ring-blue-800" : ""}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base md:text-lg flex items-center gap-2">
                      {note.isPinned && <Pin className="h-4 w-4 text-blue-500 flex-shrink-0" />}
                      <span className="line-clamp-2">{note.title}</span>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge variant="outline">{note.client}</Badge>
                      {note.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex-shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditNoteDialog(note)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Note
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => togglePin(note.id)}>
                        {note.isPinned ? (
                          <>
                            <PinOff className="mr-2 h-4 w-4" />
                            Unpin Note
                          </>
                        ) : (
                          <>
                            <Pin className="mr-2 h-4 w-4" />
                            Pin Note
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => deleteNote(note.id)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Note
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Note Content */}
                <div className="prose prose-sm max-w-none">
                  <div className="text-sm text-muted-foreground line-clamp-6 whitespace-pre-wrap">{note.content}</div>
                </div>

                {/* Note Metadata */}
                <div className="space-y-2 text-xs text-muted-foreground border-t pt-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <Avatar className="h-5 w-5 flex-shrink-0">
                        <AvatarImage src={note.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">
                          {note.assignedTo
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate">{note.assignedTo}</span>
                    </div>
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <FileText className="h-3 w-3" />
                      <span>Note</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Created: {new Date(note.createdDate).toLocaleDateString()}</span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>Due: {new Date(note.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* List View - Mobile Responsive */
        <div className="space-y-3">
          {sortedNotes.map((note) => (
            <Card
              key={note.id}
              className={`hover:shadow-md transition-shadow ${note.isPinned ? "ring-2 ring-blue-200 bg-blue-50/30 dark:bg-blue-950/20 dark:ring-blue-800" : ""}`}
            >
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {note.isPinned && <Pin className="h-4 w-4 text-blue-500 flex-shrink-0" />}
                        <h3 className="font-medium text-sm md:text-base truncate">{note.title}</h3>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="flex-shrink-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditNoteDialog(note)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Note
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => togglePin(note.id)}>
                            {note.isPinned ? (
                              <>
                                <PinOff className="mr-2 h-4 w-4" />
                                Unpin Note
                              </>
                            ) : (
                              <>
                                <Pin className="mr-2 h-4 w-4" />
                                Pin Note
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => deleteNote(note.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Note
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge variant="outline">{note.client}</Badge>
                      {note.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3 whitespace-pre-wrap">
                      {note.content}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={note.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">
                            {note.assignedTo
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span>{note.assignedTo}</span>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <span>Created: {new Date(note.createdDate).toLocaleDateString()}</span>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>Due: {new Date(note.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {sortedNotes.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No notes found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterBy !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Create your first note to get started"}
            </p>
            <Button onClick={openAddNoteDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Note
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Note Dialog - Mobile Responsive */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle>{editingNote ? "Edit Note" : "Add New Note"}</DialogTitle>
            <DialogDescription>
              {editingNote ? "Update your note details" : "Create a new note with rich content"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Note Title *</Label>
              <Input
                id="title"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                placeholder="Enter note title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Note Content *</Label>
              <Textarea
                id="content"
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                placeholder="Write your note content here... (supports markdown-like formatting)"
                rows={8}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Tip: Use **bold**, *italic*, and bullet points (•) for better formatting
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="client">Client</Label>
                <Select value={newNote.client} onValueChange={(value) => setNewNote({ ...newNote, client: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((client) => (
                      <SelectItem key={client} value={client}>
                        {client}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="assignee">Assigned To</Label>
                <Select
                  value={newNote.assignedToId}
                  onValueChange={(value) => setNewNote({ ...newNote, assignedToId: value })}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newNote.dueDate}
                  onChange={(e) => setNewNote({ ...newNote, dueDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={newNote.tags}
                  onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
                  placeholder="e.g. meeting, proposal, technical"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleSaveNote} className="w-full sm:w-auto">
              {editingNote ? "Update Note" : "Add Note"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
