"use client"
import * as React from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  Users, // Added icon for member management
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: SquareTerminal,
      isActive: false, // will be updated based on the route
    },
    {
      title: "Member Management",
      url: "/admin/member_management",
      icon: Users,
      items: [
        { title: "Add New Member", url: "/admin/member_management/add" },
        { title: "Expiry Notification", url: "/admin/member_management/expiry" },
        { title: "Renew Members", url: "/admin/member_management/renew" },
      ],
      isActive: false, // will be updated based on the route
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        { title: "General", url: "#" },
        { title: "Team", url: "#" },
        { title: "Billing", url: "#" },
        { title: "Limits", url: "#" },
      ],
    },
  ],
  navSecondary: [
    { title: "Support", url: "#", icon: LifeBuoy },
    { title: "Feedback", url: "#", icon: Send },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Get the current pathname
  const pathname = usePathname();

  // Determine active states for routes
  const isDashboardActive = pathname.startsWith("/admin/dashboard");
  const isMemberManagementActive = pathname.startsWith("/admin/member-management");

  // Update navMain items to reflect active states
  const navMain = data.navMain.map((item) => {
    if (item.title === "Dashboard") {
      return { ...item, isActive: isDashboardActive };
    } else if (item.title === "Member Management") {
      return { ...item, isActive: isMemberManagementActive };
    }
    return item;
  });

  return (
    <Sidebar
      className="top-[--header-height] !h-[calc(100svh-var(--header-height))]"
      {...props}
    >

        <div className="flex flex-col items-center py-6">
          {/* Optimized logo image from the public folder */}
          <div className="relative h-24 w-24">
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              sizes="(max-width: 768px) 100vw, 24rem"
              className="rounded-lg object-contain"
            />
          </div>
          {/* Branding text */}
          <div className="mt-4 text-center">
            <span className="block text-2xl font-bold">Club 7</span>
            <span className="block text-xl">Admin</span>
          </div>
        </div>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
