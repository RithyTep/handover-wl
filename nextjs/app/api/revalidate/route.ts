import { revalidateTag, revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

// Cache expiration config for immediate invalidation
const EXPIRE_NOW = { expire: 0 };

// POST - Revalidate cache by tag or path
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { tag, path, secret } = body;

    // Optional: Verify secret for security
    const expectedSecret = process.env.REVALIDATE_SECRET;
    if (expectedSecret && secret !== expectedSecret) {
      return NextResponse.json(
        { success: false, error: "Invalid secret" },
        { status: 401 }
      );
    }

    const revalidated: string[] = [];

    // Revalidate by tag (Next.js 16 requires profile as second arg)
    if (tag) {
      const tags = Array.isArray(tag) ? tag : [tag];
      for (const t of tags) {
        revalidateTag(t, EXPIRE_NOW);
        revalidated.push(`tag:${t}`);
      }
    }

    // Revalidate by path
    if (path) {
      const paths = Array.isArray(path) ? path : [path];
      for (const p of paths) {
        revalidatePath(p);
        revalidated.push(`path:${p}`);
      }
    }

    // If no tag or path specified, revalidate common tags
    if (!tag && !path) {
      revalidateTag("tickets", EXPIRE_NOW);
      revalidateTag("dashboard", EXPIRE_NOW);
      revalidateTag("backups", EXPIRE_NOW);
      revalidated.push("tag:tickets", "tag:dashboard", "tag:backups");
    }

    console.log("[Revalidate] Cache invalidated:", revalidated.join(", "));

    return NextResponse.json({
      success: true,
      revalidated,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[Revalidate] Error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// GET - Revalidate all common caches (convenience endpoint)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get("tag");
  const path = searchParams.get("path");

  try {
    const revalidated: string[] = [];

    if (tag) {
      revalidateTag(tag, EXPIRE_NOW);
      revalidated.push(`tag:${tag}`);
    }

    if (path) {
      revalidatePath(path);
      revalidated.push(`path:${path}`);
    }

    if (!tag && !path) {
      revalidateTag("tickets", EXPIRE_NOW);
      revalidateTag("dashboard", EXPIRE_NOW);
      revalidated.push("tag:tickets", "tag:dashboard");
    }

    return NextResponse.json({
      success: true,
      revalidated,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
