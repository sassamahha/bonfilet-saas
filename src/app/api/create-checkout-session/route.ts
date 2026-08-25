// POST /api/create-checkout-session
// サーバー側で見積を再計算し、商品代 + 送料 + 関税 を Stripe Checkout に渡す。
// 配送先国はデザイナーで選んだ国に固定（見積と実請求を一致させる）。
import { readJson } from "@/lib/readJson";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getEnv } from "@/db";
import { getStripe } from "@/lib/stripe";
import { buildQuote } from "@/lib/quote";
import { MAX_TEXT_LENGTH, MIN_QTY } from "@/lib/bonfiletPricing";
import { toCurrencyCode, toStripeAmount, getUsdJpyRate } from "@/lib/currency";
import { getShippableCountry } from "@/lib/repo";
import { resolveBonfiletLocale } from "@/lib/i18n/bonfilet";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const env = await getEnv();
    const body = await readJson(req);

    const text = String(body?.text ?? "").trim();
    const font = String(body?.font ?? "inter");
    const bgColor = String(body?.bgColor ?? "#cccccc");
    const fontColor = String(body?.fontColor ?? "#000000");
    const enableBack = Boolean(body?.enableBack);
    const backText = String(body?.backText ?? "").trim();
    const backBgColor = String(body?.backBgColor ?? "");
    const backFontColor = String(body?.backFontColor ?? "");
    const quantityRaw = Number(body?.quantity ?? 0);
    const countryCode = String(body?.countryCode ?? "").toUpperCase();
    const lang = resolveBonfiletLocale(String(body?.lang ?? "en"));
    const draftId = String(body?.draftId ?? "").trim();

    if (!text || text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json({ error: "text invalid" }, { status: 400 });
    }
    if (enableBack && (!backText || backText.length > MAX_TEXT_LENGTH)) {
      return NextResponse.json({ error: "backText invalid" }, { status: 400 });
    }

    const minQty = MIN_QTY;
    if (!Number.isFinite(quantityRaw) || quantityRaw < minQty) {
      return NextResponse.json({ error: `quantity must be >= ${minQty}` }, { status: 400 });
    }

    // 国（配送可能国のみ）
    const rule = await getShippableCountry(countryCode);
    if (!rule) {
      return NextResponse.json({ error: "country not shippable" }, { status: 400 });
    }
    // 見積（JPY）
    const quote = buildQuote({
      quantity: quantityRaw,
      hasBack: enableBack,
      rule,
      minQty,
    });

    // 通貨変換
    const currency = toCurrencyCode(rule.currencyDisplay);
    const rate = getUsdJpyRate(env as unknown as { USD_TO_JPY_RATE?: string });
    const amt = (jpy: number) => toStripeAmount(jpy, currency, rate);

    const origin = env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_APP_URL || req.headers.get("origin") || "http://localhost:3000";
    const langPrefix = lang === "en" ? "" : `/${lang}`;
    const cancelPath = `${langPrefix}/bonfilet`;

    const stripe = getStripe(env.STRIPE_SECRET_KEY);

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: quote.quantity,
        price_data: {
          currency,
          unit_amount: amt(quote.unitJpy + quote.backAdditionJpy),
          product_data: {
            name: enableBack ? "Bonfilet (Custom, double-sided)" : "Bonfilet (Custom)",
            description: `Text: ${text}`,
          },
        },
      },
    ];
    if (quote.dutiesJpy > 0) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency,
          unit_amount: amt(quote.dutiesJpy),
          product_data: {
            name: "Import duties & taxes (prepaid)",
            description: "No additional charges on delivery",
          },
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: [rule.code as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry],
      },
      phone_number_collection: { enabled: true },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: amt(quote.shippingJpy), currency },
            display_name: "FedEx International",
          },
        },
      ],
      success_url: `${origin}${langPrefix}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${cancelPath}?canceled=1`,
      metadata: {
        text,
        font,
        bgColor,
        fontColor,
        enableBack: String(enableBack),
        backText,
        backBgColor,
        backFontColor,
        quantity: String(quote.quantity),
        countryCode: rule.code,
        unitJpy: String(quote.unitJpy),
        backAdditionJpy: String(quote.backAdditionJpy),
        subtotalJpy: String(quote.subtotalJpy),
        shippingJpy: String(quote.shippingJpy),
        dutiesJpy: String(quote.dutiesJpy),
        totalJpy: String(quote.totalJpy),
        currency,
        lang,
        draftId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "checkout error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
