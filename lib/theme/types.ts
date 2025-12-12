import type { LucideIcon } from "lucide-react"

export interface ThemeHeaderConfig {
	container: string
	logo: {
		wrapper?: string
		icon?: string
		svgIcon?: string
		title: string
		titleGradient?: string
		subtitle?: string
	}
	badge: string
	nav: {
		link: string
		kbd: string
		kbdIcon?: string
	}
}

export interface ThemeActionButton {
	id: string
	label: string
	svgIcon?: string
	icon?: LucideIcon
	className: string
	iconClassName?: string
}

export interface ThemeMobileAction {
	id: string
	icon?: LucideIcon
	svgIcon?: string
	className: string
	iconColor: string
}

export interface ThemeLayoutConfig {
	body: string
	background: string
	mobileBar: string
}

export interface ThemeTableConfig {
	container: string
	header: string
	headerCell: string
	row: string
	cell: string
	mobileCard: string
	detailsButton: string
}

export interface ThemeConfig {
	header: ThemeHeaderConfig
	layout: ThemeLayoutConfig
	table: ThemeTableConfig
	actions: {
		aiFill: ThemeActionButton
		quickFill: ThemeActionButton
		clear: ThemeActionButton
		refresh: ThemeActionButton
		copy: ThemeActionButton
		save: ThemeActionButton
		send: ThemeActionButton
	}
	mobileActions: {
		aiFill: ThemeMobileAction
		quickFill: ThemeMobileAction
		clear: ThemeMobileAction
		save: ThemeMobileAction
		send: ThemeMobileAction
	}
}

export interface HeaderNavItem {
	href: string
	label: string
	svgIcon?: string
	icon?: LucideIcon
}
