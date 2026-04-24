import { NextResponse } from "next/server"
import { z } from "zod"
import { revokeRefreshToken } from "@/server/services/auth.service"

const bodySchema = z.object({ refreshToken: z.string().min(10) })

export async function POST(request: Request) {
	const parsed = bodySchema.safeParse(await request.json().catch(() => ({})))
	if (parsed.success) {
		await revokeRefreshToken(parsed.data.refreshToken).catch(() => {})
	}
	return NextResponse.json({ success: true })
}
