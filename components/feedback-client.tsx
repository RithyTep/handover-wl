"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, PlusCircle, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { trpc } from "@/components/trpc-provider"
import { FeedbackForm, FeedbackList, FeedbackSuccess } from "@/components/feedback"

export function FeedbackClient() {
	const router = useRouter()
	const [activeTab, setActiveTab] = useState<"submit" | "view">("submit")
	const [isSubmitted, setIsSubmitted] = useState(false)

	const { data: feedbackData, isLoading, refetch: refetchFeedback } = trpc.feedback.getAll.useQuery(
		undefined,
		{
			enabled: activeTab === "view",
		}
	)

	const feedbackList = feedbackData?.feedback || []

	const handleSuccess = () => {
		setIsSubmitted(true)
		refetchFeedback()
	}

	const handleReset = () => {
		setIsSubmitted(false)
	}

	const handleViewAll = () => {
		setIsSubmitted(false)
		setActiveTab("view")
	}

	if (isSubmitted) {
		return (
			<FeedbackSuccess
				onSubmitAnother={handleReset}
				onViewAll={handleViewAll}
			/>
		)
	}

	return (
		<div className="min-h-screen bg-background">
			<div className="max-w-3xl mx-auto px-4 py-8">
				<div className="mb-6">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => router.push("/")}
						className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Dashboard
					</Button>
					<h1 className="text-3xl font-bold tracking-tight">Feedback</h1>
					<p className="text-muted-foreground mt-2">
						Share your thoughts anonymously. All feedback is welcome!
					</p>
				</div>

				<div className="flex gap-2 mb-6">
					<Button
						variant={activeTab === "submit" ? "default" : "outline"}
						size="sm"
						onClick={() => setActiveTab("submit")}
					>
						<PlusCircle className="w-4 h-4 mr-2" />
						Submit Feedback
					</Button>
					<Button
						variant={activeTab === "view" ? "default" : "outline"}
						size="sm"
						onClick={() => setActiveTab("view")}
					>
						<List className="w-4 h-4 mr-2" />
						View All ({feedbackList.length})
					</Button>
				</div>

				{activeTab === "view" ? (
					<FeedbackList
						feedbackList={feedbackList}
						isLoading={isLoading}
						onRefresh={() => refetchFeedback()}
						onSwitchToSubmit={() => setActiveTab("submit")}
					/>
				) : (
					<FeedbackForm onSuccess={handleSuccess} />
				)}
			</div>
		</div>
	)
}
