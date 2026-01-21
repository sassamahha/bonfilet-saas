// src/lib/shippingPricing.ts

export type ShippingZoneId = "Z1" | "Z2" | "Z3" | "Z4";

export interface ShippingBand {
  minQty: number;
  maxQty: number;
  shippingUSD: number;
}

export interface ShippingZone {
  id: ShippingZoneId;
  label: string;
  countries: string[];
  bands: ShippingBand[];
}

// 送料テーブル（FedEx見積もり待ちの初期値）
// FedExの正式見積もり取得後、数値を更新するだけで反映可能
export const SHIPPING_ZONES: ShippingZone[] = [
  {
    id: "Z1",
    label: "Asia Nearby",
    countries: ["JP", "KR", "CN", "HK", "TW", "SG", "TH", "MY", "VN", "PH", "ID"],
    bands: [
      { minQty: 30, maxQty: 99, shippingUSD: 29 },
      { minQty: 100, maxQty: 499, shippingUSD: 49 },
      { minQty: 500, maxQty: 1000, shippingUSD: 79 },
      { minQty: 1001, maxQty: 4999, shippingUSD: 0 }, // TODO: FedEx見積もり待ち
      { minQty: 5000, maxQty: Number.MAX_SAFE_INTEGER, shippingUSD: 0 }, // TODO: FedEx見積もり待ち
    ],
  },
  {
    id: "Z2",
    label: "US / EU / Oceania",
    countries: ["US", "CA", "MX", "GB", "FR", "DE", "IT", "ES", "NL", "BE", "SE", "AU", "NZ"],
    bands: [
      { minQty: 30, maxQty: 99, shippingUSD: 39 },
      { minQty: 100, maxQty: 499, shippingUSD: 69 },
      { minQty: 500, maxQty: 1000, shippingUSD: 109 },
      { minQty: 1001, maxQty: 4999, shippingUSD: 0 }, // TODO: FedEx見積もり待ち
      { minQty: 5000, maxQty: Number.MAX_SAFE_INTEGER, shippingUSD: 0 }, // TODO: FedEx見積もり待ち
    ],
  },
  {
    id: "Z3",
    label: "ME / LatAm / East EU",
    countries: ["AE", "SA", "QA", "TR", "BR", "AR", "CL", "CO", "PL", "CZ", "HU"],
    bands: [
      { minQty: 30, maxQty: 99, shippingUSD: 49 },
      { minQty: 100, maxQty: 499, shippingUSD: 89 },
      { minQty: 500, maxQty: 1000, shippingUSD: 139 },
      { minQty: 1001, maxQty: 4999, shippingUSD: 0 }, // TODO: FedEx見積もり待ち
      { minQty: 5000, maxQty: Number.MAX_SAFE_INTEGER, shippingUSD: 0 }, // TODO: FedEx見積もり待ち
    ],
  },
  {
    id: "Z4",
    label: "Africa / Remote",
    countries: ["ZA", "EG", "KE", "NG", "MA"],
    bands: [
      { minQty: 30, maxQty: 99, shippingUSD: 59 },
      { minQty: 100, maxQty: 499, shippingUSD: 109 },
      { minQty: 500, maxQty: 1000, shippingUSD: 169 },
      { minQty: 1001, maxQty: 4999, shippingUSD: 0 }, // TODO: FedEx見積もり待ち
      { minQty: 5000, maxQty: Number.MAX_SAFE_INTEGER, shippingUSD: 0 }, // TODO: FedEx見積もり待ち
    ],
  },
];

/**
 * 国コードからゾーンを取得
 * @param countryCode ISO 3166-1 alpha-2 国コード
 * @returns 該当するゾーン、見つからない場合はZ4（デフォルト）
 */
export function getZoneByCountry(countryCode: string): ShippingZone {
  const upperCode = countryCode.toUpperCase();
  const zone = SHIPPING_ZONES.find((z) =>
    z.countries.includes(upperCode)
  );
  return zone || SHIPPING_ZONES[3]; // デフォルトはZ4
}

/**
 * 数量とゾーンから送料を計算
 * @param zone 送料ゾーン
 * @param quantity 数量
 * @returns 送料（USD）、未設定の場合はnull
 */
export function calculateShipping(
  zone: ShippingZone,
  quantity: number
): number | null {
  for (const band of zone.bands) {
    if (quantity >= band.minQty && quantity <= band.maxQty) {
      // 送料が0の場合は未設定（FedEx見積もり待ち）
      return band.shippingUSD > 0 ? band.shippingUSD : null;
    }
  }
  return null;
}

/**
 * 数量帯情報を取得
 * @param zone 送料ゾーン
 * @param quantity 数量
 * @returns 数量帯情報（例: "30-99 pcs"）、見つからない場合はnull
 */
export function getQuantityBand(
  zone: ShippingZone,
  quantity: number
): string | null {
  for (const band of zone.bands) {
    if (quantity >= band.minQty && quantity <= band.maxQty) {
      if (band.maxQty === Number.MAX_SAFE_INTEGER) {
        return `${band.minQty}+ pcs`;
      }
      return `${band.minQty}-${band.maxQty} pcs`;
    }
  }
  return null;
}


