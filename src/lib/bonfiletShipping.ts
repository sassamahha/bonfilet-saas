// src/lib/bonfiletShipping.ts
// Bonfilet専用のFedEx送料ロジック（ゾーンA〜H, 1, 2）とDelivered価格計算

import {
  normalizeQty,
  calcTaxIncludedTotalUSD,
} from "@/lib/bonfiletPricing";

// -------------------------------
// 1. FedExゾーン & 料金マスター
// -------------------------------

// FedEx料金表のゾーンID
export type FedexZoneId =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "1"
  | "2";

// 重量ティア（kg）
export const TIERS_KG = [0.5, 1, 2, 5, 10] as const;
export type TierKg = (typeof TIERS_KG)[number];

/**
 * 送料調整パラメータ
 *
 * - SHIPPING_MULTIPLIER:
 *   FedEx料金表の値（baseUSD）に対して係数を掛けることで、
 *   燃油サーチャージやマージンなどを一括調整できる。
 *   例: 1.3 (= +30%)
 *
 * - SHIPPING_HANDLING_USD:
 *   1出荷あたりに固定で上乗せしたいハンドリングフィー（USD）。
 */
export const SHIPPING_MULTIPLIER =
  Number(
    process.env.NEXT_PUBLIC_SHIPPING_MULTIPLIER ??
      process.env.NEXT_PUBLIC_SHIPPING_FACTOR ?? // 旧環境変数名との互換
      "1.3"
  ) || 1.3;

export const SHIPPING_HANDLING_USD =
  Number(process.env.NEXT_PUBLIC_SHIPPING_HANDLING_USD ?? "0");

// 料金テーブル（USDマスター）
export const RATES_USD: Record<FedexZoneId, Record<TierKg, number>> = {
  A: { 0.5: 36.14, 1: 43.43, 2: 58.0, 5: 98.86, 10: 146.0 },
  B: { 0.5: 59.14, 1: 72.57, 2: 99.43, 5: 183.57, 10: 322.14 },
  C: { 0.5: 56.43, 1: 71.57, 2: 101.86, 5: 184.14, 10: 324.14 },
  D: { 0.5: 63.57, 1: 78.0, 2: 106.86, 5: 198.43, 10: 342.71 },
  E: { 0.5: 65.86, 1: 86.43, 2: 127.57, 5: 243.86, 10: 436.71 },
  F: { 0.5: 85.43, 1: 108.0, 2: 153.14, 5: 300.71, 10: 526.43 },
  G: { 0.5: 105.29, 1: 133.14, 2: 188.86, 5: 358.14, 10: 636.71 },
  H: { 0.5: 109.29, 1: 138.57, 2: 197.14, 5: 377.14, 10: 651.71 },
  "1": { 0.5: 72.14, 1: 95.29, 2: 141.57, 5: 284.71, 10: 531.86 },
  "2": { 0.5: 74.43, 1: 97.71, 2: 144.29, 5: 288.29, 10: 536.86 },
};

// -------------------------------
// 2. 数量→重量ティア
// -------------------------------

/**
 * 数量から重量ティア(kg)を決定する。
 * - 30  ~  99   => 0.5
 * - 100 ~ 199   => 1
 * - 200 ~ 299   => 2
 * - 300 ~ 2999  => 5
 * - 3000 ~      => 10
 */
export function qtyToTierKg(qty: number): TierKg {
  const q = normalizeQty(qty);
  if (q >= 30 && q <= 99) return 0.5;
  if (q >= 100 && q <= 199) return 1;
  if (q >= 200 && q <= 299) return 2;
  if (q >= 300 && q <= 2999) return 5;
  return 10;
}

// -------------------------------
// 3. 国コード→FedExゾーン解決
// -------------------------------

// US西部ゾーン（Zone "1"）に入る州コード
const US_WEST_STATES = [
  "CO", "ID", "UT", "AZ", "NV", "CA", "OR", "WA",
] as const;
type UsStateCode = (typeof US_WEST_STATES)[number];

// US州リスト（ISO 3166-2:US準拠）
export interface USState {
  code: string; // 2文字コード（例: "CA"）
  name: string; // 州名（例: "California"）
}

export const US_STATES: USState[] = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
  { code: "DC", name: "District of Columbia" },
];

