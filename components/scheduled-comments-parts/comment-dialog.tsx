"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { CommentType } from "@/enums"
import type { CommentFormData } from "./scheduled-comment-types"

interface CommentDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	isEditing: boolean
	formData: CommentFormData
	loading: boolean
	onFormChange: (data: Partial<CommentFormData>) => void
	onSave: () => void
}

export function CommentDialog({
	open,
	onOpenChange,
	isEditing,
	formData,
	loading,
	onFormChange,
	onSave,
}: CommentDialogProps) {
	const { commentType, ticketKey, commentText, cronSchedule, enabled } = formData
	const isJira = commentType === "jira"

	const isValid = commentText && (isJira ? ticketKey && cronSchedule : true)

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>
						{isEditing ? "Edit Scheduled Comment" : "New Scheduled Comment"}
					</DialogTitle>
					<DialogDescription>
						{isJira
							? "Schedule a comment to be posted to a Jira ticket using your user token."
							: "Schedule a comment to be posted as a reply to handover Slack messages using your user token."}
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					<div className="grid gap-2">
						<Label htmlFor="comment_type">Comment Type</Label>
						<Select
							value={commentType}
							onValueChange={(value) =>
								onFormChange({ commentType: value as CommentType })
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="slack">
									Slack Thread (replies to handover messages)
								</SelectItem>
								<SelectItem value="jira">Jira Ticket Comment</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{isJira && (
						<div className="grid gap-2">
							<Label htmlFor="ticket_key">Ticket Key</Label>
							<Input
								id="ticket_key"
								placeholder="e.g., PROJ-123"
								value={ticketKey}
								onChange={(e) =>
									onFormChange({ ticketKey: e.target.value.toUpperCase() })
								}
							/>
						</div>
					)}

					<div className="grid gap-2">
						<Label htmlFor="comment_text">Comment Text</Label>
						<Textarea
							id="comment_text"
							placeholder="Enter the comment to post..."
							value={commentText}
							onChange={(e) => onFormChange({ commentText: e.target.value })}
							rows={4}
						/>
					</div>

					{isJira && (
						<div className="grid gap-2">
							<Label htmlFor="cron_schedule">Cron Schedule</Label>
							<Input
								id="cron_schedule"
								placeholder="e.g., 0 9 * * * (Daily at 9 AM)"
								value={cronSchedule}
								onChange={(e) => onFormChange({ cronSchedule: e.target.value })}
							/>
							<p className="text-xs text-muted-foreground">
								Examples: <code>0 9 * * *</code> (Daily 9 AM),{" "}
								<code>0 */2 * * *</code> (Every 2 hours),{" "}
								<code>*/30 * * * *</code> (Every 30 min)
							</p>
						</div>
					)}

					{!isJira && (
						<div className="p-3 bg-muted/50 rounded-md border border-border/50">
							<p className="text-sm text-muted-foreground">
								<strong>Note:</strong> Slack thread comments are automatically
								posted as replies to handover messages at 5:10 PM and 10:40 PM
								GMT+7.
							</p>
						</div>
					)}

					<div className="flex items-center space-x-2">
						<Switch
							id="enabled"
							checked={enabled}
							onCheckedChange={(checked) => onFormChange({ enabled: checked })}
						/>
						<Label htmlFor="enabled">Enabled</Label>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button onClick={onSave} disabled={loading || !isValid}>
						{loading ? "Saving..." : isEditing ? "Update" : "Create"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
