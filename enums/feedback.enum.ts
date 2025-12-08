export enum FeedbackType {
	BUG = "bug",
	FEEDBACK = "feedback",
	SUGGESTION = "suggestion",
	FEATURE = "feature",
}

export enum FeedbackStatus {
	NEW = "new",
	REVIEWED = "reviewed",
	RESOLVED = "resolved",
	DISMISSED = "dismissed",
}

export const FeedbackTypeValues = Object.values(FeedbackType) as [FeedbackType, ...FeedbackType[]]
export const FeedbackStatusValues = Object.values(FeedbackStatus) as [FeedbackStatus, ...FeedbackStatus[]]
