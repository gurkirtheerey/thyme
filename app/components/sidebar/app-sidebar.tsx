import {
  Calendar,
  ChevronUp,
  Home,
  Settings,
  User2,
  Users,
  UserRound,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import AppSidebarSignout from "./app-sidebar-signout";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { user } from "@/db/schema";
import Link from "next/link";
// Menu items.
const PROVIDER_ITEMS = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Clients",
    url: "/clients",
    icon: Users,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

const CLIENT_ITEMS = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
];

export async function AppSidebar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  const user2 = await db.query.user.findFirst({
    where: eq(user.email, session.user.email),
  });

  if (!user2) {
    return null;
  }

  const items = user2.role === "provider" ? PROVIDER_ITEMS : CLIENT_ITEMS;

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Thyme</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="w-full">
                <SidebarMenuButton className="w-full">
                  <User2 /> {session.user.email}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[220px]">
                <Link href="/profile">
                  <DropdownMenuItem>
                    <UserRound />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <AppSidebarSignout />
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
