// POST /api/order-draft — プレビュー画像を R2 に保存し draftId を返す
import { readJson } from "@/lib/readJson";
import { NextResponse } from "next/server";
import { getBucket, getDb, schema } from "@/db";
import { newId } from "@/lib/repo";

export const dynamic = "force-dynamic";

const MAX_BYTES = 2 * 1024 * 1024; // 2MB / 画像

function decodeDataUrl(dataUrl: string): { bytes: Uint8Array; contentType: string } | null {
  const m = /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
  if (!m) return null;
  const bin = atob(m[2]);
  if (bin.length > MAX_BYTES) return null;
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return { bytes, contentType: m[1] };
}

export async function POST(req: Request) {
  try {
    const body = await readJson(req);
    const front = decodeDataUrl(String(body?.frontPreviewImage ?? ""));
    if (!front) {
      return NextResponse.json({ error: "frontPreviewImage must be a small data:image/* URL" }, { status: 400 });
    }
    const backRaw = body?.backPreviewImage ? String(body.backPreviewImage) : "";
    const back = backRaw ? decodeDataUrl(backRaw) : null;
    if (backRaw && !back) {
      return NextResponse.json({ error: "backPreviewImage invalid" }, { status: 400 });
    }

    const id = newId("draft");
    const bucket = await getBucket();
    const ext = (ct: string) => (ct === "image/jpeg" ? "jpg" : ct === "image/webp" ? "webp" : "png");
    const frontKey = `previews/${id}-front.${ext(front.contentType)}`;
    await bucket.put(frontKey, front.bytes, { httpMetadata: { contentType: front.contentType } });
    let backKey: string | null = null;
    if (back) {
      backKey = `previews/${id}-back.${ext(back.contentType)}`;
      await bucket.put(backKey, back.bytes, { httpMetadata: { contentType: back.contentType } });
    }

    const db = await getDb();
    await db.insert(schema.drafts).values({
      id,
      frontKey,
      backKey,
      designJson: body?.designJson ? String(body.designJson) : null,
    });

    return NextResponse.json({ draftId: id });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "order draft error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
