// PATCH /api/admin/orders/:id/status  { status, trackingNumber? }
import { readJson } from "@/lib/readJson";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { adminRoute } from "@/lib/adminRoute";

export const dynamic = "force-dynamic";

const STATUSES = ["PENDING", "IN_PRODUCTION", "QC", "PACKED", "SHIPPED"] as const;
type Status = (typeof STATUSES)[number];

export const PATCH = adminRoute(async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
  const { id } = await ctx.params;
  const body = await readJson(req);
  const status = String(body?.status ?? "") as Status;
  if (!STATUSES.includes(status)) {
    return NextResponse.json({ error: "invalid status" }, { status: 400 });
  }
  const trackingNumber = body?.trackingNumber != null ? String(body.trackingNumber).trim() || null : undefined;

  const db = await getDb();
  const existing = await db.query.orders.findFirst({ where: eq(schema.orders.id, id) });
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });

  await db
    .update(schema.orders)
    .set({
      status,
      ...(trackingNumber !== undefined ? { trackingNumber } : {}),
      updatedAt: new Date(),
    })
    .where(eq(schema.orders.id, id));
  return NextResponse.json({ success: true });
});
