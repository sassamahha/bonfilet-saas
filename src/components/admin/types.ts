// src/components/admin/types.ts — 管理画面用の JSON シリアライズ済み型（timestamp は ISO 文字列）
import type { Country, Campaign } from "@/db/schema";

type Serialized<T> = {
  [K in keyof T]: T[K] extends Date ? string : T[K] extends Date | null ? string | null : T[K];
};

export type CountryRow = Serialized<Country>;
export type CampaignRow = Serialized<Campaign>;

export const ORDER_STATUSES = ["PENDING", "IN_PRODUCTION", "QC", "PACKED", "SHIPPED"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** GET /api/admin/orders の1行（工場向け最小情報のみ） */
export type OrderRow = {
  id: string;
  createdAt: string;
  status: string;
  quantity: number;
  country: string;
  trackingNumber: string | null;
  designJson: string;
};

/** GET /api/admin/orders/:id の order（金額・顧客メール・Stripe ID は含まない） */
export type OrderDetailRow = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  quantity: number;
  country: string;
  designJson: string;
  previewKeysJson: string | null;
  trackingNumber: string | null;
  shippingName: string | null;
  shippingAddress1: string | null;
  shippingAddress2: string | null;
  shippingCity: string | null;
  shippingState: string | null;
  shippingPostal: string | null;
  shippingCountry: string | null;
  shippingPhone: string | null;
};

export const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "受付",
  IN_PRODUCTION: "製作中",
  QC: "検品",
  PACKED: "梱包済",
  SHIPPED: "発送済",
};

export type DutiesType = "rate" | "fixed_per_unit" | "fixed_per_order";
export const DUTIES_OPTIONS: { value: "" | DutiesType; label: string }[] = [
  { value: "", label: "未設定" },
  { value: "rate", label: "率 (%)" },
  { value: "fixed_per_unit", label: "1個あたり固定 (JPY)" },
  { value: "fixed_per_order", label: "1注文あたり固定 (JPY)" },
];

export type ShippingBand = { upToQty: number; jpy: number };

export type DesignJson = {
  text?: string;
  font?: string;
  bgColor?: string;
  fontColor?: string;
  enableBack?: boolean;
  backText?: string;
  backBgColor?: string;
  backFontColor?: string;
};
