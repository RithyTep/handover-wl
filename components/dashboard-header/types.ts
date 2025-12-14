import type { Theme } from "@/lib/types"

export interface DashboardHeaderProps {
	theme: Theme
	ticketCount: number
}

export interface SvgIconProps {
	src: string
	className?: string
	alt?: string
}
