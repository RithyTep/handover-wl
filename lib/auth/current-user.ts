import { headers } from "next/headers"

export type CurrentUser = { id: string; email: string }

export async function getCurrentUser(): Promise<CurrentUser | null> {
	const h = await headers()
	const id = h.get("x-user-id")
	const email = h.get("x-user-email")
	if (!id || !email) return null
	return { id, email }
}
