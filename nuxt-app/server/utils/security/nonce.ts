import { MAX_NONCES_PER_SESSION, NONCE_EXPIRY_MS } from './constants'

const nonceStore = new Map<string, Map<string, number>>()

let cleanupInterval: ReturnType<typeof setInterval> | null = null

function ensureCleanupRunning(): void {
  if (cleanupInterval) return

  cleanupInterval = setInterval(() => {
    cleanupExpiredNonces()
  }, 60 * 1000)

  if (cleanupInterval.unref) {
    cleanupInterval.unref()
  }
}

function cleanupExpiredNonces(): void {
  const now = Date.now()

  Array.from(nonceStore.entries()).forEach(([sessionId, nonces]) => {
    Array.from(nonces.entries()).forEach(([nonce, timestamp]) => {
      if (now - timestamp > NONCE_EXPIRY_MS) {
        nonces.delete(nonce)
      }
    })

    if (nonces.size === 0) {
      nonceStore.delete(sessionId)
    }
  })
}

export function consumeNonce(sessionId: string, nonce: string): boolean {
  ensureCleanupRunning()

  if (!sessionId || !nonce) {
    return false
  }

  let sessionNonces = nonceStore.get(sessionId)
  if (!sessionNonces) {
    sessionNonces = new Map()
    nonceStore.set(sessionId, sessionNonces)
  }

  if (sessionNonces.has(nonce)) {
    return false
  }

  if (sessionNonces.size >= MAX_NONCES_PER_SESSION) {
    const entries = Array.from(sessionNonces.entries())
      .sort((a, b) => a[1] - b[1])
      .slice(0, Math.floor(MAX_NONCES_PER_SESSION / 2))

    for (const [oldNonce] of entries) {
      sessionNonces.delete(oldNonce)
    }
  }

  sessionNonces.set(nonce, Date.now())

  return true
}

export function isNonceUsed(sessionId: string, nonce: string): boolean {
  const sessionNonces = nonceStore.get(sessionId)
  if (!sessionNonces) {
    return false
  }
  return sessionNonces.has(nonce)
}

export function clearSessionNonces(sessionId: string): void {
  nonceStore.delete(sessionId)
}

export function getNonceStats(): { sessions: number, totalNonces: number } {
  let totalNonces = 0
  Array.from(nonceStore.values()).forEach((nonces) => {
    totalNonces += nonces.size
  })
  return {
    sessions: nonceStore.size,
    totalNonces,
  }
}

export function generateNonce(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}
