// src/lib/bonfiletPricing.ts
// USD基準の価格計算

export const MIN_QTY = 30;
export const BACK_SIDE_ADDITION_USD = 0.80; // 約120円相当（150円/USD換算）

export type Tier = { upTo: number; unitUSD: number };

// USD基準の価格リスト（元のJPY価格を150円/USDで換算）
export const TIERS: Tier[] = [
  { upTo: 39, unitUSD: 8.0 }, // 1200円 ÷ 150
  { upTo: 49, unitUSD: 7.33 }, // 1100円 ÷ 150
  { upTo: 59, unitUSD: 6.67 }, // 1000円 ÷ 150
  { upTo: 69, unitUSD: 6.0 }, // 900円 ÷ 150
  { upTo: 79, unitUSD: 5.67 }, // 850円 ÷ 150
  { upTo: 89, unitUSD: 5.33 }, // 800円 ÷ 150
  { upTo: 99, unitUSD: 4.67 }, // 700円 ÷ 150
  { upTo: 149, unitUSD: 4.0 }, // 600円 ÷ 150
  { upTo: 199, unitUSD: 3.67 }, // 550円 ÷ 150
  { upTo: 249, unitUSD: 3.33 }, // 500円 ÷ 150
  { upTo: 299, unitUSD: 3.0 }, // 450円 ÷ 150
  { upTo: 399, unitUSD: 2.87 }, // 430円 ÷ 150
  { upTo: 499, unitUSD: 2.77 }, // 415円 ÷ 150
  { upTo: 599, unitUSD: 2.67 }, // 400円 ÷ 150
  { upTo: 699, unitUSD: 2.53 }, // 380円 ÷ 150
  { upTo: 799, unitUSD: 2.4 }, // 360円 ÷ 150
  { upTo: 899, unitUSD: 2.27 }, // 340円 ÷ 150
  { upTo: 999, unitUSD: 2.2 }, // 330円 ÷ 150
  { upTo: 1999, unitUSD: 2.13 }, // 320円 ÷ 150
  { upTo: 2999, unitUSD: 1.67 }, // 250円 ÷ 150
  { upTo: 3999, unitUSD: 1.6 }, // 240円 ÷ 150
  { upTo: 5999, unitUSD: 1.53 }, // 230円 ÷ 150
  { upTo: 9999, unitUSD: 1.43 }, // 215円 ÷ 150
  { upTo: Number.MAX_SAFE_INTEGER, unitUSD: 1.33 }, // 200円 ÷ 150
];

export function normalizeQty(q: number) {
  if (!Number.isFinite(q)) return MIN_QTY;
  return Math.max(MIN_QTY, Math.floor(q));
}

export function getUnitPriceUSD(quantity: number) {
  const q = normalizeQty(quantity);
  for (const t of TIERS) {
    if (q <= t.upTo) return t.unitUSD;
  }
  return 1.33;
}

export function calcTaxIncludedUnitUSD(quantity: number) {
  const unit = getUnitPriceUSD(quantity);
  return Math.round(unit * 1.1 * 100) / 100; // 税込10%、小数点2桁
}

export function calcTaxIncludedTotalUSD(
  quantity: number,
  hasBackSide?: boolean
) {
  const q = normalizeQty(quantity);
  const unitTax = calcTaxIncludedUnitUSD(q);
  const baseTotal = q * unitTax;
  if (hasBackSide) {
    const backAddition = Math.round(BACK_SIDE_ADDITION_USD * 1.1 * 100) / 100; // 税込
    return Math.round((baseTotal + q * backAddition) * 100) / 100;
  }
  return Math.round(baseTotal * 100) / 100;
}
