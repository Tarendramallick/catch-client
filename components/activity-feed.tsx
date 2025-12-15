"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, User } from "lucide-react"
import useSWR from "swr"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch")
  const json = await res.json()
  return json.data || []
}

const getActivityTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    contact_created: "contact created",
    contact_updated: "contact updated",
    deal_created: "deal created",
    deal_updated: "deal updated",
    deal_stage_changed: "deal stage changed",
    task_created: "task created",
    task_completed: "task completed",
    note_added: "note added",
    call_logged: "call logged",
    email_sent: "email sent",
    meeting_scheduled: "meeting scheduled",
    company_created: "company created",
    user_login: "user login",
  }
  return labels[type] || type.replace(/_/g, " ")
}

const getActivityColor = (type: string) => {
  if (type.includes("created")) return "bg-green-100 text-green-800"
  if (type.includes("updated") || type.includes("changed")) return "bg-blue-100 text-blue-800"
  if (type.includes("completed")) return "bg-purple-100 text-purple-800"
  if (type.includes("call") || type.includes("email") || type.includes("meeting"))
    return "bg-orange-100 text-orange-800"
  return "bg-gray-100 text-gray-800"
}

export function ActivityFeed() {
  const { data: activities = [], error, isLoading } = useSWR("/api/activities?limit=10", fetcher)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest updates across all contacts, deals, and tasks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="h-4 w-40 bg-muted rounded animate-pulse" />
          <div className="h-3 w-72 bg-muted rounded animate-pulse" />
          <div className="h-4 w-56 bg-muted rounded animate-pulse" />
          <div className="h-3 w-64 bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest updates across all contacts, deals, and tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-600 py-6">Failed to load activity</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
        <CardDescription>Latest updates across all contacts, deals, and tasks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">No recent activity to display</div>
        ) : (
          activities.map((activity: any, index: number) => (
            <div key={activity.id || index}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 mt-0.5">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.title}</p>
                    {activity.description && (
                      <p className="text-sm text-muted-foreground mt-0.5">{activity.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{activity.userName || "System"}</span>
                      </span>
                      {activity.entityType && activity.entityName && (
                        <span>
                          {activity.entityType}: {activity.entityName}
                        </span>
                      )}
                      <span>
                        {activity.timestamp ? new Date(activity.timestamp).toLocaleDateString() : "Unknown date"}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge className={getActivityColor(activity.type)} variant="secondary">
                  {getActivityTypeLabel(activity.type)}
                </Badge>
              </div>
              {index < activities.length - 1 && <Separator className="mt-4" />}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
