"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Send, Loader2, Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { trpc } from "@/components/trpc-provider"
import { FeedbackType } from "@/enums"
import { feedbackTypes } from "./feedback-types"

interface FeedbackFormProps {
	onSuccess: () => void
}

export function FeedbackForm({ onSuccess }: FeedbackFormProps) {
	const [selectedType, setSelectedType] = useState<FeedbackType | null>(null)
	const [title, setTitle] = useState("")
	const [description, setDescription] = useState("")
	const [isSubmitting, setIsSubmitting] = useState(false)

	const createFeedbackMutation = trpc.feedback.create.useMutation({
		onSuccess: () => {
			onSuccess()
			toast.success("Thank you for your feedback!")
		},
		onError: (error) => {
			toast.error(error.message || "Failed to submit feedback")
		},
	})

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!selectedType || !title.trim() || !description.trim()) {
			toast.error("Please fill in all required fields")
			return
		}

		setIsSubmitting(true)

		try {
			await createFeedbackMutation.mutateAsync({
				type: selectedType,
				title: title.trim(),
				description: description.trim(),
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<Card className="mb-6">
				<CardHeader>
					<CardTitle className="text-lg">What type of feedback?</CardTitle>
					<CardDescription>Select the category that best fits your feedback</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 gap-3">
						{feedbackTypes.map((type) => {
							const Icon = type.icon
							const isSelected = selectedType === type.id
							return (
								<button
									key={type.id}
									type="button"
									onClick={() => setSelectedType(type.id)}
									className={cn(
										"flex flex-col items-start p-4 rounded-lg border-2 transition-all text-left",
										isSelected
											? type.color
											: "border-border hover:border-muted-foreground/30 hover:bg-muted/50"
									)}
								>
									<Icon className={cn("w-5 h-5 mb-2", isSelected ? "" : "text-muted-foreground")} />
									<span className="font-medium text-sm">{type.label}</span>
									<span className="text-xs text-muted-foreground mt-0.5">
										{type.description}
									</span>
								</button>
							)
						})}
					</div>
				</CardContent>
			</Card>

			<Card className="mb-6">
				<CardHeader>
					<CardTitle className="text-lg">Details</CardTitle>
					<CardDescription>
						Provide as much detail as possible to help us understand your feedback
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="title">
							Title <span className="text-red-500">*</span>
						</Label>
						<Input
							id="title"
							placeholder="Brief summary of your feedback"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							maxLength={200}
						/>
						<p className="text-xs text-muted-foreground text-right">
							{title.length}/200
						</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">
							Description <span className="text-red-500">*</span>
						</Label>
						<Textarea
							id="description"
							placeholder={
								selectedType === "bug"
									? "Please describe the issue, steps to reproduce, and expected behavior..."
									: selectedType === "feature"
									? "Describe the feature you'd like to see and how it would help..."
									: "Share your thoughts, ideas, or suggestions..."
							}
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							rows={6}
							maxLength={2000}
						/>
						<p className="text-xs text-muted-foreground text-right">
							{description.length}/2000
						</p>
					</div>
				</CardContent>
			</Card>

			<Card className="mb-6 border-muted bg-muted/30">
				<CardContent className="py-4">
					<div className="flex items-start gap-3">
						<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
							<Star className="w-4 h-4 text-primary" />
						</div>
						<div>
							<p className="text-sm font-medium">Anonymous Submission</p>
							<p className="text-xs text-muted-foreground mt-0.5">
								Your feedback is completely anonymous. No personal information is collected or stored.
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<Button
				type="submit"
				size="lg"
				className="w-full"
				disabled={!selectedType || !title.trim() || !description.trim() || isSubmitting}
			>
				{isSubmitting ? (
					<>
						<Loader2 className="w-4 h-4 mr-2 animate-spin" />
						Submitting...
					</>
				) : (
					<>
						<Send className="w-4 h-4 mr-2" />
						Submit Feedback
					</>
				)}
			</Button>
		</form>
	)
}
