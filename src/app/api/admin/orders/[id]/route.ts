// GET /api/admin/orders/:id
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { adminRoute } from "@/lib/adminRoute";

export const dynamic = "force-dynamic";

export const GET = adminRoute(async (_req: Request, ctx: { params: Promise<{ id: string }> }) => {
  const { id } = await ctx.params;
  const db = await getDb();
  const order = await db.query.orders.findFirst({ where: eq(schema.orders.id, id) });
  if (!order) return NextResponse.json({ error: "not found" }, { status: 404 });
  const campaign = order.campaignId
    ? await db.query.campaigns.findFirst({ where: eq(schema.campaigns.id, order.campaignId) })
    : null;
  return NextResponse.json({ order, campaign });
});
