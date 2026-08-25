// 手動定義（wrangler types で再生成可）
interface CloudflareEnv {
  DB: D1Database;
  ASSETS_BUCKET: R2Bucket;
  ASSETS: Fetcher;
  SPEC_MAIL?: SendEmail;
  NEXT_PUBLIC_APP_URL: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  APP_SECRET_KEY: string;
  SPEC_MAIL_FROM?: string;
  SPEC_MAIL_TO?: string;
  USD_TO_JPY_RATE?: string;
}

