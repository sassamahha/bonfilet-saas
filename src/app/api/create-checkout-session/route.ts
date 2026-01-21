// src/app/api/create-checkout-session/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  MIN_QTY,
  normalizeQty,
  getUnitPriceUSD,
  calcTaxIncludedTotalUSD,
} from "@/lib/bonfiletPricing";
import {
  getDeliveredPricingUSD,
  getFedexZoneByCountry,
  getShippingUSDFromZoneAndQty,
} from "@/lib/bonfiletShipping";
import { ENABLED_COUNTRIES } from "@/lib/countryRules";
import {
  type CurrencyCode,
  convertUSDToCurrency,
  getStripeAmount,
  getExchangeRate,
} from "@/lib/currency";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // NOTE: stripe@14.x の型定義が許可するAPIバージョンに合わせる（Vercel build対策）
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const text = String(body?.text ?? "").trim();
    const bgColor = String(body?.bgColor ?? "");
    const font = String(body?.font ?? "");
    const fontColor = String(body?.fontColor ?? "");
    const quantityRaw = Number(body?.quantity ?? 0);
    const currency = (String(body?.currency ?? "usd").toLowerCase() as CurrencyCode);
    const enableBack = Boolean(body?.enableBack);
    const backText = String(body?.backText ?? "").trim();
    const backBgColor = String(body?.backBgColor ?? "");
    const backFontColor = String(body?.backFontColor ?? "");
    const lang = String(body?.lang ?? "en");
    const countryCode = String(body?.countryCode ?? "US");
    const stateCode = String(body?.stateCode ?? "").trim() || null;
    const dutiesAck = Boolean(body?.dutiesAck);
    const draftId = String(body?.draftId ?? "").trim();

    if (!text) {
      return NextResponse.json({ error: "text required" }, { status: 400 });
    }

    const quantity = normalizeQty(quantityRaw);
    if (!Number.isFinite(quantity) || quantity < MIN_QTY) {
      return NextResponse.json({ error: "quantity invalid" }, { status: 400 });
    }

    // 通貨バリデーション（USD/JPYのみ）
    if (currency !== "usd" && currency !== "jpy") {
      return NextResponse.json(
        { error: "currency must be usd or jpy" },
        { status: 400 }
      );
    }

    // 新しい送料ロジックを使用してDelivered価格（送料込）を計算
    const delivered = getDeliveredPricingUSD({
      quantity,
      countryCode,
      stateCode,
      hasBackSide: enableBack,
    });

    const unitAmountForTotalUSD = delivered.deliveredUnitUSD;
    const productTotalUSD = delivered.productTotalUSD;
    const shippingUSD = delivered.shippingUSD;

    // 選択通貨に変換
    const unitAmountInCurrency = convertUSDToCurrency(unitAmountForTotalUSD, currency);
    const shippingInCurrency = convertUSDToCurrency(shippingUSD, currency);
    const stripeCurrency = currency;
    const unitAmountForStripe = getStripeAmount(unitAmountInCurrency, currency);
    const shippingAmountForStripe = getStripeAmount(shippingInCurrency, currency);

    const origin =
      process.env.NEXT_PUBLIC_APP_URL ||
      req.headers.get("origin") ||
      "http://localhost:3000";

    // URL生成: 英語の場合は /order、それ以外は /{lang}/order
    const langPrefix = lang && lang !== "en" ? `${lang}/` : "";

    // stripe@14.x の型定義が AllowedCountry のユニオン型を要求するため明示キャスト
    const allowedCountries =
      ENABLED_COUNTRIES.map((c) => c.code) as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[];

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity,
          price_data: {
            currency: stripeCurrency,
            unit_amount: unitAmountForStripe,
            product_data: {
              name: "Bonfilet (Custom)",
              description: `Text: ${text}`,
            },
          },
        },
      ],
      // 配送可能国を制限（初期対応12カ国のみ）
      // Stripeは大文字のISO 3166-1 alpha-2国コードを要求
      shipping_address_collection: {
        allowed_countries: allowedCountries,
      },
      // 電話番号を必須入力にする
      phone_number_collection: {
        enabled: true,
      },
      // 送料オプション（新しい送料ロジックで計算済み）
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: shippingAmountForStripe,
              currency: stripeCurrency,
            },
            display_name: "FedEx International",
          },
        },
      ],
      success_url: `${origin}/${langPrefix}order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${langPrefix}order?canceled=1`,
      metadata: {
        text,
        bgColor,
        font,
        fontColor,
        quantity: String(quantity),
        unitUSD: String(delivered.productUnitUSD),
        totalUSD: String(productTotalUSD),
        shippingUSD: String(shippingUSD),
        currency,
        enableBack: String(enableBack),
        backText,
        backBgColor,
        backFontColor,
        lang,
        countryCode,
        stateCode: stateCode || "",
        dutiesAck: String(dutiesAck),
        draftId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "checkout error" },
      { status: 500 }
    );
  }
}
