// src/lib/repo.ts — DB アクセス（国・キャンペーン）
import { eq, and, asc, isNotNull } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { parseShipping, type CountryRule } from "./quote";
import type { Country } from "@/db/schema";

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
