# Bonfilet v2

チーム向けカスタム布バンド「Bonfilet」の越境 EC。テキストと色を選んで注文 → 中国工場で製造 → FedEx で関税込み直送。

- Next.js 15 (App Router) / Tailwind v4
- Cloudflare Workers + D1 + R2（Drizzle ORM）
- Stripe Checkout

設計メモ: `../docs/REDESIGN_2026.md`　デプロイ: `DEPLOY.md`

## 主要ディレクトリ
```
src/app/                 ページ（/ LP, /bonfilet デザイナー, /c/[slug] キャンペーン, /admin 管理）
src/app/api/             API（countries, order-draft, create-checkout-session, webhook, admin/*）
src/components/designer  デザイナー（Canvas プレビュー）
src/components/landing   LP
src/components/admin     管理画面
src/db/                  Drizzle スキーマ / バインディング
src/lib/quote.ts         見積計算（商品代 + 送料 + 関税）
src/lib/repo.ts          DB アクセス
drizzle/                 マイグレーション SQL
```

## 設計の要点
- **配送可能国 = 関税が設定された国**。管理画面で関税を入力した瞬間に配送先に出る
- 関税は購入者から前払いで徴収（工場立替 → 英伝堂へ後日請求）。購入者への追加請求なし
- 金額は JPY 基準で保存。表示・決済通貨は国ごとに設定（jpy / usd）
