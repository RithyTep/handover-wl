"use client"

import { Sun, Moon, Key, AtSign } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ShiftConfigProps {
	variant: "evening" | "night"
	token: string
	mentions: string
	onTokenChange: (value: string) => void
	onMentionsChange: (value: string) => void
}

export function ShiftConfig({
	variant,
	token,
	mentions,
	onTokenChange,
	onMentionsChange,
}: ShiftConfigProps) {
	const isEvening = variant === "evening"
	const Icon = isEvening ? Sun : Moon
	const iconColor = isEvening ? "text-orange-500" : "text-blue-500"
	const title = isEvening ? "Evening Shift" : "Night Shift"
	const tokenId = isEvening ? "eveningToken" : "nightToken"
	const mentionsId = isEvening ? "eveningMentions" : "nightMentions"
	const tokenLabel = isEvening ? "Evening User Token" : "Night User Token"
	const mentionsLabel = isEvening ? "Evening Mentions" : "Night Mentions"
	const tokenDesc = isEvening
		? "Slack user token for evening report. Leave empty to disable evening report."
		: "Slack user token for night report. Leave empty to disable night report."
	const mentionsDesc = isEvening
		? "Member mentions for evening shift handover"
		: "Member mentions for night shift handover"

	return (
		<div className="border border-border rounded-lg p-6 bg-card">
			<div className="flex items-center gap-2 mb-4">
				<Icon className={`w-4 h-4 ${iconColor}`} />
				<h3 className="text-base font-semibold">{title}</h3>
			</div>

			<div className="space-y-4">
				<div>
					<Label htmlFor={tokenId} className="text-sm font-medium mb-2 block">
						<Key className="w-3 h-3 inline mr-1" />
						{tokenLabel}
					</Label>
					<Input
						id={tokenId}
						type="password"
						value={token}
						onChange={(e) => onTokenChange(e.target.value)}
						placeholder="xoxp-..."
						className="w-full font-mono"
					/>
					<p className="text-xs text-muted-foreground mt-1">{tokenDesc}</p>
				</div>

				<div>
					<Label htmlFor={mentionsId} className="text-sm font-medium mb-2 block">
						<AtSign className="w-3 h-3 inline mr-1" />
						{mentionsLabel}
					</Label>
					<Input
						id={mentionsId}
						type="text"
						value={mentions}
						onChange={(e) => onMentionsChange(e.target.value)}
						placeholder="<@U123456> <@U789012> or @channel"
						className="w-full"
					/>
					<p className="text-xs text-muted-foreground mt-1">{mentionsDesc}</p>
				</div>
			</div>
		</div>
	)
}
