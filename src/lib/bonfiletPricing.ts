// src/lib/bonfiletPricing.ts — JPY 基準の価格表
export const MIN_QTY = 30;
export const MAX_TEXT_LENGTH = 40;
export const BACK_SIDE_ADDITION_JPY = 120;

export type Tier = { upTo: number; unitJpy: number };

export const DEFAULT_TIERS: Tier[] = [
  { upTo: 39, unitJpy: 1080 },
  { upTo: 49, unitJpy: 990 },
  { upTo: 59, unitJpy: 900 },
  { upTo: 69, unitJpy: 810 },
  { upTo: 79, unitJpy: 765 },
  { upTo: 89, unitJpy: 720 },
  { upTo: 99, unitJpy: 630 },
  { upTo: 149, unitJpy: 540 },
  { upTo: 199, unitJpy: 495 },
  { upTo: 249, unitJpy: 450 },
  { upTo: 299, unitJpy: 405 },
  { upTo: 399, unitJpy: 387 },
  { upTo: 499, unitJpy: 374 },
  { upTo: 599, unitJpy: 360 },
  { upTo: 699, unitJpy: 342 },
  { upTo: 799, unitJpy: 324 },
  { upTo: 899, unitJpy: 306 },
  { upTo: 999, unitJpy: 297 },
  { upTo: 1999, unitJpy: 288 },
  { upTo: 2999, unitJpy: 225 },
  { upTo: 3999, unitJpy: 216 },
  { upTo: 5999, unitJpy: 207 },
  { upTo: 9999, unitJpy: 194 },
  { upTo: Number.MAX_SAFE_INTEGER, unitJpy: 180 },
];

export function normalizeQty(q: number, minQty = MIN_QTY) {
  if (!Number.isFinite(q)) return minQty;
  return Math.max(minQty, Math.floor(q));
}

export function getUnitJpy(quantity: number, tiers: Tier[] = DEFAULT_TIERS) {
  for (const t of tiers) if (quantity <= t.upTo) return t.unitJpy;
  return tiers[tiers.length - 1]?.unitJpy ?? 0;
}

export function parseTiers(json: string | null | undefined): Tier[] {
  if (!json) return DEFAULT_TIERS;
  try {
    const arr = JSON.parse(json);
    if (!Array.isArray(arr) || arr.length === 0) return DEFAULT_TIERS;
    return arr
      .map((t) => ({ upTo: Number(t.upTo), unitJpy: Number(t.unitJpy) }))
      .filter((t) => Number.isFinite(t.upTo) && Number.isFinite(t.unitJpy))
      .sort((a, b) => a.upTo - b.upTo);
  } catch {
    return DEFAULT_TIERS;
  }
}
