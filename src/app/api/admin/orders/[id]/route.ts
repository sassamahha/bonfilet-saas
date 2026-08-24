// GET /api/admin/orders/:id
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { adminRoute } from "@/lib/adminRoute";

export const dynamic = "force-dynamic";

export const GET = adminRoute(async (_req: Request, ctx: { params: Promise<{ id: string }> }) => {
  const { id } = await ctx.params;
  const db = await getDb();
  const row = await db.query.orders.findFirst({ where: eq(schema.orders.id, id) });
  if (!row) return NextResponse.json({ error: "not found" }, { status: 404 });
  // 製造・配送に必要な情報だけを返す（金額・顧客メール・Stripe ID は Admin に出さない）
  const order = {
    id: row.id,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    status: row.status,
    quantity: row.quantity,
    country: row.country,
    designJson: row.designJson,
    previewKeysJson: row.previewKeysJson,
    trackingNumber: row.trackingNumber,
    shippingName: row.shippingName,
    shippingAddress1: row.shippingAddress1,
    shippingAddress2: row.shippingAddress2,
    shippingCity: row.shippingCity,
    shippingState: row.shippingState,
    shippingPostal: row.shippingPostal,
    shippingCountry: row.shippingCountry,
    shippingPhone: row.shippingPhone,
  };
  return NextResponse.json({ order });
});
