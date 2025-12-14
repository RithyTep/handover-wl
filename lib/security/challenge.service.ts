import { SignJWT, jwtVerify, type JWTPayload } from "jose"
import {
	POW_DIFFICULTY,
	CHALLENGE_TOKEN_EXPIRY_MS,
	POW_SOLUTION_VALIDITY_MS,
	HEADERS,
	ERRORS,
	JWT_SECRET_ENV,
	INTERNAL_SECRET_ENV,
} from "./constants"
import type {
	ChallengeTokenPayload,
	ChallengeResponse,
	ChallengeValidationResult,
} from "./types"
import { validatePoWSolution, generateChallenge, hashRequestBody } from "./pow"
import { validateFingerprint, hashFingerprint, isValidFingerprintFormat } from "./fingerprint"
import { consumeNonce } from "./nonce"
import { logger } from "@/lib/logger"

const log = logger.security

interface ChallengeHeaders {
	token: string | null
	nonce: string | null
	powSolution: string | null
	powInput: string | null
	fingerprint: string | null
	timestampStr: string | null
	requestHash: string | null
}

function getJwtSecret(): Uint8Array {
	const secret = process.env[JWT_SECRET_ENV]
	if (!secret) {
		log.warn("JWT secret not configured", { env: JWT_SECRET_ENV })
		return new TextEncoder().encode("fallback-secret-change-in-production-" + Date.now())
	}
	return new TextEncoder().encode(secret)
}

function getInternalSecret(): string | null {
	return process.env[INTERNAL_SECRET_ENV] || null
}

function extractChallengeHeaders(headers: Headers): ChallengeHeaders {
	return {
		token: headers.get(HEADERS.CHALLENGE_TOKEN),
		nonce: headers.get(HEADERS.CHALLENGE_NONCE),
		powSolution: headers.get(HEADERS.CHALLENGE_POW),
		powInput: headers.get(HEADERS.CHALLENGE_POW_INPUT),
		fingerprint: headers.get(HEADERS.CHALLENGE_FINGERPRINT),
		timestampStr: headers.get(HEADERS.CHALLENGE_TIMESTAMP),
		requestHash: headers.get(HEADERS.CHALLENGE_REQUEST_HASH),
	}
}

function validateRequiredHeaders(h: ChallengeHeaders): ChallengeValidationResult | null {
	if (!h.token || !h.nonce || !h.powSolution || !h.powInput || !h.fingerprint || !h.timestampStr) {
		return { valid: false, error: ERRORS.MISSING_CHALLENGE }
	}
	return null
}

function validateTimestamp(timestampStr: string): { timestamp: number } | ChallengeValidationResult {
	const timestamp = parseInt(timestampStr, 10)
	if (isNaN(timestamp)) {
		return { valid: false, error: ERRORS.MISSING_CHALLENGE }
	}
	return { timestamp }
}

async function verifyToken(token: string): Promise<ChallengeTokenPayload | ChallengeValidationResult> {
	try {
		const { payload: verified } = await jwtVerify(token, getJwtSecret())
		return verified as unknown as ChallengeTokenPayload
	} catch {
		return { valid: false, error: ERRORS.INVALID_TOKEN }
	}
}

function validateTokenExpiry(payload: ChallengeTokenPayload): ChallengeValidationResult | null {
	if (Date.now() > payload.expiresAt) {
		return { valid: false, error: ERRORS.TOKEN_EXPIRED }
	}
	return null
}

function validateFingerprintMatch(
	fingerprint: string,
	payloadFingerprint: string
): ChallengeValidationResult | null {
	const hashedFingerprint = hashFingerprint(fingerprint)
	if (!validateFingerprint(hashedFingerprint, payloadFingerprint)) {
		return { valid: false, error: ERRORS.FINGERPRINT_MISMATCH }
	}
	return null
}

function validatePoWTiming(timestamp: number): ChallengeValidationResult | null {
	if (Math.abs(Date.now() - timestamp) > POW_SOLUTION_VALIDITY_MS) {
		return { valid: false, error: ERRORS.POW_EXPIRED }
	}
	return null
}

