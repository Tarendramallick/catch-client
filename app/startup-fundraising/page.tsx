import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function StartupFundraisingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Startup Fundraising</h1>
          <p className="text-muted-foreground">Manage investor relations and fundraising rounds.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Investor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Investor Pipeline</CardTitle>
          <CardDescription>Track potential investors and their engagement.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-10">No investor data yet.</div>
        </CardContent>
      </Card>
    </div>
  )
}
