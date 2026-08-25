// src/lib/orderMail.ts — 受注通知メール（Cloudflare Email Routing の send_email バインディング）
// 宛先は Email Routing で検証済みのアドレス（bonfilet@eidendo.co.jp）に限定される。
import { getEnv } from "@/db";
import { formatMoney, toCurrencyCode, convertFromJpy, type CurrencyCode } from "./currency";
import type { Order } from "@/db/schema";

export const DELIVERY_LEAD_DAYS = 21; // 納品目安 約3週間

function b64(s: string) {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

/** RFC 2047 （日本語 Subject 用） */
function encodeHeader(s: string) {
  return `=?UTF-8?B?${b64(s)}?=`;
}

function fmtDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
}

export function buildOrderMailText(order: Order, specUrl: string, usdJpyRate: number) {
  const d = JSON.parse(order.designJson || "{}");
  const cur = toCurrencyCode(order.currencyDisplay) as CurrencyCode;
  const money = (jpy: number) =>
    cur === "jpy"
      ? formatMoney(jpy, "jpy")
      : `${formatMoney(convertFromJpy(jpy, cur, usdJpyRate), cur)} (${formatMoney(jpy, "jpy")})`;
  const eta = new Date(order.createdAt.getTime() + DELIVERY_LEAD_DAYS * 24 * 60 * 60 * 1000);

  const lines = [
    "Bonfilet 新規注文",
    "================================",
    "",
    `注文ID: ${order.id}`,
    `注文日: ${fmtDate(order.createdAt)}`,
    `納品予定: ${fmtDate(eta)} 頃（約3週間後）`,
    "",
    "--- デザイン ---",
    `表: ${d.text ?? ""}（${d.font ?? "inter"} / 帯 ${d.bgColor ?? ""} / 文字 ${d.fontColor ?? ""}）`,
    d.enableBack ? `裏: ${d.backText ?? ""}（帯 ${d.backBgColor ?? ""} / 文字 ${d.backFontColor ?? ""}）` : "裏: なし",
    `数量: ${order.quantity} 個`,
    "",
    "--- 金額 ---",
    `商品代: ${money(order.subtotalJpy)}`,
    `送料: ${money(order.shippingJpy)}`,
    `関税(前払): ${money(order.dutiesJpy)}`,
    `合計: ${money(order.totalJpy)}`,
    "",
    "--- 納品先 ---",
    `${order.shippingName ?? ""}`,
    `${order.shippingPostal ?? ""} ${order.shippingState ?? ""} ${order.shippingCity ?? ""}`,
    `${order.shippingAddress1 ?? ""} ${order.shippingAddress2 ?? ""}`,
    `${order.shippingCountry ?? order.country}`,
    `TEL: ${order.shippingPhone ?? ""}`,
    `Email: ${order.customerEmail ?? ""}`,
    "",
    "--- 工場向け仕様書（金額なし・90日で失効） ---",
    specUrl,
    "",
    "このリンクを開き、印刷 → PDF保存して工場へ送付してください。",
  ];
  return lines.join("\r\n");
}

/**
 * 受注メールを送る。SPEC_MAIL バインディングが無い環境（ローカル等）では何もしない。
 * 失敗しても注文保存は成功扱い（呼び出し側で catch）。
 */
export async function sendOrderMail(order: Order, specUrl: string, usdJpyRate: number) {
  const env = (await getEnv()) as unknown as {
    SPEC_MAIL?: { send: (msg: unknown) => Promise<void> };
    SPEC_MAIL_FROM?: string;
    SPEC_MAIL_TO?: string;
  };
  if (!env.SPEC_MAIL || !env.SPEC_MAIL_FROM || !env.SPEC_MAIL_TO) {
    console.log("[OrderMail] SPEC_MAIL not configured; skip");
    return false;
  }

  const subject = encodeHeader(`【Bonfilet】新規注文 ${order.quantity}個 / ${order.country} / ${order.id.slice(-6)}`);
  const body = buildOrderMailText(order, specUrl, usdJpyRate);
  const raw = [
    `From: Bonfilet Orders <${env.SPEC_MAIL_FROM}>`,
    `To: <${env.SPEC_MAIL_TO}>`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    b64(body),
  ].join("\r\n");

  // cloudflare:email はランタイム専用モジュール。バンドラに解析させないため実行時に解決する
  // バンドラ（webpack/SWC/esbuild）に定数畳み込みさせないため、オブジェクト経由で解決する
  const runtimeModules: Record<string, string> = { email: "cloudflare:email" };
  const specifier = runtimeModules[String("email")];
  const { EmailMessage } = (await import(/* webpackIgnore: true */ specifier)) as {
    EmailMessage: new (from: string, to: string, raw: string) => unknown;
  };
  const msg = new EmailMessage(env.SPEC_MAIL_FROM, env.SPEC_MAIL_TO, raw);
  await env.SPEC_MAIL.send(msg);
  return true;
}
