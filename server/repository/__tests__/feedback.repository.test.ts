import { describe, it, expect, vi, beforeEach } from "vitest"
import { FeedbackRepository } from "../feedback.repository"
import { prisma } from "@/lib/prisma"
import { FeedbackType, FeedbackStatus } from "@/enums"

vi.mock("@/lib/prisma", () => ({
	prisma: {
		feedback: {
			findMany: vi.fn(),
			findUnique: vi.fn(),
			create: vi.fn(),
			update: vi.fn(),
			delete: vi.fn(),
		},
	},
}))

describe("FeedbackRepository", () => {
	let repository: FeedbackRepository

	const mockPrismaFeedback = {
		id: 1,
		type: "bug",
		title: "Test Bug",
		description: "Description of bug",
		createdAt: new Date("2024-01-01"),
		status: "pending",
	}

	beforeEach(() => {
		repository = new FeedbackRepository()
		vi.clearAllMocks()
	})

	describe("findAll", () => {
		it("should return feedback items with limit", async () => {
			vi.mocked(prisma.feedback.findMany).mockResolvedValue([mockPrismaFeedback])

			const result = await repository.findAll(10)

			expect(prisma.feedback.findMany).toHaveBeenCalledWith({
				orderBy: { createdAt: "desc" },
				take: 10,
			})
			expect(result).toHaveLength(1)
			expect(result[0].title).toBe("Test Bug")
		})

		it("should return empty array when no feedback exists", async () => {
			vi.mocked(prisma.feedback.findMany).mockResolvedValue([])

			const result = await repository.findAll(10)

			expect(result).toEqual([])
		})
	})

	describe("findById", () => {
		it("should return feedback when found", async () => {
			vi.mocked(prisma.feedback.findUnique).mockResolvedValue(mockPrismaFeedback)

			const result = await repository.findById(1)

			expect(prisma.feedback.findUnique).toHaveBeenCalledWith({
				where: { id: 1 },
			})
			expect(result?.id).toBe(1)
			expect(result?.type).toBe("bug")
		})

		it("should return null when not found", async () => {
			vi.mocked(prisma.feedback.findUnique).mockResolvedValue(null)

			const result = await repository.findById(999)

			expect(result).toBeNull()
		})
	})

	describe("insert", () => {
		it("should create new feedback", async () => {
			vi.mocked(prisma.feedback.create).mockResolvedValue(mockPrismaFeedback)

			const result = await repository.insert(
				FeedbackType.BUG,
				"Test Bug",
				"Description of bug",
				FeedbackStatus.NEW
			)

			expect(prisma.feedback.create).toHaveBeenCalledWith({
				data: {
					type: FeedbackType.BUG,
					title: "Test Bug",
					description: "Description of bug",
					status: FeedbackStatus.NEW,
				},
			})
			expect(result.title).toBe("Test Bug")
		})
	})

	describe("updateStatus", () => {
		it("should update feedback status", async () => {
			const updatedFeedback = { ...mockPrismaFeedback, status: "reviewed" }
			vi.mocked(prisma.feedback.update).mockResolvedValue(updatedFeedback)

			const result = await repository.updateStatus(1, FeedbackStatus.REVIEWED)

			expect(prisma.feedback.update).toHaveBeenCalledWith({
				where: { id: 1 },
				data: { status: FeedbackStatus.REVIEWED },
			})
			expect(result?.status).toBe("reviewed")
		})

		it("should return null when update fails", async () => {
			vi.mocked(prisma.feedback.update).mockRejectedValue(new Error("Not found"))

			const result = await repository.updateStatus(999, FeedbackStatus.REVIEWED)

			expect(result).toBeNull()
		})
	})

	describe("delete", () => {
		it("should return true when deleted successfully", async () => {
			vi.mocked(prisma.feedback.delete).mockResolvedValue(mockPrismaFeedback)

			const result = await repository.delete(1)

			expect(prisma.feedback.delete).toHaveBeenCalledWith({
				where: { id: 1 },
			})
			expect(result).toBe(true)
		})

		it("should return false when delete fails", async () => {
			vi.mocked(prisma.feedback.delete).mockRejectedValue(new Error("Not found"))

			const result = await repository.delete(999)

			expect(result).toBe(false)
		})
	})
})
