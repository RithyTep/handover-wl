import { prisma } from "@/lib/prisma"
import { env } from "@/lib/env"
import { generateRefreshToken, hashRefreshToken } from "@/lib/auth/refresh-token"
import {
	signAccessToken,
} from "@/lib/auth/jwt"
import { verifyGoogleIdToken } from "@/lib/auth/google"

export type SessionTokens = {
	accessToken: string
	refreshToken: string
	accessTokenExpiresIn: number
	refreshTokenExpiresIn: number
	user: { id: string; email: string; name?: string | null; picture?: string | null }
}

export async function loginWithGoogle(idToken: string, userAgent?: string): Promise<SessionTokens> {
	const claims = await verifyGoogleIdToken(idToken)

	const user = await prisma.user.upsert({
		where: { googleSub: claims.sub },
		update: {
			email: claims.email,
			name: claims.name,
			picture: claims.picture,
			lastLoginAt: new Date(),
		},
		create: {
			googleSub: claims.sub,
			email: claims.email,
			name: claims.name,
			picture: claims.picture,
			lastLoginAt: new Date(),
		},
	})

	return issueTokens(user.id, user.email, user.name, user.picture, userAgent)
}

export async function refreshSession(rawRefreshToken: string, userAgent?: string): Promise<SessionTokens> {
	const hash = hashRefreshToken(rawRefreshToken)
	const existing = await prisma.refreshToken.findUnique({
		where: { tokenHash: hash },
		include: { user: true },
	})

	if (!existing || existing.revokedAt || existing.expiresAt < new Date()) {
		// Reuse/expired: revoke entire family for safety.
		if (existing) {
			await prisma.refreshToken.updateMany({
				where: { userId: existing.userId, revokedAt: null },
				data: { revokedAt: new Date() },
			})
		}
		throw new Error("Invalid refresh token")
	}

	const next = await issueTokens(
		existing.user.id,
		existing.user.email,
		existing.user.name,
		existing.user.picture,
		userAgent
	)

	await prisma.refreshToken.update({
		where: { id: existing.id },
		data: { revokedAt: new Date(), replacedBy: hashRefreshToken(next.refreshToken).slice(0, 64) },
	})

	return next
}

export async function revokeRefreshToken(rawRefreshToken: string): Promise<void> {
	await prisma.refreshToken.updateMany({
		where: { tokenHash: hashRefreshToken(rawRefreshToken), revokedAt: null },
		data: { revokedAt: new Date() },
	})
}

async function issueTokens(
	userId: string,
	email: string,
	name: string | null | undefined,
	picture: string | null | undefined,
	userAgent?: string
): Promise<SessionTokens> {
	const accessToken = await signAccessToken({ sub: userId, email, name: name ?? undefined })
	const { raw, hash } = generateRefreshToken()
	const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_TTL_S * 1000)

	await prisma.refreshToken.create({
		data: { userId, tokenHash: hash, expiresAt, userAgent },
	})

	return {
		accessToken,
		refreshToken: raw,
		accessTokenExpiresIn: env.ACCESS_TOKEN_TTL_S,
		refreshTokenExpiresIn: env.REFRESH_TOKEN_TTL_S,
		user: { id: userId, email, name, picture },
	}
}
