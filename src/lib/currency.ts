// src/lib/currency.ts
// 通貨定義と為替レート管理（USD基準）

export type CurrencyCode = "usd" | "jpy";

export interface Currency {
  code: CurrencyCode;
  name: string;
  symbol: string;
  // Stripeの最小単位（1通貨単位あたりの最小額）
  // 例: USD=100 (cents), JPY=1 (円)
  stripeMinUnit: number;
}

export const CURRENCIES: Currency[] = [
  { code: "usd", name: "US Dollar", symbol: "$", stripeMinUnit: 100 },
  { code: "jpy", name: "Japanese Yen", symbol: "¥", stripeMinUnit: 1 },
];

/**
 * USD基準の為替レート取得（環境変数から、デフォルト値あり）
 */
export function getExchangeRate(toCurrency: CurrencyCode): number {
  if (toCurrency === "usd") return 1.0;

  // 環境変数の命名規則: USD_TO_{CURRENCY}_RATE
  const envKey = `USD_TO_${toCurrency.toUpperCase()}_RATE`;
  const envValue =
    process.env[envKey] ?? process.env[`NEXT_PUBLIC_${envKey}`];

  if (envValue) {
    const rate = Number(envValue);
    if (Number.isFinite(rate) && rate > 0) return rate;
  }

  // デフォルト値（固定レート）
  const defaultRates: Record<CurrencyCode, number> = {
    usd: 1.0,
    jpy: 150.0, // 固定: 150円/USD
  };

  return defaultRates[toCurrency] ?? 1.0;
}

/**
 * USD金額を指定通貨に変換
 */
export function convertUSDToCurrency(
  amountUSD: number,
  targetCurrency: CurrencyCode
): number {
  if (targetCurrency === "usd") return amountUSD;
  const rate = getExchangeRate(targetCurrency);
  return amountUSD * rate;
}

/**
 * Stripe用の最小単位に変換
 */
export function getStripeAmount(
  amountInCurrency: number,
  currency: CurrencyCode
): number {
  const currencyInfo = CURRENCIES.find((c) => c.code === currency);
  const minUnit = currencyInfo?.stripeMinUnit ?? 100;
  return Math.max(1, Math.round(amountInCurrency * minUnit));
}


