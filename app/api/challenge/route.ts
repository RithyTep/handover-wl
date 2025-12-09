/**
 * Challenge API endpoint
 * Generates browser challenges for mutation requests
 */

import { NextRequest, NextResponse } from "next/server";
import { generateChallengeToken } from "@/lib/security/challenge.service";
import { isValidFingerprintFormat } from "@/lib/security/fingerprint";
import { ERRORS } from "@/lib/security/constants";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fingerprint } = body;

    // Validate fingerprint is provided and valid format
    if (!fingerprint || !isValidFingerprintFormat(fingerprint)) {
      return NextResponse.json(
        {
          error: "Invalid or missing fingerprint",
          message: ERRORS.BOT_DETECTED,
        },
        { status: 400 }
      );
    }

    // Generate challenge token
    const challenge = await generateChallengeToken(fingerprint);

    return NextResponse.json(challenge);
  } catch (error) {
    console.error("[Challenge API] Error generating challenge:", error);

    return NextResponse.json(
      {
        error: "Failed to generate challenge",
        message: ERRORS.BOT_DETECTED,
      },
      { status: 500 }
    );
  }
}

// Only POST is allowed
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}