// ISO 3166-1 alpha-2 → FedexZoneId マップ
const COUNTRY_ZONE_BY_ISO: Record<string, FedexZoneId> = {
  AE: "H",
  AR: "G",
  AT: "F",
  AU: "E",
  BA: "H",
  BD: "H",
  BE: "F",
  BG: "F",
  BJ: "H",
  BO: "G",
  BQ: "G",
  BR: "G",
  BY: "H",
  CA: "2",
  CD: "H",
  CG: "H",
  CH: "F",
  CI: "H",
  CL: "G",
  CO: "G",
  CR: "G",
  CW: "G",
  CZ: "F",
  DE: "F",
  DK: "F",
  DO: "G",
  EC: "G",
  EE: "F",
  EG: "H",
  ES: "F",
  ET: "H",
  FI: "F",
  FR: "F",
  GA: "H",
  GB: "F",
  GD: "G",
  GE: "H",
  GG: "F",
  GH: "H",
  GN: "H",
  GP: "G",
  GR: "F",
  GT: "G",
  GY: "G",
  HK: "A",
  HN: "G",
  HR: "F",
  HU: "F",
  ID: "D",
  IE: "F",
  IL: "F",
  IN: "F",
  IQ: "H",
  IS: "F",
  IT: "F",
  JE: "F",
  JO: "H",
  JP: "C",
  KE: "H",
  KR: "B",
  KW: "H",
  LB: "H",
  LI: "F",
  LT: "F",
  LU: "F",
  LV: "F",
  MA: "H",
  MC: "F",
  MD: "H",
  ME: "F",
  MF: "G",
  MK: "F",
  MO: "A",
  MQ: "G",
  MX: "2",
  MY: "B",
  NG: "H",
  NI: "G",
  NL: "F",
  NO: "F",
  NZ: "E",
  OM: "H",
  PA: "G",
  PE: "G",
  PG: "G",
  PH: "D",
  PL: "F",
  PR: "2",
  PT: "F",
  QA: "H",
  RO: "F",
  RS: "F",
  RU: "F",
  SA: "H",
  SE: "F",
  SG: "B",
  SI: "F",
  SK: "F",
  SV: "G",
  SZ: "H",
  TH: "B",
  TG: "H",
  TN: "H",
  TR: "F",
  TT: "G",
  TW: "B",
  UA: "F",
  US: "2", // 実際のゾーン決定は state で上書き
  UY: "G",
  UZ: "H",
  VA: "F",
  VE: "G",
  VN: "B",
  ZA: "H",
  ZM: "H",
  SX: "G", // St. Maarten / St. Martin
};

// FedEx配送可能な国コード（UIフィルタ用）
export const SUPPORTED_COUNTRY_CODES = Object.keys(COUNTRY_ZONE_BY_ISO);

/**
 * 国コード（とUSの場合は州コード）からFedExゾーンIDを取得。
 * - USだけ州で Zone 1 / Zone 2 を分岐
 * - それ以外は国コードで一発解決
 */
export function getFedexZoneByCountry(
  countryCode: string,
  stateCode?: string | null
): FedexZoneId {
  const country = countryCode.toUpperCase();

  // USだけ州で Zone 1 / Zone 2 を分岐
  if (country === "US") {
    const st = (stateCode ?? "").toUpperCase();
    if (US_WEST_STATES.includes(st as UsStateCode)) {
      return "1";
    }
    return "2";
  }

  const zone = COUNTRY_ZONE_BY_ISO[country];
  if (zone) return zone;

  // マッピング外は本来UIに出さない前提だが、安全側でZone "2"にフォールバック
  return "2";
}

// -------------------------------
// 4. ゾーン×数量→送料USD
// -------------------------------

export function getShippingUSDFromZoneAndQty(
  zone: FedexZoneId,
  qty: number
): number {
  const tier = qtyToTierKg(qty);
  const base = RATES_USD[zone]?.[tier];
  if (!base) return 0;

  // base_usd = rates_usd[zone][tierKg]
  // final_usd = base_usd * shipping_multiplier + handling_usd
  const finalUSD = base * SHIPPING_MULTIPLIER + SHIPPING_HANDLING_USD;

  const effective = finalUSD;
  return Math.round(effective * 100) / 100;
}

// -------------------------------
// 3. Delivered価格計算
// -------------------------------

export interface DeliveredPricingUSD {
  productUnitUSD: number;
  productTotalUSD: number;
  shippingUSD: number;
  deliveredUnitUSD: number;
  deliveredTotalUSD: number;
}

/**
 * 商品価格ロジックと送料ロジックを統合し、
 * Delivered単価/合計（送料込）を計算する。
 */
export function getDeliveredPricingUSD(params: {
  quantity: number;
  countryCode: string;
  stateCode?: string | null;
  hasBackSide?: boolean;
}): DeliveredPricingUSD {
  const { quantity, countryCode, stateCode, hasBackSide } = params;

  const q = normalizeQty(quantity);

  // 商品側の合計（金額はすでに税込）
  const productTotalUSD = calcTaxIncludedTotalUSD(q, hasBackSide);
  const productUnitUSD = productTotalUSD / q;

  // 送料（国→FedExゾーン→数量→送料USD）
  const zone = getFedexZoneByCountry(countryCode, stateCode);
  const shippingUSD = getShippingUSDFromZoneAndQty(zone, q);

  // Delivered（送料込）の単価・合計
  const deliveredTotalUSD = productTotalUSD + shippingUSD;
  const deliveredUnitUSD = deliveredTotalUSD / q;

  return {
    productUnitUSD,
    productTotalUSD,
    shippingUSD,
    deliveredUnitUSD,
    deliveredTotalUSD,
  };
}

