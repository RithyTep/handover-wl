import { describe, it, expect, vi, beforeEach } from "vitest"
import { CommentType } from "@/enums"

// Use vi.hoisted to define mocks before vi.mock is hoisted
const { mockGetAllItems, mockCreate, mockUpdate, mockDelete } = vi.hoisted(() => ({
	mockGetAllItems: vi.fn(),
	mockCreate: vi.fn(),
	mockUpdate: vi.fn(),
	mockDelete: vi.fn(),
}))

// Mock the service
vi.mock("@/server/services/scheduled-comment.service", () => ({
	ScheduledCommentService: class MockScheduledCommentService {
		getAllItems = mockGetAllItems
		create = mockCreate
		update = mockUpdate
		delete = mockDelete
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
import { scheduledCommentsRouter } from "../scheduledComments"

describe("scheduledCommentsRouter", () => {
	const mockComment = {
		id: 1,
		comment_type: CommentType.SLACK,
		ticket_key: "PROJ-1",
		comment_text: "Test comment",
		cron_schedule: "0 9 * * *",
		enabled: true,
		created_at: "2024-01-01T00:00:00.000Z",
		updated_at: "2024-01-02T00:00:00.000Z",
		last_posted_at: null,
	}

	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe("getAll", () => {
		it("should return all comments", async () => {
			mockGetAllItems.mockResolvedValue([mockComment])

			const caller = scheduledCommentsRouter.createCaller({})
			const result = await caller.getAll()

			expect(mockGetAllItems).toHaveBeenCalled()
			expect(result.success).toBe(true)
			expect(result.comments).toEqual([mockComment])
		})

		it("should return empty array when no comments exist", async () => {
			mockGetAllItems.mockResolvedValue([])

			const caller = scheduledCommentsRouter.createCaller({})
			const result = await caller.getAll()

			expect(result.success).toBe(true)
			expect(result.comments).toEqual([])
		})
	})

	describe("create", () => {
		it("should create a new comment", async () => {
			mockCreate.mockResolvedValue(mockComment)

			const caller = scheduledCommentsRouter.createCaller({ headers: new Headers() })
			const result = await caller.create({
				comment_type: CommentType.SLACK,
				comment_text: "Test comment",
				cron_schedule: "0 9 * * *",
				enabled: true,
				ticket_key: "PROJ-1",
			})

			expect(mockCreate).toHaveBeenCalledWith({
				commentType: CommentType.SLACK,
				commentText: "Test comment",
				cronSchedule: "0 9 * * *",
				enabled: true,
				ticketKey: "PROJ-1",
			})
			expect(result.success).toBe(true)
			expect(result.comment).toEqual(mockComment)
		})

		it("should handle comment creation without ticket_key", async () => {
			const commentWithoutTicket = { ...mockComment, ticket_key: null }
			mockCreate.mockResolvedValue(commentWithoutTicket)

			const caller = scheduledCommentsRouter.createCaller({ headers: new Headers() })
			const result = await caller.create({
				comment_type: CommentType.JIRA,
				comment_text: "Global comment",
				cron_schedule: "0 10 * * *",
				enabled: false,
			})

			expect(result.success).toBe(true)
			expect(result.comment.ticket_key).toBeNull()
		})
	})

	describe("update", () => {
		it("should update an existing comment", async () => {
			const updatedComment = { ...mockComment, comment_text: "Updated comment" }
			mockUpdate.mockResolvedValue(updatedComment)

			const caller = scheduledCommentsRouter.createCaller({ headers: new Headers() })
			const result = await caller.update({
				id: 1,
				comment_type: CommentType.SLACK,
				comment_text: "Updated comment",
				cron_schedule: "0 9 * * *",
				enabled: true,
				ticket_key: "PROJ-1",
			})

			expect(mockUpdate).toHaveBeenCalledWith({
				id: 1,
				commentType: CommentType.SLACK,
				commentText: "Updated comment",
				cronSchedule: "0 9 * * *",
				enabled: true,
				ticketKey: "PROJ-1",
			})
			expect(result.success).toBe(true)
			expect(result.comment.comment_text).toBe("Updated comment")
		})
	})

	describe("delete", () => {
		it("should delete a comment", async () => {
			mockDelete.mockResolvedValue(true)

			const caller = scheduledCommentsRouter.createCaller({ headers: new Headers() })
			const result = await caller.delete({ id: 1 })

			expect(mockDelete).toHaveBeenCalledWith(1)
			expect(result.success).toBe(true)
		})
	})
})
