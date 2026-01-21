# Stripe Webhook セットアップガイド

## 1. Stripe CLIのインストール（macOS - Xcode問題回避）

HomebrewがXcodeの問題で失敗する場合、公式バイナリを使用します。

### 手順

1. **Stripe CLIの公式GitHub Releaseからダウンロード**
   - ブラウザで以下にアクセス：
     ```
     https://github.com/stripe/stripe-cli/releases/latest
     ```
   - `stripe_X.X.X_macos_x86_64.tar.gz`（Intel Mac）または
     `stripe_X.X.X_macos_arm64.tar.gz`（Apple Silicon Mac）をダウンロード

2. **解凍と配置**
   ```bash
   # ダウンロードしたtar.gzを解凍
   tar -xzf stripe_X.X.X_macos_*.tar.gz
   
   # 実行可能ファイルをPATHに追加（例：/usr/local/bin）
   sudo mv stripe /usr/local/bin/
   
   # 権限を確認
   chmod +x /usr/local/bin/stripe
   ```

3. **インストール確認**
   ```bash
   stripe version
   ```
   バージョンが表示されればOK

### 代替方法（CLIを使わない場合）

Stripe Dashboardで直接Webhookエンドポイントを作成することも可能ですが、ローカルテストにはngrok等のトンネリングツールが必要です。

---

## 2. 環境変数の設定

### `.env.local`に以下を追加

```env
# Stripe API Keys（テストモード）
STRIPE_SECRET_KEY=sk_test_xxxxx（既に設定済み）
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx（既に設定済み）

# Webhook Secret（ローカルテスト用 - 後でStripe CLIから取得）
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# データベース
DATABASE_URL="file:./dev.db"
```

---

## 3. ローカルWebhookテスト手順

### ステップ1: Stripe CLIにログイン

```bash
stripe login
```

ブラウザが開き、Stripeアカウントでログインして認証を完了してください。

### ステップ2: Webhookをローカルに転送

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

このコマンドを実行すると、以下のような出力が表示されます：

```
> Ready! Your webhook signing secret is whsec_xxxxx (^C to quit)
```

### ステップ3: Webhook Secretを`.env.local`に設定

表示された`whsec_xxxxx`をコピーして、`.env.local`の`STRIPE_WEBHOOK_SECRET`に設定：

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### ステップ4: 開発サーバーを再起動

環境変数を読み込むため、開発サーバーを再起動：

```bash
# 現在のサーバーを停止（Ctrl+C）
npm run dev
```

### ステップ5: テストイベントを送信

別のターミナルで以下を実行：

```bash
stripe trigger checkout.session.completed
```

開発サーバーのログで、Webhookが受信されたことを確認してください。

---

## 4. 実際の注文フローでテスト

### ステップ1: 開発サーバーを起動

```bash
npm run dev
```

### ステップ2: Stripe CLIでWebhookを転送（別ターミナル）

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

### ステップ3: ブラウザで注文を作成

1. `http://localhost:3000/order` にアクセス
2. デザインを作成（テキスト、カラー、数量など）
3. 「Confirm Order」をクリック
4. 仕様書を確認して「Proceed to Payment」をクリック

### ステップ4: Stripe Checkoutでテスト決済

1. Stripe Checkoutページが表示されます
2. テストカード情報を入力：
   - **カード番号**: `4242 4242 4242 4242`
   - **有効期限**: 未来の日付（例：12/34）
   - **CVC**: 任意の3桁（例：123）
   - **郵便番号**: 任意（例：12345）
3. 「Pay」をクリック

### ステップ5: 結果確認

- **成功ページ**: `/order/success`にリダイレクト
- **Webhook**: Stripe CLIのターミナルにイベントが表示される
- **データベース**: 注文が保存されていることを確認
  ```bash
  npx prisma studio
  ```
  ブラウザで`Order`テーブルを確認

---

## 5. 本番環境（Vercel）でのWebhook設定

### ステップ1: Vercelに環境変数を設定

1. Vercelダッシュボードにアクセス
2. プロジェクトを選択
3. **Settings** → **Environment Variables** に移動
4. 以下を追加：
   - `STRIPE_SECRET_KEY` = `sk_live_xxxxx`（本番用）
   - `STRIPE_WEBHOOK_SECRET` = `whsec_xxxxx`（後で取得）

### ステップ2: Stripe DashboardでWebhookエンドポイントを作成

1. **Stripe Dashboard**にアクセス: https://dashboard.stripe.com
2. **Developers** → **Webhooks** に移動
3. **Add endpoint** をクリック
4. 以下を設定：
   - **Endpoint URL**: `https://your-domain.vercel.app/api/webhook`
   - **Description**: `Production webhook`（任意）
   - **Events to send**: 
     - `checkout.session.completed` を選択
     - 必要に応じて他のイベントも選択
5. **Add endpoint** をクリック

### ステップ3: Webhook Secretを取得

1. 作成したエンドポイントをクリック
2. **Signing secret** セクションで **Reveal** をクリック
3. `whsec_xxxxx` をコピー
4. Vercelの環境変数 `STRIPE_WEBHOOK_SECRET` に設定

### ステップ4: 動作確認

1. 本番環境でテスト注文を作成
2. Stripe Dashboard → **Webhooks** → エンドポイントをクリック
3. **Recent events** タブで、イベントが受信されているか確認
4. 成功していれば **Status: 200** と表示される

---

## トラブルシューティング

### Webhookが受信されない

- **ローカル**: `stripe listen`が実行されているか確認
- **本番**: Vercelの環境変数が正しく設定されているか確認
- **エンドポイントURL**: 正しいURLが設定されているか確認

### 署名検証エラー

- `STRIPE_WEBHOOK_SECRET`が正しく設定されているか確認
- ローカルと本番で異なるSecretを使用しているか確認

### データベースに注文が保存されない

- Prisma Clientが正しく生成されているか確認: `npx prisma generate`
- データベースファイルが存在するか確認: `ls -la prisma/dev.db`
- サーバーログでエラーを確認

---

## 次のステップ

1. ✅ Stripe CLIをインストール
2. ✅ ローカルでWebhookテスト
3. ✅ 実際の注文フローでテスト
4. ⏳ 本番環境にデプロイ
5. ⏳ 本番Webhookを設定

