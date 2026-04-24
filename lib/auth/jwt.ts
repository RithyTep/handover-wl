import { SignJWT, jwtVerify } from "jose"
import { createHash, randomBytes } from "crypto"
import { env } from "@/lib/env"

const secret = () => {
	if (!env.JWT_SECRET) throw new Error("JWT_SECRET not configured")
	return new TextEncoder().encode(env.JWT_SECRET)
}

export type AccessPayload = { sub: string; email: string; name?: string }

export async function signAccessToken(payload: AccessPayload): Promise<string> {
	return new SignJWT({ ...payload })
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime(`${env.ACCESS_TOKEN_TTL_S}s`)
		.sign(secret())
}

export async function verifyAccessToken(token: string): Promise<AccessPayload | null> {
	try {
		const { payload } = await jwtVerify(token, secret())
		return { sub: String(payload.sub), email: String(payload.email), name: payload.name as string | undefined }
	} catch {
		return null
	}
}

export function generateRefreshToken(): { raw: string; hash: string } {
	const raw = randomBytes(32).toString("base64url")
	const hash = createHash("sha256").update(raw).digest("hex")
	return { raw, hash }
}

export function hashRefreshToken(raw: string): string {
	return createHash("sha256").update(raw).digest("hex")
}
