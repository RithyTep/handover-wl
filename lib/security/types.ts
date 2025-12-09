/**
 * Type definitions for browser challenge system
 */

export interface ChallengeTokenPayload {
  /** Unique session ID */
  sessionId: string;
  /** Hashed browser fingerprint */
  fingerprint: string;
  /** Token issue timestamp */
  issuedAt: number;
  /** PoW difficulty level */
  difficulty: number;
  /** Token expiry timestamp */
  expiresAt: number;
}

export interface ChallengeResponse {
  /** Signed JWT token */
  token: string;
  /** PoW difficulty (number of leading zeros) */
  difficulty: number;
  /** Challenge string to include in PoW */
  challenge: string;
  /** Token expiry timestamp */
  expiresAt: number;
}

export interface ChallengeHeaders {
  /** JWT challenge token */
  token: string;
  /** One-time nonce */
  nonce: string;
  /** PoW solution hash */
  powSolution: string;
  /** Input that produces the PoW hash */
  powInput: string;
  /** Current browser fingerprint */
  fingerprint: string;
  /** Request timestamp */
  timestamp: number;
  /** Hash of request body */
  requestHash: string;
}

export interface ChallengeValidationResult {
  valid: boolean;
  error?: string;
  sessionId?: string;
}

export interface BrowserFingerprint {
  /** Canvas fingerprint hash */
  canvas: string;
  /** WebGL renderer info hash */
  webgl: string;
  /** Screen dimensions */
  screen: string;
  /** Timezone */
  timezone: string;
  /** Language */
  language: string;
  /** Platform */
  platform: string;
  /** Combined hash */
  hash: string;
}

export interface PoWSolution {
  /** The hash that meets difficulty requirement */
  hash: string;
  /** The input that produces the hash */
  input: string;
  /** Number of iterations to find solution */
  iterations: number;
}

export interface NonceEntry {
  /** Nonce value */
  nonce: string;
  /** When the nonce was used */
  usedAt: number;
  /** Session ID it belongs to */
  sessionId: string;
}
