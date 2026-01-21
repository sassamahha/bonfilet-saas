# Stripe Webhook デバッグガイド

## 問題: 注文がデータベースに保存されない

注文がデータベースに保存されない場合、以下の手順で問題を特定してください。

## 1. 環境変数の確認

`.env.local`に以下が設定されているか確認：

```env
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
DATABASE_URL="file:./dev.db"
```

## 2. Stripe CLIの設定確認

### ステップ1: Stripe CLIがインストールされているか確認

```bash
stripe version
```

### ステップ2: Stripe CLIにログイン

```bash
stripe login
```

### ステップ3: Webhookをローカルに転送

**重要**: 開発サーバーを起動した状態で、別のターミナルで以下を実行：

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

このコマンドを実行すると、以下のような出力が表示されます：

```
> Ready! Your webhook signing secret is whsec_xxxxx (^C to quit)
```

### ステップ4: Webhook Secretを`.env.local`に設定

表示された`whsec_xxxxx`をコピーして、`.env.local`の`STRIPE_WEBHOOK_SECRET`に設定：

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### ステップ5: 開発サーバーを再起動

環境変数を読み込むため、開発サーバーを再起動：

```bash
# 現在のサーバーを停止（Ctrl+C）
npm run dev
```

## 3. サーバーログの確認

開発サーバーのターミナルで、以下のログが表示されるか確認：

### Webhook受信時

```
[Webhook] Received webhook request
[Webhook] Body length: xxx
[Webhook] Has signature: true
[Webhook] Has webhook secret: true
[Webhook] Attempting to construct event...
[Webhook] Event constructed successfully. Type: checkout.session.completed
[Webhook] Processing checkout.session.completed event
[Webhook] Session ID: cs_test_xxxxx
[Webhook] Metadata: {...}
[Webhook] Quantity: 30 EnableBack: false
[Webhook] Shipping address: {...}
[Webhook] Duties acknowledged: true
[Webhook] Attempting to save order to database...
[Webhook] Order created successfully!
[Webhook] Order ID: xxxxx
[Webhook] Session ID: cs_test_xxxxx
```

### エラーが発生している場合

- `[Webhook] Missing signature or webhook secret` → `STRIPE_WEBHOOK_SECRET`が設定されていない
- `[Webhook] Signature verification failed` → Webhook Secretが間違っている、またはStripe CLIが実行されていない
- `[Webhook] No shipping address found` → Stripe Checkoutで配送先が入力されていない
- `[Webhook] Unexpected error` → データベースエラーなどの予期しないエラー

## 4. テスト手順

### 手順1: 開発サーバーを起動

```bash
npm run dev
```

### 手順2: Stripe CLIでWebhookを転送（別ターミナル）

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

### 手順3: テスト注文を作成

1. `http://localhost:3000/order` にアクセス
2. デザインを作成
3. 関税同意のチェックボックスにチェック
4. 「Confirm Order」をクリック
5. 仕様書を確認して「Proceed to Payment」をクリック

### 手順4: Stripe Checkoutでテスト決済

1. テストカード情報を入力：
   - カード番号: `4242 4242 4242 4242`
   - 有効期限: 未来の日付（例：12/34）
   - CVC: 任意の3桁（例：123）
   - 郵便番号: 任意（例：12345）
2. 「Pay」をクリック

### 手順5: ログとデータベースを確認

1. **サーバーログ**: Webhookが受信されたか確認
2. **Stripe CLIのターミナル**: イベントが表示されたか確認
3. **データベース**: 注文が保存されたか確認
   ```bash
   npx prisma studio
   ```
   ブラウザで`Order`テーブルを確認

## 5. よくある問題と対処法

### 問題1: Webhookが受信されない

**原因**: Stripe CLIが実行されていない、またはエンドポイントURLが間違っている

**対処法**:
- `stripe listen --forward-to localhost:3000/api/webhook`が実行されているか確認
- エンドポイントURLが`/api/webhook`であることを確認

### 問題2: 署名検証エラー

**原因**: `STRIPE_WEBHOOK_SECRET`が設定されていない、または間違っている

**対処法**:
- `.env.local`に`STRIPE_WEBHOOK_SECRET`が設定されているか確認
- Stripe CLIで表示された`whsec_xxxxx`を使用しているか確認
- 開発サーバーを再起動して環境変数を読み込む

### 問題3: データベースエラー

**原因**: Prisma Clientが生成されていない、またはデータベースファイルが存在しない

**対処法**:
```bash
npx prisma generate
npx prisma db push
```

### 問題4: 配送先情報が取得できない

**原因**: Stripe Checkoutで配送先が入力されていない

**対処法**:
- Stripe Checkoutで配送先情報を入力しているか確認
- `shipping_address_collection`が正しく設定されているか確認

## 6. 手動テスト（開発用）

Webhookを手動でテストする場合：

```bash
# テストイベントを送信
stripe trigger checkout.session.completed
```

サーバーログでWebhookが受信されたことを確認してください。

