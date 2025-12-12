/**
 * Theme Configuration Types
 *
 * Shared types for all theme configurations.
 */

import type { LucideIcon } from "lucide-react"

// ============================================================================
// Header Configuration Types
// ============================================================================

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

// ============================================================================
// Action Button Types
// ============================================================================

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

// ============================================================================
// Layout & Table Types
// ============================================================================

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

// ============================================================================
// Main Theme Config Type
// ============================================================================

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

// ============================================================================
// Navigation Types
// ============================================================================

export interface HeaderNavItem {
	href: string
	label: string
	svgIcon?: string
	icon?: LucideIcon
}
