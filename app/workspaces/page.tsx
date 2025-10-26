import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function WorkspacesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workspaces</h1>
          <p className="text-muted-foreground">Organize your projects and collaborations.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Workspace
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Workspaces</CardTitle>
          <CardDescription>Your dedicated areas for different projects or teams.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-10">No workspaces created yet.</div>
        </CardContent>
      </Card>
    </div>
  )
}
