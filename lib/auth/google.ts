import { jwtVerify, createRemoteJWKSet } from "jose"
import { env } from "@/lib/env"

const JWKS = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"))

export type GoogleIdTokenClaims = {
	sub: string
	email: string
	email_verified: boolean
	name?: string
	picture?: string
	hd?: string
}

export async function verifyGoogleIdToken(idToken: string): Promise<GoogleIdTokenClaims> {
	if (!env.GOOGLE_CLIENT_ID) throw new Error("GOOGLE_CLIENT_ID not configured")

	const { payload } = await jwtVerify(idToken, JWKS, {
		issuer: ["https://accounts.google.com", "accounts.google.com"],
		audience: env.GOOGLE_CLIENT_ID,
	})

	const claims = payload as unknown as GoogleIdTokenClaims
	if (!claims.email_verified) throw new Error("Email not verified")
	if (claims.hd !== env.GOOGLE_ALLOWED_HD) {
		throw new Error(`Domain not allowed: ${claims.hd ?? "none"}`)
	}
	return claims
}
