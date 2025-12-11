"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeSelector } from "@/components/theme/theme-selector"
import { cn } from "@/lib/utils"
import { getHeaderConfig, getHeaderNavItems, getKbdIcon } from "@/lib/theme"
import type { Theme } from "@/lib/types"

// ============================================================================
// Types
// ============================================================================

interface DashboardHeaderProps {
	theme: Theme
	ticketCount: number
}

interface SvgIconProps {
	src: string
	className?: string
	alt?: string
}

// ============================================================================
// Helper Components
// ============================================================================

const SvgIcon = ({ src, className, alt = "" }: SvgIconProps) => (
	<img src={src} alt={alt} className={cn("w-4 h-4", className)} aria-hidden="true" />
)

// ============================================================================
// Coding Theme Header (Special Layout)
// ============================================================================

const CodingHeader = ({ theme, ticketCount }: DashboardHeaderProps) => {
	const config = getHeaderConfig(theme)
	const navItems = getHeaderNavItems(theme)
	const kbdConfig = getKbdIcon(theme)

	return (
		<header className={config.container}>
			<div className="flex items-center gap-4">
				<div className="flex items-center gap-3 group cursor-pointer">
					<div className={config.logo.wrapper}>
						{config.logo.svgIcon && (
							<SvgIcon src={config.logo.svgIcon} className="w-5 h-5" />
						)}
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
					<Link
						key={item.href}
						href={item.href}
						className={config.nav.link}
						tabIndex={0}
						aria-label={item.label}
					>
						{item.svgIcon && <SvgIcon src={item.svgIcon} />}
						<span className="hidden sm:inline">{item.label}</span>
					</Link>
				))}
				<kbd className={config.nav.kbd} aria-label="Press Command + K for quick actions">
					{kbdConfig.svgIcon && (
						<SvgIcon src={kbdConfig.svgIcon} className="w-4 h-4 opacity-50" />
					)}
				</kbd>
			</nav>
		</header>
	)
}

// ============================================================================
// Clash Theme Header (Clash of Clans Style)
// ============================================================================

const ClashHeader = ({ theme, ticketCount }: DashboardHeaderProps) => {
	const config = getHeaderConfig(theme)
	const navItems = getHeaderNavItems(theme)
	const kbdConfig = getKbdIcon(theme)

	return (
		<header className={config.container}>
			{/* Left side - Logo and badge */}
			<div className="flex items-center gap-2 sm:gap-4">
				{/* Clash of Clans Emblem + Handover Title */}
				<div className="flex items-center gap-2 sm:gap-3">
					<img
						src="/assets/clash/emblem.png"
						alt="Clash of Clans"
						className="h-10 sm:h-12 w-auto drop-shadow-lg"
						style={{
							filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
						}}
					/>
					<h1
						className="text-lg sm:text-2xl font-bold uppercase tracking-wide"
						style={{
							color: '#fbcc14',
							textShadow: '-2px -2px 0 #582e00, 2px -2px 0 #582e00, -2px 2px 0 #582e00, 2px 2px 0 #582e00, 0 3px 0 #3a1a00',
							fontFamily: "'Bungee', 'Supercell Magic', sans-serif",
						}}
					>
						Handover
					</h1>
				</div>
				{/* Badge with gold coin */}
				<div className="flex items-center gap-1.5 clash-badge">
					<img src="/icons/clash/gold-coin.svg" alt="" className="w-4 h-4" />
					<span>{ticketCount}</span>
				</div>
			</div>

			{/* Right side - Navigation */}
			<nav className="flex items-center gap-1 sm:gap-2" aria-label="Main navigation">
				<ThemeSelector variant={theme} />
				{navItems.map((item) => (
					<Link key={item.href} href={item.href}>
						<Button
							variant="ghost"
							size="sm"
							className="clash-btn-wood !py-1 !px-2 sm:!px-3 !h-8 !text-xs !mb-0"
							tabIndex={0}
							aria-label={item.label}
						>
							{item.svgIcon && <SvgIcon src={item.svgIcon} className="w-4 h-4" />}
							<span className="hidden sm:inline ml-1">{item.label}</span>
						</Button>
					</Link>
				))}
				<kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-[#fbcc14] bg-[#2a1f16] border-2 border-[#6a5a4a] rounded-md font-bold"
				     aria-label="Press Command + K for quick actions">
					{kbdConfig.svgIcon && (
						<SvgIcon src={kbdConfig.svgIcon} className="w-3 h-3" />
					)}
					<span>K</span>
				</kbd>
			</nav>
		</header>
	)
}

// ============================================================================
// Standard Theme Header
// ============================================================================

const StandardHeader = ({ theme, ticketCount }: DashboardHeaderProps) => {
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
								className={cn(
									"w-7 h-7 opacity-80",
									theme === "lunar" && "w-6 h-8"
								)}
							/>
						)}
						{config.logo.titleGradient ? (
							<span className={config.logo.titleGradient}>Handover</span>
						) : (
							<span className="family-pixel">Handover</span>
						)}
					</h1>
				</div>
				{config.logo.subtitle && (
					<span className={config.logo.subtitle}>Task Management</span>
				)}
				<span className={config.badge}>{ticketCount}{theme === "default" && " tickets"}</span>
			</div>

			<nav className="flex items-center gap-1" aria-label="Main navigation">
				<ThemeSelector variant={theme} />
				{navItems.map((item) => (
					<Link key={item.href} href={item.href}>
						<Button
							variant="ghost"
							size="sm"
							className={config.nav.link}
							tabIndex={0}
							aria-label={item.label}
						>
							{item.svgIcon && <SvgIcon src={item.svgIcon} />}
							{item.icon && <item.icon className="w-4 h-4 mr-1.5" aria-hidden="true" />}
							<span className="hidden sm:inline">{item.label}</span>
						</Button>
					</Link>
				))}
				<kbd className={config.nav.kbd} aria-label="Press Command + K for quick actions">
					{kbdConfig.svgIcon && (
						<SvgIcon src={kbdConfig.svgIcon} className="w-3 h-3" />
					)}
					{kbdConfig.icon && <kbdConfig.icon className="w-3 h-3" aria-hidden="true" />}
					<span>K</span>
				</kbd>
			</nav>
		</header>
	)
}

// ============================================================================
// Default Theme Header (Has different structure)
// ============================================================================

const DefaultHeader = ({ theme, ticketCount }: DashboardHeaderProps) => {
	const config = getHeaderConfig(theme)
	const navItems = getHeaderNavItems(theme)
	const kbdConfig = getKbdIcon(theme)

	return (
		<header className={config.container}>
			<div className="flex items-center gap-6">
				<div className="flex items-center gap-3">
					<div className="flex flex-col">
						<h1 className={config.logo.title}>Handover</h1>
						{config.logo.subtitle && (
							<span className={config.logo.subtitle}>Task Management</span>
						)}
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
						<Button
							variant="ghost"
							size="sm"
							className={config.nav.link}
							tabIndex={0}
							aria-label={item.label}
						>
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

// ============================================================================
// Main Export
// ============================================================================

export const DashboardHeader = ({ theme, ticketCount }: DashboardHeaderProps) => {
	if (theme === "coding") {
		return <CodingHeader theme={theme} ticketCount={ticketCount} />
	}

	if (theme === "clash") {
		return <ClashHeader theme={theme} ticketCount={ticketCount} />
	}

	if (theme === "default") {
		return <DefaultHeader theme={theme} ticketCount={ticketCount} />
	}

	return <StandardHeader theme={theme} ticketCount={ticketCount} />
}
