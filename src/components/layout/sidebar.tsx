'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PackageIcon, ListChecksIcon } from '@phosphor-icons/react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/products', label: 'Products', icon: PackageIcon },
  { href: '/orders', label: 'Orders', icon: ListChecksIcon },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-5">
        <div className="flex items-center gap-2.5">
          <div className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-lg shadow-sm">
            <PackageIcon size={17} weight="fill" />
          </div>
          <span className="font-heading text-base font-semibold tracking-tight">
            Revest Admin
          </span>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="px-2 pt-2">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {navItems.map(({ href, label, icon: Icon }) => {
                const active = pathname.startsWith(href)
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className={cn(
                        'h-9 gap-2.5 rounded-lg px-3 text-sm font-medium transition-all',
                        active
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                          : 'text-sidebar-foreground/70 hover:bg-muted/60 hover:text-sidebar-foreground',
                      )}
                    >
                      <Link href={href}>
                        <Icon
                          size={17}
                          weight={active ? 'fill' : 'regular'}
                          className={active ? 'text-sidebar-primary' : ''}
                        />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
