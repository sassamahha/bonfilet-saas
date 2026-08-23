-- v1 の数量帯一律送料（3帯）を初期値として全国に投入。USD は 150円/USD で換算。
-- Z1 Asia Nearby: $29 / $49 / $79  → 4350 / 7350 / 11850
UPDATE countries SET shipping_json = '[{"upToQty":99,"jpy":4350},{"upToQty":499,"jpy":7350},{"upToQty":1000,"jpy":11850}]'
  WHERE code IN ('JP','HK','TW','SG','TH','MY','VN');
-- Z2 US / EU / Oceania: $39 / $69 / $109 → 5850 / 10350 / 16350
UPDATE countries SET shipping_json = '[{"upToQty":99,"jpy":5850},{"upToQty":499,"jpy":10350},{"upToQty":1000,"jpy":16350}]'
  WHERE code IN ('US','CA','GB','AU','NZ');
