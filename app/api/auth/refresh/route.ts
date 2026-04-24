import { NextResponse } from "next/server"
import { z } from "zod"
import { refreshSession } from "@/server/services/auth.service"

const bodySchema = z.object({ refreshToken: z.string().min(10) })

export async function POST(request: Request) {
	try {
		const parsed = bodySchema.safeParse(await request.json())
		if (!parsed.success) {
			return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 })
		}
		const userAgent = request.headers.get("user-agent") ?? undefined
		const tokens = await refreshSession(parsed.data.refreshToken, userAgent)
		return NextResponse.json({ success: true, data: tokens })
	} catch {
		return NextResponse.json({ success: false, error: "Invalid refresh token" }, { status: 401 })
	}
}
