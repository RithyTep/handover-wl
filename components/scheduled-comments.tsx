"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Plus } from "lucide-react"
import { trpc } from "@/components/trpc-provider"
import { toast } from "sonner"
import { CommentType } from "@/enums"
import type { IScheduledCommentItem } from "@/interfaces"
import {
	CommentCard,
	CommentDialog,
	type CommentFormData,
} from "./scheduled-comments-parts"

const initialFormData: CommentFormData = {
	commentType: CommentType.SLACK,
	ticketKey: "",
	commentText: "",
	cronSchedule: "",
	enabled: true,
}

export default function ScheduledComments() {
	const [dialogOpen, setDialogOpen] = useState(false)
	const [editingComment, setEditingComment] =
		useState<IScheduledCommentItem | null>(null)
	const [formData, setFormData] = useState<CommentFormData>(initialFormData)

	const { data: commentsData, refetch: refetchComments } =
		trpc.scheduledComments.getAll.useQuery()

	const createMutation = trpc.scheduledComments.create.useMutation({
		onSuccess: () => {
			toast.success("Scheduled comment created")
			refetchComments()
			resetForm()
		},
		onError: (error) => {
			toast.error("Error creating comment: " + error.message)
		},
	})

	const updateMutation = trpc.scheduledComments.update.useMutation({
		onSuccess: () => {
			toast.success("Scheduled comment updated")
			refetchComments()
			resetForm()
		},
		onError: (error) => {
			toast.error("Error updating comment: " + error.message)
		},
	})

	const deleteMutation = trpc.scheduledComments.delete.useMutation({
		onSuccess: () => {
			toast.success("Scheduled comment deleted")
			refetchComments()
		},
		onError: (error) => {
			toast.error("Error deleting comment: " + error.message)
		},
	})

	const comments = commentsData?.comments || []
	const loading =
		createMutation.isPending ||
		updateMutation.isPending ||
		deleteMutation.isPending

	const resetForm = () => {
		setFormData(initialFormData)
		setEditingComment(null)
		setDialogOpen(false)
	}

	const handleNew = () => {
		setFormData(initialFormData)
		setEditingComment(null)
		setDialogOpen(true)
	}

	const handleEdit = (comment: IScheduledCommentItem) => {
		setEditingComment(comment)
		setFormData({
			commentType: comment.comment_type,
			ticketKey: comment.ticket_key ?? "",
			commentText: comment.comment_text,
			cronSchedule: comment.cron_schedule,
			enabled: comment.enabled,
		})
		setDialogOpen(true)
	}

	const handleFormChange = (data: Partial<CommentFormData>) => {
		setFormData((prev) => ({ ...prev, ...data }))
	}

	const handleSave = async () => {
		const { commentType, ticketKey, commentText, cronSchedule, enabled } = formData
		const finalCronSchedule = commentType === "slack" ? "0 0 * * *" : cronSchedule

		const payload = {
			comment_type: commentType,
			ticket_key: commentType === "jira" ? ticketKey : undefined,
			comment_text: commentText,
			cron_schedule: finalCronSchedule,
			enabled,
		}

		if (editingComment) {
			await updateMutation.mutateAsync({ id: editingComment.id, ...payload })
		} else {
			await createMutation.mutateAsync(payload)
		}
		setDialogOpen(false)
	}

	const handleDelete = async (id: number) => {
		if (!confirm("Are you sure you want to delete this scheduled comment?"))
			return
		await deleteMutation.mutateAsync({ id })
	}

	return (
		<div className="space-y-4">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>Scheduled Comments</CardTitle>
							<CardDescription>
								Automatically post comments to Jira tickets using your user token
							</CardDescription>
						</div>
						<Button onClick={handleNew}>
							<Plus className="mr-2 h-4 w-4" />
							New Schedule
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					{comments.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							No scheduled comments yet. Create one to get started!
						</div>
					) : (
						<div className="space-y-3">
							{comments.map((comment) => (
								<CommentCard
									key={comment.id}
									comment={comment}
									loading={loading}
									onEdit={handleEdit}
									onDelete={handleDelete}
								/>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			<CommentDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				isEditing={!!editingComment}
				formData={formData}
				loading={loading}
				onFormChange={handleFormChange}
				onSave={handleSave}
			/>
		</div>
	)
}
