"use client";

import { useState } from "react";
import { ClipboardList, Settings, Clock, History, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function Sidebar({ activeTab = "tickets", onTabChange, onCollapsedChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapsedChange = (newCollapsed: boolean) => {
    setCollapsed(newCollapsed);
    onCollapsedChange?.(newCollapsed);
  };

  const navItems = [
    { id: "tickets", icon: ClipboardList, label: "Tickets" },
    { id: "scheduler", icon: Clock, label: "Scheduler" },
    { id: "history", icon: History, label: "History" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav
      className={cn(
        "fixed left-0 top-0 h-screen bg-background border-r border-border flex flex-col transition-all duration-180 ease-out z-40",
        collapsed ? "w-14" : "w-56"
      )}
    >
      {/* Logo/Brand */}
      <div className={cn(
        "h-[52px] border-b border-border flex items-center",
        collapsed ? "justify-center px-2" : "px-4"
      )}>
        {!collapsed && (
          <h1 className="text-sm font-semibold text-foreground tracking-tight">
            Handover
          </h1>
        )}
        {collapsed && (
          <div className="w-6 h-6 bg-foreground rounded flex items-center justify-center">
            <span className="text-[10px] font-bold text-background">H</span>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeTab;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange?.(item.id)}
              className={cn(
                "flex items-center w-full rounded-md text-sm transition-colors duration-150",
                collapsed ? "px-2 py-2 justify-center" : "px-3 py-2 space-x-3",
                isActive
                  ? "bg-muted text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </div>

      {/* Collapse Toggle */}
      <div className="border-t border-border p-2">
        <button
          onClick={() => handleCollapsedChange(!collapsed)}
          className={cn(
            "flex items-center w-full rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-150",
            collapsed ? "px-2 py-2 justify-center" : "px-3 py-2 space-x-3"
          )}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </nav>
  );
}
