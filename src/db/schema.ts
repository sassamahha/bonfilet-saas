// src/db/schema.ts — Drizzle (SQLite / Cloudflare D1)
import { sqliteTable, text, integer, real, index } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

const now = () => sql`(unixepoch())`;

/**
 * 国・関税・送料
 * 配送可能 = enabled && dutiesType != null
 * 関税は工場立替 → 英伝堂へ後日請求。購入者には価格内包で checkout 時に徴収する。
 */
export const countries = sqliteTable(
  "countries",
  {
    code: text("code").primaryKey(), // ISO 3166-1 alpha-2
    name: text("name").notNull(),
    enabled: integer("enabled", { mode: "boolean" }).notNull().default(false),
    // null = 関税未設定 → 配送対象外
    dutiesType: text("duties_type", {
      enum: ["rate", "fixed_per_unit", "fixed_per_order"],
    }),
    // rate: % (例 7.5), fixed_*: JPY
    dutiesValue: real("duties_value").notNull().default(0),
    dutiesNote: text("duties_note"),
    // 送料（JPY）: [{ upToQty: 300, jpy: 1500 }, { upToQty: 100000, jpy: 2500 }]
    shippingJson: text("shipping_json").notNull().default("[]"),
    // 表示通貨 (jpy | usd)
    currencyDisplay: text("currency_display").notNull().default("jpy"),
    sortOrder: integer("sort_order").notNull().default(100),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(now()),
  },
  (t) => [index("countries_enabled_idx").on(t.enabled)]
);

/** 非公開URL単位のキャンペーン（Comicon など） */
export const campaigns = sqliteTable("campaigns", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  status: text("status", { enum: ["draft", "open", "closed"] })
    .notNull()
    .default("draft"),
  opensAt: integer("opens_at", { mode: "timestamp" }),
  closesAt: integer("closes_at", { mode: "timestamp" }),
  minQty: integer("min_qty"),
  // null = 標準価格表。[{ upTo: 49, unitJpy: 1100 }, ...]
  priceTableJson: text("price_table_json"),
  // null = 全配送対象国。["JP","US"]
  allowedCountriesJson: text("allowed_countries_json"),
  // { accent: "#..", heading: "...", description: "..." }
  themeJson: text("theme_json"),
  note: text("note"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(now()),
});

export const orders = sqliteTable(
  "orders",
  {
    id: text("id").primaryKey(),
    campaignId: text("campaign_id").references(() => campaigns.id),
    stripeSessionId: text("stripe_session_id").notNull().unique(),
    status: text("status", {
      enum: ["PENDING", "IN_PRODUCTION", "QC", "PACKED", "SHIPPED"],
    })
      .notNull()
      .default("PENDING"),

    quantity: integer("quantity").notNull(),
    country: text("country").notNull(),

    // 金額は全て JPY 基準で保存（表示通貨は別途）
    unitJpy: integer("unit_jpy").notNull(),
    backAdditionJpy: integer("back_addition_jpy").notNull().default(0),
    subtotalJpy: integer("subtotal_jpy").notNull(),
    shippingJpy: integer("shipping_jpy").notNull(),
    dutiesJpy: integer("duties_jpy").notNull(),
    totalJpy: integer("total_jpy").notNull(),
    currencyDisplay: text("currency_display").notNull().default("jpy"),
    // Stripe で実際に課金した通貨と金額（最小単位）
    chargedCurrency: text("charged_currency"),
    chargedAmount: integer("charged_amount"),

    shippingName: text("shipping_name"),
    shippingAddress1: text("shipping_address1"),
    shippingAddress2: text("shipping_address2"),
    shippingCity: text("shipping_city"),
    shippingState: text("shipping_state"),
    shippingPostal: text("shipping_postal"),
    shippingCountry: text("shipping_country"),
    shippingPhone: text("shipping_phone"),
    customerEmail: text("customer_email"),

    // { text, font, bgColor, fontColor, enableBack, backText, backBgColor, backFontColor }
    designJson: text("design_json").notNull(),
    // R2 keys: { front: "previews/xxx-front.png", back?: "..." }
    previewKeysJson: text("preview_keys_json"),

    trackingNumber: text("tracking_number"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(now()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(now()),
  },
  (t) => [
    index("orders_status_idx").on(t.status),
    index("orders_created_idx").on(t.createdAt),
    index("orders_campaign_idx").on(t.campaignId),
  ]
);

/** checkout 前のプレビュー保管（R2 キー） */
export const drafts = sqliteTable(
  "drafts",
  {
    id: text("id").primaryKey(),
    frontKey: text("front_key").notNull(),
    backKey: text("back_key"),
    designJson: text("design_json"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(now()),
  },
  (t) => [index("drafts_created_idx").on(t.createdAt)]
);

export type Country = typeof countries.$inferSelect;
export type Campaign = typeof campaigns.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type Draft = typeof drafts.$inferSelect;
