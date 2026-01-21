import bcrypt from "bcryptjs"
import crypto from "node:crypto"

export const LAZYHAND_AUTH_COOKIE = "lazyhand_auth"

const TOKEN_SEED = "lazyhand"

function getPasswordHash(): string | null {
	const hash = process.env.LAZYHAND_PASSWORD_HASH
	return hash && hash.trim() ? hash : null
}

function buildToken(hash: string): string {
	return crypto.createHmac("sha256", hash).update(TOKEN_SEED).digest("hex")
}

export function isLazyhandAuthed(cookieValue?: string | null): boolean {
	const hash = getPasswordHash()
	if (!hash || !cookieValue) return false
	const expected = buildToken(hash)
	if (expected.length !== cookieValue.length) return false
	return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(cookieValue))
}

export async function verifyLazyhandPassword(password: string): Promise<boolean> {
	const hash = getPasswordHash()
	if (!hash) return false
	return bcrypt.compare(password, hash)
}

export function buildLazyhandCookieValue(): string | null {
	const hash = getPasswordHash()
	if (!hash) return null
	return buildToken(hash)
}

export function getLazyhandCookieOptions() {
	return {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax" as const,
		path: "/lazyhand",
		maxAge: 60 * 60 * 24 * 30,
	}
}
