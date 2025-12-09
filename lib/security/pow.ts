/**
 * Proof-of-Work utilities for server-side validation
 */

import { createHash } from "crypto";
import { POW_DIFFICULTY } from "./constants";

/**
 * Compute SHA-256 hash of input
 */
export function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

/**
 * Check if a hash meets the difficulty requirement
 * @param hash - The hash to check
 * @param difficulty - Number of leading zeros required
 */
export function meetsPoWDifficulty(hash: string, difficulty: number = POW_DIFFICULTY): boolean {
  const prefix = "0".repeat(difficulty);
  return hash.startsWith(prefix);
}

/**
 * Validate a proof-of-work solution
 * @param powInput - The input that should produce the hash
 * @param powSolution - The claimed hash
 * @param difficulty - Required difficulty level
 */
export function validatePoWSolution(
  powInput: string,
  powSolution: string,
  difficulty: number = POW_DIFFICULTY
): boolean {
  // Compute the hash from the input
  const computedHash = sha256(powInput);

  // Check if the provided solution matches the computed hash
  if (computedHash !== powSolution) {
    return false;
  }

  // Check if the hash meets difficulty requirement
  return meetsPoWDifficulty(computedHash, difficulty);
}

/**
 * Validate that the PoW input contains required components
 * @param powInput - The PoW input string
 * @param challenge - The challenge string that must be included
 * @param fingerprint - The fingerprint that must be included
 * @param timestamp - The timestamp that must be included
 */
export function validatePoWInput(
  powInput: string,
  challenge: string,
  fingerprint: string,
  timestamp: number
): boolean {
  // PoW input format: challenge:fingerprint:timestamp:nonce
  const parts = powInput.split(":");

  if (parts.length < 4) {
    return false;
  }

  const [inputChallenge, inputFingerprint, inputTimestamp] = parts;

  return (
    inputChallenge === challenge &&
    inputFingerprint === fingerprint &&
    inputTimestamp === timestamp.toString()
  );
}

/**
 * Generate a random challenge string
 */
export function generateChallenge(): string {
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  return Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Hash a request body for integrity checking
 */
export function hashRequestBody(body: unknown): string {
  const bodyStr = typeof body === "string" ? body : JSON.stringify(body);
  return sha256(bodyStr);
}
