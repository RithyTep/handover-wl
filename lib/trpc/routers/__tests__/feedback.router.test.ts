import { describe, it, expect, vi, beforeEach } from "vitest"
import { FeedbackType } from "@/enums"

// Use vi.hoisted to define mocks before vi.mock is hoisted
const { mockGetAllItems, mockCreate } = vi.hoisted(() => ({
	mockGetAllItems: vi.fn(),
	mockCreate: vi.fn(),
}))

// Mock the service
vi.mock("@/server/services/feedback.service", () => ({
	FeedbackService: class MockFeedbackService {
		getAllItems = mockGetAllItems
		create = mockCreate
	},
}))

// Mock database init
vi.mock("@/server/repository/database.repository", () => ({
	initDatabase: vi.fn().mockResolvedValue(undefined),
}))

// Mock challenge validation (for protected mutations)
vi.mock("@/lib/security/challenge.service", () => ({
	validateChallenge: vi.fn().mockResolvedValue({ valid: true }),
	createChallengeErrorResponse: vi.fn(),
}))

// Import router after mocks are set up
import { feedbackRouter } from "../feedback"

describe("feedbackRouter", () => {
	const mockFeedback = {
		id: 1,
		type: FeedbackType.BUG,
		title: "Test Bug",
		description: "This is a bug report",
		status: "new",
		created_at: "2024-01-01T00:00:00.000Z",
	}

	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe("getAll", () => {
		it("should return all feedback items", async () => {
			mockGetAllItems.mockResolvedValue([mockFeedback])

			const caller = feedbackRouter.createCaller({})
			const result = await caller.getAll()

			expect(mockGetAllItems).toHaveBeenCalled()
			expect(result.success).toBe(true)
			expect(result.feedback).toEqual([mockFeedback])
		})

		it("should return empty array when no feedback exists", async () => {
			mockGetAllItems.mockResolvedValue([])

			const caller = feedbackRouter.createCaller({})
			const result = await caller.getAll()

			expect(result.success).toBe(true)
			expect(result.feedback).toEqual([])
		})

		it("should return multiple feedback items", async () => {
			const multipleFeedback = [
				mockFeedback,
				{ ...mockFeedback, id: 2, type: FeedbackType.FEATURE, title: "Feature Request" },
				{ ...mockFeedback, id: 3, type: FeedbackType.IMPROVEMENT, title: "Improvement" },
			]
			mockGetAllItems.mockResolvedValue(multipleFeedback)

			const caller = feedbackRouter.createCaller({})
			const result = await caller.getAll()

			expect(result.feedback).toHaveLength(3)
		})
	})

	describe("create", () => {
		it("should create a bug report", async () => {
			mockCreate.mockResolvedValue(mockFeedback)

			const caller = feedbackRouter.createCaller({ headers: new Headers() })
			const result = await caller.create({
				type: FeedbackType.BUG,
				title: "Test Bug",
				description: "This is a bug report",
			})

			expect(mockCreate).toHaveBeenCalledWith(
				FeedbackType.BUG,
				"Test Bug",
				"This is a bug report"
			)
			expect(result.success).toBe(true)
			expect(result.data).toEqual(mockFeedback)
		})

		it("should create a feature request", async () => {
			const featureRequest = {
				...mockFeedback,
				type: FeedbackType.FEATURE,
				title: "New Feature",
			}
			mockCreate.mockResolvedValue(featureRequest)

			const caller = feedbackRouter.createCaller({ headers: new Headers() })
			const result = await caller.create({
				type: FeedbackType.FEATURE,
				title: "New Feature",
				description: "Please add this feature",
			})

			expect(mockCreate).toHaveBeenCalledWith(
				FeedbackType.FEATURE,
				"New Feature",
				"Please add this feature"
			)
			expect(result.data.type).toBe(FeedbackType.FEATURE)
		})

		it("should create a suggestion", async () => {
			const suggestion = {
				...mockFeedback,
				type: FeedbackType.SUGGESTION,
				title: "UI Suggestion",
			}
			mockCreate.mockResolvedValue(suggestion)

			const caller = feedbackRouter.createCaller({ headers: new Headers() })
			const result = await caller.create({
				type: FeedbackType.SUGGESTION,
				title: "UI Suggestion",
				description: "The UI could be better",
			})

			expect(result.data.type).toBe(FeedbackType.SUGGESTION)
		})
	})
})
