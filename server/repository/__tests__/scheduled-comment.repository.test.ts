import { describe, it, expect, vi, beforeEach } from "vitest"
import { ScheduledCommentRepository } from "../scheduled-comment.repository"
import { prisma } from "@/lib/prisma"
import { CommentType } from "@/enums"

vi.mock("@/lib/prisma", () => ({
	prisma: {
		scheduledComment: {
			findMany: vi.fn(),
			findUnique: vi.fn(),
			create: vi.fn(),
			update: vi.fn(),
			delete: vi.fn(),
			deleteMany: vi.fn(),
			createMany: vi.fn(),
		},
	},
}))

describe("ScheduledCommentRepository", () => {
	let repository: ScheduledCommentRepository

	const mockPrismaComment = {
		id: 1,
		commentType: "slack",
		ticketKey: "PROJ-1",
		commentText: "Test comment",
		cronSchedule: "0 9 * * *",
		enabled: true,
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-02"),
		lastPostedAt: null,
	}

	beforeEach(() => {
		repository = new ScheduledCommentRepository()
		vi.clearAllMocks()
	})

	describe("findAll", () => {
		it("should return all comments ordered by createdAt desc", async () => {
			vi.mocked(prisma.scheduledComment.findMany).mockResolvedValue([mockPrismaComment])

			const result = await repository.findAll()

			expect(prisma.scheduledComment.findMany).toHaveBeenCalledWith({
				orderBy: { createdAt: "desc" },
			})
			expect(result).toHaveLength(1)
			expect(result[0].comment_type).toBe("slack")
		})
	})

	describe("findEnabled", () => {
		it("should return only enabled comments", async () => {
			vi.mocked(prisma.scheduledComment.findMany).mockResolvedValue([mockPrismaComment])

			const result = await repository.findEnabled()

			expect(prisma.scheduledComment.findMany).toHaveBeenCalledWith({
				where: { enabled: true },
				orderBy: { createdAt: "desc" },
			})
			expect(result[0].enabled).toBe(true)
		})
	})

	describe("findById", () => {
		it("should return comment when found", async () => {
			vi.mocked(prisma.scheduledComment.findUnique).mockResolvedValue(mockPrismaComment)

			const result = await repository.findById(1)

			expect(prisma.scheduledComment.findUnique).toHaveBeenCalledWith({
				where: { id: 1 },
			})
			expect(result?.id).toBe(1)
		})

		it("should return null when not found", async () => {
			vi.mocked(prisma.scheduledComment.findUnique).mockResolvedValue(null)

			const result = await repository.findById(999)

			expect(result).toBeNull()
		})
	})

	describe("insert", () => {
		it("should create a new comment", async () => {
			vi.mocked(prisma.scheduledComment.create).mockResolvedValue(mockPrismaComment)

			const result = await repository.insert({
				commentType: CommentType.SLACK,
				commentText: "Test comment",
				cronSchedule: "0 9 * * *",
				enabled: true,
				ticketKey: "PROJ-1",
			})

			expect(prisma.scheduledComment.create).toHaveBeenCalledWith({
				data: {
					commentType: CommentType.SLACK,
					ticketKey: "PROJ-1",
					commentText: "Test comment",
					cronSchedule: "0 9 * * *",
					enabled: true,
				},
			})
			expect(result.comment_text).toBe("Test comment")
		})
	})

	describe("update", () => {
		it("should update an existing comment", async () => {
			const updatedComment = { ...mockPrismaComment, commentText: "Updated" }
			vi.mocked(prisma.scheduledComment.update).mockResolvedValue(updatedComment)

			const result = await repository.update({
				id: 1,
				commentType: CommentType.SLACK,
				commentText: "Updated",
				cronSchedule: "0 9 * * *",
				enabled: true,
				ticketKey: "PROJ-1",
			})

			expect(prisma.scheduledComment.update).toHaveBeenCalledWith({
				where: { id: 1 },
				data: expect.objectContaining({
					commentText: "Updated",
				}),
			})
			expect(result?.comment_text).toBe("Updated")
		})

		it("should return null when update fails", async () => {
			vi.mocked(prisma.scheduledComment.update).mockRejectedValue(new Error("Not found"))

			const result = await repository.update({
				id: 999,
				commentType: CommentType.SLACK,
				commentText: "Test",
				cronSchedule: "0 9 * * *",
				enabled: true,
				ticketKey: null,
			})

			expect(result).toBeNull()
		})
	})

	describe("delete", () => {
		it("should return true when deleted successfully", async () => {
			vi.mocked(prisma.scheduledComment.delete).mockResolvedValue(mockPrismaComment)

			const result = await repository.delete(1)

			expect(result).toBe(true)
		})

		it("should return false when delete fails", async () => {
			vi.mocked(prisma.scheduledComment.delete).mockRejectedValue(new Error("Not found"))

			const result = await repository.delete(999)

			expect(result).toBe(false)
		})
	})

	describe("updateLastPosted", () => {
		it("should update lastPostedAt timestamp", async () => {
			vi.mocked(prisma.scheduledComment.update).mockResolvedValue(mockPrismaComment)

			await repository.updateLastPosted(1)

			expect(prisma.scheduledComment.update).toHaveBeenCalledWith({
				where: { id: 1 },
				data: { lastPostedAt: expect.any(Date) },
			})
		})
	})

	describe("deleteAll", () => {
		it("should delete all comments", async () => {
			vi.mocked(prisma.scheduledComment.deleteMany).mockResolvedValue({ count: 5 })

			await repository.deleteAll()

			expect(prisma.scheduledComment.deleteMany).toHaveBeenCalled()
		})
	})

	describe("createMany", () => {
		it("should create multiple comments", async () => {
			vi.mocked(prisma.scheduledComment.createMany).mockResolvedValue({ count: 2 })

			await repository.createMany([
				{
					comment_type: "slack",
					ticket_key: "PROJ-1",
					comment_text: "Test 1",
					cron_schedule: "0 9 * * *",
					enabled: true,
				},
				{
					comment_type: "jira",
					ticket_key: "PROJ-2",
					comment_text: "Test 2",
					cron_schedule: "0 10 * * *",
					enabled: false,
				},
			])

			expect(prisma.scheduledComment.createMany).toHaveBeenCalledWith({
				data: [
					{
						commentType: "slack",
						ticketKey: "PROJ-1",
						commentText: "Test 1",
						cronSchedule: "0 9 * * *",
						enabled: true,
					},
					{
						commentType: "jira",
						ticketKey: "PROJ-2",
						commentText: "Test 2",
						cronSchedule: "0 10 * * *",
						enabled: false,
					},
				],
			})
		})
	})
})
