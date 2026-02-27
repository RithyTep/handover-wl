import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { parseTrustedIPs, isIPAllowed } from "@/lib/security/ip-whitelist"

const securityHeaders = {
	"X-Content-Type-Options": "nosniff",
	"X-Frame-Options": "DENY",
	"X-XSS-Protection": "1; mode=block",
	"Referrer-Policy": "strict-origin-when-cross-origin",
	"Permissions-Policy": "camera=(), microphone=(), geolocation=()",
}

// Parsed once at cold start, reused for all requests
const trustedIPs = parseTrustedIPs(process.env.TRUSTED_IPS ?? "")
const isDev = process.env.NODE_ENV === "development"

const PUBLIC_PATHS = [
	"/api/health",
	"/api/cron",
	"/api/slack/commands",
	"/api/webhook-jira",
]

function isPublicPath(pathname: string): boolean {
	return PUBLIC_PATHS.some((p) => pathname.startsWith(p))
}

function getClientIP(request: NextRequest): string {
	const forwarded = request.headers.get("x-forwarded-for")
	if (forwarded) return forwarded.split(",")[0].trim()
	return request.headers.get("x-real-ip") ?? "unknown"
}

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl

	// IP whitelist check (skip for public paths)
	if (trustedIPs.length > 0 && !isPublicPath(pathname)) {
		const clientIP = getClientIP(request)

		if (!isIPAllowed(clientIP, trustedIPs, isDev)) {
			console.warn(
				`[Security] Blocked untrusted IP: ${clientIP} → ${request.method} ${pathname}`
			)
			return new NextResponse(
				JSON.stringify({ success: false, error: "Access denied" }),
				{ status: 403, headers: { "Content-Type": "application/json" } }
			)
		}
	}

	// Apply security headers
	const response = NextResponse.next()
	Object.entries(securityHeaders).forEach(([key, value]) => {
		response.headers.set(key, value)
	})
	return response
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
