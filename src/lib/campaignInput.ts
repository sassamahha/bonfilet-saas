// src/lib/campaignInput.ts — 管理画面からのキャンペーン入力を検証
import { parseTiers } from "./bonfiletPricing";

type Values = {
  slug?: string;
  name?: string;
  status?: "draft" | "open" | "closed";
  opensAt?: Date | null;
  closesAt?: Date | null;
  minQty?: number | null;
  priceTableJson?: string | null;
  allowedCountriesJson?: string | null;
  themeJson?: string | null;
  note?: string | null;
};

function toDate(v: unknown): Date | null | undefined {
  if (v === undefined) return undefined;
  if (v === null || v === "") return null;
  const d = new Date(String(v));
  return Number.isNaN(d.getTime()) ? null : d;
}

export function campaignInputToValues(body: Record<string, unknown>): { values: Values } | { error: string } {
  const values: Values = {};
  if (body.slug !== undefined) {
    const slug = String(body.slug).trim().toLowerCase();
    if (!/^[a-z0-9][a-z0-9-]{1,63}$/.test(slug)) return { error: "slug must be a-z 0-9 -" };
    values.slug = slug;
  }
  if (body.name !== undefined) values.name = String(body.name).trim();
  if (body.status !== undefined) {
    const s = String(body.status);
    if (!["draft", "open", "closed"].includes(s)) return { error: "invalid status" };
    values.status = s as Values["status"];
  }
  const o = toDate(body.opensAt);
  if (o !== undefined) values.opensAt = o;
  const c = toDate(body.closesAt);
  if (c !== undefined) values.closesAt = c;
  if (body.minQty !== undefined) {
    values.minQty = body.minQty === null || body.minQty === "" ? null : Math.max(1, Number(body.minQty) || 1);
  }
  if (body.priceTableJson !== undefined) {
    const raw = body.priceTableJson ? String(body.priceTableJson) : "";
    if (!raw) values.priceTableJson = null;
    else {
      try {
        JSON.parse(raw);
      } catch {
        return { error: "priceTableJson is not JSON" };
      }
      values.priceTableJson = JSON.stringify(parseTiers(raw));
    }
  }
  if (body.allowedCountriesJson !== undefined) {
    const raw = body.allowedCountriesJson ? String(body.allowedCountriesJson) : "";
    if (!raw) values.allowedCountriesJson = null;
    else {
      try {
        const arr = JSON.parse(raw);
        if (!Array.isArray(arr)) return { error: "allowedCountriesJson must be an array" };
        values.allowedCountriesJson = JSON.stringify(arr.map((s) => String(s).toUpperCase()));
      } catch {
        return { error: "allowedCountriesJson is not JSON" };
      }
    }
  }
  if (body.themeJson !== undefined) {
    const raw = body.themeJson ? String(body.themeJson) : "";
    if (!raw) values.themeJson = null;
    else {
      try {
        JSON.parse(raw);
      } catch {
        return { error: "themeJson is not JSON" };
      }
      values.themeJson = raw;
    }
  }
  if (body.note !== undefined) values.note = body.note ? String(body.note) : null;
  return { values };
}
