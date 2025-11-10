"use client";

import { ClipboardList, Settings, BarChart3 } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

interface SidebarProps {
  activeTab?: string;
}

export function Sidebar({ activeTab = "tickets" }: SidebarProps) {
  const navItems = [
    { id: "tickets", icon: ClipboardList, label: "Tickets" },
    { id: "analytics", icon: BarChart3, label: "Analytics" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="fixed left-0 top-0 h-screen w-64 bg-background border-r border-border flex flex-col">
      {/* Logo/Brand */}
      <div className="px-4 py-5 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-base font-semibold text-foreground">Jira Handover</h1>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeTab;

          return (
            <button
              key={item.id}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all w-full ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-400 font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Theme Toggle */}
        <div className="pt-2">
          <ThemeToggle />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-border">
        {/* User Profile Card */}
        <div className="p-3">
          <div className="flex items-center space-x-3 p-2 rounded-lg bg-muted">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-white">RT</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">User</p>
              <p className="text-xs text-muted-foreground truncate">user@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
