// src/db/index.ts — D1 / R2 バインディング取得
import { drizzle } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import * as schema from "./schema";

export async function getDb() {
  const { env } = await getCloudflareContext({ async: true });
  return drizzle(env.DB, { schema });
}

export async function getBucket() {
  const { env } = await getCloudflareContext({ async: true });
  return env.ASSETS_BUCKET;
}

export async function getEnv() {
  const { env } = await getCloudflareContext({ async: true });
  return env;
}

export { schema };
