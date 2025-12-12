import type { ThemeConfig } from "../types"

export const angkorPixelThemeConfig: ThemeConfig = {
	header: {
		container:
			"h-14 sm:h-16 flex-shrink-0 flex items-center justify-between px-4 sm:px-8 bg-[#3a2a1a] border-b-4 border-[#8b7355] shadow-lg z-10",
		logo: {
			title: "flex gap-1 text-xl angkor-title tracking-tight family-pixel",
			subtitle:
				"text-[10px] text-[#d4af37] font-medium -mt-0.5 hidden sm:block uppercase tracking-wider",
			svgIcon: "/assets/angkor-pixel/pixel-art/face-brown-spiky.png",
		},
		badge: "angkor-badge",
		nav: {
			link: "text-[#f5e6d3] hover:text-[#ffd700] transition-all font-bold uppercase tracking-wide hover:scale-105",
			kbd: "hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-[#d4af37] bg-[#2d4a3e] border-2 border-[#8b7355] rounded-md font-bold shadow-inner",
			kbdIcon: "/assets/angkor-pixel/buttons/btn-star.png",
		},
	},
	layout: {
		body: "theme-angkor_pixel",
		background: "angkor-pixel-bg",
		mobileBar: "angkor-pixel-mobile-bar",
	},
	table: {
		container: "angkor-pixel-card angkor-pixel-table overflow-hidden",
		header: "angkor-pixel-table-header bg-[#3a2a1a]",
		headerCell: "text-[#ffd700] font-bold uppercase text-xs tracking-wider bg-[#3a2a1a]",
		row: "angkor-pixel-table-row bg-[#1e3329]",
		cell: "text-[#f5e6d3] font-medium bg-[#1e3329]",
		mobileCard: "angkor-pixel-card bg-[#1a2f26]",
		detailsButton: "angkor-btn text-sm py-1 px-3",
	},
	actions: {
		aiFill: {
			id: "ai-fill",
			label: "Harvest",
			svgIcon: "/assets/angkor-pixel/buttons/btn-sq-home.png",
			className:
				"inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-foreground text-xs h-9 px-3 text-[#ffd700] bg-[#3a2a1a] hover:bg-[#4b3a2a] border-4 border-[#8b7355]",
			iconClassName: "w-5 h-5",
		},
		quickFill: {
			id: "quick-fill",
			label: "Craft",
			svgIcon: "/assets/angkor-pixel/buttons/btn-sq-tools.png",
			className:
				"inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-foreground text-xs h-9 px-3 text-[#ffd700] bg-[#3a2a1a] hover:bg-[#4b3a2a] border-4 border-[#8b7355]",
			iconClassName: "w-5 h-5",
		},
		clear: {
			id: "clear",
			label: "Destroy",
			svgIcon: "/assets/angkor-pixel/buttons/btn-x-brown.png",
			className:
				"inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-foreground text-xs h-9 px-3 text-[#ffd700] bg-[#3a2a1a] hover:bg-[#4b3a2a] border-4 border-[#8b7355]",
			iconClassName: "w-5 h-5",
		},
		refresh: {
			id: "refresh",
			label: "Explore",
			svgIcon: "/assets/angkor-pixel/buttons/btn-rd-info.png",
			className:
				"inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-foreground text-xs h-9 px-3 text-[#ffd700] bg-[#3a2a1a] hover:bg-[#4b3a2a] border-4 border-[#8b7355]",
			iconClassName: "w-5 h-5",
		},
		copy: {
			id: "copy",
			label: "Clone",
			svgIcon: "/assets/angkor-pixel/buttons/btn-sq-folder.png",
			className:
				"inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-foreground text-xs h-9 px-3 text-[#ffd700] bg-[#3a2a1a] hover:bg-[#4b3a2a] border-4 border-[#8b7355]",
			iconClassName: "w-5 h-5",
		},
		save: {
			id: "save",
			label: "Store",
			svgIcon: "/assets/angkor-pixel/buttons/btn-check-gold.png",
			className:
				"inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-foreground text-xs h-9 px-3 text-[#ffd700] bg-[#3a2a1a] hover:bg-[#4b3a2a] border-4 border-[#8b7355]",
			iconClassName: "w-5 h-5",
		},
		send: {
			id: "send",
			label: "Attack!",
			svgIcon: "/assets/angkor-pixel/buttons/btn-star.png",
			className:
				"inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-foreground text-xs h-9 px-4 text-[#ffd700] bg-[#3a2a1a] hover:bg-[#4b3a2a] border-4 border-[#8b7355] font-bold",
			iconClassName: "w-5 h-5",
		},
	},
	mobileActions: {
		aiFill: {
			id: "ai-fill",
			svgIcon: "/assets/angkor-pixel/buttons/btn-sq-home.png",
			className: "angkor-mobile-btn",
			iconColor: "",
		},
		quickFill: {
			id: "quick-fill",
			svgIcon: "/assets/angkor-pixel/buttons/btn-sq-tools.png",
			className: "angkor-mobile-btn",
			iconColor: "",
		},
		clear: {
			id: "clear",
			svgIcon: "/assets/angkor-pixel/buttons/btn-x-brown.png",
			className: "angkor-mobile-btn",
			iconColor: "",
		},
		save: {
			id: "save",
			svgIcon: "/assets/angkor-pixel/buttons/btn-check-gold.png",
			className: "angkor-mobile-btn",
			iconColor: "",
		},
		send: {
			id: "send",
			svgIcon: "/assets/angkor-pixel/buttons/btn-star.png",
			className: "angkor-mobile-btn angkor-mobile-btn-primary",
			iconColor: "",
		},
	},
}
