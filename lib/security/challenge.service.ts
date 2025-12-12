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

function getJwtSecret(): Uint8Array {
	const secret = process.env[JWT_SECRET_ENV]
	if (!secret) {
		log.warn("JWT secret not configured", { env: JWT_SECRET_ENV })
		return new TextEncoder().encode("fallback-secret-change-in-production-" + Date.now())
	}
	return new TextEncoder().encode(secret)
}

function getInternalSecret(): string | null {
  return process.env[INTERNAL_SECRET_ENV] || null;
}

export async function generateChallengeToken(fingerprint: string): Promise<ChallengeResponse> {
  if (!isValidFingerprintFormat(fingerprint)) {
    throw new Error("Invalid fingerprint format");
  }

  const sessionId = crypto.randomUUID();
  const challenge = generateChallenge();
  const now = Date.now();
  const expiresAt = now + CHALLENGE_TOKEN_EXPIRY_MS;

  const hashedFingerprint = hashFingerprint(fingerprint);

  const payload: ChallengeTokenPayload = {
    sessionId,
    fingerprint: hashedFingerprint,
    issuedAt: now,
    difficulty: POW_DIFFICULTY,
    expiresAt,
  };

  const token = await new SignJWT(payload as unknown as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt / 1000)
    .sign(getJwtSecret());

  return {
    token,
    difficulty: POW_DIFFICULTY,
    challenge,
    expiresAt,
  };
}

export async function validateChallenge(
  headers: Headers,
  requestBody?: unknown
): Promise<ChallengeValidationResult> {
  const internalSecret = headers.get(HEADERS.INTERNAL_SECRET);
  const expectedSecret = getInternalSecret();

  if (expectedSecret && internalSecret === expectedSecret) {
    return { valid: true, sessionId: "internal" };
  }

  const token = headers.get(HEADERS.CHALLENGE_TOKEN);
  const nonce = headers.get(HEADERS.CHALLENGE_NONCE);
  const powSolution = headers.get(HEADERS.CHALLENGE_POW);
  const powInput = headers.get(HEADERS.CHALLENGE_POW_INPUT);
  const fingerprint = headers.get(HEADERS.CHALLENGE_FINGERPRINT);
  const timestampStr = headers.get(HEADERS.CHALLENGE_TIMESTAMP);
  const requestHash = headers.get(HEADERS.CHALLENGE_REQUEST_HASH);

  if (!token || !nonce || !powSolution || !powInput || !fingerprint || !timestampStr) {
    return { valid: false, error: ERRORS.MISSING_CHALLENGE };
  }

  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) {
    return { valid: false, error: ERRORS.MISSING_CHALLENGE };
  }

  if (!isValidFingerprintFormat(fingerprint)) {
    return { valid: false, error: ERRORS.BOT_DETECTED };
  }

  let payload: ChallengeTokenPayload;
  try {
    const { payload: verified } = await jwtVerify(token, getJwtSecret());
    payload = verified as unknown as ChallengeTokenPayload;
  } catch {
    return { valid: false, error: ERRORS.INVALID_TOKEN };
  }

  if (Date.now() > payload.expiresAt) {
    return { valid: false, error: ERRORS.TOKEN_EXPIRED };
  }

  const hashedFingerprint = hashFingerprint(fingerprint);
  if (!validateFingerprint(hashedFingerprint, payload.fingerprint)) {
    return { valid: false, error: ERRORS.FINGERPRINT_MISMATCH };
  }

  const now = Date.now();
  if (Math.abs(now - timestamp) > POW_SOLUTION_VALIDITY_MS) {
    return { valid: false, error: ERRORS.POW_EXPIRED };
  }

  if (!validatePoWSolution(powInput, powSolution, payload.difficulty)) {
    return { valid: false, error: ERRORS.INVALID_POW };
  }

  if (!consumeNonce(payload.sessionId, nonce)) {
    return { valid: false, error: ERRORS.NONCE_REUSED };
  }

  if (requestBody !== undefined && requestHash) {
    const expectedHash = hashRequestBody(requestBody);
    if (requestHash !== expectedHash) {
      return { valid: false, error: ERRORS.REQUEST_HASH_MISMATCH };
    }
  }

  return { valid: true, sessionId: payload.sessionId };
}

export function createChallengeErrorResponse(error: string): {
  code: string;
  message: string;
  data: { reason: string; banWarning: boolean };
} {
  return {
    code: "FORBIDDEN",
    message: ERRORS.BOT_DETECTED,
    data: {
      reason: error,
      banWarning: true,
    },
  };
}

export function hasValidInternalSecret(headers: Headers): boolean {
  const internalSecret = headers.get(HEADERS.INTERNAL_SECRET);
  const expectedSecret = getInternalSecret();

  if (!expectedSecret) {
    return false;
  }

  return internalSecret === expectedSecret;
}
