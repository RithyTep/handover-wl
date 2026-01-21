"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LazyhandLogin() {
	const [password, setPassword] = useState("")
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(false)

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setError("")
		setLoading(true)

		try {
			const response = await fetch("/api/lazyhand-auth", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ password }),
			})
			const data = await response.json().catch(() => ({}))
			if (!response.ok) {
				throw new Error(data?.error || "Authentication failed")
			}
			window.location.reload()
		} catch (err) {
			const message = err instanceof Error ? err.message : "Authentication failed"
			setError(message)
			setPassword("")
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-background px-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Lazyhand Access</CardTitle>
					<CardDescription>Enter the password to continue.</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="lazyhand-password">Password</Label>
							<Input
								id="lazyhand-password"
								type="password"
								autoComplete="current-password"
								value={password}
								onChange={(event) => setPassword(event.target.value)}
								placeholder="Enter password"
								required
							/>
							{error ? <p className="text-sm text-red-500">{error}</p> : null}
						</div>
						<Button type="submit" className="w-full" disabled={loading}>
							{loading ? "Unlocking..." : "Unlock"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
