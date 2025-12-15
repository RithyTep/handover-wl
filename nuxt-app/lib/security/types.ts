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

export interface ChallengeResponse {
  token: string
  challenge: string
  difficulty: number
  expiresAt: number
}

export interface ChallengeSession {
  token: string
  challenge: string
  difficulty: number
  fingerprint: string
  expiresAt: number
}
