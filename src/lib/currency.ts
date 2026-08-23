// src/lib/currency.ts — 表示通貨。内部は JPY 基準。
export type CurrencyCode = "jpy" | "usd";

export const CURRENCIES: Record<CurrencyCode, { symbol: string; stripeMinUnit: number; locale: string }> = {
  jpy: { symbol: "¥", stripeMinUnit: 1, locale: "ja-JP" },
  usd: { symbol: "$", stripeMinUnit: 100, locale: "en-US" },
};

/** 1 USD = N JPY（環境変数 USD_TO_JPY_RATE、デフォルト 150） */
export function getUsdJpyRate(env?: { USD_TO_JPY_RATE?: string }) {
  const v = Number(env?.USD_TO_JPY_RATE ?? process.env.USD_TO_JPY_RATE ?? process.env.NEXT_PUBLIC_USD_TO_JPY_RATE);
  return Number.isFinite(v) && v > 0 ? v : 150;
}

export function toCurrencyCode(s: string | null | undefined): CurrencyCode {
  return s === "usd" ? "usd" : "jpy";
}

/** JPY → 表示通貨の数値（USD は小数2桁） */
export function convertFromJpy(jpy: number, to: CurrencyCode, rate: number) {
  if (to === "jpy") return Math.round(jpy);
  return Math.round((jpy / rate) * 100) / 100;
}

export function formatMoney(amount: number, code: CurrencyCode) {
  const c = CURRENCIES[code];
  return new Intl.NumberFormat(c.locale, {
    style: "currency",
    currency: code.toUpperCase(),
    minimumFractionDigits: code === "jpy" ? 0 : 2,
    maximumFractionDigits: code === "jpy" ? 0 : 2,
  }).format(amount);
}

/** Stripe に渡す最小単位の整数 */
export function toStripeAmount(jpy: number, to: CurrencyCode, rate: number) {
  const v = convertFromJpy(jpy, to, rate);
  return Math.round(v * CURRENCIES[to].stripeMinUnit);
}
