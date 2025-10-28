"use client"

import type React from "react"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, Upload, Download, Send, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface QuoteItem {
  id: string
  name: string
  description: string
  length?: string
  quantity: number
  rate: number
  total: number
}

interface CompanyInfo {
  name: string
  address: string
  phone: string
  email: string
  website?: string
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch")
  const data = await res.json()
  return data.data || data
}

const statusOptions = ["Draft", "Sent", "Accepted", "Declined", "Withdrawn"]

export default function QuotePage() {
  const { toast } = useToast()
  // Quotes list
  const { data: quotes = [], mutate: mutateQuotes } = useSWR("/api/quotes", fetcher)
  const { data: companies = [] } = useSWR("/api/companies?limit=1000", fetcher)

  // Dialog/form state
  const [isOpen, setIsOpen] = useState(false)
  const [quoteNumber, setQuoteNumber] = useState(() => `QT-${Date.now().toString().slice(-6)}`)
  const [clientCompany, setClientCompany] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [items, setItems] = useState<QuoteItem[]>([
    { id: "1", name: "", description: "", quantity: 1, rate: 0, total: 0 },
  ])
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
  })
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [status, setStatus] = useState<string>("Draft")

  const resetForm = () => {
    setQuoteNumber(`QT-${Date.now().toString().slice(-6)}`)
    setClientCompany("")
    setItems([{ id: "1", name: "", description: "", quantity: 1, rate: 0, total: 0 }])
    setCompanyInfo({ name: "", address: "", phone: "", email: "", website: "" })
    setAttachedFiles([])
    setShowSuggestions(false)
    setStatus("Draft")
  }

  const addItem = () => {
    const newItem: QuoteItem = { id: Date.now().toString(), name: "", description: "", quantity: 1, rate: 0, total: 0 }
    setItems((prev) => [...prev, newItem])
  }
  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id))
  const updateItem = (id: string, field: keyof QuoteItem, value: string | number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        const updated = { ...item, [field]: value } as QuoteItem
        if (field === "quantity" || field === "rate") updated.total = (updated.quantity || 0) * (updated.rate || 0)
        return updated
      }),
    )
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) setAttachedFiles((prev) => [...prev, ...Array.from(files)])
  }
  const removeFile = (index: number) => setAttachedFiles((prev) => prev.filter((_, i) => i !== index))

  const deleteQuote = async (id: string) => {
    if (!confirm("Delete this quote?")) return
    const res = await fetch(`/api/quotes/${id}`, { method: "DELETE" })
    if (!res.ok) {
      toast({ title: "Error", description: "Failed to delete quote", variant: "destructive" })
      return
    }
    await mutateQuotes()
    toast({ title: "Quote Deleted", description: "The quote has been removed." })
  }

  const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0)
  const total = subtotal

  const saveQuote = async () => {
    try {
      const payload = {
        quoteNumber,
        clientCompany,
        companyInfo,
        items,
        subtotal,
        total,
        attachedFiles: attachedFiles.map((f) => f.name),
        status: status.toLowerCase(),
      }
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Failed to save quote")
      await mutateQuotes()
      toast({ title: "Quote Saved", description: `Quote ${quoteNumber} has been saved successfully.` })
      setIsOpen(false)
      resetForm()
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to save quote. Please try again.",
        variant: "destructive",
      })
    }
  }

  const allCompanyNames = useMemo(
    () => Array.from(new Set(companies.map((c: any) => c.name).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    [companies],
  )
  const filteredSuggestions = useMemo(() => {
    if (!clientCompany.trim()) return []
    return allCompanyNames.filter((n) => n.toLowerCase().includes(clientCompany.toLowerCase())).slice(0, 8)
  }, [clientCompany, allCompanyNames])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quotes</h1>
          <p className="text-muted-foreground">Browse all quotes and create new ones</p>
        </div>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Quote
        </Button>
      </div>

      {/* Quotes List */}
      <Card>
        <CardHeader>
          <CardTitle>All Quotes ({quotes.length || 0})</CardTitle>
          <CardDescription>Recently created quotes appear first</CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quote #</TableHead>
                <TableHead>Client Company</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(quotes || []).map((q: any) => (
                <TableRow key={q.id}>
                  <TableCell className="font-medium">{q.quoteNumber}</TableCell>
                  <TableCell>{q.clientCompany}</TableCell>
                  <TableCell className="text-right">${(q.total || 0).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="whitespace-nowrap">
                      {(q.status || "draft").toString()}
                    </Badge>
                  </TableCell>
                  <TableCell>{q.createdAt ? new Date(q.createdAt).toLocaleDateString() : ""}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => deleteQuote(q.id)}>
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {(quotes || []).length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                    No quotes found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Quote Dialog (uses current form) */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Quote</DialogTitle>
            <DialogDescription>Generate professional quotes for your clients</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quote Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quote Header */}
              <Card>
                <CardHeader>
                  <CardTitle>Quote Information</CardTitle>
                  <CardDescription>Basic quote details and client information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quoteNumber">Quote Number</Label>
                      <Input
                        id="quoteNumber"
                        value={quoteNumber}
                        onChange={(e) => setQuoteNumber(e.target.value)}
                        placeholder="QT-123456"
                      />
                    </div>
                    <div className="space-y-2 relative">
                      <Label htmlFor="clientCompany">Client Company</Label>
                      <Input
                        id="clientCompany"
                        value={clientCompany}
                        placeholder="Start typing to search companies..."
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                        onChange={(e) => {
                          setClientCompany(e.target.value)
                          setShowSuggestions(true)
                        }}
                        autoComplete="off"
                      />
                      {showSuggestions && filteredSuggestions.length > 0 && (
                        <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow">
                          <ul className="max-h-56 overflow-auto text-sm">
                            {filteredSuggestions.map((name) => (
                              <li
                                key={name}
                                className="px-3 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer"
                                onMouseDown={() => {
                                  setClientCompany(name)
                                  setShowSuggestions(false)
                                }}
                              >
                                {name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quote Items */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Quote Items</CardTitle>
                      <CardDescription>Add items and services to your quote</CardDescription>
                    </div>
                    <Button onClick={addItem} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item, index) => (
                    <div key={item.id} className="space-y-4 p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Item {index + 1}</h4>
                        {items.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Item Name</Label>
                          <Input
                            value={item.name}
                            onChange={(e) => updateItem(item.id, "name", e.target.value)}
                            placeholder="Service or product name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Length/Duration (Optional)</Label>
                          <Input
                            value={item.length || ""}
                            onChange={(e) => updateItem(item.id, "length", e.target.value)}
                            placeholder="e.g., 3 months, 40 hours"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={item.description}
                          onChange={(e) => updateItem(item.id, "description", e.target.value)}
                          placeholder="Detailed description of the item or service"
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Quantity</Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, "quantity", Number.parseInt(e.target.value) || 1)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Rate ($)</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.rate}
                            onChange={(e) => updateItem(item.id, "rate", Number.parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Total</Label>
                          <Input value={`$${(item.total || 0).toFixed(2)}`} disabled className="bg-muted" />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* File Attachments */}
              <Card>
                <CardHeader>
                  <CardTitle>Attachments</CardTitle>
                  <CardDescription>Upload legal documents, contracts, or supporting files</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                    />
                    <Button variant="outline" asChild>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Files
                      </label>
                    </Button>
                    <span className="text-sm text-muted-foreground">PDF, DOC, TXT, JPG, PNG files supported</span>
                  </div>

                  {attachedFiles.length > 0 && (
                    <div className="space-y-2">
                      <Label>Attached Files</Label>
                      <div className="space-y-2">
                        {attachedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">{file.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Company Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Company Info</CardTitle>
                  <CardDescription>Information that will appear on the quote</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={companyInfo.name}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                      placeholder="Your Company Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyAddress">Address</Label>
                    <Textarea
                      id="companyAddress"
                      value={companyInfo.address}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                      placeholder="123 Business St, City, State 12345"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyPhone">Phone</Label>
                    <Input
                      id="companyPhone"
                      value={companyInfo.phone}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyEmail">Email</Label>
                    <Input
                      id="companyEmail"
                      type="email"
                      value={companyInfo.email}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                      placeholder="contact@yourcompany.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyWebsite">Website (Optional)</Label>
                    <Input
                      id="companyWebsite"
                      value={companyInfo.website || ""}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, website: e.target.value })}
                      placeholder="www.yourcompany.com"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Quote Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Quote Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <Badge variant="outline" className="w-full justify-center">
                      Quote #{quoteNumber}
                    </Badge>
                    <p className="text-xs text-muted-foreground text-center">Valid for 30 days from creation</p>
                  </div>

                  {/* Status Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="quoteStatus">Status</Label>
                    <select
                      id="quoteStatus"
                      className="w-full border rounded px-3 py-2 bg-background"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Button className="w-full" onClick={saveQuote}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Send className="h-4 w-4 mr-2" />
                      Email to Client
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={saveQuote} className="w-full sm:w-auto">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
