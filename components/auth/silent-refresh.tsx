"use client"

import { useEffect } from "react"

const REFRESH_INTERVAL_MS = 55 * 60 * 1000 // 55 min, slightly before 1h access token expiry

export function SilentRefresh() {
	useEffect(() => {
		const refresh = () => {
			fetch("/api/auth/refresh", {
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: "{}",
			}).catch(() => {})
		}
		const id = window.setInterval(refresh, REFRESH_INTERVAL_MS)
		return () => window.clearInterval(id)
	}, [])
	return null
}
