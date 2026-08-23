// 手動定義（wrangler types で再生成可）
interface CloudflareEnv {
  DB: D1Database;
  ASSETS_BUCKET: R2Bucket;
  ASSETS: Fetcher;
  NEXT_PUBLIC_APP_URL: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  ADMIN_EMAILS: string;
  ADMIN_SECRET_KEY: string;
}
