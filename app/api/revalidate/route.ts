import { revalidateTag, revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { CACHE } from "@/lib/config";

function revalidateAllTags(): string[] {
  const tags = Object.values(CACHE.TAGS);
  tags.forEach((t) => revalidateTag(t, CACHE.EXPIRE_NOW));
  return tags.map((t) => `tag:${t}`);
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { tag, path, secret } = body;

    const expectedSecret = process.env.REVALIDATE_SECRET;
    if (expectedSecret && secret !== expectedSecret) {
      return NextResponse.json(
        { success: false, error: "Invalid secret" },
        { status: 401 }
      );
    }

    const revalidated: string[] = [];

    if (tag) {
      const tags = Array.isArray(tag) ? tag : [tag];
      tags.forEach((t) => {
        revalidateTag(t, CACHE.EXPIRE_NOW);
        revalidated.push(`tag:${t}`);
      });
    }

    if (path) {
      const paths = Array.isArray(path) ? path : [path];
      paths.forEach((p) => {
        revalidatePath(p);
        revalidated.push(`path:${p}`);
      });
    }

    if (!tag && !path) {
      revalidated.push(...revalidateAllTags());
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get("tag");
  const path = searchParams.get("path");

  try {
    const revalidated: string[] = [];

    if (tag) {
      revalidateTag(tag, CACHE.EXPIRE_NOW);
      revalidated.push(`tag:${tag}`);
    }

    if (path) {
      revalidatePath(path);
      revalidated.push(`path:${path}`);
    }

    if (!tag && !path) {
      revalidated.push(...revalidateAllTags());
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
