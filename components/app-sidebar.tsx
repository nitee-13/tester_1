"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  FileText,
  LucideIcon,
} from "lucide-react"
import {ModeToggle} from "@/components/toggle-mode"
import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import { useSources } from "@/context/SourcesContext"

//Devinf NavType 
type NavType = {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}
// This is sample data.
const data = {
  user: {
    name: "Niteeq",
    email: "nit.sheik@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {      
      title: "Chat",
      url: "/chat",
      icon: Bot,
    },
    {      
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "/chat",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}
// Function to create the sources navigation item
const createSourcesNavItem = (sources: any[]) => ({
  title: "Sources",
  url: "#",
  icon: FileText,
  isActive: true,
  items: sources.map(source => ({
    title: source.name,
    url: "#",
  }))
})

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { sources } = useSources()
  React.useEffect(() => {
    console.log("[AppSidebar] sources", sources)
  }, [sources])
    // Create a combined navigation array with Chat, Sources, and other items
  const combinedNavItems = React.useMemo(() => {
  const chatItem = data.navMain.find(item => item.title === "Chat") // Get the Chat item
  const otherItems = data.navMain.filter(item => item.title !== "Chat")
  const sourcesItem = createSourcesNavItem(sources);
  console.log("[AppSidebar] combinedNavItems", [chatItem, sourcesItem, ...otherItems])
    
  return chatItem ? [chatItem, sourcesItem, ...otherItems] : [sourcesItem, ...otherItems]
  }, [sources]) // Recreate when sources change
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams}   />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={combinedNavItems} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
      <ModeToggle /> 
    </Sidebar>
  )
}
