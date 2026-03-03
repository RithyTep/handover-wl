import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import {
	parseTrustedIPs,
	isIPAllowed,
	createSessionCookie,
	verifySessionCookie,
	SESSION_COOKIE_NAME,
	SESSION_MAX_AGE_S,
} from "@/lib/security/ip-whitelist"

const securityHeaders = {
	"X-Content-Type-Options": "nosniff",
	"X-Frame-Options": "DENY",
	"X-XSS-Protection": "1; mode=block",
	"Referrer-Policy": "strict-origin-when-cross-origin",
	"Permissions-Policy": "camera=(), microphone=(), geolocation=()",
}

// Parsed once at cold start, reused for all requests
const TRUSTED_IPS_RAW = process.env.TRUSTED_IPS ?? ""
const trustedIPs = parseTrustedIPs(TRUSTED_IPS_RAW)
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

function applySecurityHeaders(response: NextResponse): NextResponse {
	Object.entries(securityHeaders).forEach(([key, value]) => {
		response.headers.set(key, value)
	})
	return response
}

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl

	// IP whitelist check (skip for public paths)
	if (trustedIPs.length > 0 && !isPublicPath(pathname)) {
		const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value
		const hasValidSession =
			sessionCookie && (await verifySessionCookie(sessionCookie, TRUSTED_IPS_RAW))

		// 1. Valid session cookie → instant pass (any IP)
		if (hasValidSession) {
			return applySecurityHeaders(NextResponse.next())
		}

		// 2. Trusted IP → pass + set 7-day cookie (only when no valid cookie)
		const clientIP = getClientIP(request)
		if (isIPAllowed(clientIP, trustedIPs, isDev)) {
			const response = applySecurityHeaders(NextResponse.next())
			const cookieValue = await createSessionCookie(TRUSTED_IPS_RAW)
			response.cookies.set(SESSION_COOKIE_NAME, cookieValue, {
				httpOnly: true,
				secure: !isDev,
				sameSite: "lax",
				path: "/",
				maxAge: SESSION_MAX_AGE_S,
			})
			return response
		}

		// 3. No cookie, no trusted IP → block
		console.warn(
			`[Security] Blocked untrusted IP: ${clientIP} → ${request.method} ${pathname}`
		)
		return new NextResponse(
			JSON.stringify({ success: false, error: "Access denied" }),
			{ status: 403, headers: { "Content-Type": "application/json" } }
		)
	}

	return applySecurityHeaders(NextResponse.next())
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
