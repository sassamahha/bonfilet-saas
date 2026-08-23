// PUT/DELETE /api/admin/campaigns/:id
import { readJson } from "@/lib/readJson";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { adminRoute } from "@/lib/adminRoute";
import { campaignInputToValues } from "@/lib/campaignInput";

export const dynamic = "force-dynamic";

export const PUT = adminRoute(async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
  const { id } = await ctx.params;
  const body = await readJson(req);
  const parsed = campaignInputToValues(body);
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const db = await getDb();
  await db.update(schema.campaigns).set(parsed.values).where(eq(schema.campaigns.id, id));
  const row = await db.query.campaigns.findFirst({ where: eq(schema.campaigns.id, id) });
  return NextResponse.json({ campaign: row });
});

export const DELETE = adminRoute(async (_req: Request, ctx: { params: Promise<{ id: string }> }) => {
  const { id } = await ctx.params;
  const db = await getDb();
  await db.delete(schema.campaigns).where(eq(schema.campaigns.id, id));
  return NextResponse.json({ success: true });
});
