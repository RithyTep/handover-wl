"use client"

import { Hash, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ChannelSettingsProps {
	channelId: string
	onChannelIdChange: (value: string) => void
	onSave: () => void
}

export function ChannelSettings({ channelId, onChannelIdChange, onSave }: ChannelSettingsProps) {
	return (
		<div className="border border-border rounded-lg p-6 bg-card">
			<div className="flex items-center gap-2 mb-4">
				<Hash className="w-4 h-4 text-muted-foreground" />
				<h3 className="text-base font-semibold">Slack Channel</h3>
			</div>

			<div className="space-y-4">
				<div>
					<Label htmlFor="channelId" className="text-sm font-medium mb-2 block">
						Custom Channel ID
					</Label>
					<Input
						id="channelId"
						type="text"
						value={channelId}
						onChange={(e) => onChannelIdChange(e.target.value)}
						placeholder="C08TWKP6ZK7"
						className="w-full font-mono"
					/>
					<p className="text-xs text-muted-foreground mt-1">
						Leave empty to use default channel from environment variables
					</p>
				</div>

				<Button
					onClick={onSave}
					variant="default"
					size="sm"
					className="w-full sm:w-auto"
				>
					<Save className="w-4 h-4 mr-2" />
					Save Channel ID
				</Button>
			</div>
		</div>
	)
}
