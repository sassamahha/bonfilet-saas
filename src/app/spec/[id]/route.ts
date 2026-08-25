// GET /spec/:id?k=<token> — 仕様書 HTML（署名リンク、90日で失効、ログイン不要）
// 画像は R2 から読み込んで data URI として埋め込む（自己完結・そのまま PDF 保存可）
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getBucket, getDb, schema } from "@/db";
import { generateSpecHTML, type SpecData } from "@/lib/bonfiletSpecTemplate";
import { verifySpecToken } from "@/lib/specToken";

export const dynamic = "force-dynamic";

async function loadImageAsDataUrl(key: string | undefined | null): Promise<string | undefined> {
  if (!key) return undefined;
  try {
    const bucket = await getBucket();
    const obj = await bucket.get(key);
    if (!obj) return undefined;
    const buf = new Uint8Array(await obj.arrayBuffer());
    let bin = "";
    const chunk = 0x8000;
    for (let i = 0; i < buf.length; i += chunk) {
      bin += String.fromCharCode(...buf.subarray(i, i + chunk));
    }
    const ct = obj.httpMetadata?.contentType ?? "image/png";
    return `data:${ct};base64,${btoa(bin)}`;
  } catch {
    return undefined;
  }
}

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const token = new URL(req.url).searchParams.get("k") ?? "";
  if (!(await verifySpecToken(id, token))) {
    return new NextResponse("This link is invalid or has expired.", { status: 403 });
  }

  const db = await getDb();
  const order = await db.query.orders.findFirst({ where: eq(schema.orders.id, id) });
  if (!order) return new NextResponse("Not found", { status: 404 });

  const d = JSON.parse(order.designJson || "{}");
  const keys = order.previewKeysJson
    ? (JSON.parse(order.previewKeysJson) as { front?: string; back?: string })
    : {};

  const [frontImg, backImg] = await Promise.all([
    loadImageAsDataUrl(keys.front),
    d.enableBack ? loadImageAsDataUrl(keys.back) : Promise.resolve(undefined),
  ]);

  const spec: SpecData = {
    frontPreviewImage: frontImg,
    backPreviewImage: backImg,
    text: d.text ?? "",
    backText: d.enableBack ? d.backText : undefined,
    bgColor: d.bgColor ?? "#cccccc",
    fontColor: d.fontColor ?? "#000000",
    backBgColor: d.enableBack ? d.backBgColor : undefined,
    backFontColor: d.enableBack ? d.backFontColor : undefined,
    font: d.font ?? "inter",
    quantity: order.quantity,
    customerName: order.shippingName ?? undefined,
    shippingName: order.shippingName ?? undefined,
    shippingPhone: order.shippingPhone ?? undefined,
    shippingAddress: {
      line1: order.shippingAddress1 ?? "",
      line2: order.shippingAddress2 ?? "",
      city: order.shippingCity ?? "",
      state: order.shippingState ?? "",
      postal_code: order.shippingPostal ?? "",
      country: order.shippingCountry ?? order.country,
    },
  };

  return new NextResponse(generateSpecHTML(spec, { showPrintButton: true }), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex",
      "Cache-Control": "private, no-store",
    },
  });
}
