import { NextResponse } from "next/server"
import { z } from "zod"
import { loginWithGoogle } from "@/server/services/auth.service"
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
		return NextResponse.json({ success: true, data: tokens })
	} catch (err) {
		log.warn("Google login failed", { error: (err as Error).message })
		return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 401 })
	}
}
