import { generateChallengeToken } from '../utils/security'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const fingerprint = body?.fingerprint

    if (!fingerprint || typeof fingerprint !== 'string') {
      throw createError({
        statusCode: 400,
        message: 'Fingerprint required',
      })
    }

    const challengeResponse = await generateChallengeToken(fingerprint)

    return {
      success: true,
      ...challengeResponse,
    }
  }
  catch (error) {
    if (error instanceof Error && error.message === 'Invalid fingerprint format') {
      throw createError({
        statusCode: 400,
        message: 'Invalid fingerprint format',
      })
    }
    throw error
  }
})
