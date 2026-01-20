#!/usr/bin/env node
import http from "node:http"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { spawn } from "node:child_process"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const REPO_ROOT = path.resolve(__dirname, "..")

const HOST = "127.0.0.1"
const PORT = Number(process.env.LAZYHAND_UI_PORT || 3199)

const CONFIG_DIR = path.join(os.homedir(), ".lazyhand")
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json")

const DEFAULT_CONFIG = {
	appUrl: "https://handover-production.rithytep.online",
	token: "",
	channelId: "",
	mentions: "",
	preset: "day",
	hour: "21",
	minute: "8",
}

function readConfig() {
	try {
		if (!fs.existsSync(CONFIG_FILE)) return { ...DEFAULT_CONFIG }
		const raw = fs.readFileSync(CONFIG_FILE, "utf8")
		return { ...DEFAULT_CONFIG, ...JSON.parse(raw) }
	} catch (error) {
		return { ...DEFAULT_CONFIG }
	}
}

function writeConfig(config) {
	fs.mkdirSync(CONFIG_DIR, { recursive: true })
	fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), "utf8")
}

function sendJson(res, status, payload) {
	res.writeHead(status, { "Content-Type": "application/json" })
	res.end(JSON.stringify(payload))
}

function parseJsonBody(req) {
	return new Promise((resolve, reject) => {
		let data = ""
		req.on("data", (chunk) => {
			data += chunk.toString()
		})
		req.on("end", () => {
			if (!data) return resolve({})
			try {
				resolve(JSON.parse(data))
			} catch (error) {
				reject(new Error("Invalid JSON"))
			}
		})
	})
}

function runScript(scriptPath, env) {
	return new Promise((resolve, reject) => {
		const child = spawn(scriptPath, [], { env })
		let stdout = ""
		let stderr = ""
		child.stdout.on("data", (chunk) => {
			stdout += chunk.toString()
		})
		child.stderr.on("data", (chunk) => {
			stderr += chunk.toString()
		})
		child.on("close", (code) => {
			if (code === 0) resolve({ stdout, stderr })
			else reject(new Error(stderr || `Command failed (${code})`))
		})
	})
}

function runNodeScript(scriptPath, args, env) {
	return new Promise((resolve, reject) => {
		const command = scriptPath === "launchctl" ? "launchctl" : process.execPath
		const childArgs = scriptPath === "launchctl" ? args : [scriptPath, ...args]
		const child = spawn(command, childArgs, { env })
		let stdout = ""
		let stderr = ""
		child.stdout.on("data", (chunk) => {
			stdout += chunk.toString()
		})
		child.stderr.on("data", (chunk) => {
			stderr += chunk.toString()
		})
		child.on("close", (code) => {
			if (code === 0) resolve({ stdout, stderr })
			else reject(new Error(stderr || `Command failed (${code})`))
		})
	})
}

function runCommand(command, args) {
	return new Promise((resolve, reject) => {
		const child = spawn(command, args)
		let stdout = ""
		let stderr = ""
		child.stdout.on("data", (chunk) => {
			stdout += chunk.toString()
		})
		child.stderr.on("data", (chunk) => {
			stderr += chunk.toString()
		})
		child.on("close", (code) => {
			if (code === 0) resolve({ stdout, stderr })
			else reject(new Error(stderr || `Command failed (${code})`))
		})
	})
}

function baseEnv(config) {
	return {
		...process.env,
		HANDOVER_APP_URL: config.appUrl,
		HANDOVER_SLACK_USER_TOKEN: config.token,
		HANDOVER_SLACK_CHANNEL_ID: config.channelId,
		HANDOVER_SLACK_MENTIONS: config.mentions || "",
	}
}

function derivePreset(hour, minute) {
	if (Number(hour) === 17 && Number(minute) === 16) return "day"
	if (Number(hour) === 23 && Number(minute) === 46) return "night"
	return "custom"
}

async function readLaunchAgent() {
	const plistPath = path.join(
		os.homedir(),
		"Library",
		"LaunchAgents",
		"com.handover.lazyhand.plist"
	)

	if (!fs.existsSync(plistPath)) {
		return { found: false }
	}

	const { stdout } = await runCommand("/usr/bin/plutil", [
		"-convert",
		"json",
		"-o",
		"-",
		"--",
		plistPath,
	])
	const data = JSON.parse(stdout)
	const env = data.EnvironmentVariables || {}
	const interval = data.StartCalendarInterval || {}
	const hour = interval.Hour != null ? String(interval.Hour) : ""
	const minute = interval.Minute != null ? String(interval.Minute) : ""
	const preset = derivePreset(hour, minute)

	return {
		found: true,
		config: {
			appUrl: env.HANDOVER_APP_URL || DEFAULT_CONFIG.appUrl,
			token: env.HANDOVER_SLACK_USER_TOKEN || "",
			channelId: env.HANDOVER_SLACK_CHANNEL_ID || "",
			mentions: env.HANDOVER_SLACK_MENTIONS || "",
			preset,
			hour: hour || DEFAULT_CONFIG.hour,
			minute: minute || DEFAULT_CONFIG.minute,
		},
	}
}

