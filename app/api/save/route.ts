import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { saveTicketData, initDatabase } from "@/lib/services";
import { CACHE } from "@/lib/config";

export async function POST(request: NextRequest) {
  try {
    await initDatabase();
    const data = await request.json();

    const formattedData: Record<string, { status: string; action: string }> = {};

    for (const [key, value] of Object.entries(data)) {
      const isStatus = key.startsWith("status-");
      const isAction = key.startsWith("action-");

      if (!isStatus && !isAction) continue;

      const ticketKey = key.replace(/^(status|action)-/, "");
      if (!formattedData[ticketKey]) {
        formattedData[ticketKey] = { status: "--", action: "--" };
      }

      if (isStatus) formattedData[ticketKey].status = value as string;
      if (isAction) formattedData[ticketKey].action = value as string;
    }

    await saveTicketData(formattedData);

    revalidateTag(CACHE.TAGS.TICKETS, CACHE.EXPIRE_NOW);
    revalidateTag(CACHE.TAGS.DASHBOARD, CACHE.EXPIRE_NOW);

    return NextResponse.json({
      success: true,
      ticketCount: Object.keys(formattedData).length,
      storage: "postgresql",
      cacheRevalidated: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
