// src/lib/quote.ts — 見積計算（商品代 + 送料 + 関税 = 合計）。全て JPY。
import { BACK_SIDE_ADDITION_JPY, getUnitJpy, normalizeQty, type Tier } from "./bonfiletPricing";

export type DutiesType = "rate" | "fixed_per_unit" | "fixed_per_order";
export type ShippingBand = { upToQty: number; jpy: number };

export interface CountryRule {
  code: string;
  name: string;
  dutiesType: DutiesType | null;
  dutiesValue: number;
  shipping: ShippingBand[];
  currencyDisplay: string;
}

export interface Quote {
  quantity: number;
  unitJpy: number;
  backAdditionJpy: number;
  subtotalJpy: number;
  shippingJpy: number;
  dutiesJpy: number;
  totalJpy: number;
}

export function parseShipping(json: string | null | undefined): ShippingBand[] {
  if (!json) return [];
  try {
    const arr = JSON.parse(json);
    if (!Array.isArray(arr)) return [];
    return arr
      .map((b) => ({ upToQty: Number(b.upToQty), jpy: Number(b.jpy) }))
      .filter((b) => Number.isFinite(b.upToQty) && Number.isFinite(b.jpy))
      .sort((a, b) => a.upToQty - b.upToQty);
  } catch {
    return [];
  }
}

/** 配送可能 = 関税設定あり */
export function isShippable(c: { enabled: boolean; dutiesType: string | null }) {
  return c.enabled && c.dutiesType != null;
}

export function calcShippingJpy(bands: ShippingBand[], qty: number) {
  if (bands.length === 0) return 0;
  for (const b of bands) if (qty <= b.upToQty) return b.jpy;
  return bands[bands.length - 1].jpy;
}

export function calcDutiesJpy(rule: CountryRule, qty: number, subtotalJpy: number) {
  switch (rule.dutiesType) {
    case "rate":
      return Math.round((subtotalJpy * rule.dutiesValue) / 100);
    case "fixed_per_unit":
      return Math.round(rule.dutiesValue * qty);
    case "fixed_per_order":
      return Math.round(rule.dutiesValue);
    default:
      return 0;
  }
}

export function buildQuote(opts: {
  quantity: number;
  hasBack: boolean;
  rule: CountryRule;
  tiers?: Tier[];
  minQty?: number;
}): Quote {
  const quantity = normalizeQty(opts.quantity, opts.minQty);
  const unitJpy = getUnitJpy(quantity, opts.tiers);
  const backAdditionJpy = opts.hasBack ? BACK_SIDE_ADDITION_JPY : 0;
  const subtotalJpy = (unitJpy + backAdditionJpy) * quantity;
  const shippingJpy = calcShippingJpy(opts.rule.shipping, quantity);
  const dutiesJpy = calcDutiesJpy(opts.rule, quantity, subtotalJpy);
  return {
    quantity,
    unitJpy,
    backAdditionJpy,
    subtotalJpy,
    shippingJpy,
    dutiesJpy,
    totalJpy: subtotalJpy + shippingJpy + dutiesJpy,
  };
}
