import { createChallengeErrorResponse, validateChallenge } from '../utils/security'

// Routes that require challenge validation for mutations
const PROTECTED_ROUTES = [
  '/api/ticket-data',
  '/api/slack',
  '/api/backup',
  '/api/settings',
  '/api/scheduled-comments',
  '/api/feedback',
]

export default defineEventHandler(async (event) => {
  const method = event.method
  const path = event.path

  // Only validate mutations (POST, PUT, DELETE, PATCH)
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    return
  }

  // Check if route is protected
  const isProtected = PROTECTED_ROUTES.some(route => path.startsWith(route))
  if (!isProtected) {
    return
  }

  // Get headers from request
  const headers = new Headers()
  const rawHeaders = getHeaders(event)
  for (const [key, value] of Object.entries(rawHeaders)) {
    if (value) {
      headers.set(key, Array.isArray(value) ? value[0] : value)
    }
  }

  // Validate challenge
  const body = await readBody(event).catch(() => undefined)
  const result = await validateChallenge(headers, body)

  if (!result.valid) {
    const errorResponse = createChallengeErrorResponse(result.error || 'Unknown error')
    throw createError({
      statusCode: 403,
      message: errorResponse.message,
      data: errorResponse.data,
    })
  }

  // Attach session ID to event context for logging
  event.context.sessionId = result.sessionId
})