const html = `<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>Lazyhand Scheduler</title>
		<style>
			@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap");

			:root {
				--bg: #f4f3ef;
				--ink: #111111;
				--muted: #6f6f6f;
				--card: #ffffff;
				--border: #e2e2e2;
				--accent: #111111;
				--accent-soft: #f0f0f0;
				--ring: rgba(17, 17, 17, 0.12);
			}

			* { box-sizing: border-box; }

			body {
				margin: 0;
				font-family: "Space Grotesk", "Helvetica Neue", sans-serif;
				color: var(--ink);
				background:
					radial-gradient(720px 320px at 12% -10%, rgba(0, 0, 0, 0.08), transparent 60%),
					radial-gradient(600px 320px at 90% 0%, rgba(0, 0, 0, 0.06), transparent 60%),
					var(--bg);
				min-height: 100vh;
			}

			.app {
				max-width: 980px;
				margin: 0 auto;
				padding: 32px 18px 48px;
				display: grid;
				gap: 22px;
			}

			.header {
				display: grid;
				gap: 6px;
				animation: fadeUp 0.6s ease both;
			}

			.header h1 {
				margin: 0;
				font-size: clamp(2rem, 2.6vw, 2.6rem);
				letter-spacing: -0.02em;
			}

			.header p {
				margin: 0;
				color: var(--muted);
				max-width: 520px;
			}

			.grid {
				display: grid;
				gap: 18px;
				grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
			}

			.card {
				background: var(--card);
				border: 1px solid var(--border);
				border-radius: 16px;
				padding: 18px;
				box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
				animation: fadeUp 0.7s ease both;
			}

			.grid .card:nth-child(2) {
				animation-delay: 0.08s;
			}

			.card-title {
				font-size: 1.05rem;
				font-weight: 600;
				margin-bottom: 12px;
			}

			.field {
				display: flex;
				flex-direction: column;
				gap: 6px;
				margin-bottom: 14px;
			}

			label {
				font-family: "IBM Plex Mono", "SFMono-Regular", monospace;
				font-size: 0.72rem;
				text-transform: uppercase;
				letter-spacing: 0.12em;
				color: var(--muted);
			}

			input, textarea, select {
				border: 1px solid var(--border);
				border-radius: 10px;
				padding: 10px 12px;
				font-size: 0.95rem;
				background: #ffffff;
				font-family: inherit;
				transition: border-color 0.2s ease, box-shadow 0.2s ease;
			}

			input:focus, textarea:focus {
				outline: none;
				border-color: var(--accent);
				box-shadow: 0 0 0 3px var(--ring);
			}

			textarea { min-height: 72px; resize: vertical; }

			.pill-row {
				display: flex;
				flex-wrap: wrap;
				gap: 10px;
			}

			.pill {
				border: 1px solid var(--border);
				border-radius: 999px;
				padding: 6px 12px;
				cursor: pointer;
				display: inline-flex;
				gap: 6px;
				align-items: center;
				background: #ffffff;
				transition: all 0.2s ease;
			}

			.pill input { display: none; }

			.pill.active {
				background: var(--accent);
				color: white;
				border-color: transparent;
			}

			.time-row {
				display: flex;
				gap: 12px;
				align-items: center;
				margin-top: 12px;
			}

			.time-row input {
				width: 90px;
			}

			.actions {
				display: flex;
				flex-wrap: wrap;
				gap: 12px;
				margin-top: 12px;
			}

			button {
				border: 1px solid transparent;
				border-radius: 10px;
				padding: 10px 16px;
				font-size: 0.9rem;
				cursor: pointer;
				font-weight: 600;
				transition: transform 0.2s ease, box-shadow 0.2s ease;
			}

			button.primary {
				background: var(--accent);
				color: #ffffff;
			}

			button.secondary {
				background: var(--accent-soft);
				color: var(--ink);
				border-color: var(--border);
			}

			button.ghost {
				background: transparent;
				color: var(--ink);
				border: 1px dashed var(--border);
			}

			button:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12); }

			.statusbar {
				border: 1px dashed var(--border);
				padding: 10px 12px;
				font-size: 0.85rem;
				display: flex;
				gap: 8px;
				align-items: center;
				border-radius: 12px;
				background: #fafafa;
			}

			.statusbar.error {
				color: #a11;
				background: #fff1f1;
				border-color: #f0c2c2;
			}

			@keyframes fadeUp {
				from { opacity: 0; transform: translateY(8px); }
				to { opacity: 1; transform: translateY(0); }
			}
		</style>
	</head>
	<body>
		<div class="app">
			<header class="header">
				<h1>Lazyhand Scheduler</h1>
				<p>Schedule auto-replies for the latest handover message. Pick a preset or customize your own times.</p>
			</header>

			<main class="grid">
				<section class="card">
					<div class="card-title">Connection</div>
					<div class="field">
						<label for="appUrl">App URL</label>
						<input id="appUrl" type="text" placeholder="https://handover-production.rithytep.online" />
					</div>
					<div class="field">
						<label for="token">Slack User Token</label>
						<input id="token" type="password" placeholder="xoxp-..." />
					</div>
					<div class="field">
						<label for="channel">Slack Channel ID</label>
						<input id="channel" type="text" placeholder="C123456" />
					</div>
					<div class="field">
						<label for="mentions">Mentions</label>
						<textarea id="mentions" placeholder="<@U123> <@U456>"></textarea>
					</div>
				</section>

				<section class="card">
					<div class="card-title">Schedule</div>
					<div class="pill-row" id="presetRow">
						<label class="pill"><input type="radio" name="preset" value="off" />Off</label>
						<label class="pill"><input type="radio" name="preset" value="day" />Day · 17:16</label>
						<label class="pill"><input type="radio" name="preset" value="night" />Night · 23:46</label>
						<label class="pill"><input type="radio" name="preset" value="custom" />Custom</label>
					</div>
					<div class="time-row" id="customRow">
						<label>Hour <input id="hour" type="number" min="0" max="23" /></label>
						<label>Minute <input id="minute" type="number" min="0" max="59" /></label>
					</div>
					<div class="actions">
						<button class="primary" id="applyBtn">Apply Schedule</button>
						<button class="secondary" id="stopBtn">Stop Schedule</button>
						<button class="ghost" id="runBtn">Run Now</button>
						<button class="ghost" id="syncBtn">Sync LaunchAgent</button>
					</div>
				</section>
			</main>

			<div class="statusbar">
				<span class="status-label">Status:</span>
				<span id="statusBox">Ready.</span>
			</div>
		</div>

		<script>
			const presetRow = document.getElementById("presetRow");
			const customRow = document.getElementById("customRow");
			const statusBox = document.getElementById("statusBox");
			const statusBar = document.querySelector(".statusbar");

			const appUrlEl = document.getElementById("appUrl");
			const tokenEl = document.getElementById("token");
			const channelEl = document.getElementById("channel");
			const mentionsEl = document.getElementById("mentions");
			const hourEl = document.getElementById("hour");
			const minuteEl = document.getElementById("minute");

			function setStatus(text, tone = "ok") {
				statusBox.textContent = text;
				if (statusBar) {
					statusBar.classList.toggle("error", tone === "error");
				}
			}

			function getPreset() {
				const checked = document.querySelector("input[name='preset']:checked");
				return checked ? checked.value : "day";
			}

			function updatePresetUI() {
				const preset = getPreset();
				customRow.style.display = preset === "custom" ? "flex" : "none";
				document.querySelectorAll(".pill").forEach((pill) => {
					const input = pill.querySelector("input");
					pill.classList.toggle("active", input && input.checked);
				});
			}

			presetRow.addEventListener("change", updatePresetUI);

			async function loadConfig() {
				try {
					const response = await fetch("/config");
					const data = await response.json();
					appUrlEl.value = data.appUrl || "";
					tokenEl.value = data.token || "";
					channelEl.value = data.channelId || "";
					mentionsEl.value = data.mentions || "";
					hourEl.value = data.hour || "21";
					minuteEl.value = data.minute || "8";
					const presetInput = document.querySelector('input[name="preset"][value="' + (data.preset || "day") + '"]');
					if (presetInput) presetInput.checked = true;
					updatePresetUI();
				} catch (error) {
					setStatus("Failed to load config.", "error");
				}
			}


			function hydrateForm(data) {
				appUrlEl.value = data.appUrl || "";
				tokenEl.value = data.token || "";
				channelEl.value = data.channelId || "";
				mentionsEl.value = data.mentions || "";
				hourEl.value = data.hour || "21";
				minuteEl.value = data.minute || "8";
				const presetInput = document.querySelector('input[name="preset"][value="' + (data.preset || "day") + '"]');
				if (presetInput) presetInput.checked = true;
				updatePresetUI();
			}

			function buildPayload() {
				return {
					appUrl: appUrlEl.value.trim(),
					token: tokenEl.value.trim(),
					channelId: channelEl.value.trim(),
					mentions: mentionsEl.value.trim(),
					preset: getPreset(),
					hour: hourEl.value.trim(),
					minute: minuteEl.value.trim(),
				};
			}

			async function postJson(path, payload) {
				const response = await fetch(path, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload || {}),
				});
				const data = await response.json();
				if (!response.ok) throw new Error(data?.error || "Request failed");
				return data;
			}

			document.getElementById("applyBtn").addEventListener("click", async () => {
				setStatus("Applying schedule...");
				try {
					const data = await postJson("/apply", buildPayload());
					setStatus(data.message || "Schedule applied.");
				} catch (error) {
					setStatus(error.message || "Apply failed.", "error");
				}
			});

			document.getElementById("stopBtn").addEventListener("click", async () => {
				setStatus("Stopping schedule...");
				try {
					const data = await postJson("/stop");
					setStatus(data.message || "Schedule stopped.");
				} catch (error) {
					setStatus(error.message || "Stop failed.", "error");
				}
			});

			document.getElementById("runBtn").addEventListener("click", async () => {
				setStatus("Running now...");
				try {
					const data = await postJson("/run", buildPayload());
					setStatus(data.message || "Run completed.");
				} catch (error) {
					setStatus(error.message || "Run failed.", "error");
				}
			});

			document.getElementById("syncBtn").addEventListener("click", async () => {
				setStatus("Syncing from LaunchAgent...");
				try {
					const response = await fetch("/sync");
					const data = await response.json();
					if (!response.ok) throw new Error(data?.error || "Sync failed.");
					if (data?.config) {
						hydrateForm(data.config);
						setStatus("Synced from LaunchAgent.");
					} else {
						setStatus("No schedule found.", "error");
					}
				} catch (error) {
					setStatus(error.message || "Sync failed.", "error");
				}
			});

			loadConfig();
		</script>
	</body>
</html>`

