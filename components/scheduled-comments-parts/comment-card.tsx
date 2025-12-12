"use client"

import { Pencil, Trash2, Clock, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { IScheduledCommentItem } from "@/interfaces"
import { formatDate, getCronDescription } from "./scheduled-comment-types"

interface CommentCardProps {
	comment: IScheduledCommentItem
	loading: boolean
	onEdit: (comment: IScheduledCommentItem) => void
	onDelete: (id: number) => void
}

export function CommentCard({ comment, loading, onEdit, onDelete }: CommentCardProps) {
	return (
		<Card className="border">
			<CardContent className="p-4">
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<div className="flex items-center gap-2 mb-2 flex-wrap">
							{comment.comment_type === "slack" ? (
								<span className="text-xs bg-blue-500/10 text-blue-600 px-2 py-1 rounded font-medium">
									Slack Thread
								</span>
							) : (
								<span className="font-mono font-semibold text-sm bg-primary/10 px-2 py-1 rounded">
									{comment.ticket_key}
								</span>
							)}
							{comment.enabled ? (
								<span className="text-xs flex items-center gap-1 text-green-600">
									<CheckCircle2 className="h-3 w-3" />
									Enabled
								</span>
							) : (
								<span className="text-xs text-muted-foreground">Disabled</span>
							)}
						</div>
						<p className="text-sm mb-2 line-clamp-2">{comment.comment_text}</p>
						<div className="flex items-center gap-4 text-xs text-muted-foreground">
							{comment.comment_type === "jira" && (
								<span className="flex items-center gap-1">
									<Clock className="h-3 w-3" />
									{getCronDescription(comment.cron_schedule)}
								</span>
							)}
							{comment.comment_type === "slack" && (
								<span>Posted after handover messages</span>
							)}
							<span>Last posted: {formatDate(comment.last_posted_at)}</span>
						</div>
					</div>
					<div className="flex items-center gap-2 ml-4">
						<Button
							variant="outline"
							size="icon"
							onClick={() => onEdit(comment)}
							disabled={loading}
						>
							<Pencil className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							size="icon"
							onClick={() => onDelete(comment.id)}
							disabled={loading}
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
