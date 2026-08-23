// GET /api/generate-spec?order_id=... — 仕様書 HTML（管理者のみ）
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { generateSpecHTML, type SpecData } from "@/lib/bonfiletSpecTemplate";
import { getAdminEmail } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!(await getAdminEmail())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("order_id");
  if (!orderId) return NextResponse.json({ error: "order_id required" }, { status: 400 });

  const db = await getDb();
  const order = await db.query.orders.findFirst({ where: eq(schema.orders.id, orderId) });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const d = JSON.parse(order.designJson || "{}");
  const keys = order.previewKeysJson ? (JSON.parse(order.previewKeysJson) as { front?: string; back?: string }) : {};
  const assetUrl = (k?: string) => (k ? `/api/assets/${k}` : undefined);

  const spec: SpecData = {
    frontPreviewImage: assetUrl(keys.front),
    backPreviewImage: d.enableBack ? assetUrl(keys.back) : undefined,
    text: d.text ?? "",
    backText: d.enableBack ? d.backText : undefined,
    bgColor: d.bgColor ?? "#cccccc",
    fontColor: d.fontColor ?? "#000000",
    backBgColor: d.enableBack ? d.backBgColor : undefined,
    backFontColor: d.enableBack ? d.backFontColor : undefined,
    font: d.font ?? "inter",
    quantity: order.quantity,
    customerName: order.shippingName ?? undefined,
    customerEmail: order.customerEmail ?? undefined,
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
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