const server = http.createServer(async (req, res) => {
	if (!req.url) {
		sendJson(res, 404, { error: "Not found" })
		return
	}

	if (req.method === "GET" && req.url === "/") {
		res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
		res.end(html)
		return
	}

	if (req.method === "GET" && req.url === "/config") {
		sendJson(res, 200, readConfig())
		return
	}

	if (req.method === "GET" && req.url === "/sync") {
		try {
			const result = await readLaunchAgent()
			if (!result.found) {
				sendJson(res, 404, { error: "No LaunchAgent schedule found." })
				return
			}
			writeConfig(result.config)
			sendJson(res, 200, result)
		} catch (error) {
			sendJson(res, 500, { error: error.message || "Sync failed." })
		}
		return
	}

	if (req.method === "POST" && req.url === "/apply") {
		try {
			const payload = await parseJsonBody(req)
			const config = { ...DEFAULT_CONFIG, ...payload }
			writeConfig(config)

			const scriptPath = path.join(REPO_ROOT, "scripts", "setup-lazyhand-macos.sh")
			if (!fs.existsSync(scriptPath)) {
				sendJson(res, 500, { error: "setup-lazyhand-macos.sh not found" })
				return
			}

			const env = {
				...baseEnv(config),
				SCHEDULE_PRESET: config.preset || "day",
				SCHEDULE_HOUR: config.hour || "21",
				SCHEDULE_MINUTE: config.minute || "8",
			}

			await runScript(scriptPath, env)
			sendJson(res, 200, { message: "Schedule applied." })
		} catch (error) {
			sendJson(res, 500, { error: error.message || "Failed to apply schedule." })
		}
		return
	}

	if (req.method === "POST" && req.url === "/stop") {
		try {
			const plistPath = path.join(
				os.homedir(),
				"Library",
				"LaunchAgents",
				"com.handover.lazyhand.plist"
			)
			const uid = process.getuid()
			await runNodeScript("launchctl", ["bootout", `gui/${uid}`, plistPath], process.env)
			sendJson(res, 200, { message: "Schedule stopped." })
		} catch (error) {
			sendJson(res, 500, { error: error.message || "Failed to stop schedule." })
		}
		return
	}

	if (req.method === "POST" && req.url === "/run") {
		try {
			const payload = await parseJsonBody(req)
			const config = { ...DEFAULT_CONFIG, ...payload }
			writeConfig(config)

			const scriptPath = path.join(REPO_ROOT, "scripts", "handover.mjs")
			const env = baseEnv(config)
			await runNodeScript(scriptPath, ["reply"], env)
			sendJson(res, 200, { message: "Reply sent." })
		} catch (error) {
			sendJson(res, 500, { error: error.message || "Failed to run reply." })
		}
		return
	}

	sendJson(res, 404, { error: "Not found" })
})

server.listen(PORT, HOST, () => {
	console.log(`Lazyhand UI running at http://${HOST}:${PORT}`)
})
