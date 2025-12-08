import { prisma } from "@/lib/prisma"
import { FeedbackType, FeedbackStatus } from "@/enums"
import type { Feedback as PrismaFeedback } from "@/lib/generated/prisma"
import type { Feedback } from "@/lib/types"

function toDomain(row: PrismaFeedback): Feedback {
	return {
		id: row.id,
		type: row.type as FeedbackType,
		title: row.title,
		description: row.description,
		created_at: row.createdAt,
		status: row.status as FeedbackStatus,
	}
}

export class FeedbackRepository {
	async findAll(limit: number): Promise<Feedback[]> {
		const rows = await prisma.feedback.findMany({
			orderBy: { createdAt: "desc" },
			take: limit,
		})
		return rows.map(toDomain)
	}

	async findById(id: number): Promise<Feedback | null> {
		const row = await prisma.feedback.findUnique({
			where: { id },
		})
		return row ? toDomain(row) : null
	}

	async insert(
		type: FeedbackType,
		title: string,
		description: string,
		status: FeedbackStatus
	): Promise<Feedback> {
		const row = await prisma.feedback.create({
			data: {
				type,
				title,
				description,
				status,
			},
		})
		return toDomain(row)
	}

	async updateStatus(id: number, status: FeedbackStatus): Promise<Feedback | null> {
		try {
			const row = await prisma.feedback.update({
				where: { id },
				data: { status },
			})
			return toDomain(row)
		} catch {
			return null
		}
	}

	async delete(id: number): Promise<boolean> {
		try {
			await prisma.feedback.delete({
				where: { id },
			})
			return true
		} catch {
			return false
		}
	}
}
