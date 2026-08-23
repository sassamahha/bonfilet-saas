// PUT /api/admin/countries/:code — 国の関税・送料・有効を更新（無ければ作成）
import { readJson } from "@/lib/readJson";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { adminRoute } from "@/lib/adminRoute";
import { parseShipping } from "@/lib/quote";

export const dynamic = "force-dynamic";

const DUTIES = ["rate", "fixed_per_unit", "fixed_per_order"] as const;

export const PUT = adminRoute(async (req: Request, ctx: { params: Promise<{ code: string }> }) => {
  const { code: raw } = await ctx.params;
  const code = raw.toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return NextResponse.json({ error: "invalid code" }, { status: 400 });
  const body = await readJson(req);

  const dutiesTypeRaw = body?.dutiesType == null || body.dutiesType === "" ? null : String(body.dutiesType);
  if (dutiesTypeRaw !== null && !(DUTIES as readonly string[]).includes(dutiesTypeRaw)) {
    return NextResponse.json({ error: "invalid dutiesType" }, { status: 400 });
  }
  const dutiesType = dutiesTypeRaw as (typeof DUTIES)[number] | null;
  const dutiesValue = Number(body?.dutiesValue ?? 0);
  if (!Number.isFinite(dutiesValue) || dutiesValue < 0) {
    return NextResponse.json({ error: "invalid dutiesValue" }, { status: 400 });
  }
  const shipping = parseShipping(
    typeof body?.shippingJson === "string" ? body.shippingJson : JSON.stringify(body?.shipping ?? [])
  );
  const currencyDisplay = body?.currencyDisplay === "usd" ? "usd" : "jpy";

  const values = {
    name: body?.name ? String(body.name) : undefined,
    enabled: body?.enabled != null ? Boolean(body.enabled) : undefined,
    dutiesType,
    dutiesValue,
    dutiesNote: body?.dutiesNote != null ? String(body.dutiesNote) : null,
    shippingJson: JSON.stringify(shipping),
    currencyDisplay,
    sortOrder: body?.sortOrder != null ? Number(body.sortOrder) || 100 : undefined,
    updatedAt: new Date(),
  };

  const db = await getDb();
  const existing = await db.query.countries.findFirst({ where: eq(schema.countries.code, code) });
  if (existing) {
    await db.update(schema.countries).set(values).where(eq(schema.countries.code, code));
  } else {
    if (!values.name) return NextResponse.json({ error: "name required" }, { status: 400 });
    await db.insert(schema.countries).values({
      code,
      name: values.name,
      enabled: values.enabled ?? true,
      dutiesType,
      dutiesValue,
      dutiesNote: values.dutiesNote,
      shippingJson: values.shippingJson,
      currencyDisplay,
      sortOrder: values.sortOrder ?? 100,
    });
  }
  const row = await db.query.countries.findFirst({ where: eq(schema.countries.code, code) });
  return NextResponse.json({ country: row });
});
