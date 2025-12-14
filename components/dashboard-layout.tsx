"use client"

import { useEffect, useMemo } from "react"
import dynamic from "next/dynamic"
import { DashboardHeader } from "./dashboard-header"
import { DashboardContent } from "./dashboard-content"
import { DashboardMobileActions } from "./dashboard-mobile-actions"
import { CommandPalette } from "@/components/command-palette"
import { QuickFillDialog } from "./quick-fill-dialog"
import { ClearDialog } from "./clear-dialog"
import { SendSlackDialog } from "./send-slack-dialog"
import { cn } from "@/lib/utils"
import { getLayoutConfig } from "@/lib/theme"
import type { Theme, Ticket } from "@/lib/types"

// Dynamically import heavy theme scenes for code splitting
const NewYearScene = dynamic(() => import("@/components/new-year-scene").then(m => ({ default: m.NewYearScene })), { ssr: false })
const LunarScene = dynamic(() => import("@/components/lunar-scene").then(m => ({ default: m.LunarScene })), { ssr: false })
const CodingScene = dynamic(() => import("@/components/coding-scene").then(m => ({ default: m.CodingScene })), { ssr: false })
const ProfessionalScene = dynamic(() => import("@/components/professional-scene").then(m => ({ default: m.ProfessionalScene })), { ssr: false })
const AngkorPixelScene = dynamic(() => import("@/components/angkor-pixel-scene").then(m => ({ default: m.AngkorPixelScene })), { ssr: false })
const PixelStatusBar = dynamic(() => import("@/components/pixel-status-bar").then(m => ({ default: m.PixelStatusBar })), { ssr: false })
const CodingFooter = dynamic(() => import("@/components/coding-footer").then(m => ({ default: m.CodingFooter })), { ssr: false })

interface DashboardLayoutProps {
	theme: Theme
	tickets: Ticket[]
	ticketData: Record<string, string>
	updateTicketData: (key: string, value: string) => void
	renderKey: number
	onAIFillAll: () => void
	onQuickFill: (status: string, action: string) => void
	onClear: () => void
	onRefresh: () => void
	onCopy: () => void
	onSave: () => void
	onSendSlack: () => Promise<void>
	quickFillOpen: boolean
	onQuickFillOpenChange: (open: boolean) => void
	clearOpen: boolean
	onClearOpenChange: (open: boolean) => void
	sendSlackOpen: boolean
	onSendSlackOpenChange: (open: boolean) => void
}

const THEME_SCENES: Record<Theme, React.ComponentType | null> = {
	default: ProfessionalScene,
	christmas: NewYearScene,
	pixel: PixelStatusBar,
	lunar: LunarScene,
	coding: CodingScene,
	clash: null,
	angkor_pixel: AngkorPixelScene,
}

export const DashboardLayout = ({
	theme,
	tickets,
	ticketData,
	updateTicketData,
	renderKey,
	onAIFillAll,
	onQuickFill,
	onClear,
	onRefresh,
	onCopy,
	onSave,
	onSendSlack,
	quickFillOpen,
	onQuickFillOpenChange,
	clearOpen,
	onClearOpenChange,
	sendSlackOpen,
	onSendSlackOpenChange,
}: DashboardLayoutProps) => {
	const layoutConfig = useMemo(() => getLayoutConfig(theme), [theme])

	useEffect(() => {
		document.body.classList.remove(
			"theme-christmas",
			"theme-default",
			"theme-pixel",
			"theme-lunar",
			"theme-coding",
			"theme-clash",
			"theme-angkor_pixel"
		)
		document.body.classList.add(`theme-${theme}`)
	}, [theme])

	const SceneComponent = THEME_SCENES[theme]

	const handleOpenQuickFill = () => onQuickFillOpenChange(true)
	const handleOpenClear = () => onClearOpenChange(true)
	const handleOpenSendSlack = () => onSendSlackOpenChange(true)

	return (
		<>
			<CommandPalette
				onAIFillAll={onAIFillAll}
				onQuickFill={handleOpenQuickFill}
				onClear={handleOpenClear}
				onSave={onSave}
				onSendSlack={handleOpenSendSlack}
				onCopy={onCopy}
				onRefresh={onRefresh}
			/>
			<div
				className={cn("h-dvh flex flex-col overflow-hidden relative", layoutConfig.background)}
				role="main"
			>
				{SceneComponent && <SceneComponent />}
				<DashboardHeader theme={theme} ticketCount={tickets.length} />
				<DashboardContent
					tickets={tickets}
					ticketData={ticketData}
					updateTicketData={updateTicketData}
					renderKey={renderKey}
					theme={theme}
					onAIFillAll={onAIFillAll}
					onQuickFill={handleOpenQuickFill}
					onClear={handleOpenClear}
					onRefresh={onRefresh}
					onCopy={onCopy}
					onSave={onSave}
					onSendSlack={handleOpenSendSlack}
				/>
				<DashboardMobileActions
					theme={theme}
					onAIFillAll={onAIFillAll}
					onQuickFill={handleOpenQuickFill}
					onClear={handleOpenClear}
					onSave={onSave}
					onSendSlack={handleOpenSendSlack}
				/>
				{theme === "coding" && <CodingFooter />}
			</div>
			<QuickFillDialog
				open={quickFillOpen}
				onOpenChange={onQuickFillOpenChange}
				onQuickFill={onQuickFill}
			/>
			<ClearDialog
				open={clearOpen}
				onOpenChange={onClearOpenChange}
				onClearAll={onClear}
			/>
			<SendSlackDialog
				open={sendSlackOpen}
				onOpenChange={onSendSlackOpenChange}
				onSendSlack={onSendSlack}
			/>
		</>
	)
}
