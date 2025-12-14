"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeSelector } from "@/components/theme/theme-selector"
import { getHeaderConfig, getHeaderNavItems, getKbdIcon } from "@/lib/theme"
import { SvgIcon } from "./svg-icon"
import type { DashboardHeaderProps } from "./types"

export const ClashHeader = ({ theme, ticketCount }: DashboardHeaderProps) => {
	const config = getHeaderConfig(theme)
	const navItems = getHeaderNavItems(theme)
	const kbdConfig = getKbdIcon(theme)

	return (
		<header className={config.container}>
			<div className="flex items-center gap-2 sm:gap-4">
				<div className="flex items-center gap-2 sm:gap-3">
					<img
						src="/assets/clash/emblem.png"
						alt="Clash of Clans"
						className="h-10 sm:h-12 w-auto drop-shadow-lg"
						style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }}
					/>
					<h1
						className="text-lg sm:text-2xl font-bold uppercase tracking-wide"
						style={{
							color: "#fbcc14",
							textShadow:
								"-2px -2px 0 #582e00, 2px -2px 0 #582e00, -2px 2px 0 #582e00, 2px 2px 0 #582e00, 0 3px 0 #3a1a00",
							fontFamily: "'Bungee', 'Supercell Magic', sans-serif",
						}}
					>
						Handover
					</h1>
				</div>
				<div className="flex items-center gap-1.5 clash-badge">
					<Image src="/icons/clash/gold-coin.svg" alt="" width={16} height={16} className="w-4 h-4" />
					<span>{ticketCount}</span>
				</div>
			</div>

			<nav className="flex items-center gap-1 sm:gap-2" aria-label="Main navigation">
				<ThemeSelector variant={theme} />
				{navItems.map((item) => (
					<Link key={item.href} href={item.href}>
						<Button
							variant="ghost"
							size="sm"
							className="clash-btn-wood !py-1 !px-2 sm:!px-3 !h-8 !text-xs !mb-0"
							aria-label={item.label}
						>
							{item.svgIcon && <SvgIcon src={item.svgIcon} className="w-4 h-4" />}
							<span className="hidden sm:inline ml-1">{item.label}</span>
						</Button>
					</Link>
				))}
				<kbd
					className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-[#fbcc14] bg-[#2a1f16] border-2 border-[#6a5a4a] rounded-md font-bold"
					aria-label="Press Command + K for quick actions"
				>
					{kbdConfig.svgIcon && <SvgIcon src={kbdConfig.svgIcon} className="w-3 h-3" />}
					<span>K</span>
				</kbd>
			</nav>
		</header>
	)
}
