"use client"

import Link from "next/link"
import { ThemeSelector } from "@/components/theme/theme-selector"
import { getHeaderConfig, getHeaderNavItems, getKbdIcon } from "@/lib/theme"
import { SvgIcon } from "./svg-icon"
import type { DashboardHeaderProps } from "./types"

export const CodingHeader = ({ theme }: DashboardHeaderProps) => {
	const config = getHeaderConfig(theme)
	const navItems = getHeaderNavItems(theme)
	const kbdConfig = getKbdIcon(theme)

	return (
		<header className={config.container}>
			<div className="flex items-center gap-4">
				<div className="flex items-center gap-3 group cursor-pointer">
					<div className={config.logo.wrapper}>
						{config.logo.svgIcon && <SvgIcon src={config.logo.svgIcon} className="w-5 h-5" />}
					</div>
					<div className="flex flex-col">
						<span className={config.logo.title}>
							Dev<span className="text-indigo-500">Handover</span>
							<span className="text-indigo-500 animate-pulse">_</span>
						</span>
					</div>
				</div>
				<span className={config.badge}>
					<SvgIcon src="/icons/coding/git-branch.svg" className="w-3 h-3" />
					v2024.1.0
				</span>
				<div className="hidden sm:flex items-center gap-2">
					<SvgIcon src="/icons/coding/commit.svg" className="opacity-50" />
					<SvgIcon src="/icons/coding/database.svg" className="opacity-50" />
					<SvgIcon src="/icons/coding/server.svg" className="opacity-50" />
				</div>
			</div>

			<nav className="flex items-center gap-6" aria-label="Main navigation">
				<ThemeSelector variant={theme} />
				{navItems.map((item) => (
					<Link key={item.href} href={item.href} className={config.nav.link} aria-label={item.label}>
						{item.svgIcon && <SvgIcon src={item.svgIcon} />}
						<span className="hidden sm:inline">{item.label}</span>
					</Link>
				))}
				<kbd className={config.nav.kbd} aria-label="Press Command + K for quick actions">
					{kbdConfig.svgIcon && <SvgIcon src={kbdConfig.svgIcon} className="w-4 h-4 opacity-50" />}
				</kbd>
			</nav>
		</header>
	)
}
