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
