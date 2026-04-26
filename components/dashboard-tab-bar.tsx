"use client"

import { cn } from "@/lib/utils"
import type { DashboardTab, Theme } from "@/lib/types"

interface DashboardTabBarProps {
	activeTab: DashboardTab
	onTabChange: (tab: DashboardTab) => void
	pendingCount: number
	releaseDateCount: number
	theme: Theme
}

interface TabConfig {
	id: DashboardTab
	label: string
	count: number
}

const getTabButtonClassName = (theme: Theme, isActive: boolean) => {
	if (theme === "sakura") {
		return isActive
			? "bg-white/80 text-rose-500 border border-b-0 border-rose-200 shadow-[0_-8px_24px_rgba(244,114,182,0.08)]"
			: "bg-white/45 text-rose-300 hover:text-rose-500 hover:bg-white/70 border border-transparent"
	}

	if (theme === "coding") {
		return isActive ? "bg-zinc-800 text-green-400" : "text-zinc-500 hover:text-zinc-400"
	}

	return isActive
		? "bg-white/15 text-white"
		: "bg-white/5 text-white/50 hover:text-white/70 hover:bg-white/8"
}

const getTabCountClassName = (theme: Theme, isActive: boolean) => {
	if (theme === "sakura") {
		return isActive ? "bg-rose-100 text-rose-500" : "bg-rose-50/80 text-rose-300"
	}

	if (theme === "coding") {
		return isActive ? "bg-green-500/20 text-green-400" : "bg-zinc-700 text-zinc-500"
	}

	return isActive ? "bg-white/20 text-white" : "bg-white/10 text-white/40"
}

export function DashboardTabBar({
	activeTab,
	onTabChange,
	pendingCount,
	releaseDateCount,
	theme,
}: DashboardTabBarProps) {
	const tabs: TabConfig[] = [
		{ id: "pending", label: "Pending", count: pendingCount },
		{ id: "release-date", label: "Release Date", count: releaseDateCount },
	]

	return (
		<div className="relative z-10 px-4 sm:px-6 pt-2">
			<div className="flex gap-1">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						onClick={() => onTabChange(tab.id)}
						className={cn(
							"px-4 py-1.5 text-xs font-medium rounded-t-md transition-colors",
							getTabButtonClassName(theme, activeTab === tab.id),
						)}
					>
						{tab.label}
						<span className={cn(
							"ml-1.5 px-1.5 py-0.5 text-[10px] rounded-full",
							getTabCountClassName(theme, activeTab === tab.id),
						)}>
							{tab.count}
						</span>
					</button>
				))}
			</div>
		</div>
	)
}
