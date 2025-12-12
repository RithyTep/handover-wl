import type { IScheduledCommentItem } from "@/interfaces"
import { CommentType } from "@/enums"

export type { IScheduledCommentItem }
export { CommentType }

export interface CommentFormData {
	commentType: CommentType
	ticketKey: string
	commentText: string
	cronSchedule: string
	enabled: boolean
}

export function formatDate(dateString?: string | Date | null): string {
	if (!dateString) return "Never"
	const date = typeof dateString === "string" ? new Date(dateString) : dateString
	return date.toLocaleString("en-US", {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	})
}

export function getCronDescription(cron: string): string {
	if (cron === "0 9 * * *") return "Daily at 9:00 AM"
	if (cron === "0 17 * * *") return "Daily at 5:00 PM"
	if (cron === "0 */2 * * *") return "Every 2 hours"
	if (cron === "*/30 * * * *") return "Every 30 minutes"
	if (cron === "0 9 * * 1") return "Every Monday at 9:00 AM"
	return cron
}
