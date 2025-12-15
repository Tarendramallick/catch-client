"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Send } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch")
  const data = await res.json()
  return data.data || data
}

export default function WorkspacesPage() {
  const { data: users = [] } = useSWR("/api/users?limit=1000", fetcher)
  const admins = useMemo(() => users.filter((u: any) => (u.role || "").toLowerCase() === "admin"), [users])

  const { data: workspaces = [], mutate: mutateWorkspaces } = useSWR("/api/workspaces", fetcher)
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(null)
  const { data: messages = [], mutate: mutateMessages } = useSWR(
    selectedWorkspaceId ? `/api/workspaces/${selectedWorkspaceId}/messages` : null,
    fetcher,
  )

  const [isOpen, setIsOpen] = useState(false)
  const [newWsName, setNewWsName] = useState("")
  const [creatorAdminId, setCreatorAdminId] = useState("")
  const [memberIds, setMemberIds] = useState<string[]>([])

  const [messageText, setMessageText] = useState("")
  const [senderUserId, setSenderUserId] = useState("")

  const createWorkspace = async () => {
    if (!newWsName.trim() || !creatorAdminId) return
    const res = await fetch("/api/workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newWsName.trim(), memberIds, createdByUserId: creatorAdminId }),
    })
    if (!res.ok) {
      alert("Only admins can create workspaces.")
      return
    }
    await mutateWorkspaces()
    setIsOpen(false)
    setNewWsName("")
    setCreatorAdminId("")
    setMemberIds([])
  }

  const sendMessage = async () => {
    if (!selectedWorkspaceId || !messageText.trim() || !senderUserId) return
    const sender = users.find((u: any) => (u._id || u.id) === senderUserId)
    const res = await fetch(`/api/workspaces/${selectedWorkspaceId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: messageText.trim(), userId: senderUserId, userName: sender?.name }),
    })
    if (!res.ok) {
      alert("Failed to send message")
      return
    }
    setMessageText("")
    await mutateMessages()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workspaces</h1>
          <p className="text-muted-foreground">Group chat per workspace. Admins can create new workspaces.</p>
        </div>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Workspace
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>My Workspaces</CardTitle>
            <CardDescription>Select a workspace to view messages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {workspaces.length === 0 && <div className="text-muted-foreground py-4 text-center">No workspaces yet</div>}
            {workspaces.map((ws: any) => (
              <button
                key={ws.id}
                onClick={() => setSelectedWorkspaceId(ws.id)}
                className={`w-full text-left p-3 rounded border ${selectedWorkspaceId === ws.id ? "bg-accent" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{ws.name}</span>
                  <Badge variant="outline">{(ws.memberIds || []).length} members</Badge>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Chat</CardTitle>
            <CardDescription>Send messages to the selected workspace</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selectedWorkspaceId ? (
              <div className="text-muted-foreground text-center py-10">Select a workspace to start chatting</div>
            ) : (
              <>
                <div className="space-y-3 max-h-[50vh] overflow-y-auto border rounded p-3">
                  {(messages || []).map((m: any) => (
                    <div key={m.id} className="flex flex-col">
                      <div className="text-xs text-muted-foreground">
                        {m.userName || "User"} • {m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}
                      </div>
                      <div className="text-sm">{m.text}</div>
                    </div>
                  ))}
                  {(messages || []).length === 0 && (
                    <div className="text-muted-foreground text-center py-6">No messages yet</div>
                  )}
                </div>
                <div className="grid gap-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="grid gap-1">
                      <Label>Sender</Label>
                      <select
                        className="w-full border rounded px-3 py-2 bg-background"
                        value={senderUserId}
                        onChange={(e) => setSenderUserId(e.target.value)}
                      >
                        <option value="">Select user</option>
                        {users.map((u: any) => (
                          <option key={u._id || u.id} value={u._id || u.id}>
                            {u.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                    />
                    <Button onClick={sendMessage} disabled={!senderUserId || !messageText.trim()}>
                      <Send className="h-4 w-4 mr-1" />
                      Send
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Workspace Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Workspace</DialogTitle>
            <DialogDescription>Admins only. Provide name and select members.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label>Workspace Name</Label>
              <Input value={newWsName} onChange={(e) => setNewWsName(e.target.value)} placeholder="Workspace name" />
            </div>
            <div className="grid gap-2">
              <Label>Created By (Admin)</Label>
              <select
                className="w-full border rounded px-3 py-2 bg-background"
                value={creatorAdminId}
                onChange={(e) => setCreatorAdminId(e.target.value)}
              >
                <option value="">Select admin</option>
                {admins.map((u: any) => (
                  <option key={u._id || u.id} value={u._id || u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label>Members</Label>
              <div className="max-h-48 overflow-auto border rounded p-2 space-y-2">
                {users.map((u: any) => {
                  const id = u._id || u.id
                  const checked = memberIds.includes(id)
                  return (
                    <label key={id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) =>
                          setMemberIds((prev) => (e.target.checked ? [...prev, id] : prev.filter((x) => x !== id)))
                        }
                      />
                      <span>{u.name}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createWorkspace} disabled={!newWsName.trim() || !creatorAdminId}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
