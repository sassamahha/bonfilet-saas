// GET/POST /api/admin/campaigns
import { readJson } from "@/lib/readJson";
import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { adminRoute } from "@/lib/adminRoute";
import { newId } from "@/lib/repo";
import { campaignInputToValues } from "@/lib/campaignInput";

export const dynamic = "force-dynamic";

export const GET = adminRoute(async () => {
  const db = await getDb();
  const rows = await db.select().from(schema.campaigns).orderBy(desc(schema.campaigns.createdAt));
  return NextResponse.json({ campaigns: rows });
});

export const POST = adminRoute(async (req: Request) => {
  const body = await readJson(req);
  const parsed = campaignInputToValues(body);
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  if (!parsed.values.slug || !parsed.values.name) {
    return NextResponse.json({ error: "slug and name required" }, { status: 400 });
  }
  const db = await getDb();
  const id = newId("cmp");
  await db.insert(schema.campaigns).values({ id, ...parsed.values, slug: parsed.values.slug, name: parsed.values.name });
  return NextResponse.json({ id });
});
