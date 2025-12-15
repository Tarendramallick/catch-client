import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { CheckCircle, Users, Target, BarChart3, Handshake, Briefcase } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">CC</span>
            </div>
            <span className="font-bold text-lg">CatchClients</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
        <div className="container px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">CatchClients</h1>
            <p className="text-xl md:text-2xl">The Smart CRM Built for Modern Teams</p>
            <p className="max-w-[700px] mx-auto text-lg md:text-xl">
              CatchClients is a modern, user-friendly CRM platform developed by Catch22Digital, designed to help growing
              businesses manage client relationships, track leads, and streamline sales operations.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
              <Button asChild className="bg-white text-blue-600 hover:bg-gray-100">
                <Link href="/login">Get Started</Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What the Software Offers</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Whether you're a startup, freelancer, or agency, CatchClients gives you the tools you need to stay
                organized, close more deals, and build long-lasting client relationships.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-2 lg:grid-cols-3">
            <div className="grid gap-1">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Users className="h-5 w-5 text-blue-500" />
                Contact & Client Management
              </div>
              <p className="text-sm text-muted-foreground">
                Store and manage detailed contact profiles. Add custom notes, tags, and timelines for each client.
              </p>
            </div>
            <div className="grid gap-1">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Target className="h-5 w-5 text-purple-500" />
                Lead & Deal Tracking
              </div>
              <p className="text-sm text-muted-foreground">
                Track potential clients across a customizable sales pipeline. Monitor deal stages, close probabilities,
                and assigned team members. Get notified when leads go cold or move forward.
              </p>
            </div>
            <div className="grid gap-1">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Tasks & Reminders
              </div>
              <p className="text-sm text-muted-foreground">
                Schedule meetings, follow-ups, and to-dos. Stay on top of deadlines with smart reminders and daily
                dashboards.
              </p>
            </div>
            <div className="grid gap-1">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Handshake className="h-5 w-5 text-orange-500" />
                Team Collaboration
              </div>
              <p className="text-sm text-muted-foreground">
                Assign roles and clients to team members. Share notes and updates in real time. Keep everyone aligned on
                client progress.
              </p>
            </div>
            <div className="grid gap-1">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <BarChart3 className="h-5 w-5 text-red-500" />
                Analytics & Reporting
              </div>
              <p className="text-sm text-muted-foreground">
                Visualize your sales pipeline. Track KPIs like close rates, client growth, and rep performance. Export
                data for quarterly reviews or client updates.
              </p>
            </div>
            <div className="grid gap-1">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Briefcase className="h-5 w-5 text-yellow-500" />
                Customizable Workflows
              </div>
              <p className="text-sm text-muted-foreground">
                Tailor CatchClients to your unique business needs with flexible workflows and custom fields.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6 text-center space-y-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Catch More Clients?</h2>
          <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
            Join thousands of growing businesses who trust CatchClients to streamline their sales and client management.
          </p>
          <Button asChild size="lg">
            <Link href="/login">Start Your Free Trial</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-background">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; 2025 Catch22Digital. All rights reserved.</p>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="#" className="hover:underline" prefetch={false}>
              Privacy Policy
            </Link>
            <Link href="#" className="hover:underline" prefetch={false}>
              Terms of Service
            </Link>
            <Link href="#" className="hover:underline" prefetch={false}>
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
