/**
 * Server-side fingerprint validation utilities
 */

import { sha256 } from "./pow";

/**
 * Validate that two fingerprints match
 * Uses timing-safe comparison to prevent timing attacks
 */
export function validateFingerprint(
  providedFingerprint: string,
  storedFingerprint: string
): boolean {
  if (!providedFingerprint || !storedFingerprint) {
    return false;
  }

  // Use timing-safe comparison
  if (providedFingerprint.length !== storedFingerprint.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < providedFingerprint.length; i++) {
    result |= providedFingerprint.charCodeAt(i) ^ storedFingerprint.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Hash a fingerprint for storage
 * This adds an extra layer by hashing the client-provided hash
 */
export function hashFingerprint(fingerprint: string): string {
  return sha256(fingerprint);
}

/**
 * Validate fingerprint format
 * Fingerprint should be a 64-character hex string (SHA-256)
 */
export function isValidFingerprintFormat(fingerprint: string): boolean {
  if (!fingerprint || typeof fingerprint !== "string") {
    return false;
  }

  // Should be 64 hex characters
  return /^[a-f0-9]{64}$/i.test(fingerprint);
}
