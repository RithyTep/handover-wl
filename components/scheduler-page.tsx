"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import confetti from "canvas-confetti"
import { Clock, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { trpc } from "@/components/trpc-provider"
import {
	SchedulerStatus,
	ChannelSettings,
	ShiftConfig,
	ManualTrigger,
} from "./scheduler"

export function SchedulerPage() {
	const [scheduleEnabled, setScheduleEnabled] = useState(false)
	const [loading, setLoading] = useState(true)
	const [triggeringComments, setTriggeringComments] = useState(false)
	const [customChannelId, setCustomChannelId] = useState("")

	const [eveningToken, setEveningToken] = useState("")
	const [nightToken, setNightToken] = useState("")
	const [eveningMentions, setEveningMentions] = useState("")
	const [nightMentions, setNightMentions] = useState("")

	const { data: schedulerState, isLoading: schedulerLoading } =
		trpc.scheduler.getState.useQuery()
	const { data: shiftSettings } = trpc.settings.getShiftTokens.useQuery()
	const { data: customChannel } = trpc.settings.getCustomChannel.useQuery()

	const setSchedulerStateMutation = trpc.scheduler.setState.useMutation({
		onSuccess: (data) => {
			setScheduleEnabled(data.enabled)
			if (data.enabled) {
				confetti({
					particleCount: 100,
					spread: 70,
					origin: { y: 0.6 },
				})
				toast.success("Scheduler enabled! Reports will be sent at configured times.")
			} else {
				toast.success("Scheduler disabled")
			}
		},
		onError: (error) => {
			toast.error("Failed to update scheduler: " + error.message)
		},
	})

	const saveCustomChannelMutation = trpc.settings.setCustomChannel.useMutation({
		onSuccess: () => {
			toast.success("Custom channel ID saved successfully!")
		},
		onError: (error) => {
			toast.error("Error saving channel ID: " + error.message)
		},
	})

	const saveShiftSettingsMutation = trpc.settings.setShiftTokens.useMutation({
		onSuccess: () => {
			toast.success("Shift settings saved successfully!")
		},
		onError: (error) => {
			toast.error("Error saving shift settings: " + error.message)
		},
	})

	useEffect(() => {
		if (schedulerState) {
			setScheduleEnabled(schedulerState.enabled)
			setLoading(false)
		} else if (schedulerLoading === false) {
			setLoading(false)
		}
	}, [schedulerState, schedulerLoading])

	useEffect(() => {
		if (shiftSettings?.data) {
			const settings = shiftSettings.data
			setEveningToken(settings.eveningToken)
			setNightToken(settings.nightToken)
			setEveningMentions(settings.eveningMentions)
			setNightMentions(settings.nightMentions)
		}
	}, [shiftSettings])

	useEffect(() => {
		if (customChannel?.channelId) {
			setCustomChannelId(customChannel.channelId || "")
		}
	}, [customChannel])

	const handleToggleSchedule = async () => {
		const newValue = !scheduleEnabled
		const loadingToast = toast.loading(
			newValue ? "Enabling scheduler..." : "Disabling scheduler..."
		)
		try {
			await setSchedulerStateMutation.mutateAsync({ enabled: newValue })
		} finally {
			toast.dismiss(loadingToast)
		}
	}

	const handleSaveCustomChannelId = async () => {
		const loadingToast = toast.loading("Saving custom channel ID...")
		try {
			await saveCustomChannelMutation.mutateAsync({ channel_id: customChannelId })
		} finally {
			toast.dismiss(loadingToast)
		}
	}

	const handleSaveShiftSettings = async () => {
		const loadingToast = toast.loading("Saving shift settings...")
		try {
			await saveShiftSettingsMutation.mutateAsync({
				evening_user_token: eveningToken,
				night_user_token: nightToken,
				evening_mentions: eveningMentions,
				night_mentions: nightMentions,
			})
		} finally {
			toast.dismiss(loadingToast)
		}
	}

	const handleTriggerScheduledComments = async () => {
		setTriggeringComments(true)
		const loadingToast = toast.loading(
			"Scanning for handover messages and posting replies..."
		)

		try {
			const response = await fetch("/api/scan-and-reply-handover", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
			})
			const data = await response.json()

			toast.dismiss(loadingToast)

			if (data.replied) {
				confetti({
					particleCount: 150,
					spread: 80,
					origin: { y: 0.5 },
				})
				toast.success(`Reply posted successfully! (${data.ticketsCount} tickets)`)
			} else {
				toast.info(data.message || "No handover messages found that need replies")
			}
		} catch (error: unknown) {
			toast.dismiss(loadingToast)
			const message = error instanceof Error ? error.message : "Unknown error"
			toast.error("Error scanning messages: " + message)
		} finally {
			setTriggeringComments(false)
		}
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="text-center">
					<Clock className="w-8 h-8 animate-spin mx-auto mb-2 text-foreground" />
					<p className="text-sm text-muted-foreground">Loading scheduler...</p>
				</div>
			</div>
		)
	}

	return (
		<div className="w-full h-full flex flex-col gap-6 max-w-2xl">
			<div>
				<h2 className="text-2xl font-semibold tracking-tight mb-2">Scheduler</h2>
				<p className="text-sm text-muted-foreground">
					Configure shift-based handover reports with custom user tokens.
				</p>
			</div>

			<SchedulerStatus
				enabled={scheduleEnabled}
				loading={loading}
				onToggle={handleToggleSchedule}
			/>

			<ChannelSettings
				channelId={customChannelId}
				onChannelIdChange={setCustomChannelId}
				onSave={handleSaveCustomChannelId}
			/>

			<ShiftConfig
				variant="evening"
				token={eveningToken}
				mentions={eveningMentions}
				onTokenChange={setEveningToken}
				onMentionsChange={setEveningMentions}
			/>

			<ShiftConfig
				variant="night"
				token={nightToken}
				mentions={nightMentions}
				onTokenChange={setNightToken}
				onMentionsChange={setNightMentions}
			/>

			<div className="border border-border rounded-lg p-6 bg-card">
				<Button
					onClick={handleSaveShiftSettings}
					variant="default"
					size="lg"
					className="w-full"
				>
					<Save className="w-4 h-4 mr-2" />
					Save All Shift Settings
				</Button>
				<p className="text-xs text-muted-foreground mt-2 text-center">
					Save tokens and mentions for both evening and night shifts
				</p>
			</div>

			<ManualTrigger
				triggering={triggeringComments}
				onTrigger={handleTriggerScheduledComments}
			/>
		</div>
	)
}
