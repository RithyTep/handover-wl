import type { PoWSolution } from './types'

interface PoWWorkerMessage {
  type: 'solved' | 'progress' | 'error'
  hash?: string
  input?: string
  nonce?: number
  iterations?: number
  timeMs?: number
  error?: string
}

export function solvePoWWithWorker(
  challenge: string,
  fingerprint: string,
  timestamp: number,
  difficulty: number,
  onProgress?: (iterations: number) => void
): Promise<PoWSolution> {
  return new Promise((resolve, reject) => {
    const worker = new Worker('/pow-worker.js')

    worker.onmessage = (e: MessageEvent<PoWWorkerMessage>) => {
      const { type, hash, input, iterations, error } = e.data

      if (type === 'solved' && hash && input && iterations !== undefined) {
        worker.terminate()
        resolve({
          hash,
          input,
          iterations,
        })
      } else if (type === 'progress' && iterations !== undefined) {
        onProgress?.(iterations)
      } else if (type === 'error') {
        worker.terminate()
        reject(new Error(error || 'PoW solver failed'))
      }
    }

    worker.onerror = (error) => {
      worker.terminate()
      reject(new Error(`Worker error: ${error.message}`))
    }

    worker.postMessage({
      type: 'solve',
      challenge,
      fingerprint,
      timestamp,
      difficulty,
    })
  })
}

export async function sha256Browser(input: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function hashRequestBody(body: unknown): Promise<string> {
  const bodyStr = typeof body === 'string' ? body : JSON.stringify(body)
  return sha256Browser(bodyStr)
}

export function generateNonce(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
