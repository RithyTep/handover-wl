import type { Theme } from "@/lib/types"
import type { LucideIcon } from "lucide-react"
import { MessageSquare, FileText, Command } from "lucide-react"

export type {
	ThemeConfig,
	ThemeHeaderConfig,
	ThemeLayoutConfig,
	ThemeTableConfig,
	ThemeActionButton,
	ThemeMobileAction,
} from "./types"

import { THEME_CONFIGS } from "./themes"
import type { ThemeConfig, ThemeHeaderConfig, ThemeLayoutConfig, ThemeTableConfig } from "./types"

export const getThemeConfig = (theme: Theme): ThemeConfig => {
	return THEME_CONFIGS[theme] ?? THEME_CONFIGS.default
}

export const getHeaderConfig = (theme: Theme): ThemeHeaderConfig => {
	return getThemeConfig(theme).header
}

export const getLayoutConfig = (theme: Theme): ThemeLayoutConfig => {
	return getThemeConfig(theme).layout
}

export const getTableConfig = (theme: Theme): ThemeTableConfig => {
	return getThemeConfig(theme).table
}

export const getActionsConfig = (theme: Theme) => {
	return getThemeConfig(theme).actions
}

export const getMobileActionsConfig = (theme: Theme) => {
	return getThemeConfig(theme).mobileActions
}

export interface HeaderNavItem {
	href: string
	label: string
	svgIcon?: string
	icon?: LucideIcon
}

export const getHeaderNavItems = (theme: Theme): HeaderNavItem[] => {
	if (theme === "coding") {
		return [
			{ href: "/feedback", label: "Issues", svgIcon: "/icons/coding/bug.svg" },
			{ href: "/changelog", label: "Branches", svgIcon: "/icons/coding/merge.svg" },
		]
	}
	if (theme === "pixel") {
		return [
			{ href: "/feedback", label: "Feedback", svgIcon: "/icons/pixel/ghost.svg" },
			{ href: "/changelog", label: "Changelog", svgIcon: "/icons/pixel/flag.svg" },
		]
	}
	if (theme === "lunar") {
		return [
			{ href: "/feedback", label: "Feedback", svgIcon: "/icons/lunar/fan.svg" },
			{ href: "/changelog", label: "Changelog", svgIcon: "/icons/lunar/drum.svg" },
		]
	}
	if (theme === "christmas") {
		return [
			{ href: "/feedback", label: "Feedback", svgIcon: "/icons/christmas/gift.svg" },
			{ href: "/changelog", label: "Changelog", svgIcon: "/icons/christmas/holly.svg" },
		]
	}
	if (theme === "clash") {
		return [
			{ href: "/feedback", label: "War Log", svgIcon: "/icons/clash/attack-btn.svg" },
			{ href: "/changelog", label: "News", svgIcon: "/icons/clash/clan-btn.svg" },
		]
	}
	return [
		{ href: "/feedback", label: "Feedback", icon: MessageSquare },
		{ href: "/changelog", label: "Changelog", icon: FileText },
	]
}

export const getKbdIcon = (theme: Theme): { icon?: LucideIcon; svgIcon?: string } => {
	const config = getHeaderConfig(theme)
	if (config.nav.kbdIcon) {
		return { svgIcon: config.nav.kbdIcon }
	}
	return { icon: Command }
}
