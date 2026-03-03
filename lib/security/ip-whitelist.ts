const LOCALHOST_IPS = ["127.0.0.1", "::1", "localhost"] as const

interface ParsedCIDR {
	networkInt: number
	maskInt: number
}

export type WhitelistEntry =
	| { type: "exact"; ip: string }
	| { type: "cidr"; parsed: ParsedCIDR }

function ipv4ToInt(ip: string): number | null {
	const parts = ip.split(".")
	if (parts.length !== 4) return null
	let result = 0
	for (const part of parts) {
		const num = parseInt(part, 10)
		if (isNaN(num) || num < 0 || num > 255) return null
		result = (result << 8) | num
	}
	return result >>> 0
}

function parseCIDR(cidr: string): ParsedCIDR | null {
	const [ip, prefixStr] = cidr.split("/")
	const prefix = parseInt(prefixStr, 10)
	if (isNaN(prefix) || prefix < 0 || prefix > 32) return null
	const networkInt = ipv4ToInt(ip)
	if (networkInt === null) return null
	const maskInt = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0
	return {
		networkInt: (networkInt & maskInt) >>> 0,
		maskInt,
	}
}

function isIPInCIDR(ip: string, cidr: ParsedCIDR): boolean {
	const ipInt = ipv4ToInt(ip)
	if (ipInt === null) return false
	return ((ipInt & cidr.maskInt) >>> 0) === cidr.networkInt
}

/**
 * Parse comma-separated TRUSTED_IPS into structured entries.
 * Called once at module load time. Throws on invalid CIDR to fail fast.
 */
export function parseTrustedIPs(raw: string): WhitelistEntry[] {
	return raw
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean)
		.map((entry): WhitelistEntry => {
			if (entry.includes("/")) {
				const parsed = parseCIDR(entry)
				if (!parsed) {
					throw new Error(`Invalid CIDR in TRUSTED_IPS: "${entry}"`)
				}
				return { type: "cidr", parsed }
			}
			return { type: "exact", ip: entry }
		})
}

/**
 * Check whether a client IP is allowed.
 * - Empty whitelist => allow all (backward compatible)
 * - Dev mode + localhost => always allowed
 */
export function isIPAllowed(
	clientIP: string,
	whitelist: WhitelistEntry[],
	isDev: boolean
): boolean {
	if (whitelist.length === 0) return true
	if (isDev && (LOCALHOST_IPS as readonly string[]).includes(clientIP)) {
		return true
	}
	return whitelist.some((entry) => {
		if (entry.type === "exact") return entry.ip === clientIP
		return isIPInCIDR(clientIP, entry.parsed)
	})
}

// --- Session cookie (7-day) using Web Crypto API (Edge Runtime safe) ---

const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000 // 7 days
export const SESSION_MAX_AGE_S = 7 * 24 * 60 * 60 // 7 days in seconds
export const SESSION_COOKIE_NAME = "ip_session"

// Cache imported CryptoKey per secret (key import is expensive, only do it once)
const keyCache = new Map<string, Promise<CryptoKey>>()
const encoder = new TextEncoder()

function getCachedKey(secret: string): Promise<CryptoKey> {
	let cached = keyCache.get(secret)
	if (!cached) {
		cached = crypto.subtle.importKey(
			"raw",
			encoder.encode(secret),
			{ name: "HMAC", hash: "SHA-256" },
			false,
			["sign"]
		)
		keyCache.set(secret, cached)
	}
	return cached
}

async function hmacSign(data: string, secret: string): Promise<string> {
	const key = await getCachedKey(secret)
	const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(data))
	return btoa(String.fromCharCode(...new Uint8Array(sig)))
}

/** Create a signed session cookie value: `timestamp.signature` */
export async function createSessionCookie(secret: string): Promise<string> {
	const timestamp = Date.now().toString()
	const signature = await hmacSign(timestamp, secret)
	return `${timestamp}.${signature}`
}

/** Verify session cookie: valid signature + not expired (7 days) */
export async function verifySessionCookie(
	value: string,
	secret: string
): Promise<boolean> {
	const dotIndex = value.indexOf(".")
	if (dotIndex === -1) return false

	const timestamp = value.substring(0, dotIndex)
	const signature = value.substring(dotIndex + 1)

	const elapsed = Date.now() - parseInt(timestamp, 10)
	if (isNaN(elapsed) || elapsed < 0 || elapsed > SESSION_MAX_AGE_MS) {
		return false
	}

	const expected = await hmacSign(timestamp, secret)
	return signature === expected
}
