"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Target, CheckSquare, Calendar, DollarSign, Plus, ExternalLink } from "lucide-react"
import Link from "next/link"
import {
  getContactById,
  getDealById,
  getTaskById,
  getContactDeals,
  getContactTasks,
  getDealTasks,
} from "@/lib/crm-data"

interface EntityConnectionsProps {
  entityType: "contact" | "deal" | "task"
  entityId: string
}

export function EntityConnections({ entityType, entityId }: EntityConnectionsProps) {
  const renderContactConnections = (contactId: string) => {
    const contact = getContactById(contactId)
    if (!contact) return null

    const relatedDeals = getContactDeals(contactId)
    const relatedTasks = getContactTasks(contactId)

    return (
      <div className="space-y-4">
        {/* Related Deals */}
        {relatedDeals.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="h-4 w-4" />
                Related Deals ({relatedDeals.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {relatedDeals.map((deal) => (
                <div key={deal.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex-1">
                    <Link href={`/deals?highlight=${deal.id}`} className="font-medium text-sm hover:underline">
                      {deal.title}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <DollarSign className="h-3 w-3" />${deal.value.toLocaleString()}
                      <Badge variant="outline" className="text-xs">
                        {deal.stage}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/deals?highlight=${deal.id}`}>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Related Tasks */}
        {relatedTasks.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                Related Tasks ({relatedTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {relatedTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex-1">
                    <Link href={`/tasks?highlight=${task.id}`} className="font-medium text-sm hover:underline">
                      {task.title}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {task.dueDate} at {task.dueTime}
                      <Badge
                        variant={
                          task.priority === "high"
                            ? "destructive"
                            : task.priority === "medium"
                              ? "default"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/tasks?highlight=${task.id}`}>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  const renderDealConnections = (dealId: string) => {
    const deal = getDealById(dealId)
    if (!deal) return null

    const relatedContact = getContactById(deal.contactId)
    const relatedTasks = getDealTasks(dealId)

    return (
      <div className="space-y-4">
        {/* Related Contact */}
        {relatedContact && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <User className="h-4 w-4" />
                Primary Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={relatedContact.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {relatedContact.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Link
                      href={`/contacts?highlight=${relatedContact.id}`}
                      className="font-medium text-sm hover:underline"
                    >
                      {relatedContact.name}
                    </Link>
                    <div className="text-xs text-muted-foreground">
                      {relatedContact.position} at {relatedContact.company}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/contacts?highlight=${relatedContact.id}`}>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Related Tasks */}
        {relatedTasks.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                Related Tasks ({relatedTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {relatedTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex-1">
                    <Link href={`/tasks?highlight=${task.id}`} className="font-medium text-sm hover:underline">
                      {task.title}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {task.dueDate} at {task.dueTime}
                      <Badge variant={task.completed ? "secondary" : "default"} className="text-xs">
                        {task.completed ? "Completed" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/tasks?highlight=${task.id}`}>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  const renderTaskConnections = (taskId: string) => {
    const task = getTaskById(taskId)
    if (!task) return null

    const relatedContact = task.contactId ? getContactById(task.contactId) : null
    const relatedDeal = task.dealId ? getDealById(task.dealId) : null

    return (
      <div className="space-y-4">
        {/* Related Contact */}
        {relatedContact && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <User className="h-4 w-4" />
                Related Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={relatedContact.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {relatedContact.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Link
                      href={`/contacts?highlight=${relatedContact.id}`}
                      className="font-medium text-sm hover:underline"
                    >
                      {relatedContact.name}
                    </Link>
                    <div className="text-xs text-muted-foreground">
                      {relatedContact.position} at {relatedContact.company}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/contacts?highlight=${relatedContact.id}`}>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Related Deal */}
        {relatedDeal && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="h-4 w-4" />
                Related Deal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-2 border rounded">
                <div className="flex-1">
                  <Link href={`/deals?highlight=${relatedDeal.id}`} className="font-medium text-sm hover:underline">
                    {relatedDeal.title}
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <DollarSign className="h-3 w-3" />${relatedDeal.value.toLocaleString()}
                    <Badge variant="outline" className="text-xs">
                      {relatedDeal.stage}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/deals?highlight=${relatedDeal.id}`}>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Connected Items</h3>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Connection
        </Button>
      </div>

      {entityType === "contact" && renderContactConnections(entityId)}
      {entityType === "deal" && renderDealConnections(entityId)}
      {entityType === "task" && renderTaskConnections(entityId)}
    </div>
  )
}
