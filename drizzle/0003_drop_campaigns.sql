-- キャンペーン機能の削除（orders は campaign_id 抜きで再構築）
PRAGMA defer_foreign_keys = on;

CREATE TABLE orders_new (
  id text PRIMARY KEY NOT NULL,
  stripe_session_id text NOT NULL,
  status text DEFAULT 'PENDING' NOT NULL,
  quantity integer NOT NULL,
  country text NOT NULL,
  unit_jpy integer NOT NULL,
  back_addition_jpy integer DEFAULT 0 NOT NULL,
  subtotal_jpy integer NOT NULL,
  shipping_jpy integer NOT NULL,
  duties_jpy integer NOT NULL,
  total_jpy integer NOT NULL,
  currency_display text DEFAULT 'jpy' NOT NULL,
  charged_currency text,
  charged_amount integer,
  shipping_name text,
  shipping_address1 text,
  shipping_address2 text,
  shipping_city text,
  shipping_state text,
  shipping_postal text,
  shipping_country text,
  shipping_phone text,
  customer_email text,
  design_json text NOT NULL,
  preview_keys_json text,
  tracking_number text,
  created_at integer DEFAULT (unixepoch()) NOT NULL,
  updated_at integer DEFAULT (unixepoch()) NOT NULL
);

INSERT INTO orders_new (
  id, stripe_session_id, status, quantity, country,
  unit_jpy, back_addition_jpy, subtotal_jpy, shipping_jpy, duties_jpy, total_jpy,
  currency_display, charged_currency, charged_amount,
  shipping_name, shipping_address1, shipping_address2, shipping_city, shipping_state,
  shipping_postal, shipping_country, shipping_phone, customer_email,
  design_json, preview_keys_json, tracking_number, created_at, updated_at
)
SELECT
  id, stripe_session_id, status, quantity, country,
  unit_jpy, back_addition_jpy, subtotal_jpy, shipping_jpy, duties_jpy, total_jpy,
  currency_display, charged_currency, charged_amount,
  shipping_name, shipping_address1, shipping_address2, shipping_city, shipping_state,
  shipping_postal, shipping_country, shipping_phone, customer_email,
  design_json, preview_keys_json, tracking_number, created_at, updated_at
FROM orders;

DROP TABLE orders;
ALTER TABLE orders_new RENAME TO orders;

CREATE UNIQUE INDEX orders_stripe_session_id_unique ON orders (stripe_session_id);
CREATE INDEX orders_status_idx ON orders (status);
CREATE INDEX orders_created_idx ON orders (created_at);

DROP TABLE IF EXISTS campaigns;
