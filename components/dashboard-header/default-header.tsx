"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeSelector } from "@/components/theme/theme-selector"
import { getHeaderConfig, getHeaderNavItems, getKbdIcon } from "@/lib/theme"
import type { DashboardHeaderProps } from "./types"

export const DefaultHeader = ({ theme, ticketCount }: DashboardHeaderProps) => {
	const config = getHeaderConfig(theme)
	const navItems = getHeaderNavItems(theme)
	const kbdConfig = getKbdIcon(theme)

	return (
		<header className={config.container}>
			<div className="flex items-center gap-6">
				<div className="flex items-center gap-3">
					<div className="flex flex-col">
						<h1 className={config.logo.title}>Handover</h1>
						{config.logo.subtitle && <span className={config.logo.subtitle}>Task Management</span>}
					</div>
				</div>
				<div className="hidden sm:flex items-center gap-2">
					<span className="h-5 w-px bg-slate-700" aria-hidden="true" />
					<span className={config.badge}>{ticketCount} tickets</span>
				</div>
			</div>

			<nav className="flex items-center gap-2" aria-label="Main navigation">
				<ThemeSelector variant={theme} />
				{navItems.map((item) => (
					<Link key={item.href} href={item.href}>
						<Button variant="ghost" size="sm" className={config.nav.link} aria-label={item.label}>
							{item.icon && <item.icon className="w-4 h-4 mr-1.5" aria-hidden="true" />}
							<span className="hidden sm:inline">{item.label}</span>
						</Button>
					</Link>
				))}
				<kbd className={config.nav.kbd} aria-label="Press Command + K for quick actions">
					{kbdConfig.icon && <kbdConfig.icon className="w-3 h-3" aria-hidden="true" />}
					<span>K</span>
				</kbd>
			</nav>
		</header>
	)
}
