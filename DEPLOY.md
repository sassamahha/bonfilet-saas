# デプロイ手順（Supabase + Vercel）

## 前提条件

- Supabaseアカウント（PostgreSQLデータベース）
- Vercelアカウント
- Stripeアカウント（本番環境）
- ドメイン: bonfilet.jp

## 1. Supabaseのセットアップ

### 1.1 プロジェクト作成

1. [Supabase](https://supabase.com) にログイン
2. 新しいプロジェクトを作成
3. データベースパスワードを設定（後で使用）

### 1.2 データベースURLの取得

Supabaseダッシュボード → Project Settings → Database → Connection string → **URI** をコピー

形式: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

### 1.3 Prismaスキーマの更新

`prisma/schema.prisma` の `datasource db` を以下に変更：

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 1.4 マイグレーション実行

```bash
# Prisma Clientを再生成
npx prisma generate

# マイグレーションを作成・適用
npx prisma migrate dev --name init

# または、既存のDBに直接適用する場合
npx prisma db push
```

### 1.5 初期データの投入（Countryテーブル）

```bash
npx prisma db seed
```

または、Supabase SQL Editorで直接実行：

```sql
INSERT INTO "Country" (id, code, name, enabled) VALUES
  (gen_random_uuid()::text, 'US', 'United States', true),
  (gen_random_uuid()::text, 'CA', 'Canada', true),
  (gen_random_uuid()::text, 'GB', 'United Kingdom', true),
  (gen_random_uuid()::text, 'AU', 'Australia', true),
  (gen_random_uuid()::text, 'NZ', 'New Zealand', true),
  (gen_random_uuid()::text, 'SG', 'Singapore', true),
  (gen_random_uuid()::text, 'HK', 'Hong Kong', true),
  (gen_random_uuid()::text, 'TW', 'Taiwan', true),
  (gen_random_uuid()::text, 'MY', 'Malaysia', true),
  (gen_random_uuid()::text, 'TH', 'Thailand', true),
  (gen_random_uuid()::text, 'VN', 'Vietnam', true),
  (gen_random_uuid()::text, 'JP', 'Japan', true);
```

## 2. Vercelのセットアップ

### 2.1 プロジェクト作成

1. [Vercel](https://vercel.com) にログイン
2. GitHubリポジトリをインポート（またはVercel CLIでデプロイ）

### 2.2 環境変数の設定

Vercelダッシュボード → Project Settings → Environment Variables で以下を設定：

#### 必須環境変数

```
# データベース
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# Stripe（本番環境）
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# アプリケーションURL
NEXT_PUBLIC_APP_URL=https://bonfilet.jp

# 為替レート（オプション、デフォルト値あり）
USD_TO_JPY_RATE=150

# Admin認証（カンマ区切りで複数指定可能）
ADMIN_EMAILS=admin@example.com,admin2@example.com
```

#### オプション環境変数（送料調整用）

```
SHIPPING_MULTIPLIER=1.00
SHIPPING_HANDLING_USD=0.00
```

### 2.3 ビルド設定

Vercelは自動検出しますが、必要に応じて以下を確認：

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`（デフォルト）
- **Output Directory**: `.next`（デフォルト）
- **Install Command**: `npm install`（デフォルト）

### 2.4 ドメイン設定

1. Vercelダッシュボード → Project Settings → Domains
2. `bonfilet.jp` を追加
3. Vercelが提供するDNSレコードをドメインのDNS設定に追加

## 3. Stripe Webhookの本番環境設定

### 3.1 Webhookエンドポイントの作成

1. [Stripe Dashboard](https://dashboard.stripe.com) → Developers → Webhooks
2. "Add endpoint" をクリック
3. Endpoint URL: `https://bonfilet.jp/api/webhook`
4. Events to send: `checkout.session.completed` を選択
5. "Add endpoint" をクリック

### 3.2 Webhook Secretの取得

1. 作成したWebhookエンドポイントをクリック
2. "Signing secret" をコピー（`whsec_...` で始まる）
3. Vercelの環境変数 `STRIPE_WEBHOOK_SECRET` に設定

## 4. デプロイ後の確認事項

### 4.1 データベース接続確認

- Admin画面（`/admin/login`）にアクセスできるか
- 注文がDBに保存されるか

### 4.2 Stripe決済フロー確認

1. テスト注文を実行
2. Stripe Dashboardで決済が記録されているか確認
3. Webhookが正常に動作しているか確認（Stripe Dashboard → Webhooks → イベントログ）

### 4.3 各ページの動作確認

- `/` - トップページ
- `/order` - オーダーページ
- `/privacy-policy` - プライバシーポリシー
- `/terms-of-service` - 利用規約
- `/tokushoho` - 特定商取引法
- `/ja/*` - 日本語版ページ

## 5. トラブルシューティング

### Prisma Clientエラー

```bash
# ローカルで再生成
npx prisma generate

# Vercelでも自動生成されるが、必要に応じて
# package.json の postinstall スクリプトを確認
```

### データベース接続エラー

- `DATABASE_URL` が正しく設定されているか確認
- Supabaseの接続設定（IP制限など）を確認
- Connection Poolingを使用する場合は、`?pgbouncer=true` を追加
- **注意**: Prisma Migrate (`prisma migrate`) を使用する場合は、Connection Pooling URLではなく直接接続URLを使用してください
  - マイグレーション用: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
  - アプリケーション用（Pooling推奨）: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true`

### Webhookエラー

- `STRIPE_WEBHOOK_SECRET` が正しく設定されているか確認
- Stripe DashboardでWebhookイベントのログを確認
- VercelのFunction Logsでエラーを確認

## 6. デプロイ前チェックリスト

- [ ] Supabaseプロジェクトが作成され、データベースURLを取得済み
- [ ] `prisma/schema.prisma` の `datasource db` を `postgresql` に変更済み
- [ ] Prismaマイグレーションを実行し、テーブルが作成済み
- [ ] Countryテーブルに初期データ（12カ国）が投入済み
- [ ] Vercelプロジェクトが作成され、GitHubリポジトリと連携済み
- [ ] すべての環境変数がVercelに設定済み（`DATABASE_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_APP_URL`, `ADMIN_EMAILS` など）
- [ ] Stripe本番環境のAPIキー（`sk_live_...`）を取得済み
- [ ] Stripe Webhookエンドポイント（`https://bonfilet.jp/api/webhook`）を作成済み
- [ ] Stripe Webhook Secret（`whsec_...`）をVercelの環境変数に設定済み
- [ ] ドメイン `bonfilet.jp` をVercelに追加済み
- [ ] DNS設定が完了し、ドメインがVercelに接続済み

## 7. 本番環境での注意事項

- **Stripe API Key**: 必ず本番環境のキー（`sk_live_...`）を使用
- **Webhook Secret**: 本番環境のWebhookエンドポイントのシークレットを使用
- **データベース**: 本番環境用のSupabaseプロジェクトを使用（開発環境と分離推奨）
- **環境変数**: すべての環境変数がVercelに正しく設定されているか確認
- **Prismaスキーマ**: 本番環境では `provider = "postgresql"` に変更されていることを確認

