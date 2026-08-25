# Bonfilet v2

チーム向けカスタム布バンド「Bonfilet」の越境 EC。テキストと色を選んで注文 → 中国工場で製造 → FedEx で関税込み直送。

- Next.js 15 (App Router) / Tailwind v4
- Cloudflare Workers + D1 + R2 + Email Routing（Drizzle ORM）
- Stripe Checkout

設計メモ: `../docs/REDESIGN_2026.md`　セットアップ: `../docs/CLOUDFLARE_SETUP.md`　デプロイ: `DEPLOY.md`

## 運用モデル（Admin なし）
- 管理画面・ログインは**存在しない**。受注すると bonfilet@eidendo.co.jp に受注メール（金額・納品先・納品予定日・仕様書リンク）が届き、仕様書を PDF にして工場へ転送するだけ
- 仕様書リンクは注文ごとの署名付き URL（90日で失効・金額なし）
- 売上・顧客対応は Stripe ダッシュボード。宛先情報は 90 日で自動消去
- 国・関税・送料の設定は wrangler CLI（`../docs/CLOUDFLARE_SETUP.md` の運用節参照）

## 主要ディレクトリ
```
src/app/                 ページ（/ LP, /bonfilet デザイナー, /spec/[id] 仕様書）
src/app/api/             API（countries, order-draft, create-checkout-session, webhook）
src/components/designer  デザイナー（Canvas プレビュー）
src/components/landing   LP
src/db/                  Drizzle スキーマ / バインディング
src/lib/quote.ts         見積計算（商品代 + 送料 + 関税）
src/lib/orderMail.ts     受注メール（Email Routing send_email）
src/lib/specToken.ts     仕様書リンクの署名トークン
drizzle/                 マイグレーション SQL
```

## 設計の要点
- **配送可能国 = 関税が設定された国**。countries に関税を入れた瞬間にデザイナーの配送先に出る
- 関税は購入者から前払いで徴収（送料に内包表示）。工場立替 → 英伝堂へ後日請求。購入者への追加請求なし
- 送料は数量帯一律（30–99 / 100–499 / 500–）。金額は JPY 基準で保存、表示・決済通貨は国ごと（jpy / usd）
