#!/usr/bin/env node
import { spawn } from "node:child_process"

const args = process.argv.slice(2)
const command = (args[0] || "copy").toLowerCase()
const appUrl = (process.env.HANDOVER_APP_URL || process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "")

function usage() {
	console.log(`Usage:
  handover            Copy handover text to clipboard
  handover copy       Copy handover text to clipboard
  handover print      Print handover text to stdout
  handover send       Send handover to Slack

Environment:
  HANDOVER_APP_URL or APP_URL (default: http://localhost:3000)`)
}

async function fetchJson(path, options) {
	const response = await fetch(`${appUrl}${path}`, options)
	const data = await response.json().catch(() => ({}))
	if (!response.ok || data?.success === false) {
		const errorText = data?.error || `Request failed (${response.status})`
		throw new Error(errorText)
	}
	return data
}

function tryCopyWith(commandName, argsList, text) {
	return new Promise((resolve, reject) => {
		const proc = spawn(commandName, argsList)
		proc.on("error", reject)
		proc.on("close", (code) => {
			if (code === 0) resolve()
			else reject(new Error(`Clipboard command exited with ${code}`))
		})
		proc.stdin.end(text)
	})
}

async function copyToClipboard(text) {
	const platform = process.platform
	if (platform === "darwin") {
		return tryCopyWith("pbcopy", [], text)
	}
	if (platform === "win32") {
		return tryCopyWith("clip", [], text)
	}

	try {
		return await tryCopyWith("wl-copy", [], text)
	} catch (error) {
		return tryCopyWith("xclip", ["-selection", "clipboard"], text)
	}
}

async function runCopy(printOnly) {
	const data = await fetchJson("/api/handover-copy", { cache: "no-store" })
	const text = data?.text || ""

	if (!text) {
		console.error("No handover text found.")
		process.exit(1)
	}

	if (printOnly) {
		console.log(text)
		return
	}

	try {
		await copyToClipboard(text)
		console.log("Handover copied to clipboard.")
	} catch (error) {
		console.error("Clipboard copy failed. Printing text instead.\n")
		console.log(text)
		process.exit(1)
	}
}

async function runSend() {
	const data = await fetchJson("/api/handover-send", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
	})

	console.log(
		`Sent ${data.ticketsProcessed || 0} ticket(s) to Slack.`
	)
}

async function main() {
	if (["-h", "--help", "help"].includes(command)) {
		usage()
		return
	}

	if (command === "copy") {
		await runCopy(false)
		return
	}

	if (command === "print") {
		await runCopy(true)
		return
	}

	if (command === "send") {
		await runSend()
		return
	}

	if (command === "handover") {
		await runCopy(false)
		return
	}

	usage()
	process.exit(1)
}

main().catch((error) => {
	console.error(error?.message || String(error))
	process.exit(1)
})
