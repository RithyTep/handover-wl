/**
 * Nonce manager to prevent replay attacks
 * Uses in-memory storage with automatic cleanup
 */

import { NONCE_EXPIRY_MS, MAX_NONCES_PER_SESSION } from "./constants";
import type { NonceEntry } from "./types";

// In-memory nonce storage
// Key: sessionId, Value: Map of nonce -> timestamp
const nonceStore = new Map<string, Map<string, number>>();

// Cleanup interval handle
let cleanupInterval: NodeJS.Timeout | null = null;

/**
 * Start the automatic cleanup interval
 */
function ensureCleanupRunning(): void {
  if (cleanupInterval) return;

  // Run cleanup every minute
  cleanupInterval = setInterval(() => {
    cleanupExpiredNonces();
  }, 60 * 1000);

  // Don't prevent process exit
  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }
}

/**
 * Clean up expired nonces from all sessions
 */
function cleanupExpiredNonces(): void {
  const now = Date.now();

  Array.from(nonceStore.entries()).forEach(([sessionId, nonces]) => {
    Array.from(nonces.entries()).forEach(([nonce, timestamp]) => {
      if (now - timestamp > NONCE_EXPIRY_MS) {
        nonces.delete(nonce);
      }
    });

    // Remove empty sessions
    if (nonces.size === 0) {
      nonceStore.delete(sessionId);
    }
  });
}

/**
 * Check if a nonce has been used and mark it as used
 * @param sessionId - The session ID
 * @param nonce - The nonce to check
 * @returns true if nonce is valid (not used), false if already used
 */
export function consumeNonce(sessionId: string, nonce: string): boolean {
  ensureCleanupRunning();

  if (!sessionId || !nonce) {
    return false;
  }

  // Get or create session nonce map
  let sessionNonces = nonceStore.get(sessionId);
  if (!sessionNonces) {
    sessionNonces = new Map();
    nonceStore.set(sessionId, sessionNonces);
  }

  // Check if nonce already exists
  if (sessionNonces.has(nonce)) {
    return false; // Replay attack detected
  }

  // Check if session has too many nonces (potential DoS)
  if (sessionNonces.size >= MAX_NONCES_PER_SESSION) {
    // Remove oldest nonces
    const entries = Array.from(sessionNonces.entries())
      .sort((a, b) => a[1] - b[1])
      .slice(0, Math.floor(MAX_NONCES_PER_SESSION / 2));

    for (const [oldNonce] of entries) {
      sessionNonces.delete(oldNonce);
    }
  }

  // Mark nonce as used
  sessionNonces.set(nonce, Date.now());

  return true;
}

/**
 * Check if a nonce has been used (without consuming it)
 * @param sessionId - The session ID
 * @param nonce - The nonce to check
 * @returns true if nonce has been used
 */
export function isNonceUsed(sessionId: string, nonce: string): boolean {
  const sessionNonces = nonceStore.get(sessionId);
  if (!sessionNonces) {
    return false;
  }
  return sessionNonces.has(nonce);
}

/**
 * Clear all nonces for a session (used when session is invalidated)
 */
export function clearSessionNonces(sessionId: string): void {
  nonceStore.delete(sessionId);
}

/**
 * Get stats about nonce storage (for debugging/monitoring)
 */
export function getNonceStats(): { sessions: number; totalNonces: number } {
  let totalNonces = 0;
  Array.from(nonceStore.values()).forEach((nonces) => {
    totalNonces += nonces.size;
  });
  return {
    sessions: nonceStore.size,
    totalNonces,
  };
}

/**
 * Generate a cryptographically secure nonce
 */
export function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
