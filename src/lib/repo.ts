// src/lib/repo.ts — DB アクセス（国・キャンペーン）
import { eq, and, asc, isNotNull } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { parseShipping, type CountryRule } from "./quote";
import { parseTiers } from "./bonfiletPricing";
import type { Campaign, Country } from "@/db/schema";

export function newId(prefix = "") {
  const id = crypto.randomUUID().replace(/-/g, "");
  return prefix ? `${prefix}_${id}` : id;
}

export function toRule(c: Country): CountryRule {
  return {
    code: c.code,
    name: c.name,
    dutiesType: c.dutiesType,
    dutiesValue: c.dutiesValue,
    shipping: parseShipping(c.shippingJson),
    currencyDisplay: c.currencyDisplay,
  };
}

/** 配送可能国（enabled かつ関税設定あり） */
export async function listShippableCountries(): Promise<CountryRule[]> {
  const db = await getDb();
  const rows = await db
    .select()
    .from(schema.countries)
    .where(and(eq(schema.countries.enabled, true), isNotNull(schema.countries.dutiesType)))
    .orderBy(asc(schema.countries.sortOrder), asc(schema.countries.name));
  return rows.map(toRule);
}

export async function getShippableCountry(code: string): Promise<CountryRule | null> {
  const db = await getDb();
  const row = await db.query.countries.findFirst({
    where: and(eq(schema.countries.code, code.toUpperCase()), eq(schema.countries.enabled, true)),
  });
  if (!row || row.dutiesType == null) return null;
  return toRule(row);
}

export async function listAllCountries(): Promise<Country[]> {
  const db = await getDb();
  return db
    .select()
    .from(schema.countries)
    .orderBy(asc(schema.countries.sortOrder), asc(schema.countries.name));
}

/** 受付中のキャンペーン（slug）。期間外・非公開は null */
export async function getOpenCampaign(slug: string): Promise<Campaign | null> {
  const db = await getDb();
  const c = await db.query.campaigns.findFirst({ where: eq(schema.campaigns.slug, slug) });
  if (!c || c.status !== "open") return null;
  const now = Date.now();
  if (c.opensAt && c.opensAt.getTime() > now) return null;
  if (c.closesAt && c.closesAt.getTime() < now) return null;
  return c;
}

export function campaignTiers(c: Campaign | null) {
  return parseTiers(c?.priceTableJson);
}

export function campaignAllowedCountries(c: Campaign | null): string[] | null {
  if (!c?.allowedCountriesJson) return null;
  try {
    const arr = JSON.parse(c.allowedCountriesJson);
    return Array.isArray(arr) ? arr.map((s) => String(s).toUpperCase()) : null;
  } catch {
    return null;
  }
}

export function campaignTheme(c: Campaign | null): {
  accent?: string;
  heading?: string;
  description?: string;
} {
  if (!c?.themeJson) return {};
  try {
    return JSON.parse(c.themeJson) ?? {};
  } catch {
    return {};
  }
}
