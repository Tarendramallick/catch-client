"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Phone, Mail, Users, CheckSquare, FileText, Target, User, Clock } from "lucide-react"
import useSWR from "swr"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch")
  const json = await res.json()
  return json.data || []
}

type ActivityType =
  | "call"
  | "email"
  | "meeting"
  | "task"
  | "note"
  | "deal_update"
  | "contact_update"
  | "company"
  | "custom"

const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case "call":
      return <Phone className="h-4 w-4 text-blue-500" />
    case "email":
      return <Mail className="h-4 w-4 text-green-500" />
    case "meeting":
      return <Users className="h-4 w-4 text-purple-500" />
    case "task":
      return <CheckSquare className="h-4 w-4 text-orange-500" />
    case "note":
      return <FileText className="h-4 w-4 text-gray-500" />
    case "deal_update":
      return <Target className="h-4 w-4 text-red-500" />
    case "contact_update":
      return <User className="h-4 w-4 text-indigo-500" />
    default:
      return <Clock className="h-4 w-4 text-gray-500" />
  }
}

const getActivityColor = (type: ActivityType) => {
  switch (type) {
    case "call":
      return "bg-blue-100 text-blue-800"
    case "email":
      return "bg-green-100 text-green-800"
    case "meeting":
      return "bg-purple-100 text-purple-800"
    case "task":
      return "bg-orange-100 text-orange-800"
    case "note":
      return "bg-gray-100 text-gray-800"
    case "deal_update":
      return "bg-red-100 text-red-800"
    case "contact_update":
      return "bg-indigo-100 text-indigo-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function ActivityFeed() {
  const { data: activities = [] } = useSWR("/api/activities?limit=10", fetcher)

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
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <Badge className={getActivityColor(activity.type)} variant="secondary">
                      {(activity.type || "").replace("_", " ")}
                    </Badge>
                  </div>
                  {activity.description && <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>}
                  <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{activity.userName || "User"}</span>
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
              {index < activities.length - 1 && <Separator className="mt-4" />}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
