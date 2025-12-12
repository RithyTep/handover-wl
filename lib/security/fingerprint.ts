import { sha256 } from "./pow";

export function validateFingerprint(
  providedFingerprint: string,
  storedFingerprint: string
): boolean {
  if (!providedFingerprint || !storedFingerprint) {
    return false;
  }

  if (providedFingerprint.length !== storedFingerprint.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < providedFingerprint.length; i++) {
    result |= providedFingerprint.charCodeAt(i) ^ storedFingerprint.charCodeAt(i);
  }

  return result === 0;
}

export function hashFingerprint(fingerprint: string): string {
  return sha256(fingerprint);
}

export function isValidFingerprintFormat(fingerprint: string): boolean {
  if (!fingerprint || typeof fingerprint !== "string") {
    return false;
  }

  return /^[a-f0-9]{64}$/i.test(fingerprint);
}
