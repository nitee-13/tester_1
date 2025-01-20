"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import Link from "next/link"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

type NavItemType = {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  isSelected?: boolean
  items?:{
    title: string
    url: string 
    isSelected?: boolean
    onClick?: () => void
  }[]
}

export function NavMain({
  items,
}: {
  items: NavItemType[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            {item.items ? (
              // Render as collapsible if it has sub-items
              <Collapsible
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <div>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}
                    isActive={item.isActive}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton 
                          isActive={subItem.isSelected}
                          
                          asChild
                          className={subItem.isSelected ? "bg-accent" : ""}
                          onClick={subItem.onClick}
                          >
                            {subItem.onClick ? (
                              <button className="w-full h-full">
                                <span>{subItem.title}</span>
                              </button>
                            ):(
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                            )}
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ) : (
              // Render as direct link if no sub-items
              <Link href={item.url}>
                <SidebarMenuButton tooltip={item.title}
                isActive={item.isActive}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
