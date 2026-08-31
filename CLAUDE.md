# Bonfilet v2 — Claude 向けプロジェクトメモ

チーム向けカスタム布バンドの越境EC。**2026-08-26 に本番ローンチ済み**（https://bonfilet.jp）。

## 構成（v2 / Admin なし）
- Next.js 15 + Tailwind v4 / Cloudflare Workers（@opennextjs/cloudflare）+ D1（Drizzle）+ R2 + Email Routing / Stripe Checkout
- **管理画面・ログインは存在しない（意図的）**。受注→ bonfilet@eidendo.co.jp に自動メール（金額・納品先・納品予定+21日・仕様書リンク）→ 仕様書を PDF にして工場へ転送する運用
- 仕様書 `/spec/[id]?k=<HMAC>` は署名リンク（90日失効・金額なし・A4 1枚・画像は R2 から data URI 埋め込み）
- 注文の宛先 PII は 90 日で自動消去（webhook 実行時に purge）。下書き画像は 7 日
- **配送可能国 = countries で enabled かつ duties_type が非 null**。関税は価格内包で前払い徴収（表示上は送料に合算、関税という語は顧客に見せない）。送料は数量帯一律（30–99/100–499/500–）
- 金額は JPY 基準で保存、表示/決済通貨は国ごと（jpy/usd、USD_TO_JPY_RATE デフォルト150）
- 売上・顧客対応は Stripe ダッシュボードが正

## コマンド
- 開発: `npm run dev`（.dev.vars 必須。ローカル D1 は `npm run db:migrate:local`）
- デプロイ: `npm run deploy`（wrangler login 済みであること）
- スキーマ変更: schema.ts 編集 → `npm run db:generate` → migrate local → remote
- ログ: `npx wrangler tail`
- 国の開放（管理画面は無い）: `npx wrangler d1 execute bonfilet --remote --command "update countries set duties_type='rate', duties_value=25, shipping_json='[...]' where code='US'"`

## 事故防止
- **Admin/キャンペーン機能を復活させない**（設計判断で削除済み。必要になったら git 履歴から）
- 仕様書・受注メール以外に金額/顧客メールを露出させない
- `cloudflare:email` の import はバンドラ対策済み（orderMail.ts のオブジェクト経由 dynamic import を変えない）
- wrangler の対話プロンプトが wrangler.jsonc に重複バインディングを追記することがある → 正は DB / ASSETS_BUCKET / SPEC_MAIL のみ
- workers.dev は無効化済み（workers_dev: false）。secrets は STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET / APP_SECRET_KEY の3つ
- 特商法/規約は「電話なし・メール対応のみ・DDP（追加請求なし）」文言。変更時はここを崩さない

## 関連ドキュメント
- セットアップ/運用: `../docs/CLOUDFLARE_SETUP.md`　設計判断: `../docs/REDESIGN_2026.md`
- 事業ログは /bizlog スキル（vault 02_Fact/Bonfilet/log/）

## 既知の残タスク（2026-08-31 時点）
- OGP 専用画像（1200×630）作成
- 法務ページの v2 デザイン化（現在 v1 の slate スタイル）
- Vercel / Supabase プロジェクトの削除（ローンチ 1〜2 週間後に）+ Stripe 旧キーのローテーション
- Search Console 登録・サイトマップ送信（ユーザー操作）
