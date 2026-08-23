// GET /api/assets/<r2 key> — R2 のプレビュー画像を返す（管理者のみ）
import { NextResponse } from "next/server";
import { getBucket } from "@/db";
import { getAdminEmail } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: { params: Promise<{ key: string[] }> }) {
  if (!(await getAdminEmail())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { key } = await ctx.params;
  const objectKey = key.join("/");
  const bucket = await getBucket();
  const obj = await bucket.get(objectKey);
  if (!obj) return NextResponse.json({ error: "not found" }, { status: 404 });
  return new Response(obj.body, {
    headers: {
      "Content-Type": obj.httpMetadata?.contentType ?? "application/octet-stream",
      "Cache-Control": "private, max-age=3600",
    },
  });
}
