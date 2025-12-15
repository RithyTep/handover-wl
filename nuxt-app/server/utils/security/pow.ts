import { createHash } from 'node:crypto'
import { POW_DIFFICULTY } from './constants'

export function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex')
}

export function meetsPoWDifficulty(hash: string, difficulty: number = POW_DIFFICULTY): boolean {
  const prefix = '0'.repeat(difficulty)
  return hash.startsWith(prefix)
}

export function validatePoWSolution(
  powInput: string,
  powSolution: string,
  difficulty: number = POW_DIFFICULTY,
): boolean {
  const computedHash = sha256(powInput)

  if (computedHash !== powSolution) {
    return false
  }

  return meetsPoWDifficulty(computedHash, difficulty)
}

export function validatePoWInput(
  powInput: string,
  challenge: string,
  fingerprint: string,
  timestamp: number,
): boolean {
  const parts = powInput.split(':')

  if (parts.length < 4) {
    return false
  }

  const [inputChallenge, inputFingerprint, inputTimestamp] = parts

  return (
    inputChallenge === challenge
    && inputFingerprint === fingerprint
    && inputTimestamp === timestamp.toString()
  )
}

export function generateChallenge(): string {
  const randomBytes = new Uint8Array(32)
  crypto.getRandomValues(randomBytes)
  return Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export function hashRequestBody(body: unknown): string {
  const bodyStr = typeof body === 'string' ? body : JSON.stringify(body)
  return sha256(bodyStr)
}
