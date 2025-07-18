
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '../ui/sidebar';
import { Users, BarChart3, Calendar, UserPlus, Target, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

const coachNavItems = [
  { 
    to: '/coach/dashboard', 
    icon: BarChart3, 
    label: 'Dashboard', 
    description: 'Overview & analytics' 
  },
  { 
    to: '/coach/athletes', 
    icon: Users, 
    label: 'My Athletes', 
    description: 'Manage athletes' 
  },
  { 
    to: '/coach/planning', 
    icon: Calendar, 
    label: 'Training Plans', 
    description: 'Create workouts' 
  },
  { 
    to: '/coach/invite', 
    icon: UserPlus, 
    label: 'Invite Athletes', 
    description: 'Add new athletes' 
  }
];

const quickActions = [
  { 
    to: '/coach/planning?quick=endurance', 
    icon: Target, 
    label: 'Quick Endurance', 
    description: 'Create endurance session' 
  },
  { 
    to: '/coach/planning?quick=interval', 
    icon: Activity, 
    label: 'Quick Intervals', 
    description: 'Create interval session' 
  }
];

export function CoachSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary text-primary-foreground font-medium shadow-sm" 
      : "hover:bg-muted/50 transition-colors";

  return (
    <Sidebar variant="sidebar" className="border-r" collapsible="icon">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/db53a601-301d-4a59-b7e1-c69a1d7b8e76.png" 
              alt="Ayger Logo" 
              className="h-8 w-8 flex-shrink-0"
            />
            {!collapsed && (
              <div>
                <h2 className="font-bold text-ayger-navy">Ayger Coach</h2>
                <p className="text-xs text-muted-foreground">Training Platform</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 shrink-0"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <SidebarContent className="px-2">
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-xs font-medium text-foreground uppercase tracking-wide">
              Navigation
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {coachNavItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.to} 
                      end 
                      className={({ isActive }) => cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                        getNavCls({ isActive }),
                        collapsed && "justify-center px-2"
                      )}
                    >
                      <item.icon className={cn("h-5 w-5 flex-shrink-0", collapsed && "h-6 w-6")} />
                      {!collapsed && (
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{item.label}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {item.description}
                          </p>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <SidebarGroup className="mt-6">
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Quick Actions
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {quickActions.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.to}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors"
                      >
                        <item.icon className="h-4 w-4 text-secondary" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{item.label}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {item.description}
                          </p>
                        </div>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
