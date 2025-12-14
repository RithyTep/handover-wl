"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeSelector } from "@/components/theme/theme-selector"
import { cn } from "@/lib/utils"
import { getHeaderConfig, getHeaderNavItems, getKbdIcon } from "@/lib/theme"
import { SvgIcon } from "./svg-icon"
import type { DashboardHeaderProps } from "./types"

export const StandardHeader = ({ theme, ticketCount }: DashboardHeaderProps) => {
	const config = getHeaderConfig(theme)
	const navItems = getHeaderNavItems(theme)
	const kbdConfig = getKbdIcon(theme)
	const hasSvgLogo = Boolean(config.logo.svgIcon)

	return (
		<header className={config.container}>
			<div className="flex items-center gap-4">
				<div className="flex items-center gap-2">
					<h1 className={config.logo.title}>
						{hasSvgLogo && config.logo.svgIcon && (
							<SvgIcon
								src={config.logo.svgIcon}
								className={cn("w-7 h-7 opacity-80", theme === "lunar" && "w-6 h-8")}
							/>
						)}
						{config.logo.titleGradient ? (
							<span className={config.logo.titleGradient}>Handover</span>
						) : (
							<span className="family-pixel">Handover</span>
						)}
					</h1>
				</div>
				{config.logo.subtitle && <span className={config.logo.subtitle}>Task Management</span>}
				<span className={config.badge}>
					{ticketCount}
					{theme === "default" && " tickets"}
				</span>
			</div>

			<nav className="flex items-center gap-1" aria-label="Main navigation">
				<ThemeSelector variant={theme} />
				{navItems.map((item) => (
					<Link key={item.href} href={item.href}>
						<Button variant="ghost" size="sm" className={config.nav.link} aria-label={item.label}>
							{item.svgIcon && <SvgIcon src={item.svgIcon} />}
							{item.icon && <item.icon className="w-4 h-4 mr-1.5" aria-hidden="true" />}
							<span className="hidden sm:inline">{item.label}</span>
						</Button>
					</Link>
				))}
				<kbd className={config.nav.kbd} aria-label="Press Command + K for quick actions">
					{kbdConfig.svgIcon && <SvgIcon src={kbdConfig.svgIcon} className="w-3 h-3" />}
					{kbdConfig.icon && <kbdConfig.icon className="w-3 h-3" aria-hidden="true" />}
					<span>K</span>
				</kbd>
			</nav>
		</header>
	)
}
