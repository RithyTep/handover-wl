/**
 * Challenge manager for browser
 * Handles challenge tokens, PoW solving, and request signing
 */

import { HEADERS } from "../constants";
import type { ChallengeResponse, ChallengeHeaders } from "../types";
import { getFingerprintHash } from "./fingerprint";
import { solvePoWWithWorker, hashRequestBody, generateNonce } from "./pow-solver";

interface ChallengeSession {
  token: string;
  challenge: string;
  difficulty: number;
  fingerprint: string;
  expiresAt: number;
}

// Session storage key
const SESSION_KEY = "challenge_session";

/**
 * Get stored session from sessionStorage
 */
function getStoredSession(): ChallengeSession | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (!stored) return null;

    const session = JSON.parse(stored) as ChallengeSession;

    // Check if expired
    if (Date.now() > session.expiresAt) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

/**
 * Store session in sessionStorage
 */
function storeSession(session: ChallengeSession): void {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Request a new challenge token from the server
 */
async function requestChallenge(fingerprint: string): Promise<ChallengeResponse> {
  const response = await fetch("/api/challenge", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fingerprint }),
  });

  if (!response.ok) {
    throw new Error(`Challenge request failed: ${response.status}`);
  }

  return response.json();
}

/**
 * Initialize or get existing challenge session
 */
export async function initChallengeSession(): Promise<ChallengeSession> {
  // Check for existing valid session
  const existing = getStoredSession();
  if (existing) {
    // Verify fingerprint still matches
    const currentFingerprint = await getFingerprintHash();
    if (existing.fingerprint === currentFingerprint) {
      return existing;
    }
  }

  // Generate new fingerprint and request challenge
  const fingerprint = await getFingerprintHash();
  const challengeResponse = await requestChallenge(fingerprint);

  const session: ChallengeSession = {
    token: challengeResponse.token,
    challenge: challengeResponse.challenge,
    difficulty: challengeResponse.difficulty,
    fingerprint,
    expiresAt: challengeResponse.expiresAt,
  };

  storeSession(session);
  return session;
}

/**
 * Generate challenge headers for a mutation request
 * This is the main function called before each mutation
 */
export async function generateChallengeHeaders(
  requestBody: unknown,
  onProgress?: (iterations: number) => void
): Promise<Record<string, string>> {
  // Get or create session
  const session = await initChallengeSession();

  // Generate timestamp and nonce
  const timestamp = Date.now();
  const nonce = generateNonce();

  // Solve proof-of-work
  const powSolution = await solvePoWWithWorker(
    session.challenge,
    session.fingerprint,
    timestamp,
    session.difficulty,
    onProgress
  );

  // Hash request body
  const requestHash = await hashRequestBody(requestBody);

  // Build headers
  return {
    [HEADERS.CHALLENGE_TOKEN]: session.token,
    [HEADERS.CHALLENGE_NONCE]: nonce,
    [HEADERS.CHALLENGE_POW]: powSolution.hash,
    [HEADERS.CHALLENGE_POW_INPUT]: powSolution.input,
    [HEADERS.CHALLENGE_FINGERPRINT]: session.fingerprint,
    [HEADERS.CHALLENGE_TIMESTAMP]: timestamp.toString(),
    [HEADERS.CHALLENGE_REQUEST_HASH]: requestHash,
  };
}

/**
 * Clear the challenge session (for logout or refresh)
 */
export function clearChallengeSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
}

/**
 * Check if challenge session exists and is valid
 */
export function hasChallengeSession(): boolean {
  return getStoredSession() !== null;
}

/**
 * Get time until session expires (in ms)
 */
export function getSessionTimeRemaining(): number {
  const session = getStoredSession();
  if (!session) return 0;
  return Math.max(0, session.expiresAt - Date.now());
}
