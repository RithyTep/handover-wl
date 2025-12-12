interface RateLimitRecord {
	count: number
	timestamp: number
}

interface RateLimitResult {
	success: boolean
	remaining: number
	retryAfter?: number
}

const rateLimitMap = new Map<string, RateLimitRecord>()

const CLEANUP_INTERVAL_MS = 60000
let lastCleanup = Date.now()

function cleanupExpiredEntries(windowMs: number): void {
	const now = Date.now()
	if (now - lastCleanup < CLEANUP_INTERVAL_MS) return

	for (const [key, record] of rateLimitMap.entries()) {
		if (now - record.timestamp > windowMs) {
			rateLimitMap.delete(key)
		}
	}
	lastCleanup = now
}

export function rateLimit(
	ip: string,
	limit = 100,
	windowMs = 60000
): RateLimitResult {
	cleanupExpiredEntries(windowMs)

	const now = Date.now()
	const record = rateLimitMap.get(ip)

	if (!record || now - record.timestamp > windowMs) {
		rateLimitMap.set(ip, { count: 1, timestamp: now })
		return { success: true, remaining: limit - 1 }
	}

	if (record.count >= limit) {
		const retryAfter = Math.ceil((record.timestamp + windowMs - now) / 1000)
		return { success: false, remaining: 0, retryAfter }
	}

	record.count++
	return { success: true, remaining: limit - record.count }
}

export function getRateLimitHeaders(
	result: RateLimitResult,
	limit: number
): Record<string, string> {
	const headers: Record<string, string> = {
		"X-RateLimit-Limit": String(limit),
		"X-RateLimit-Remaining": String(result.remaining),
	}

	if (result.retryAfter) {
		headers["Retry-After"] = String(result.retryAfter)
	}

	return headers
}

export function getClientIP(request: Request): string {
	const forwarded = request.headers.get("x-forwarded-for")
	if (forwarded) {
		return forwarded.split(",")[0].trim()
	}
	return "unknown"
}
