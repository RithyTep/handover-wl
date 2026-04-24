import { NextResponse } from "next/server"
import { z } from "zod"
import { revokeRefreshToken } from "@/server/services/auth.service"
import { REFRESH_COOKIE_NAME, clearAuthCookies } from "@/lib/auth/cookies"

const bodySchema = z.object({ refreshToken: z.string().min(10).optional() }).optional()

export async function POST(request: Request) {
	const body = await request.json().catch(() => ({}))
	const parsed = bodySchema.safeParse(body)
	const cookieHeader = request.headers.get("cookie") ?? ""
	const cookieRefresh = readCookie(cookieHeader, REFRESH_COOKIE_NAME)
	const refreshToken = parsed.success ? parsed.data?.refreshToken ?? cookieRefresh : cookieRefresh
	if (refreshToken) {
		await revokeRefreshToken(refreshToken).catch(() => {})
	}
	const response = NextResponse.json({ success: true })
	clearAuthCookies(response)
	return response
}

function readCookie(header: string, name: string): string | undefined {
	const match = header.split(";").map((c) => c.trim()).find((c) => c.startsWith(`${name}=`))
	return match?.slice(name.length + 1)
}
