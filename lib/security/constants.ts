/**
 * Security constants for browser challenge system
 */

// Proof-of-Work difficulty (number of leading zeros required)
// 4 = "0000" prefix, takes ~50-200ms on modern browsers
export const POW_DIFFICULTY = 4;

// Challenge token expiry (24 hours for session)
export const CHALLENGE_TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;

// PoW solution validity window (30 seconds)
export const POW_SOLUTION_VALIDITY_MS = 30 * 1000;

// Nonce expiry (prevent replay within this window)
export const NONCE_EXPIRY_MS = 60 * 1000;

// Maximum nonces to store in memory per session
export const MAX_NONCES_PER_SESSION = 1000;

// Header names
export const HEADERS = {
  CHALLENGE_TOKEN: "x-challenge-token",
  CHALLENGE_NONCE: "x-challenge-nonce",
  CHALLENGE_POW: "x-challenge-pow",
  CHALLENGE_POW_INPUT: "x-challenge-pow-input",
  CHALLENGE_FINGERPRINT: "x-challenge-fingerprint",
  CHALLENGE_TIMESTAMP: "x-challenge-timestamp",
  CHALLENGE_REQUEST_HASH: "x-challenge-request-hash",
  INTERNAL_SECRET: "x-internal-secret",
} as const;

// Error messages
export const ERRORS = {
  MISSING_CHALLENGE: "Challenge token required",
  INVALID_TOKEN: "Invalid challenge token",
  TOKEN_EXPIRED: "Challenge token expired",
  FINGERPRINT_MISMATCH: "Browser fingerprint mismatch - request blocked",
  INVALID_POW: "Invalid proof-of-work solution",
  POW_EXPIRED: "Proof-of-work solution expired",
  NONCE_REUSED: "Request nonce already used - replay attack detected",
  REQUEST_HASH_MISMATCH: "Request integrity check failed",
  BOT_DETECTED: "Automated request detected. Stop doing it - continued attempts will result in permanent ban.",
} as const;

// JWT secret key name in environment
export const JWT_SECRET_ENV = "CHALLENGE_JWT_SECRET";

// Internal API secret key name in environment
export const INTERNAL_SECRET_ENV = "INTERNAL_API_SECRET";
