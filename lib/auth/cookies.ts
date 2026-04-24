import type { NextResponse } from "next/server"
import { env } from "@/lib/env"

export const AUTH_COOKIE_NAME = "auth_token"
export const REFRESH_COOKIE_NAME = "refresh_token"

type CookieOptions = {
	accessToken: string
	refreshToken: string
}

export function setAuthCookies(response: NextResponse, { accessToken, refreshToken }: CookieOptions) {
	const secure = env.NODE_ENV === "production"
	response.cookies.set(AUTH_COOKIE_NAME, accessToken, {
		httpOnly: true,
		secure,
		sameSite: "lax",
		path: "/",
		maxAge: env.ACCESS_TOKEN_TTL_S,
	})
	response.cookies.set(REFRESH_COOKIE_NAME, refreshToken, {
		httpOnly: true,
		secure,
		sameSite: "lax",
		path: "/",
		maxAge: env.REFRESH_TOKEN_TTL_S,
	})
}

export function clearAuthCookies(response: NextResponse) {
	response.cookies.delete(AUTH_COOKIE_NAME)
	response.cookies.delete(REFRESH_COOKIE_NAME)
}
