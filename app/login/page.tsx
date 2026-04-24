import { Suspense } from "react"
import { LoginCard } from "./login-card"

export const dynamic = "force-dynamic"

export default function LoginPage() {
	return (
		<main className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
			<Suspense fallback={null}>
				<LoginCard />
			</Suspense>
		</main>
	)
}
