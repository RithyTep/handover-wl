import { NextResponse } from "next/server"
import { z } from "zod"
import { loginWithGoogle } from "@/server/services/auth.service"
import { setAuthCookies } from "@/lib/auth/cookies"
import { logger } from "@/lib/logger"

const log = logger.api
const bodySchema = z.object({ idToken: z.string().min(10) })

export async function POST(request: Request) {
	try {
		const parsed = bodySchema.safeParse(await request.json())
		if (!parsed.success) {
			return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 })
		}
		const userAgent = request.headers.get("user-agent") ?? undefined
		const tokens = await loginWithGoogle(parsed.data.idToken, userAgent)
		const response = NextResponse.json({ success: true, data: tokens })
		setAuthCookies(response, {
			accessToken: tokens.accessToken,
			refreshToken: tokens.refreshToken,
		})
		return response
	} catch (err) {
		log.warn("Google login failed", { error: (err as Error).message })
		return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 401 })
	}
}
