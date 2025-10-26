"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, X, CheckCircle, AlertCircle, Info, Zap, Calendar, Settings } from "lucide-react"

const notifications = [
  {
    id: "n1",
    type: "update",
    title: "CatchClients v2.1.0 Released",
    message: "New features: Enhanced pipeline management, improved drag & drop functionality, and better performance.",
    timestamp: "2024-01-15T10:00:00Z",
    isRead: false,
    priority: "high",
  },
  {
    id: "n2",
    type: "feature",
    title: "New Chart Components Available",
    message:
      "We've added dynamic charts to your deals dashboard. View real-time pipeline analytics and closed won trends.",
    timestamp: "2024-01-14T15:30:00Z",
    isRead: false,
    priority: "medium",
  },
  {
    id: "n3",
    type: "maintenance",
    title: "Scheduled Maintenance Complete",
    message: "System maintenance completed successfully. All services are now running optimally with improved speed.",
    timestamp: "2024-01-13T08:00:00Z",
    isRead: true,
    priority: "low",
  },
  {
    id: "n4",
    type: "security",
    title: "Security Enhancement",
    message: "Enhanced data encryption and improved authentication security measures have been implemented.",
    timestamp: "2024-01-12T12:00:00Z",
    isRead: true,
    priority: "high",
  },
  {
    id: "n5",
    type: "feature",
    title: "Contact Profile Views",
    message: "New feature: Click 'View Details' on any contact to see their complete profile with deals and notes.",
    timestamp: "2024-01-11T14:20:00Z",
    isRead: false,
    priority: "medium",
  },
  {
    id: "n6",
    type: "update",
    title: "Performance Improvements",
    message: "Faster loading times, improved search functionality, and better mobile responsiveness across all pages.",
    timestamp: "2024-01-10T09:15:00Z",
    isRead: true,
    priority: "medium",
  },
  {
    id: "n7",
    type: "feature",
    title: "Team Management Added",
    message: "New team management features: Add team members, assign tasks, and track performance metrics.",
    timestamp: "2024-01-09T16:45:00Z",
    isRead: true,
    priority: "high",
  },
]

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "update":
      return <Zap className="h-4 w-4 text-blue-500" />
    case "feature":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "maintenance":
      return <Settings className="h-4 w-4 text-orange-500" />
    case "security":
      return <AlertCircle className="h-4 w-4 text-red-500" />
    default:
      return <Info className="h-4 w-4 text-gray-500" />
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800"
    case "medium":
      return "bg-yellow-100 text-yellow-800"
    case "low":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "update":
      return "bg-blue-100 text-blue-800"
    case "feature":
      return "bg-green-100 text-green-800"
    case "maintenance":
      return "bg-orange-100 text-orange-800"
    case "security":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function NotificationsPanel() {
  const [notificationList, setNotificationList] = useState(notifications)
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)

  const markAsRead = (id: string) => {
    setNotificationList((prev) => prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotificationList((prev) => prev.map((notif) => ({ ...notif, isRead: true })))
  }

  const dismissNotification = (id: string) => {
    setNotificationList((prev) => prev.filter((notif) => notif.id !== id))
  }

  const filteredNotifications = showUnreadOnly ? notificationList.filter((notif) => !notif.isRead) : notificationList

  const unreadCount = notificationList.filter((notif) => !notif.isRead).length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>System Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowUnreadOnly(!showUnreadOnly)}>
              {showUnreadOnly ? "Show All" : "Unread Only"}
            </Button>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Mark All Read
              </Button>
            )}
          </div>
        </div>
        <CardDescription>
          Stay updated with the latest CatchClients features, updates, and system announcements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border rounded-lg transition-all hover:shadow-sm ${
                  !notification.isRead ? "bg-blue-50/50 border-blue-200" : "bg-white"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getTypeColor(notification.type)}>
                      {notification.type}
                    </Badge>
                    <Badge variant="outline" className={getPriorityColor(notification.priority)}>
                      {notification.priority}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => dismissNotification(notification.id)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{notification.message}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(notification.timestamp).toLocaleDateString()}</span>
                    <span>
                      at{" "}
                      {new Date(notification.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  {!notification.isRead && (
                    <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)} className="text-xs">
                      Mark as Read
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {filteredNotifications.length === 0 && (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {showUnreadOnly ? "No unread notifications" : "No notifications"}
                </h3>
                <p className="text-muted-foreground">
                  {showUnreadOnly
                    ? "You're all caught up! Check back later for updates."
                    : "System notifications and updates will appear here."}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
