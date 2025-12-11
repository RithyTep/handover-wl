"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { getMobileActionsConfig, getLayoutConfig } from "@/lib/theme"
import type { Theme } from "@/lib/types"

// ============================================================================
// Types
// ============================================================================

interface DashboardMobileActionsProps {
	theme: Theme
	onAIFillAll: () => void
	onQuickFill: () => void
	onClear: () => void
	onSave: () => void
	onSendSlack: () => void
}

// ============================================================================
// Main Component
// ============================================================================

export const DashboardMobileActions = ({
	theme,
	onAIFillAll,
	onQuickFill,
	onClear,
	onSave,
	onSendSlack,
}: DashboardMobileActionsProps) => {
	const mobileActionsConfig = getMobileActionsConfig(theme)
	const layoutConfig = getLayoutConfig(theme)

	const actions = [
		{ config: mobileActionsConfig.aiFill, onClick: onAIFillAll },
		{ config: mobileActionsConfig.quickFill, onClick: onQuickFill },
		{ config: mobileActionsConfig.clear, onClick: onClear },
		{ config: mobileActionsConfig.save, onClick: onSave },
		{ config: mobileActionsConfig.send, onClick: onSendSlack },
	]

	return (
		<div
			className={cn(
				"fixed bottom-0 left-0 right-0 backdrop-blur-sm border-t px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:hidden z-50",
				layoutConfig.mobileBar
			)}
			role="toolbar"
			aria-label="Mobile actions"
		>
			<div className="flex items-center justify-around">
				{actions.map(({ config, onClick }) => {
					const IconComponent = config.icon

					return (
						<button
							key={config.id}
							onClick={onClick}
							className={cn(
								"flex flex-col items-center justify-center min-w-[48px] min-h-[44px] rounded-xl transition-all active:scale-95",
								config.className,
								theme === "christmas" && "snow-btn"
							)}
							aria-label={config.id.replace("-", " ")}
							tabIndex={0}
						>
							{config.svgIcon ? (
								<Image
									src={config.svgIcon}
									alt=""
									width={40}
									height={40}
									className="object-contain"
									style={{ imageRendering: "pixelated" }}
									unoptimized
									priority
								/>
							) : IconComponent ? (
								<IconComponent
									className={cn("w-5 h-5", config.iconColor)}
									aria-hidden="true"
								/>
							) : null}
						</button>
					)
				})}
			</div>
		</div>
	)
}
