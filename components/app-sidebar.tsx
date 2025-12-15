"use client"

import * as React from "react"
import {
  BarChart3,
  Building2,
  CheckSquare,
  Home,
  PieChart,
  Settings,
  Target,
  Users,
  Zap,
  FileText,
  Briefcase,
  User,
  Handshake,
  ClipboardList,
  DollarSign,
  Receipt,
} from "lucide-react"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

// Define the base menu items (Default Dashboard Options)
const defaultMenuItems = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
      },
      {
        title: "Analytics",
        url: "/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Core CRM",
    items: [
      {
        title: "Tasks",
        url: "/tasks",
        icon: CheckSquare,
      },
      {
        title: "Notes",
        url: "/notes",
        icon: FileText,
      },
      {
        title: "Reports",
        url: "/reports",
        icon: PieChart,
      },
      {
        title: "Companies",
        url: "/companies",
        icon: Building2,
      },
      {
        title: "People",
        url: "/contacts",
        icon: Users,
      },
    ],
  },
]

// Define additional menu items based on purpose
const purposeSpecificMenuItems: Record<string, (typeof defaultMenuItems)[0]["items"]> = {
  sales: [
    { title: "Workspaces", url: "/workspaces", icon: Briefcase },
    { title: "Users", url: "/users", icon: User },
    { title: "Deals", url: "/deals", icon: Target },
    { title: "Quote", url: "/quote", icon: Receipt }, // Added Quote to sales menu
  ],
  "customer-success": [{ title: "Customer Success", url: "/customer-success", icon: Handshake }],
  recruiting: [{ title: "Recruiting", url: "/recruiting", icon: ClipboardList }],
  investing: [{ title: "Startup Fundraising", url: "/startup-fundraising", icon: DollarSign }],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const [userPurpose, setUserPurpose] = React.useState<string | null>(null)
  const [companyName, setCompanyName] = React.useState<string | null>(null)
  const [companyLogoUrl, setCompanyLogoUrl] = React.useState<string | null>(null)

  React.useEffect(() => {
    // Retrieve user purpose from local storage
    setUserPurpose(localStorage.getItem("userPurpose"))
    setCompanyName(localStorage.getItem("companyName"))
    setCompanyLogoUrl(localStorage.getItem("companyLogoUrl"))
  }, [])

  // Combine default and purpose-specific menu items
  const combinedMenuItems = React.useMemo(() => {
    const purposeItems = userPurpose ? purposeSpecificMenuItems[userPurpose] || [] : []
    const salesGroup = defaultMenuItems.find((group) => group.title === "Sales")
    if (salesGroup) {
      return defaultMenuItems.map((group) =>
        group.title === "Sales" ? { ...group, items: [...group.items, ...purposeItems] } : group,
      )
    } else {
      return [
        ...defaultMenuItems,
        {
          title: userPurpose ? userPurpose.charAt(0).toUpperCase() + userPurpose.slice(1) : "Additional",
          items: purposeItems,
        },
      ]
    }
  }, [userPurpose])

  return (
    <Sidebar collapsible="icon" className="border-r bg-background z-40" variant="sidebar" {...props}>
      <SidebarHeader className="border-b bg-background">
        <div className="flex items-center gap-2 px-2 py-3">
          {companyLogoUrl ? (
            <img
              src={companyLogoUrl || "/placeholder.svg"}
              alt="Company Logo"
              className="h-8 w-8 rounded-lg object-contain flex-shrink-0"
            />
          ) : (
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">CC</span>
            </div>
          )}
          <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
            <span className="truncate font-semibold">{companyName || "CatchClients"}</span>
            <span className="truncate text-xs text-muted-foreground">by Catch22Digital</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2 bg-background">
        {combinedMenuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      className="w-full justify-start hover:bg-accent hover:text-accent-foreground"
                      tooltip={item.title}
                    >
                      <a href={item.url} className="flex items-center gap-3 px-3 py-2 text-sm font-medium">
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t p-2 bg-background">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="w-full justify-start hover:bg-accent hover:text-accent-foreground"
              tooltip="Settings"
            >
              <a href="/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium">
                <Settings className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">Settings</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="p-2">
          <Button className="w-full" size="sm">
            <Zap className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="truncate">Upgrade Plan</span>
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
