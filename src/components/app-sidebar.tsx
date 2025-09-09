import * as React from "react";
import {
  GalleryVerticalEnd,
  Home,
  Users,
  BookOpen,
  MessageCircle,
  Settings,
  BarChart3,
  Shield,
  Calendar,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "./components/profile/nav-user";

// Type definitions
interface NavigationSubItem {
  title: string;
  url: string;
}

interface NavigationItem {
  title: string;
  url: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  items?: NavigationSubItem[];
}

// Role-based navigation configuration
const roleBasedNavigation: Record<string, NavigationItem[]> = {
  admin: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "User Management",
      url: "#",
      icon: Users,
      items: [
        {
          title: "All Users",
          url: "/dashboard/users",
        },
        {
          title: "Students",
          url: "/dashboard/students",
        },
        {
          title: "Teachers",
          url: "/dashboard/teachers",
        },
        {
          title: "Roles & Permissions",
          url: "/dashboard/roles",
        },
      ],
    },
    {
      title: "School Management",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "School Settings",
          url: "/dashboard/school-settings",
        },
        {
          title: "Classes",
          url: "/dashboard/classes",
        },
        {
          title: "Curriculum",
          url: "/dashboard/curriculum",
        },
      ],
    },
    {
      title: "Reports & Analytics",
      url: "#",
      icon: BarChart3,
      items: [
        {
          title: "User Reports",
          url: "/dashboard/reports/users",
        },
        {
          title: "Mental Health Overview",
          url: "/dashboard/reports/mental-health",
        },
        {
          title: "System Usage",
          url: "/dashboard/reports/usage",
        },
      ],
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ],
  teacher: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Data Siswa",
      url: "/dashboard/data-siswa",
      icon: Users,
    }
  ],
  counselor: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Data Siswa",
      url: "/dashboard/data-siswa",
      icon: Users,
    },
    {
      title: "Curhatan Siswa",
      url: "/dashboard/curhatan-siswa",
      icon: MessageCircle,
    },
    {
      title: "Jadwal Konseling",
      url: "/dashboard/counseling-schedule",
      icon: Calendar,
    }
  ],
  head_teacher: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "School Overview",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "School Analytics",
          url: "/dashboard/school-analytics",
        },
        {
          title: "Performance Metrics",
          url: "/dashboard/performance",
        },
        {
          title: "Student Welfare",
          url: "/dashboard/student-welfare",
        },
      ],
    },
    {
      title: "Staff Management",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Teaching Staff",
          url: "/dashboard/teaching-staff",
        },
        {
          title: "Performance Reviews",
          url: "/dashboard/staff-reviews",
        },
        {
          title: "Professional Development",
          url: "/dashboard/staff-development",
        },
      ],
    },
    {
      title: "Academic Management",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Curriculum Oversight",
          url: "/dashboard/curriculum-oversight",
        },
        {
          title: "Assessment Results",
          url: "/dashboard/assessments",
        },
        {
          title: "Academic Standards",
          url: "/dashboard/standards",
        },
      ],
    },
    {
      title: "Reports",
      url: "/dashboard/head-teacher-reports",
      icon: BarChart3,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ],
  super: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Multi-School Management",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "All Schools",
          url: "/dashboard/schools",
        },
        {
          title: "School Performance",
          url: "/dashboard/school-performance",
        },
        {
          title: "Resource Allocation",
          url: "/dashboard/resources",
        },
      ],
    },
    {
      title: "Platform Administration",
      url: "#",
      icon: Shield,
      items: [
        {
          title: "System Settings",
          url: "/dashboard/system-settings",
        },
        {
          title: "Feature Management",
          url: "/dashboard/features",
        },
        {
          title: "Global Configurations",
          url: "/dashboard/global-config",
        },
      ],
    },
    {
      title: "User Administration",
      url: "#",
      icon: Users,
      items: [
        {
          title: "All Users",
          url: "/dashboard/all-users",
        },
        {
          title: "Role Management",
          url: "/dashboard/role-management",
        },
        {
          title: "Access Control",
          url: "/dashboard/access-control",
        },
      ],
    },
    {
      title: "Analytics & Reports",
      url: "#",
      icon: BarChart3,
      items: [
        {
          title: "Platform Analytics",
          url: "/dashboard/platform-analytics",
        },
        {
          title: "Usage Statistics",
          url: "/dashboard/usage-stats",
        },
        {
          title: "Performance Metrics",
          url: "/dashboard/performance-metrics",
        },
      ],
    },
    {
      title: "System Management",
      url: "/dashboard/system-management",
      icon: Settings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const userRole = user?.role || "admin";

  const navigation: NavigationItem[] =
    roleBasedNavigation[userRole as keyof typeof roleBasedNavigation] ||
    roleBasedNavigation.admin;

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Appiks</span>
                  <span className="">
                    {user?.role
                      ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(
                          1
                        )} Panel`
                      : "Dashboard"}
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="font-medium">
                      <Icon className="size-4" />
                      {item.title}
                    </a>
                  </SidebarMenuButton>
                  {item.items?.length ? (
                    <SidebarMenuSub>
                      {item.items.map((subItem: NavigationSubItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url}>{subItem.title}</a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  ) : null}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
