// src/lib/adminAuth.ts — 管理者セッション（HMAC-SHA256 署名 Cookie、Workers 対応）
import { cookies } from "next/headers";
import { getEnv } from "@/db";

const COOKIE_NAME = "admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7日

async function secretKey() {
  const env = await getEnv();
  const raw = env.ADMIN_SECRET_KEY || process.env.ADMIN_SECRET_KEY || "";
  if (!raw) throw new Error("ADMIN_SECRET_KEY is not set");
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(raw),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function b64url(buf: ArrayBuffer | Uint8Array) {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(s: string) {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

export async function allowedEmails(): Promise<string[]> {
  const env = await getEnv();
  const raw = env.ADMIN_EMAILS || process.env.ADMIN_EMAILS || "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export async function isAllowedEmail(email: string) {
  const list = await allowedEmails();
  if (list.length === 0) return process.env.NODE_ENV !== "production";
  return list.includes(email.trim().toLowerCase());
}

/** タイミング攻撃を避けるため HMAC 経由で比較する */
async function timingSafeEqual(a: string, b: string) {
  const key = await secretKey();
  const enc = new TextEncoder();
  const [ha, hb] = await Promise.all([
    crypto.subtle.sign("HMAC", key, enc.encode(a)),
    crypto.subtle.sign("HMAC", key, enc.encode(b)),
  ]);
  const ua = new Uint8Array(ha);
  const ub = new Uint8Array(hb);
  let diff = 0;
  for (let i = 0; i < ua.length; i++) diff |= ua[i] ^ ub[i];
  return diff === 0;
}

/** メール（許可リスト）+ パスワードの両方を要求する */
export async function verifyCredentials(email: string, password: string) {
  if (!(await isAllowedEmail(email))) return false;
  const env = await getEnv();
  const expected = env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || "";
  if (!expected) {
    // パスワード未設定は開発時のみ許容
    return process.env.NODE_ENV !== "production";
  }
  if (!password) return false;
  return timingSafeEqual(password, expected);
}

async function sign(payload: string) {
  const key = await secretKey();
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return b64url(sig);
}

async function createToken(email: string) {
  const payload = b64url(new TextEncoder().encode(JSON.stringify({ email, exp: Date.now() + COOKIE_MAX_AGE * 1000 })));
  return `${payload}.${await sign(payload)}`;
}

async function verifyToken(token: string): Promise<string | null> {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const key = await secretKey();
  const ok = await crypto.subtle.verify(
    "HMAC",
    key,
    fromB64url(sig),
    new TextEncoder().encode(payload)
  );
  if (!ok) return null;
  try {
    const data = JSON.parse(new TextDecoder().decode(fromB64url(payload)));
    if (typeof data.email !== "string" || typeof data.exp !== "number") return null;
    if (Date.now() > data.exp) return null;
    return data.email;
  } catch {
    return null;
  }
}

export async function setAdminSession(email: string) {
  const token = await createToken(email);
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getAdminEmail(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const email = await verifyToken(token);
  if (!email) return null;
  return (await isAllowedEmail(email)) ? email : null;
}

export async function requireAdmin() {
  const email = await getAdminEmail();
  if (!email) throw new AdminAuthError();
  return email;
}

export class AdminAuthError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "AdminAuthError";
  }
}
