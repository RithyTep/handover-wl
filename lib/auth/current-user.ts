import { headers } from "next/headers"

export type CurrentUser = { id: string; email: string; name?: string }

export async function getCurrentUser(): Promise<CurrentUser | null> {
	const h = await headers()
	const id = h.get("x-user-id")
	const email = h.get("x-user-email")
	if (!id || !email) return null
	const rawName = h.get("x-user-name")
	const name = rawName ? safeDecode(rawName) : undefined
	return { id, email, name }
}

function safeDecode(value: string): string | undefined {
	try {
		return decodeURIComponent(value)
	} catch {
		return undefined
	}
}
