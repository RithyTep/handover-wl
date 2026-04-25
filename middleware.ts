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
import { verifyAccessToken } from "@/lib/auth/jwt"

const AUTH_COOKIE_NAME = "auth_token"

const securityHeaders = {
	"X-Content-Type-Options": "nosniff",
	"X-Frame-Options": "DENY",
	"X-XSS-Protection": "1; mode=block",
	"Referrer-Policy": "strict-origin-when-cross-origin",
	"Permissions-Policy": "camera=(), microphone=(), geolocation=()",
}

const TRUSTED_IPS_RAW = process.env.TRUSTED_IPS ?? ""
const trustedIPs = parseTrustedIPs(TRUSTED_IPS_RAW)
const isDev = process.env.NODE_ENV === "development"

const PUBLIC_PATHS = [
	"/api/health",
	"/api/cron",
	"/api/slack/commands",
	"/api/webhook-jira",
	"/api/auth/google",
	"/api/auth/refresh",
	"/api/auth/logout",
	"/login",
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

function wantsHtml(request: NextRequest): boolean {
	const accept = request.headers.get("accept") ?? ""
	return accept.includes("text/html")
}

function unauthorized(request: NextRequest, pathname: string): NextResponse {
	if (wantsHtml(request)) {
		const url = request.nextUrl.clone()
		url.pathname = "/login"
		url.searchParams.set("next", pathname)
		return NextResponse.redirect(url)
	}
	return new NextResponse(
		JSON.stringify({ success: false, error: "Access denied" }),
		{ status: 403, headers: { "Content-Type": "application/json" } }
	)
}

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl

	if (trustedIPs.length > 0 && !isPublicPath(pathname)) {
		const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value
		const hasValidSession =
			sessionCookie && (await verifySessionCookie(sessionCookie, TRUSTED_IPS_RAW))

		if (hasValidSession) {
			return applySecurityHeaders(NextResponse.next())
		}

		// Google-auth cookie (browser nav off-VPN)
		const authCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value
		if (authCookie) {
			const claims = await verifyAccessToken(authCookie)
			if (claims) {
				const res = applySecurityHeaders(NextResponse.next())
				res.headers.set("x-user-id", claims.sub)
				res.headers.set("x-user-email", claims.email)
				if (claims.name) {
					res.headers.set("x-user-name", encodeURIComponent(claims.name))
				}
				return res
			}
		}

		// Bearer access token (mobile / API clients)
		const authHeader = request.headers.get("authorization")
		if (authHeader?.startsWith("Bearer ")) {
			const claims = await verifyAccessToken(authHeader.slice(7))
			if (claims) {
				const res = applySecurityHeaders(NextResponse.next())
				res.headers.set("x-user-id", claims.sub)
				res.headers.set("x-user-email", claims.email)
				if (claims.name) {
					res.headers.set("x-user-name", encodeURIComponent(claims.name))
				}
				return res
			}
		}

		// Trusted IP → set 7-day IP session cookie
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

		console.warn(
			`[Security] Blocked untrusted IP: ${clientIP} → ${request.method} ${pathname}`
		)
		return unauthorized(request, pathname)
	}

	return applySecurityHeaders(NextResponse.next())
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
