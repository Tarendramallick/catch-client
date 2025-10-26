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
  return json.data || json.activities || []
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
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.title}</p>
                    {activity.description && (
                      <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                    )}
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {activity.type?.replace(/_/g, " ") || "activity"}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {activity.userName || "System"}
                  </span>
                  {activity.entityName && (
                    <span>
                      {activity.entityType}: {activity.entityName}
                    </span>
                  )}
                  <span>{activity.timestamp ? new Date(activity.timestamp).toLocaleDateString() : "Unknown date"}</span>
                </div>
              </div>
              {index < activities.length - 1 && <Separator className="mt-4" />}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
