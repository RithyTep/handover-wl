import { NextRequest, NextResponse } from "next/server"
import {
	LAZYHAND_AUTH_COOKIE,
	buildLazyhandCookieValue,
	getLazyhandCookieOptions,
	verifyLazyhandPassword,
} from "@/lib/lazyhand-auth"

export async function POST(request: NextRequest) {
	try {
		const body = await request.json().catch(() => ({}))
		const password = typeof body.password === "string" ? body.password : ""

		if (!password) {
			return NextResponse.json({ error: "Missing password" }, { status: 400 })
		}

		const ok = await verifyLazyhandPassword(password)
		if (!ok) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const cookieValue = buildLazyhandCookieValue()
		if (!cookieValue) {
			return NextResponse.json(
				{ error: "Lazyhand password hash not configured" },
				{ status: 500 }
			)
		}

		const response = NextResponse.json({ success: true })
		response.cookies.set(LAZYHAND_AUTH_COOKIE, cookieValue, getLazyhandCookieOptions())
		return response
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Authentication failed"
		return NextResponse.json({ error: message }, { status: 500 })
	}
}
