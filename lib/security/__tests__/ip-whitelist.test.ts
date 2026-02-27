import { describe, it, expect, vi } from "vitest"
import {
	parseTrustedIPs,
	isIPAllowed,
	createSessionCookie,
	verifySessionCookie,
} from "../ip-whitelist"

describe("parseTrustedIPs", () => {
	it("returns empty array for empty string", () => {
		expect(parseTrustedIPs("")).toEqual([])
	})

	it("parses exact IPs", () => {
		const result = parseTrustedIPs("1.2.3.4,5.6.7.8")
		expect(result).toHaveLength(2)
		expect(result[0]).toEqual({ type: "exact", ip: "1.2.3.4" })
		expect(result[1]).toEqual({ type: "exact", ip: "5.6.7.8" })
	})

	it("parses CIDR ranges", () => {
		const result = parseTrustedIPs("10.0.0.0/16")
		expect(result).toHaveLength(1)
		expect(result[0]).toMatchObject({ type: "cidr" })
	})

	it("handles mixed entries", () => {
		const result = parseTrustedIPs("203.0.113.50,10.0.0.0/16")
		expect(result).toHaveLength(2)
		expect(result[0]).toMatchObject({ type: "exact" })
		expect(result[1]).toMatchObject({ type: "cidr" })
	})

	it("trims whitespace", () => {
		const result = parseTrustedIPs("  1.2.3.4 , 5.6.7.8  ")
		expect(result[0]).toEqual({ type: "exact", ip: "1.2.3.4" })
		expect(result[1]).toEqual({ type: "exact", ip: "5.6.7.8" })
	})

	it("throws on invalid CIDR", () => {
		expect(() => parseTrustedIPs("10.0.0.0/33")).toThrow("Invalid CIDR")
		expect(() => parseTrustedIPs("bad/16")).toThrow("Invalid CIDR")
	})
})

describe("isIPAllowed", () => {
	it("allows all when whitelist is empty", () => {
		expect(isIPAllowed("1.2.3.4", [], false)).toBe(true)
	})

	it("allows exact IP match", () => {
		const wl = parseTrustedIPs("203.0.113.50")
		expect(isIPAllowed("203.0.113.50", wl, false)).toBe(true)
		expect(isIPAllowed("203.0.113.51", wl, false)).toBe(false)
	})

	it("allows IP within CIDR /16 range", () => {
		const wl = parseTrustedIPs("10.0.0.0/16")
		expect(isIPAllowed("10.0.0.1", wl, false)).toBe(true)
		expect(isIPAllowed("10.0.255.255", wl, false)).toBe(true)
		expect(isIPAllowed("10.1.0.1", wl, false)).toBe(false)
	})

	it("allows IP within CIDR /24 range", () => {
		const wl = parseTrustedIPs("192.168.1.0/24")
		expect(isIPAllowed("192.168.1.0", wl, false)).toBe(true)
		expect(isIPAllowed("192.168.1.255", wl, false)).toBe(true)
		expect(isIPAllowed("192.168.2.0", wl, false)).toBe(false)
	})

	it("allows localhost in dev mode", () => {
		const wl = parseTrustedIPs("203.0.113.50")
		expect(isIPAllowed("127.0.0.1", wl, true)).toBe(true)
		expect(isIPAllowed("::1", wl, true)).toBe(true)
	})

	it("blocks localhost in production", () => {
		const wl = parseTrustedIPs("203.0.113.50")
		expect(isIPAllowed("127.0.0.1", wl, false)).toBe(false)
	})

	it("blocks unknown IP", () => {
		const wl = parseTrustedIPs("203.0.113.50")
		expect(isIPAllowed("unknown", wl, false)).toBe(false)
		expect(isIPAllowed("1.1.1.1", wl, false)).toBe(false)
	})
})

describe("session cookie", () => {
	const secret = "203.0.113.50,10.0.0.0/16"

	it("creates and verifies a valid cookie", async () => {
		const cookie = await createSessionCookie(secret)
		expect(cookie).toContain(".")
		expect(await verifySessionCookie(cookie, secret)).toBe(true)
	})

	it("rejects cookie with wrong secret", async () => {
		const cookie = await createSessionCookie(secret)
		expect(await verifySessionCookie(cookie, "wrong-secret")).toBe(false)
	})

	it("rejects tampered cookie", async () => {
		const cookie = await createSessionCookie(secret)
		const tampered = "9999999999999." + cookie.split(".")[1]
		expect(await verifySessionCookie(tampered, secret)).toBe(false)
	})

	it("rejects malformed cookie", async () => {
		expect(await verifySessionCookie("garbage", secret)).toBe(false)
		expect(await verifySessionCookie("", secret)).toBe(false)
	})

	it("rejects expired cookie (>7 days)", async () => {
		const eightDaysAgo = Date.now() - 8 * 24 * 60 * 60 * 1000
		// Manually craft a cookie with old timestamp
		vi.spyOn(Date, "now").mockReturnValue(eightDaysAgo)
		const cookie = await createSessionCookie(secret)
		vi.restoreAllMocks()

		expect(await verifySessionCookie(cookie, secret)).toBe(false)
	})
})
