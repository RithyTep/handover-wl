import { describe, it, expect, vi, beforeEach } from "vitest"
import { ScheduledCommentService } from "../scheduled-comment.service"
import { CommentType } from "@/enums"

// Create mock functions
const mockFindAll = vi.fn()
const mockFindEnabled = vi.fn()
const mockFindById = vi.fn()
const mockInsert = vi.fn()
const mockUpdate = vi.fn()
const mockDelete = vi.fn()
const mockUpdateLastPosted = vi.fn()

// Mock the repository module
vi.mock("@/server/repository/scheduled-comment.repository", () => ({
	ScheduledCommentRepository: class MockScheduledCommentRepository {
		findAll = mockFindAll
		findEnabled = mockFindEnabled
		findById = mockFindById
		insert = mockInsert
		update = mockUpdate
		delete = mockDelete
		updateLastPosted = mockUpdateLastPosted
	},
}))

describe("ScheduledCommentService", () => {
	let service: ScheduledCommentService

	const mockComment = {
		id: 1,
		comment_type: CommentType.SLACK,
		ticket_key: "PROJ-1",
		comment_text: "Test comment",
		cron_schedule: "0 9 * * *",
		enabled: true,
		created_at: new Date("2024-01-01"),
		updated_at: new Date("2024-01-02"),
		last_posted_at: null,
	}

	beforeEach(() => {
		vi.clearAllMocks()
		service = new ScheduledCommentService()
	})

	describe("getAll", () => {
		it("should return all comments from repository", async () => {
			mockFindAll.mockResolvedValue([mockComment])

			const result = await service.getAll()

			expect(mockFindAll).toHaveBeenCalled()
			expect(result).toEqual([mockComment])
		})
	})

	describe("getAllItems", () => {
		it("should transform comments to item format", async () => {
			mockFindAll.mockResolvedValue([mockComment])

			const result = await service.getAllItems()

			expect(result).toHaveLength(1)
			expect(result[0].id).toBe(1)
			expect(result[0].comment_type).toBe(CommentType.SLACK)
		})
	})

	describe("getEnabled", () => {
		it("should return only enabled comments", async () => {
			mockFindEnabled.mockResolvedValue([mockComment])

			const result = await service.getEnabled()

			expect(mockFindEnabled).toHaveBeenCalled()
			expect(result[0].enabled).toBe(true)
		})
	})

	describe("getById", () => {
		it("should return comment by id", async () => {
			mockFindById.mockResolvedValue(mockComment)

			const result = await service.getById(1)

			expect(mockFindById).toHaveBeenCalledWith(1)
			expect(result?.id).toBe(1)
		})

		it("should return null when not found", async () => {
			mockFindById.mockResolvedValue(null)

			const result = await service.getById(999)

			expect(result).toBeNull()
		})
	})

	describe("create", () => {
		it("should create a new comment with options object", async () => {
			mockInsert.mockResolvedValue(mockComment)

			const result = await service.create({
				commentType: CommentType.SLACK,
				commentText: "Test comment",
				cronSchedule: "0 9 * * *",
				enabled: true,
				ticketKey: "PROJ-1",
			})

			expect(mockInsert).toHaveBeenCalledWith({
				commentType: CommentType.SLACK,
				commentText: "Test comment",
				cronSchedule: "0 9 * * *",
				enabled: true,
				ticketKey: "PROJ-1",
			})
			expect(result.id).toBe(1)
		})

		it("should handle undefined ticketKey as null", async () => {
			mockInsert.mockResolvedValue({ ...mockComment, ticket_key: undefined })

			await service.create({
				commentType: CommentType.SLACK,
				commentText: "Test",
				cronSchedule: "0 9 * * *",
				enabled: true,
			})

			expect(mockInsert).toHaveBeenCalledWith(
				expect.objectContaining({
					ticketKey: null,
				})
			)
		})
	})

	describe("update", () => {
		it("should update an existing comment", async () => {
			const updatedComment = { ...mockComment, comment_text: "Updated" }
			mockUpdate.mockResolvedValue(updatedComment)

			const result = await service.update({
				id: 1,
				commentType: CommentType.SLACK,
				commentText: "Updated",
				cronSchedule: "0 9 * * *",
				enabled: true,
				ticketKey: "PROJ-1",
			})

			expect(mockUpdate).toHaveBeenCalledWith({
				id: 1,
				commentType: CommentType.SLACK,
				commentText: "Updated",
				cronSchedule: "0 9 * * *",
				enabled: true,
				ticketKey: "PROJ-1",
			})
			expect(result?.comment_text).toBe("Updated")
		})

		it("should return null when update fails", async () => {
			mockUpdate.mockResolvedValue(null)

			const result = await service.update({
				id: 999,
				commentType: CommentType.SLACK,
				commentText: "Test",
				cronSchedule: "0 9 * * *",
				enabled: true,
			})

			expect(result).toBeNull()
		})
	})

	describe("delete", () => {
		it("should delete a comment", async () => {
			mockDelete.mockResolvedValue(true)

			const result = await service.delete(1)

			expect(mockDelete).toHaveBeenCalledWith(1)
			expect(result).toBe(true)
		})

		it("should return false when delete fails", async () => {
			mockDelete.mockResolvedValue(false)

			const result = await service.delete(999)

			expect(result).toBe(false)
		})
	})

	describe("updateLastPosted", () => {
		it("should update the last posted timestamp", async () => {
			mockUpdateLastPosted.mockResolvedValue(undefined)

			await service.updateLastPosted(1)

			expect(mockUpdateLastPosted).toHaveBeenCalledWith(1)
		})
	})

	describe("toItem", () => {
		it("should transform comment to item format with dates as strings", () => {
			const result = service.toItem(mockComment)

			expect(result.id).toBe(1)
			expect(result.comment_type).toBe(CommentType.SLACK)
			expect(typeof result.created_at).toBe("string")
			expect(typeof result.updated_at).toBe("string")
		})

		it("should handle null last_posted_at", () => {
			const result = service.toItem(mockComment)

			expect(result.last_posted_at).toBeNull()
		})

		it("should convert Date last_posted_at to string", () => {
			const commentWithPosted = {
				...mockComment,
				last_posted_at: new Date("2024-01-15"),
			}

			const result = service.toItem(commentWithPosted)

			expect(typeof result.last_posted_at).toBe("string")
		})
	})
})
