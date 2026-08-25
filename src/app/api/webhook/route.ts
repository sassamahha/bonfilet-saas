// POST /api/webhook — Stripe checkout.session.completed → orders 保存 + 受注メール + 古い PII の自動消去
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { eq, lt, and, isNotNull } from "drizzle-orm";
import { getDb, getEnv, schema } from "@/db";
import { getStripe, getWebCrypto } from "@/lib/stripe";
import { newId } from "@/lib/repo";
import { createSpecToken } from "@/lib/specToken";
import { sendOrderMail } from "@/lib/orderMail";
import { getUsdJpyRate } from "@/lib/currency";

export const dynamic = "force-dynamic";

const PII_RETENTION_DAYS = 90;

/** 90日より古い注文の宛先情報を消す（新規注文のたびに実行される） */
async function purgeOldPii(db: Awaited<ReturnType<typeof getDb>>) {
  const cutoff = new Date(Date.now() - PII_RETENTION_DAYS * 24 * 60 * 60 * 1000);
  await db
    .update(schema.orders)
    .set({
      shippingName: null,
      shippingAddress1: null,
      shippingAddress2: null,
      shippingCity: null,
      shippingState: null,
      shippingPostal: null,
      shippingPhone: null,
      customerEmail: null,
    })
    .where(and(lt(schema.orders.createdAt, cutoff), isNotNull(schema.orders.shippingAddress1)));
  // 7日より古い下書き（未購入プレビュー）は R2 ごと削除
  const staleCutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const stale = await db.select().from(schema.drafts).where(lt(schema.drafts.createdAt, staleCutoff)).limit(50);
  if (stale.length > 0) {
    const { getBucket } = await import("@/db");
    const bucket = await getBucket();
    for (const dr of stale) {
      try {
        await bucket.delete(dr.frontKey);
        if (dr.backKey) await bucket.delete(dr.backKey);
      } catch {
        /* ignore */
      }
      await db.delete(schema.drafts).where(eq(schema.drafts.id, dr.id));
    }
  }
}

export async function POST(req: Request) {
  const env = await getEnv();
  const stripe = getStripe(env.STRIPE_SECRET_KEY);
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "missing signature" }, { status: 400 });

  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, sig, env.STRIPE_WEBHOOK_SECRET, undefined, getWebCrypto());
  } catch (e) {
    const msg = e instanceof Error ? e.message : "invalid signature";
    return NextResponse.json({ error: `Webhook Error: ${msg}` }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const db = await getDb();
  let session = event.data.object as Stripe.Checkout.Session;

  const existing = await db.query.orders.findFirst({
    where: eq(schema.orders.stripeSessionId, session.id),
  });
  if (existing) return NextResponse.json({ received: true, message: "already exists" });

  // shipping_details が無ければ API から再取得
  let shipping = session.collected_information?.shipping_details ?? null;
  if (!shipping?.address) {
    try {
      session = await stripe.checkout.sessions.retrieve(session.id);
      shipping = session.collected_information?.shipping_details ?? null;
    } catch (e) {
      console.error("[Webhook] retrieve failed", e);
    }
  }
  const addr = shipping?.address;
  const md = session.metadata ?? {};
  const n = (k: string) => Number(md[k] ?? 0) || 0;

  const designJson = JSON.stringify({
    text: md.text ?? "",
    font: md.font ?? "inter",
    bgColor: md.bgColor ?? "",
    fontColor: md.fontColor ?? "",
    enableBack: md.enableBack === "true",
    backText: md.backText ?? "",
    backBgColor: md.backBgColor ?? "",
    backFontColor: md.backFontColor ?? "",
  });

  // Draft（R2 キー）を引き継ぐ
  let previewKeysJson: string | null = null;
  const draftId = (md.draftId ?? "").trim();
  if (draftId) {
    const draft = await db.query.drafts.findFirst({ where: eq(schema.drafts.id, draftId) });
    if (draft) {
      previewKeysJson = JSON.stringify({ front: draft.frontKey, back: draft.backKey ?? undefined });
    }
  }

  const orderId = newId("ord");
  await db.insert(schema.orders).values({
    id: orderId,
    stripeSessionId: session.id,
    status: "PENDING",
    quantity: n("quantity"),
    country: md.countryCode ?? addr?.country ?? "",
    unitJpy: n("unitJpy"),
    backAdditionJpy: n("backAdditionJpy"),
    subtotalJpy: n("subtotalJpy"),
    shippingJpy: n("shippingJpy"),
    dutiesJpy: n("dutiesJpy"),
    totalJpy: n("totalJpy"),
    currencyDisplay: md.currency ?? "jpy",
    chargedCurrency: session.currency ?? null,
    chargedAmount: session.amount_total ?? null,
    shippingName: shipping?.name ?? session.customer_details?.name ?? null,
    shippingAddress1: addr?.line1 ?? null,
    shippingAddress2: addr?.line2 ?? null,
    shippingCity: addr?.city ?? null,
    shippingState: addr?.state ?? null,
    shippingPostal: addr?.postal_code ?? null,
    shippingCountry: addr?.country ?? null,
    shippingPhone: session.customer_details?.phone ?? null,
    customerEmail: session.customer_email ?? session.customer_details?.email ?? null,
    designJson,
    previewKeysJson,
  });

  if (draftId) {
    try {
      await db.delete(schema.drafts).where(eq(schema.drafts.id, draftId));
    } catch (e) {
      console.warn("[Webhook] draft delete failed", e);
    }
  }

  // 受注メール（失敗しても注文は成立）
  try {
    const order = await db.query.orders.findFirst({ where: eq(schema.orders.id, orderId) });
    if (order) {
      const base = env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const token = await createSpecToken(orderId);
      const specUrl = `${base}/spec/${orderId}?k=${token}`;
      const rate = getUsdJpyRate(env as unknown as { USD_TO_JPY_RATE?: string });
      await sendOrderMail(order, specUrl, rate);
    }
  } catch (e) {
    console.error("[Webhook] order mail failed", e);
  }

  // 古い個人情報の自動消去（失敗しても無視）
  try {
    await purgeOldPii(db);
  } catch (e) {
    console.warn("[Webhook] purge failed", e);
  }

  return NextResponse.json({ received: true });
}
