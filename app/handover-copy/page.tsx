"use client"

import { useEffect, useState } from "react"

type CopyState = "idle" | "loading" | "copied" | "failed"

export default function HandoverCopyPage() {
	const [text, setText] = useState("")
	const [state, setState] = useState<CopyState>("loading")

	useEffect(() => {
		let isMounted = true

		async function fetchAndCopy() {
			try {
				const response = await fetch("/api/handover-copy", { cache: "no-store" })
				const data = await response.json()
				const copyText = data?.text || ""

				if (!isMounted) return

				setText(copyText)
				await navigator.clipboard.writeText(copyText)
				if (isMounted) setState("copied")
			} catch (error) {
				if (isMounted) setState("failed")
			}
		}

		fetchAndCopy()

		return () => {
			isMounted = false
		}
	}, [])

	const statusMessage =
		state === "copied"
			? "Copied to clipboard."
			: state === "failed"
				? "Auto-copy failed. Please copy manually."
				: "Preparing handover text..."

	return (
		<main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10">
			<h1 className="text-2xl font-semibold">Handover Copy</h1>
			<p className="text-sm text-muted-foreground">{statusMessage}</p>
			<textarea
				className="min-h-[280px] w-full rounded-md border border-border bg-background p-4 text-sm"
				value={text}
				readOnly
			/>
			<button
				className="w-fit rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
				onClick={async () => {
					try {
						await navigator.clipboard.writeText(text)
						setState("copied")
					} catch (error) {
						setState("failed")
					}
				}}
				type="button"
			>
				Copy Again
			</button>
		</main>
	)
}
