"use client"

import { useState } from "react"
import useSWR from "swr"
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

type ApiNote = {
  id: string
  title: string
  content: string
  client?: string
  assignedToId?: string | null
  createdDate: string
  dueDate?: string
  isPinned?: boolean
  tags?: string[]
}

type UiNote = {
  id: string
  title: string
  content: string
  client: string
  assignedTo: string
  assignedToId: string
  createdDate: string
  dueDate: string
  isPinned: boolean
  tags: string[]
  avatar?: string
}

const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then((r) => r.json())

function mapApiToUi(n: ApiNote): UiNote {
  const assignee = n.assignedToId ? teamMembers.find((m) => m.id === String(n.assignedToId)) : undefined
  return {
    id: n.id,
    title: n.title,
    content: n.content,
    client: n.client || "Internal",
    assignedTo: assignee?.name || "Unknown",
    assignedToId: String(n.assignedToId || ""),
    createdDate: n.createdDate,
    dueDate: n.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    isPinned: !!n.isPinned,
    tags: Array.isArray(n.tags) ? n.tags : [],
    avatar: assignee?.avatar || "/placeholder.svg?height=32&width=32",
  }
}

const teamMembers = [
  { id: "1", name: "Sarah Johnson", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "2", name: "Mike Chen", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "3", name: "Emma Davis", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "4", name: "Alex Rodriguez", avatar: "/placeholder.svg?height=32&width=32" },
]

export default function NotesPage() {
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    client: "",
    assignedToId: "1",
    dueDate: "",
    tags: "",
  })

  const { data, isLoading, error, mutate } = useSWR("/api/notes?limit=100", fetcher)
  const apiNotes: ApiNote[] = data?.data ?? []
  const notes: UiNote[] = apiNotes.map(mapApiToUi)

  const [companies, setCompanies] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("createdDate")
  const [filterBy, setFilterBy] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  if (companies.length === 0) {
    const set = new Set<string>([
      "Acme Corp",
      "TechStart Inc",
      "Global Solutions",
      "Innovation Labs",
      "Future Systems",
      "Internal",
    ])
    notes.forEach((n) => set.add(n.client))
    setCompanies(Array.from(set).sort())
  }

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

  const openEditNoteDialog = (note: UiNote) => {
    setNewNote({
      title: note.title,
      content: note.content,
      client: note.client,
      assignedToId: note.assignedToId || "1",
      dueDate: note.dueDate,
      tags: (note.tags || []).join(", "),
    })
    setEditingNote(note.id)
    setIsDialogOpen(true)
  }

  const handleSaveNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      alert("Please fill in the note title and content.")
      return
    }

    const tags = newNote.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)

    const payload = {
      title: newNote.title,
      content: newNote.content,
      client: newNote.client || "Internal",
      assignedToId: newNote.assignedToId || null,
      dueDate: newNote.dueDate || undefined,
      tags,
    }

    try {
      if (editingNote) {
        const res = await fetch(`/api/notes/${editingNote}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error("Failed to update note")
      } else {
        const res = await fetch("/api/notes", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error("Failed to create note")
      }
      await mutate()
      setIsDialogOpen(false)
      resetForm()
    } catch (e: any) {
      alert(e?.message || "Save failed")
    }
  }

  const togglePin = async (noteId: string) => {
    try {
      const current = notes.find((n) => n.id === noteId)
      const nextPinned = !current?.isPinned
      const res = await fetch(`/api/notes/${noteId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ isPinned: nextPinned }),
      })
      if (!res.ok) throw new Error("Failed to toggle pin")
      await mutate()
    } catch (e: any) {
      alert(e?.message || "Failed to toggle pin")
    }
  }

  const deleteNote = async (noteId: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return
    try {
      const res = await fetch(`/api/notes/${noteId}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete note")
      await mutate()
    } catch (e: any) {
      alert(e?.message || "Delete failed")
    }
  }

  const sortNotes = (notesToSort: UiNote[]) => {
    return [...notesToSort].sort((a, b) => {
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-48 bg-muted animate-pulse rounded" />
        <div className="h-24 bg-muted animate-pulse rounded" />
      </div>
    )
  }
  if (error) {
    return <div className="text-red-600">Failed to load notes.</div>
  }

  return (
    <div className="space-y-4 md:space-y-6">
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

      <Card>
        <CardContent className="p-3 md:p-6">
          <div className="flex flex-col lg:flex-row gap-4">
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

      {viewMode === "grid" ? (
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
                <div className="prose prose-sm max-w-none">
                  <div className="text-sm text-muted-foreground line-clamp-6 whitespace-pre-wrap">{note.content}</div>
                </div>

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
