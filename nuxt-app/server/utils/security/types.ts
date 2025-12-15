export interface ChallengeTokenPayload {
  sessionId: string
  fingerprint: string
  issuedAt: number
  difficulty: number
  expiresAt: number
}

export interface ChallengeResponse {
  token: string
  difficulty: number
  challenge: string
  expiresAt: number
}

export interface ChallengeHeaders {
  token: string
  nonce: string
  powSolution: string
  powInput: string
  fingerprint: string
  timestamp: number
  requestHash: string
}

export interface ChallengeValidationResult {
  valid: boolean
  error?: string
  sessionId?: string
}

export interface BrowserFingerprint {
  canvas: string
  webgl: string
  screen: string
  timezone: string
  language: string
  platform: string
  hash: string
}

export interface PoWSolution {
  hash: string
  input: string
  iterations: number
}

export interface NonceEntry {
  nonce: string
  usedAt: number
  sessionId: string
}