function validatePoW(
	powInput: string,
	powSolution: string,
	difficulty: number
): ChallengeValidationResult | null {
	if (!validatePoWSolution(powInput, powSolution, difficulty)) {
		return { valid: false, error: ERRORS.INVALID_POW }
	}
	return null
}

function validateNonce(sessionId: string, nonce: string): ChallengeValidationResult | null {
	if (!consumeNonce(sessionId, nonce)) {
		return { valid: false, error: ERRORS.NONCE_REUSED }
	}
	return null
}

function validateRequestHash(
	requestBody: unknown | undefined,
	requestHash: string | null
): ChallengeValidationResult | null {
	if (requestBody !== undefined && requestHash) {
		const expectedHash = hashRequestBody(requestBody)
		if (requestHash !== expectedHash) {
			return { valid: false, error: ERRORS.REQUEST_HASH_MISMATCH }
		}
	}
	return null
}

export async function generateChallengeToken(fingerprint: string): Promise<ChallengeResponse> {
	if (!isValidFingerprintFormat(fingerprint)) {
		throw new Error("Invalid fingerprint format")
	}

	const sessionId = crypto.randomUUID()
	const challenge = generateChallenge()
	const now = Date.now()
	const expiresAt = now + CHALLENGE_TOKEN_EXPIRY_MS

	const hashedFingerprint = hashFingerprint(fingerprint)

	const payload: ChallengeTokenPayload = {
		sessionId,
		fingerprint: hashedFingerprint,
		issuedAt: now,
		difficulty: POW_DIFFICULTY,
		expiresAt,
	}

	const token = await new SignJWT(payload as unknown as JWTPayload)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime(expiresAt / 1000)
		.sign(getJwtSecret())

	return { token, difficulty: POW_DIFFICULTY, challenge, expiresAt }
}

export async function validateChallenge(
	headers: Headers,
	requestBody?: unknown
): Promise<ChallengeValidationResult> {
	// Check internal secret bypass
	const internalSecret = headers.get(HEADERS.INTERNAL_SECRET)
	const expectedSecret = getInternalSecret()
	if (expectedSecret && internalSecret === expectedSecret) {
		return { valid: true, sessionId: "internal" }
	}

	// Extract and validate headers
	const h = extractChallengeHeaders(headers)
	const headerError = validateRequiredHeaders(h)
	if (headerError) return headerError

	// Validate timestamp
	const timestampResult = validateTimestamp(h.timestampStr!)
	if ("valid" in timestampResult) return timestampResult

	// Validate fingerprint format
	if (!isValidFingerprintFormat(h.fingerprint!)) {
		return { valid: false, error: ERRORS.BOT_DETECTED }
	}

	// Verify JWT token
	const tokenResult = await verifyToken(h.token!)
	if ("valid" in tokenResult) return tokenResult
	const payload = tokenResult

	// Run validation checks
	const expiryError = validateTokenExpiry(payload)
	if (expiryError) return expiryError

	const fingerprintError = validateFingerprintMatch(h.fingerprint!, payload.fingerprint)
	if (fingerprintError) return fingerprintError

	const timingError = validatePoWTiming(timestampResult.timestamp)
	if (timingError) return timingError

	const powError = validatePoW(h.powInput!, h.powSolution!, payload.difficulty)
	if (powError) return powError

	const nonceError = validateNonce(payload.sessionId, h.nonce!)
	if (nonceError) return nonceError

	const hashError = validateRequestHash(requestBody, h.requestHash)
	if (hashError) return hashError

	return { valid: true, sessionId: payload.sessionId }
}

export function createChallengeErrorResponse(error: string): {
	code: string
	message: string
	data: { reason: string; banWarning: boolean }
} {
	return {
		code: "FORBIDDEN",
		message: ERRORS.BOT_DETECTED,
		data: { reason: error, banWarning: true },
	}
}

export function hasValidInternalSecret(headers: Headers): boolean {
	const internalSecret = headers.get(HEADERS.INTERNAL_SECRET)
	const expectedSecret = getInternalSecret()
	return Boolean(expectedSecret && internalSecret === expectedSecret)
}
