// POST /api/admin/orders/:id/purge-pii — 配送完了後に個人情報を消去する
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { adminRoute } from "@/lib/adminRoute";

export const dynamic = "force-dynamic";

export const POST = adminRoute(async (_req: Request, ctx: { params: Promise<{ id: string }> }) => {
  const { id } = await ctx.params;
  const db = await getDb();
  const existing = await db.query.orders.findFirst({ where: eq(schema.orders.id, id) });
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (existing.status !== "SHIPPED") {
    return NextResponse.json({ error: "発送済みの注文のみ消去できます" }, { status: 400 });
  }
  await db
    .update(schema.orders)
    .set({
      shippingName: null,
      shippingAddress1: null,
      shippingAddress2: null,
      shippingCity: null,
      shippingState: null,
      shippingPostal: null,
      shippingPhone: null,
      customerEmail: null,
      updatedAt: new Date(),
    })
    .where(eq(schema.orders.id, id));
  return NextResponse.json({ success: true });
});
