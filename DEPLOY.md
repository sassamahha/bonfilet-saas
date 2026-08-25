# デプロイ手順（Cloudflare Workers + D1 + R2）

ランニングコスト 0 円構成。Vercel / Supabase は使わない。

## 構成
| 役割 | サービス | 無料枠の目安 |
|---|---|---|
| アプリ | Cloudflare Workers（@opennextjs/cloudflare） | 10万リクエスト/日 |
| DB | Cloudflare D1（SQLite） | 5GB、読み 500万行/日、書き 10万行/日 |
| 画像 | Cloudflare R2 | 10GB |
| 決済 | Stripe | 従量 |

## 初回セットアップ

```bash
npm install
npx wrangler login
```

### 1. D1 を作る
```bash
npx wrangler d1 create bonfilet
```
出力された `database_id` を `wrangler.jsonc` の `d1_databases[0].database_id` に貼る。

### 2. R2 バケットを作る
```bash
npx wrangler r2 bucket create bonfilet-assets
```

### 3. マイグレーション（本番）
```bash
npm run db:migrate:remote
```
`drizzle/0001_seed_countries.sql` で日本（関税0・配送可）と待機中の11カ国が入る。

### 4. シークレット
```bash
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put STRIPE_WEBHOOK_SECRET
npx wrangler secret put APP_SECRET_KEY      # 仕様書リンクの署名鍵（openssl rand -hex 32）
```
任意: `USD_TO_JPY_RATE`（デフォルト 150）は `wrangler.jsonc` の `vars` に追加。

### 5. デプロイ
```bash
npm run deploy
```

### 6. ドメイン
Cloudflare ダッシュボード → Workers → bonfilet → Settings → Domains & Routes で `bonfilet.jp` を追加（DNS を Cloudflare に移していること）。
`wrangler.jsonc` の `vars.NEXT_PUBLIC_APP_URL` を `https://bonfilet.jp` にしておく。

### 7. Stripe Webhook
Stripe ダッシュボード → Developers → Webhooks → エンドポイント追加
- URL: `https://bonfilet.jp/api/webhook`
- イベント: `checkout.session.completed`
- 署名シークレットを `STRIPE_WEBHOOK_SECRET` に登録

## ローカル開発
```bash
cp .dev.vars.example .dev.vars   # 値を埋める
npm run db:migrate:local          # ローカル D1 にマイグレーション
npm run dev                       # http://localhost:3000（D1/R2 はローカルエミュレーション）
```
Workers 実機相当で確認したいとき:
```bash
npm run preview
```
Stripe webhook をローカルで受ける:
```bash
stripe listen --forward-to localhost:3000/api/webhook
```

## スキーマ変更
1. `src/db/schema.ts` を編集
2. `npm run db:generate` → `drizzle/000X_*.sql` が生成される
3. `npm run db:migrate:local` で確認 → `npm run db:migrate:remote`

## 運用: 配送対象国を増やす
コード変更なし。wrangler CLI で countries に関税・送料を入れると、その国がデザイナーの配送先に現れる。
コマンド例は `../docs/CLOUDFLARE_SETUP.md` の「普段の運用」を参照。工場の回答は duties_note に残すこと。

## 運用: 受注
受注メール（bonfilet@eidendo.co.jp）内の仕様書リンクを開き、PDF にして工場へ転送する。管理画面は無い。
