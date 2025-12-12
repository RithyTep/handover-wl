import { HEADERS } from "../constants";
import type { ChallengeResponse } from "../types";
import { getFingerprintHash } from "./fingerprint";
import { solvePoWWithWorker, hashRequestBody, generateNonce } from "./pow-solver";

interface ChallengeSession {
  token: string;
  challenge: string;
  difficulty: number;
  fingerprint: string;
  expiresAt: number;
}

const SESSION_KEY = "challenge_session";

function getStoredSession(): ChallengeSession | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (!stored) return null;

    const session = JSON.parse(stored) as ChallengeSession;

    if (Date.now() > session.expiresAt) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

function storeSession(session: ChallengeSession): void {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
  }
}

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

export async function initChallengeSession(): Promise<ChallengeSession> {
  const existing = getStoredSession();
  if (existing) {
    const currentFingerprint = await getFingerprintHash();
    if (existing.fingerprint === currentFingerprint) {
      return existing;
    }
  }

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

export async function generateChallengeHeaders(
  requestBody: unknown,
  onProgress?: (iterations: number) => void
): Promise<Record<string, string>> {
  const session = await initChallengeSession();

  const timestamp = Date.now();
  const nonce = generateNonce();

  const powSolution = await solvePoWWithWorker(
    session.challenge,
    session.fingerprint,
    timestamp,
    session.difficulty,
    onProgress
  );

  const requestHash = await hashRequestBody(requestBody);

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

export function clearChallengeSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
}

export function hasChallengeSession(): boolean {
  return getStoredSession() !== null;
}

export function getSessionTimeRemaining(): number {
  const session = getStoredSession();
  if (!session) return 0;
  return Math.max(0, session.expiresAt - Date.now());
}
