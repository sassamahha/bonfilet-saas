-- 初期データ: 日本のみ配送可（関税0固定）。他は関税未設定 = 配送対象外（管理画面で開放）
INSERT INTO countries (code, name, enabled, duties_type, duties_value, duties_note, shipping_json, currency_display, sort_order) VALUES
  ('JP', 'Japan',          1, 'fixed_per_order', 0, '国内扱い。工場が関税込みで発送', '[{"upToQty":300,"jpy":1200},{"upToQty":100000,"jpy":2000}]', 'jpy', 1),
  ('US', 'United States',  1, NULL, 0, NULL, '[]', 'usd', 10),
  ('CA', 'Canada',         1, NULL, 0, NULL, '[]', 'usd', 11),
  ('GB', 'United Kingdom', 1, NULL, 0, NULL, '[]', 'usd', 12),
  ('AU', 'Australia',      1, NULL, 0, NULL, '[]', 'usd', 20),
  ('NZ', 'New Zealand',    1, NULL, 0, NULL, '[]', 'usd', 21),
  ('SG', 'Singapore',      1, NULL, 0, NULL, '[]', 'usd', 30),
  ('HK', 'Hong Kong',      1, NULL, 0, NULL, '[]', 'usd', 31),
  ('TW', 'Taiwan',         1, NULL, 0, NULL, '[]', 'usd', 32),
  ('MY', 'Malaysia',       1, NULL, 0, NULL, '[]', 'usd', 33),
  ('TH', 'Thailand',       1, NULL, 0, NULL, '[]', 'usd', 34),
  ('VN', 'Vietnam',        1, NULL, 0, NULL, '[]', 'usd', 35);
