import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const securityHeaders = {
	"X-Content-Type-Options": "nosniff",
	"X-Frame-Options": "SAMEORIGIN",
	"X-XSS-Protection": "1; mode=block",
	"Referrer-Policy": "strict-origin-when-cross-origin",
	"Permissions-Policy": "camera=(), microphone=(), geolocation=()",
}

export function middleware(_request: NextRequest) {
	const response = NextResponse.next()

	Object.entries(securityHeaders).forEach(([key, value]) => {
		response.headers.set(key, value)
	})

	return response
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
