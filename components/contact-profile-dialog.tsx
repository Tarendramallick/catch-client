"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Mail, Phone, Globe, Calendar, DollarSign, FileText, Target, Plus, ExternalLink } from "lucide-react"

interface Contact {
  id: string
  name: string
  email: string
  phone: string
  company: string
  jobTitle: string
  status: string
  tags: string[]
  lastContact: string
  avatar?: string
  website?: string
  createdDate: string
}

interface ContactProfileDialogProps {
  contact: Contact | null
  isOpen: boolean
  onClose: () => void
}

export function ContactProfileDialog({ contact, isOpen, onClose }: ContactProfileDialogProps) {
  const [deals, setDeals] = useState<any[]>([])
  const [notes, setNotes] = useState<any[]>([])

  useEffect(() => {
    if (contact) {
      // Load deals and notes from localStorage
      const savedDeals = localStorage.getItem("catchclients-deals")
      const savedNotes = localStorage.getItem("catchclients-notes")

      if (savedDeals) {
        const dealsData = JSON.parse(savedDeals)
        const contactDeals = dealsData.filter((deal: any) => deal.company === contact.company)
        setDeals(contactDeals)
      }

      if (savedNotes) {
        const notesData = JSON.parse(savedNotes)
        const contactNotes = notesData.filter((note: any) => note.client === contact.company)
        setNotes(contactNotes)
      }
    }
  }, [contact])

  if (!contact) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Hot Lead":
        return "bg-red-100 text-red-800"
      case "Qualified":
        return "bg-green-100 text-green-800"
      case "Cold Lead":
        return "bg-blue-100 text-blue-800"
      case "Nurturing":
        return "bg-yellow-100 text-yellow-800"
      case "Customer":
        return "bg-purple-100 text-purple-800"
      case "Lost":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalDealValue = deals.reduce((sum, deal) => sum + deal.value, 0)
  const activeDealCount = deals.filter((deal) => !["Closed Won", "Closed Lost"].includes(deal.stage)).length

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={contact.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {contact.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{contact.name}</h2>
              <p className="text-muted-foreground">
                {contact.jobTitle} at {contact.company}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Contact Information */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{contact.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">{contact.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Company</p>
                      <p className="text-sm text-muted-foreground">{contact.company}</p>
                    </div>
                  </div>
                  {contact.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Website</p>
                        <a
                          href={contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                          {contact.website}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Status</span>
                    <Badge className={getStatusColor(contact.status)}>{contact.status}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {contact.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t text-xs text-muted-foreground">
                  <p>Added: {new Date(contact.createdDate).toLocaleDateString()}</p>
                  <p>Last Contact: {contact.lastContact}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Active Deals</span>
                  </div>
                  <span className="font-medium">{activeDealCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Deal Value</span>
                  </div>
                  <span className="font-medium">${totalDealValue.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Notes</span>
                  </div>
                  <span className="font-medium">{notes.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Deals and Notes */}
          <div className="md:col-span-2">
            <Tabs defaultValue="deals" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="deals">Deals ({deals.length})</TabsTrigger>
                <TabsTrigger value="notes">Notes ({notes.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="deals" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Related Deals</h3>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    New Deal
                  </Button>
                </div>

                <div className="space-y-3">
                  {deals.map((deal) => (
                    <Card key={deal.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium">{deal.title}</h4>
                            <p className="text-sm text-muted-foreground">{deal.description}</p>
                          </div>
                          <Badge variant="outline">{deal.stage}</Badge>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-4">
                            <span className="font-medium text-green-600">${deal.value.toLocaleString()}</span>
                            <span className="text-muted-foreground">{deal.probability}% probability</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(deal.closeDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {deals.length === 0 && (
                    <Card>
                      <CardContent className="text-center py-8">
                        <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No deals found</h3>
                        <p className="text-muted-foreground mb-4">
                          Create a deal to start tracking opportunities with this contact
                        </p>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Create Deal
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="notes" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Related Notes</h3>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    New Note
                  </Button>
                </div>

                <div className="space-y-3">
                  {notes.map((note) => (
                    <Card key={note.id}>
                      <CardContent className="p-4">
                        <div className="mb-2">
                          <h4 className="font-medium mb-1">{note.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-3">{note.content}</p>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>By {note.assignedTo}</span>
                          <span>{new Date(note.createdDate).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {notes.length === 0 && (
                    <Card>
                      <CardContent className="text-center py-8">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No notes found</h3>
                        <p className="text-muted-foreground mb-4">
                          Add notes to track important information about this contact
                        </p>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Note
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
