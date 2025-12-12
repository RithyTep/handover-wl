import { Trash2, Save, Send, Sword, Shield, Hammer } from "lucide-react"
import type { ThemeConfig } from "../types"

export const clashThemeConfig: ThemeConfig = {
	header: {
		container:
			"h-14 sm:h-16 flex-shrink-0 flex items-center justify-between px-4 sm:px-8 border-b-4 border-[#6a5a4a] bg-gradient-to-b from-[#4a3a2a] to-[#3f2e21] backdrop-blur-sm z-10 shadow-lg",
		logo: {
			title: "text-xl clash-title tracking-tight",
			subtitle:
				"text-[10px] text-[#daa520] font-medium -mt-0.5 hidden sm:block uppercase tracking-wider",
			svgIcon: "/icons/clash/castle.svg",
		},
		badge: "clash-badge",
		nav: {
			link: "text-white hover:text-[#fbcc14] transition-all font-bold uppercase tracking-wide hover:scale-105",
			kbd: "hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-[#fbcc14] bg-[#2a1f16] border-2 border-[#6a5a4a] rounded-md font-bold shadow-inner",
			kbdIcon: "/icons/clash/star.svg",
		},
	},
	layout: {
		body: "theme-clash",
		background: "clash-bg",
		mobileBar: "bg-gradient-to-b from-[#4a3a2a] to-[#3f2e21] border-t-4 border-[#6a5a4a]",
	},
	table: {
		container: "clash-card overflow-hidden",
		header: "clash-table-header",
		headerCell: "text-[#fbcc14] font-bold uppercase text-xs tracking-wider",
		row: "clash-table-row",
		cell: "text-white font-medium",
		mobileCard: "clash-card",
		detailsButton: "clash-btn-wood text-sm py-1 px-3",
	},
	actions: {
		aiFill: {
			id: "ai-fill",
			label: "Raid",
			svgIcon: "/icons/clash/attack-btn.svg",
			className: "h-10 px-5 clash-btn-primary",
			iconClassName: "w-5 h-5",
		},
		quickFill: {
			id: "quick-fill",
			label: "Train",
			svgIcon: "/icons/clash/army-btn.svg",
			className: "h-10 px-5 clash-btn-primary",
			iconClassName: "w-5 h-5",
		},
		clear: {
			id: "clear",
			label: "Destroy",
			svgIcon: "/icons/clash/hammer.svg",
			className: "h-10 px-5 clash-btn-primary",
			iconClassName: "w-5 h-5",
		},
		refresh: {
			id: "refresh",
			label: "Scout",
			svgIcon: "/icons/clash/clan-btn.svg",
			className: "h-10 px-5 clash-btn-primary",
			iconClassName: "w-5 h-5",
		},
		copy: {
			id: "copy",
			label: "Clone",
			svgIcon: "/icons/clash/elixir.svg",
			className: "h-10 px-5 clash-btn-primary",
			iconClassName: "w-5 h-5",
		},
		save: {
			id: "save",
			label: "Build",
			svgIcon: "/icons/clash/shop-btn.svg",
			className: "h-10 px-5 clash-btn-primary",
			iconClassName: "w-5 h-5",
		},
		send: {
			id: "send",
			label: "Attack!",
			svgIcon: "/icons/clash/attack-btn.svg",
			className: "h-10 px-6 clash-btn-primary",
			iconClassName: "w-5 h-5",
		},
	},
	mobileActions: {
		aiFill: {
			id: "ai-fill",
			icon: Sword,
			className: "clash-btn-primary !p-3 !rounded-xl !mb-0",
			iconColor: "text-white",
		},
		quickFill: {
			id: "quick-fill",
			icon: Hammer,
			className: "clash-btn-primary !p-3 !rounded-xl !mb-0",
			iconColor: "text-white",
		},
		clear: {
			id: "clear",
			icon: Trash2,
			className: "clash-btn-primary !p-3 !rounded-xl !mb-0",
			iconColor: "text-white",
		},
		save: {
			id: "save",
			icon: Shield,
			className: "clash-btn-primary !p-3 !rounded-xl !mb-0",
			iconColor: "text-white",
		},
		send: {
			id: "send",
			icon: Send,
			className: "clash-btn-primary !p-3 !rounded-xl !mb-0",
			iconColor: "text-white",
		},
	},
}
