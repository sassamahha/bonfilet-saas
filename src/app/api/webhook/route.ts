// src/app/api/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getFedexZoneByCountry, qtyToTierKg } from "@/lib/bonfiletShipping";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // NOTE: stripe@14.x の型定義が許可するAPIバージョンに合わせる（Vercel build対策）
  apiVersion: "2023-10-16",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  console.log("[Webhook] Received webhook request");
  console.log("[Webhook] Request method:", req.method);
  console.log("[Webhook] Request URL:", req.url);
  
  let body: string;
  let signature: string | null;
  
  try {
    // リクエストボディを読み取る（Stripe Webhookは生のテキストが必要）
    // リクエストが到達しているかを確認するため、先にログを出力
    console.log("[Webhook] Attempting to read request body...");
    
    try {
      body = await req.text();
      console.log("[Webhook] Body read successfully, length:", body.length);
    } catch (bodyError: any) {
      console.error("[Webhook] Failed to read request body:", bodyError);
      console.error("[Webhook] Body error name:", bodyError?.name);
      console.error("[Webhook] Body error message:", bodyError?.message);
      throw bodyError;
    }
    
    signature = req.headers.get("stripe-signature");
    console.log("[Webhook] Body length:", body.length);
    console.log("[Webhook] Has signature:", !!signature);
    console.log("[Webhook] Has webhook secret:", !!webhookSecret);

    if (!signature || !webhookSecret) {
      console.error("[Webhook] Missing signature or webhook secret");
      console.error("[Webhook] Signature:", signature);
      console.error("[Webhook] Webhook secret exists:", !!webhookSecret);
      return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
    }

    let event: Stripe.Event;
    try {
      console.log("[Webhook] Attempting to construct event...");
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log("[Webhook] Event constructed successfully. Type:", event.type);
    } catch (err: any) {
      console.error("[Webhook] Signature verification failed:", err.message);
      console.error("[Webhook] Error details:", err);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // checkout.session.completed イベントを処理
    if (event.type === "checkout.session.completed") {
      console.log("[Webhook] Processing checkout.session.completed event");
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("[Webhook] Session ID:", session.id);
      console.log("[Webhook] Session metadata:", JSON.stringify(session.metadata, null, 2));

      // 既に存在する注文をチェック（重複防止）
      const existingOrder = await prisma.order.findUnique({
        where: { stripeSessionId: session.id },
      });

      if (existingOrder) {
        console.log("[Webhook] Order already exists:", session.id);
        return NextResponse.json({ received: true, message: "Order already exists" });
      }

      // metadataから注文内容を取得
      const metadata = session.metadata || {};
      console.log("[Webhook] Metadata:", metadata);
      const quantity = Number(metadata.quantity) || 0;
      const enableBack = metadata.enableBack === "true";
      console.log("[Webhook] Quantity:", quantity, "EnableBack:", enableBack);

      // 配送先情報
      // session.shipping_detailsがnullの場合、Stripe APIから再取得
      let shippingAddress = session.shipping_details?.address;
      let shippingDetails = session.shipping_details;
      let sessionForCustomerDetails: Stripe.Checkout.Session = session;
      
      console.log("[Webhook] session.shipping_details:", session.shipping_details);
      
      if (!shippingAddress) {
        console.warn("[Webhook] shipping_details not found in event, fetching from Stripe API...");
        try {
          // Stripe APIからセッション情報を再取得（shipping_detailsは自動的に含まれる）
          const fullSession = await stripe.checkout.sessions.retrieve(session.id);
          console.log("[Webhook] Full session shipping_details:", fullSession.shipping_details);
          console.log("[Webhook] Full session customer_details:", fullSession.customer_details);
          shippingDetails = fullSession.shipping_details;
          shippingAddress = fullSession.shipping_details?.address;
          sessionForCustomerDetails = fullSession;
          console.log("[Webhook] Fetched shipping address from API:", shippingAddress);
        } catch (fetchError: any) {
          console.error("[Webhook] Failed to fetch session from Stripe API:", fetchError.message);
        }
      }
      
      // それでも取得できない場合、metadataから最小限の情報を使用
      if (!shippingAddress) {
        console.warn("[Webhook] Shipping address still not found, using metadata countryCode");
        const countryCode = metadata.countryCode || "US";
        const stateCode = metadata.stateCode || undefined;
        
        // 最小限の配送先情報を構築
        shippingAddress = {
          country: countryCode,
          state: stateCode,
          line1: "",
          line2: undefined,
          city: "",
          postal_code: "",
        };
        shippingDetails = {
          name: undefined,
          phone: undefined,
          address: shippingAddress,
        } as Stripe.Checkout.Session.ShippingDetails;
        console.log("[Webhook] Using fallback shipping address from metadata:", shippingAddress);
      }
      
      console.log("[Webhook] Shipping address:", shippingAddress);
      console.log("[Webhook] Saving shipping address:", {
        line1: shippingAddress.line1,
        line2: shippingAddress.line2,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postal_code: shippingAddress.postal_code,
        country: shippingAddress.country,
      });

      // 国コードからFedExゾーンを取得
      const countryCode = shippingAddress.country || "";
      const stateCode = shippingAddress.state || null;
      const zone = getFedexZoneByCountry(countryCode, stateCode);
      const tierKg = qtyToTierKg(quantity);

      // デザイン情報をJSON形式で保存
      const designData = {
        text: metadata.text || "",
        bgColor: metadata.bgColor || "",
        fontColor: metadata.fontColor || "",
        backText: metadata.backText || "",
        backBgColor: metadata.backBgColor || "",
        backFontColor: metadata.backFontColor || "",
        enableBack,
        font: metadata.font || "inter",
      };

      // Draft画像（決済前に作成したOrderDraft）を紐付け
      const draftId = String(metadata.draftId || "").trim();
      let assets: string[] | null = null;
      if (draftId) {
        try {
          const draft = await prisma.orderDraft.findUnique({
            where: { id: draftId },
          });
          if (draft) {
            assets = [draft.frontPreviewImage, draft.backPreviewImage]
              .filter(Boolean) as string[];
          } else {
            console.warn("[Webhook] OrderDraft not found:", draftId);
          }
        } catch (e: any) {
          console.error("[Webhook] Failed to load OrderDraft:", e?.message ?? e);
        }
      } else {
        console.warn("[Webhook] draftId missing in metadata");
      }

      // 関税同意の確認（metadataから取得、またはデフォルトでfalse）
      const dutiesAck = metadata.dutiesAck === "true";
      const dutiesAckedAt = dutiesAck ? new Date() : null;
      console.log("[Webhook] Duties acknowledged:", dutiesAck);

      // 顧客メールアドレスを取得
      const customerEmail =
        sessionForCustomerDetails.customer_email ||
        sessionForCustomerDetails.customer_details?.email ||
        null;
      console.log("[Webhook] Customer email:", customerEmail);
      
      // 電話番号を取得（shipping_details.phone が空の場合、customer_details.phone を拾う）
      const customerPhone =
        shippingDetails?.phone ||
        sessionForCustomerDetails.customer_details?.phone ||
        null;
      console.log("[Webhook] Customer phone:", customerPhone);

      // DBに注文を保存
      console.log("[Webhook] Attempting to save order to database...");
      const orderData = {
        stripeSessionId: session.id,
        status: "PENDING",
        quantity,
        country: countryCode,
        state: stateCode,
        zone,
        tierKg: String(tierKg),
        shippingName: shippingDetails?.name || null,
        shippingAddress1: shippingAddress.line1 || "",
        shippingAddress2: shippingAddress.line2 || null,
        shippingCity: shippingAddress.city || "",
        shippingState: shippingAddress.state || null,
        shippingPostal: shippingAddress.postal_code || "",
        shippingCountry: shippingAddress.country || "",
        shippingPhone: customerPhone,
        customerEmail: customerEmail || null,
        designJson: JSON.stringify(designData),
        assets: assets && assets.length > 0 ? JSON.stringify(assets) : null,
        dutiesAck,
        dutiesAckedAt,
      };
      console.log("[Webhook] Order data to save:", {
        shippingAddress1: orderData.shippingAddress1,
        shippingCity: orderData.shippingCity,
        shippingState: orderData.shippingState,
        shippingPostal: orderData.shippingPostal,
        shippingCountry: orderData.shippingCountry,
        shippingPhone: orderData.shippingPhone,
        customerEmail: orderData.customerEmail,
      });
      const savedOrder = await prisma.order.create({
        data: orderData,
      });

      // Draftは不要になるので削除（失敗しても注文保存を優先）
      if (draftId) {
        try {
          await prisma.orderDraft.delete({ where: { id: draftId } });
        } catch (e: any) {
          console.warn("[Webhook] Failed to delete OrderDraft:", e?.message ?? e);
        }
      }

      console.log("[Webhook] Order created successfully!");
      console.log("[Webhook] Order ID:", savedOrder.id);
      console.log("[Webhook] Session ID:", session.id);
      return NextResponse.json({ received: true, orderId: session.id });
    }

    // その他のイベントタイプは無視
    console.log("[Webhook] Event type not handled:", event.type);
    return NextResponse.json({ received: true });
  } catch (e: any) {
    console.error("[Webhook] Unexpected error:", e);
    console.error("[Webhook] Error name:", e?.name);
    console.error("[Webhook] Error message:", e?.message);
    console.error("[Webhook] Error stack:", e?.stack);
    
    // エラーの種類に応じて適切なステータスコードを返す
    if (e?.message?.includes("text") || e?.name === "TypeError" || e?.message?.includes("body")) {
      console.error("[Webhook] Request body reading error");
      return NextResponse.json(
        { error: "Failed to read request body", details: e?.message },
        { status: 400 }
      );
    }
    
    // 接続エラーの場合
    if (e?.message?.includes("EOF") || e?.message?.includes("connection")) {
      console.error("[Webhook] Connection error - request may not have reached server");
      return NextResponse.json(
        { error: "Connection error", details: e?.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: e?.message ?? "Webhook handler failed", details: e?.stack },
      { status: 500 }
    );
  }
}

