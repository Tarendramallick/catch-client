"use client"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, User, FileText, CheckSquare, Target, Phone, Mail } from "lucide-react"
import useSWR from "swr"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch")
  const json = await res.json()
  return json.data || json.activities || []
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
      return <Phone className="h-5 w-5 text-blue-500" />
    case "email":
      return <Mail className="h-5 w-5 text-green-500" />
    case "meeting":
      return <Clock className="h-5 w-5 text-purple-500" />
    case "task":
      return <CheckSquare className="h-5 w-5 text-orange-500" />
    case "note":
      return <FileText className="h-5 w-5 text-gray-500" />
    case "deal_update":
      return <Target className="h-5 w-5 text-red-500" />
    case "contact_update":
      return <User className="h-5 w-5 text-indigo-500" />
    default:
      return <Clock className="h-5 w-5 text-gray-500" />
  }
}

const getActivityColor = (type: ActivityType) => {
  switch (type) {
    case "call":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "email":
      return "bg-green-50 text-green-700 border-green-200"
    case "meeting":
      return "bg-purple-50 text-purple-700 border-purple-200"
    case "task":
      return "bg-orange-50 text-orange-700 border-orange-200"
    case "note":
      return "bg-gray-50 text-gray-700 border-gray-200"
    case "deal_update":
      return "bg-red-50 text-red-700 border-red-200"
    case "contact_update":
      return "bg-indigo-50 text-indigo-700 border-indigo-200"
    default:
      return "bg-gray-50 text-gray-700 border-gray-200"
  }
}

export function ActivityFeed() {
  const { data: activities = [], error, isLoading } = useSWR("/api/activities?limit=10", fetcher)

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-4 w-40 bg-muted rounded animate-pulse" />
        <div className="h-3 w-72 bg-muted rounded animate-pulse" />
        <div className="h-4 w-56 bg-muted rounded animate-pulse" />
        <div className="h-3 w-64 bg-muted rounded animate-pulse" />
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-600 py-6">Failed to load activity</div>
  }

  if (activities.length === 0) {
    return <div className="text-center text-muted-foreground py-8">No recent activity to display</div>
  }

  return (
    <div className="space-y-4">
      {activities.map((activity: any, index: number) => (
        <div key={activity.id || index}>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-medium text-sm">{activity.title}</p>
                  {activity.description && <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>}
                </div>
                <Badge variant="outline" className={`text-xs shrink-0 ${getActivityColor(activity.type)}`}>
                  {(activity.type || "").replace("_", " ")}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span>{activity.userName || "System"}</span>
                {activity.entityType && activity.entityName && (
                  <>
                    <span>•</span>
                    <span>
                      {activity.entityType}: {activity.entityName}
                    </span>
                  </>
                )}
                <span>•</span>
                <span>{activity.timestamp ? new Date(activity.timestamp).toLocaleDateString() : "Unknown date"}</span>
              </div>
            </div>
          </div>
          {index < activities.length - 1 && <Separator className="mt-4" />}
        </div>
      ))}
    </div>
  )
}
