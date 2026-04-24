"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

type GoogleCredentialResponse = { credential?: string }

declare global {
	interface Window {
		google?: {
			accounts: {
				id: {
					initialize: (config: {
						client_id: string
						callback: (response: GoogleCredentialResponse) => void
						hosted_domain?: string
						ux_mode?: "popup" | "redirect"
					}) => void
					renderButton: (
						parent: HTMLElement,
						options: Record<string, unknown>
					) => void
					prompt: () => void
				}
			}
		}
	}
}

export function LoginCard() {
	const router = useRouter()
	const params = useSearchParams()
	const next = params.get("next") ?? "/"
	const buttonRef = useRef<HTMLDivElement>(null)
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)
	const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

	useEffect(() => {
		if (!clientId) return
		const script = document.createElement("script")
		script.src = "https://accounts.google.com/gsi/client"
		script.async = true
		script.defer = true
		script.onload = () => {
			if (!window.google || !buttonRef.current) return
			window.google.accounts.id.initialize({
				client_id: clientId,
				callback: async (response) => {
					if (!response.credential) return
					setLoading(true)
					setError(null)
					try {
						const res = await fetch("/api/auth/google", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ idToken: response.credential }),
						})
						const data = await res.json()
						if (!res.ok || !data.success) {
							throw new Error(data.error ?? "Login failed")
						}
						router.replace(next)
					} catch (err) {
						setError((err as Error).message)
						setLoading(false)
					}
				},
				hosted_domain: "techbodia.com",
				ux_mode: "popup",
			})
			window.google.accounts.id.renderButton(buttonRef.current, {
				theme: "filled_black",
				size: "large",
				type: "standard",
				shape: "pill",
				text: "signin_with",
				logo_alignment: "left",
			})
		}
		document.body.appendChild(script)
		return () => {
			script.remove()
		}
	}, [clientId, next, router])

	return (
		<div className="w-full max-w-sm rounded-2xl bg-neutral-900 p-8 shadow-xl ring-1 ring-white/5">
			<h1 className="text-xl font-semibold text-white">Sign in to Handover</h1>
			<p className="mt-2 text-sm text-neutral-400">
				Use your <span className="text-neutral-200">@techbodia.com</span> Google account.
			</p>

			<div className="mt-6 flex justify-center">
				{clientId ? (
					<div ref={buttonRef} />
				) : (
					<p className="text-sm text-red-400">
						NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured.
					</p>
				)}
			</div>

			{loading && <p className="mt-4 text-center text-sm text-neutral-400">Signing in…</p>}
			{error && <p className="mt-4 text-center text-sm text-red-400">{error}</p>}
		</div>
	)
}
