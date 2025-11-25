"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ClipboardList, Trophy } from "lucide-react";

export function Navigation() {
  const pathname = usePathname();

  const links = [
    {
      href: "/",
      label: "Handover",
      icon: ClipboardList,
      active: pathname === "/",
    },
    {
      href: "/achievements",
      label: "Achievements",
      icon: Trophy,
      active: pathname === "/achievements",
    },
  ];

  return (
    <nav className="flex items-center gap-1">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
              link.active
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
