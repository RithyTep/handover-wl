import { PrismaClient } from "@/lib/generated/prisma"
import { PrismaNeon } from "@prisma/adapter-neon"
import { isProduction } from "@/lib/env"

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
	const connectionString = process.env.DATABASE_URL

	if (!connectionString) {
		throw new Error("DATABASE_URL environment variable is not set")
	}

	const adapter = new PrismaNeon({ connectionString })

	return new PrismaClient({
		adapter,
		log: isProduction ? ["error"] : ["query", "error", "warn"],
	})
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (!isProduction) {
	globalForPrisma.prisma = prisma
}

export type { PrismaClient }
