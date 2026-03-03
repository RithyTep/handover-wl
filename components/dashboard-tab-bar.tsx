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
							activeTab === tab.id
								? "bg-white/15 text-white"
								: "bg-white/5 text-white/50 hover:text-white/70 hover:bg-white/8",
							theme === "coding" && activeTab === tab.id && "bg-zinc-800 text-green-400",
							theme === "coding" && activeTab !== tab.id && "text-zinc-500 hover:text-zinc-400",
						)}
					>
						{tab.label}
						<span className={cn(
							"ml-1.5 px-1.5 py-0.5 text-[10px] rounded-full",
							activeTab === tab.id
								? "bg-white/20 text-white"
								: "bg-white/10 text-white/40",
							theme === "coding" && activeTab === tab.id && "bg-green-500/20 text-green-400",
							theme === "coding" && activeTab !== tab.id && "bg-zinc-700 text-zinc-500",
						)}>
							{tab.count}
						</span>
					</button>
				))}
			</div>
		</div>
	)
}
