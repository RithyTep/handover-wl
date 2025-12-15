export const POW_DIFFICULTY = 4

export const CHALLENGE_TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000

export const POW_SOLUTION_VALIDITY_MS = 30 * 1000

export const NONCE_EXPIRY_MS = 60 * 1000

export const MAX_NONCES_PER_SESSION = 1000

export const HEADERS = {
  CHALLENGE_TOKEN: 'x-challenge-token',
  CHALLENGE_NONCE: 'x-challenge-nonce',
  CHALLENGE_POW: 'x-challenge-pow',
  CHALLENGE_POW_INPUT: 'x-challenge-pow-input',
  CHALLENGE_FINGERPRINT: 'x-challenge-fingerprint',
  CHALLENGE_TIMESTAMP: 'x-challenge-timestamp',
  CHALLENGE_REQUEST_HASH: 'x-challenge-request-hash',
  INTERNAL_SECRET: 'x-internal-secret',
} as const

export const ERRORS = {
  MISSING_CHALLENGE: 'Challenge token required',
  INVALID_TOKEN: 'Invalid challenge token',
  TOKEN_EXPIRED: 'Challenge token expired',
  FINGERPRINT_MISMATCH: 'Browser fingerprint mismatch - request blocked',
  INVALID_POW: 'Invalid proof-of-work solution',
  POW_EXPIRED: 'Proof-of-work solution expired',
  NONCE_REUSED: 'Request nonce already used - replay attack detected',
  REQUEST_HASH_MISMATCH: 'Request integrity check failed',
  BOT_DETECTED: 'Automated request detected. Stop doing it - continued attempts will result in permanent ban.',
} as const

export const JWT_SECRET_ENV = 'CHALLENGE_JWT_SECRET'

export const INTERNAL_SECRET_ENV = 'INTERNAL_API_SECRET'
