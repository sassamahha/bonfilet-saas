// src/lib/specToken.ts — 仕様書リンクの署名トークン（90日で失効）
import { getEnv } from "@/db";

export const SPEC_LINK_TTL_DAYS = 90;

async function key() {
  const env = await getEnv();
  const raw = env.APP_SECRET_KEY || process.env.APP_SECRET_KEY || "";
  if (!raw) throw new Error("APP_SECRET_KEY is not set");
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(raw),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function b64url(buf: ArrayBuffer) {
  const bytes = new Uint8Array(buf);
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(payload: string) {
  const k = await key();
  return b64url(await crypto.subtle.sign("HMAC", k, new TextEncoder().encode(payload)));
}

/** トークン形式: <expiresAtMs>.<sig> */
export async function createSpecToken(orderId: string, now = Date.now()) {
  const exp = now + SPEC_LINK_TTL_DAYS * 24 * 60 * 60 * 1000;
  const sig = await sign(`spec:${orderId}:${exp}`);
  return `${exp}.${sig}`;
}

export async function verifySpecToken(orderId: string, token: string, now = Date.now()) {
  const [expRaw, sig] = token.split(".");
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || !sig) return false;
  if (now > exp) return false;
  const expected = await sign(`spec:${orderId}:${exp}`);
  // 長さが同じ b64url 文字列同士の比較
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0;
}
