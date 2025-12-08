import { prisma } from "@/lib/prisma"

export async function initDatabase(): Promise<void> {
	await prisma.appSetting.upsert({
		where: { key: "scheduler_enabled" },
		update: {},
		create: { key: "scheduler_enabled", value: "true" },
	})
}

export async function checkHealth(): Promise<{
	healthy: boolean
	latency: number
	error?: string
}> {
	const start = Date.now()
	try {
		await prisma.$queryRaw`SELECT 1`
		return {
			healthy: true,
			latency: Date.now() - start,
		}
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error"
		return {
			healthy: false,
			latency: Date.now() - start,
			error: message,
		}
	}
}

export async function shutdown(): Promise<void> {
	await prisma.$disconnect()
}

export { prisma }
