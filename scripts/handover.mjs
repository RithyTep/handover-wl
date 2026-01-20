#!/usr/bin/env node
import { spawn } from "node:child_process"

import { basename } from "node:path"

const args = process.argv.slice(2)
const invokedAs = basename(process.argv[1] || "")
const defaultCommand = invokedAs === "lazyhand" ? "reply" : "copy"
const command = (args[0] || defaultCommand).toLowerCase()
const appUrl = (process.env.HANDOVER_APP_URL || process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "")
const envToken = process.env.HANDOVER_SLACK_USER_TOKEN || process.env.SLACK_USER_TOKEN
const envChannel = process.env.HANDOVER_SLACK_CHANNEL_ID || process.env.SLACK_CHANNEL_ID
const envMentions = process.env.HANDOVER_SLACK_MENTIONS

function getArgValue(flag) {
	const index = args.indexOf(flag)
	if (index === -1) return undefined
	return args[index + 1]
}

function usage() {
	console.log(`Usage:
  handover            Copy handover text to clipboard
  handover copy       Copy handover text to clipboard
  handover print      Print handover text to stdout
  handover send       Send handover to Slack
  handover reply      Reply to latest handover message in Slack
  lazyhand            AI fill missing fields and reply to latest handover

Environment:
  HANDOVER_APP_URL or APP_URL (default: http://localhost:3000)
  HANDOVER_SLACK_USER_TOKEN or SLACK_USER_TOKEN
  HANDOVER_SLACK_CHANNEL_ID or SLACK_CHANNEL_ID
  HANDOVER_SLACK_MENTIONS (e.g. "<@U123> <@U456>")`)
}

async function fetchJson(path, options) {
	try {
		const response = await fetch(`${appUrl}${path}`, options)
		const data = await response.json().catch(() => ({}))
		if (!response.ok || data?.success === false) {
			const errorText = data?.error || `Request failed (${response.status})`
			throw new Error(errorText)
		}
		return data
	} catch (error) {
		const data = await fetchJsonWithCurl(path, options)
		if (data?.success === false) {
			const errorText = data?.error || "Request failed"
			throw new Error(errorText)
		}
		return data
	}
}

function runCurl(url, options) {
	return new Promise((resolve, reject) => {
		const args = ["-sS", "-X", options?.method || "GET"]
		const headers = options?.headers || {}
		for (const [key, value] of Object.entries(headers)) {
			args.push("-H", `${key}: ${value}`)
		}
		if (options?.body) {
			args.push("-d", options.body)
		}
		args.push(url)

		const proc = spawn("curl", args)
		let stdout = ""
		let stderr = ""
		proc.stdout.on("data", (chunk) => {
			stdout += chunk.toString()
		})
		proc.stderr.on("data", (chunk) => {
			stderr += chunk.toString()
		})
		proc.on("error", reject)
		proc.on("close", (code) => {
			if (code === 0) resolve(stdout)
			else reject(new Error(stderr || `curl exited with ${code}`))
		})
	})
}

async function fetchJsonWithCurl(path, options) {
	const url = `${appUrl}${path}`
	const responseText = await runCurl(url, options)
	if (!responseText || !responseText.trim()) {
		throw new Error("Empty response from server.")
	}
	try {
		return JSON.parse(responseText)
	} catch (error) {
		const preview = responseText.slice(0, 200)
		throw new Error(`Invalid JSON response: ${preview}`)
	}
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

async function runReply() {
	const token = getArgValue("--token") || envToken
	const channelId = getArgValue("--channel") || envChannel
	const mentions = getArgValue("--mentions") || envMentions
	const limit = Number(getArgValue("--limit") || 10)

	if (!token || !channelId) {
		console.error("Missing --token/--channel or env vars for Slack user token and channel ID.")
		process.exit(1)
	}

	const data = await fetchJson("/api/handover-reply", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ token, channelId, limit, mentions }),
	})

	if (data.replied) {
		console.log(`Replied to handover message in ${channelId}.`)
		return
	}

	console.log(data.message || "No reply was sent.")
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

	if (command === "reply") {
		await runReply()
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
