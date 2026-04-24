import { NextResponse } from "next/server"
import { z } from "zod"
import { refreshSession } from "@/server/services/auth.service"
import {
	REFRESH_COOKIE_NAME,
	clearAuthCookies,
	setAuthCookies,
} from "@/lib/auth/cookies"

const bodySchema = z.object({ refreshToken: z.string().min(10).optional() }).optional()

export async function POST(request: Request) {
	try {
		const body = await request.json().catch(() => ({}))
		const parsed = bodySchema.safeParse(body)
		const cookieHeader = request.headers.get("cookie") ?? ""
		const cookieRefresh = readCookie(cookieHeader, REFRESH_COOKIE_NAME)
		const refreshToken = parsed.success ? parsed.data?.refreshToken ?? cookieRefresh : cookieRefresh

		if (!refreshToken) {
			return NextResponse.json({ success: false, error: "Missing refresh token" }, { status: 401 })
		}

		const userAgent = request.headers.get("user-agent") ?? undefined
		const tokens = await refreshSession(refreshToken, userAgent)
		const response = NextResponse.json({ success: true, data: tokens })
		setAuthCookies(response, {
			accessToken: tokens.accessToken,
			refreshToken: tokens.refreshToken,
		})
		return response
	} catch {
		const response = NextResponse.json({ success: false, error: "Invalid refresh token" }, { status: 401 })
		clearAuthCookies(response)
		return response
	}
}

function readCookie(header: string, name: string): string | undefined {
	const match = header.split(";").map((c) => c.trim()).find((c) => c.startsWith(`${name}=`))
	return match?.slice(name.length + 1)
}

