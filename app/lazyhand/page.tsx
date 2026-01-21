import { cookies } from "next/headers"
import LazyhandLogin from "./lazyhand-login"
import LazyhandShell from "./lazyhand-shell"
import { LAZYHAND_AUTH_COOKIE, isLazyhandAuthed } from "@/lib/lazyhand-auth"

export default async function LazyhandPage() {
	const cookieStore = await cookies()
	const authCookie = cookieStore.get(LAZYHAND_AUTH_COOKIE)?.value
	const authed = isLazyhandAuthed(authCookie)

	if (!authed) {
		return <LazyhandLogin />
	}

	return <LazyhandShell />
}
