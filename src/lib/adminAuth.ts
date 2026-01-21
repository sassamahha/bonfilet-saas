// src/lib/adminAuth.ts
import { cookies } from "next/headers";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean);

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY ?? "change-me-in-production";
const COOKIE_NAME = "admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7日間

/**
 * メールアドレスが許可リストに含まれているかチェック
 */
export function isAllowedEmail(email: string): boolean {
  const normalizedEmail = email.toLowerCase().trim();
  
  if (ADMIN_EMAILS.length === 0) {
    // 環境変数が設定されていない場合は開発モードとして全許可（本番では設定必須）
    if (process.env.NODE_ENV === "production") {
      return false;
    }
    // 開発環境ではデバッグログを出力
    if (process.env.NODE_ENV === "development") {
      console.log("[Admin Auth] No ADMIN_EMAILS set, allowing all in development mode");
    }
    return true;
  }
  
  const isAllowed = ADMIN_EMAILS.includes(normalizedEmail);
  
  // デバッグ用（開発環境のみ）
  if (process.env.NODE_ENV === "development") {
    console.log("[Admin Auth] Checking email:", normalizedEmail);
    console.log("[Admin Auth] Allowed emails:", ADMIN_EMAILS);
    console.log("[Admin Auth] Is allowed:", isAllowed);
  }
  
  return isAllowed;
}

/**
 * セッショントークンを生成（シンプルな署名付きトークン）
 */
function generateSessionToken(email: string): string {
  const timestamp = Date.now();
  const data = `${email}:${timestamp}`;
  // 簡易的な署名（本番環境ではより強固な方法を推奨）
  const signature = Buffer.from(data + ADMIN_SECRET_KEY).toString("base64");
  return Buffer.from(`${data}:${signature}`).toString("base64");
}

/**
 * セッショントークンを検証
 */
function verifySessionToken(token: string): { email: string; valid: boolean } {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    // decoded形式: "email:timestamp:signature"
    const parts = decoded.split(":");
    if (parts.length < 3) {
      if (process.env.NODE_ENV === "development") {
        console.log("[Admin Auth] verifySessionToken - Invalid token format");
      }
      return { email: "", valid: false };
    }
    
    const email = parts[0];
    const timestamp = parts[1];
    const signature = parts.slice(2).join(":"); // 署名部分（:が含まれる可能性があるため）
    const data = `${email}:${timestamp}`;
    
    // デバッグ用（開発環境のみ）
    if (process.env.NODE_ENV === "development") {
      console.log("[Admin Auth] verifySessionToken - Email:", email);
      console.log("[Admin Auth] verifySessionToken - Data:", data);
      console.log("[Admin Auth] verifySessionToken - Signature exists:", !!signature);
    }
    
    if (!email || !signature) {
      if (process.env.NODE_ENV === "development") {
        console.log("[Admin Auth] verifySessionToken - Missing email or signature");
      }
      return { email: "", valid: false };
    }

    const expectedSignature = Buffer.from(data + ADMIN_SECRET_KEY).toString("base64");
    if (signature !== expectedSignature) {
      if (process.env.NODE_ENV === "development") {
        console.log("[Admin Auth] verifySessionToken - Signature mismatch");
        console.log("[Admin Auth] verifySessionToken - Expected:", expectedSignature.substring(0, 30) + "...");
        console.log("[Admin Auth] verifySessionToken - Got:", signature.substring(0, 30) + "...");
      }
      return { email: "", valid: false };
    }
    
    if (!isAllowedEmail(email)) {
      if (process.env.NODE_ENV === "development") {
        console.log("[Admin Auth] verifySessionToken - Email not allowed:", email);
      }
      return { email: "", valid: false };
    }

    if (process.env.NODE_ENV === "development") {
      console.log("[Admin Auth] verifySessionToken - Token valid for:", email);
    }
    return { email, valid: true };
  } catch (e: any) {
    if (process.env.NODE_ENV === "development") {
      console.log("[Admin Auth] verifySessionToken - Error:", e?.message ?? String(e));
    }
    return { email: "", valid: false };
  }
}

/**
 * セッションCookieを設定
 */
export async function setAdminSession(email: string): Promise<void> {
  const cookieStore = await cookies();
  const token = generateSessionToken(email);
  
  // デバッグ用（開発環境のみ）
  if (process.env.NODE_ENV === "development") {
    console.log("[Admin Auth] setAdminSession - Setting cookie:", COOKIE_NAME);
    console.log("[Admin Auth] setAdminSession - Token length:", token.length);
  }
  
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
  
  // デバッグ用（開発環境のみ）
  if (process.env.NODE_ENV === "development") {
    const verifyCookie = cookieStore.get(COOKIE_NAME);
    console.log("[Admin Auth] setAdminSession - Cookie set successfully:", !!verifyCookie);
  }
}

/**
 * セッションCookieを削除
 */
export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * 現在のセッションを取得（認証チェック）
 */
export async function getAdminSession(): Promise<{ email: string; valid: boolean }> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  
  // デバッグ用（開発環境のみ）
  if (process.env.NODE_ENV === "development") {
    console.log("[Admin Auth] getAdminSession - Cookie name:", COOKIE_NAME);
    console.log("[Admin Auth] getAdminSession - Token exists:", !!token);
    console.log("[Admin Auth] getAdminSession - Token value:", token ? token.substring(0, 20) + "..." : "none");
    const allCookies = cookieStore.getAll();
    console.log("[Admin Auth] getAdminSession - All cookies:", allCookies.map(c => c.name));
  }
  
  if (!token) {
    return { email: "", valid: false };
  }
  return verifySessionToken(token);
}

/**
 * APIルートで使用する認証チェック関数
 */
export async function requireAdminAuth(): Promise<{ email: string }> {
  const session = await getAdminSession();
  
  // デバッグ用（開発環境のみ）
  if (process.env.NODE_ENV === "development") {
    console.log("[Admin Auth] requireAdminAuth - Session valid:", session.valid);
    console.log("[Admin Auth] requireAdminAuth - Email:", session.email);
  }
  
  if (!session.valid) {
    throw new Error("Unauthorized");
  }
  return { email: session.email };
}

