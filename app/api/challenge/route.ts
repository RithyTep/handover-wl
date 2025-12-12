import { NextRequest, NextResponse } from "next/server"
import { generateChallengeToken } from "@/lib/security/challenge.service"
import { isValidFingerprintFormat } from "@/lib/security/fingerprint"
import { ERRORS } from "@/lib/security/constants"
import { logger } from "@/lib/logger"

const log = logger.api

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const { fingerprint } = body

		if (!fingerprint || !isValidFingerprintFormat(fingerprint)) {
			return NextResponse.json(
				{
					error: "Invalid or missing fingerprint",
					message: ERRORS.BOT_DETECTED,
				},
				{ status: 400 }
			)
		}

		const challenge = await generateChallengeToken(fingerprint)

		return NextResponse.json(challenge)
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error"
		log.error("Challenge generation error", { error: message })

		return NextResponse.json(
			{
				error: "Failed to generate challenge",
				message: ERRORS.BOT_DETECTED,
			},
			{ status: 500 }
		)
	}
}

export async function GET() {
	return NextResponse.json(
		{ error: "Method not allowed" },
		{ status: 405 }
	)
}
