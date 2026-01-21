// src/app/api/generate-spec/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSpecHTML, type SpecData } from "@/lib/bonfiletSpecTemplate";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");
    const format = searchParams.get("format") || "html";

    if (!sessionId) {
      return NextResponse.json(
        { error: "session_id required" },
        { status: 400 }
      );
    }

    // DBから注文情報を取得
    const order = await prisma.order.findUnique({
      where: { stripeSessionId: sessionId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // デザイン情報をパース
    const designData = JSON.parse(order.designJson || "{}");
    const text = designData.text || "";
    const bgColor = designData.bgColor || "#cccccc";
    const fontColor = designData.fontColor || "#000000";
    const backText = designData.backText || "";
    const backBgColor = designData.backBgColor || "";
    const backFontColor = designData.backFontColor || "";
    const enableBack = designData.enableBack || false;
    const font = designData.font || "inter";

    // 配送先情報を整形
    const shippingAddress = {
      line1: order.shippingAddress1,
      line2: order.shippingAddress2 || "",
      city: order.shippingCity,
      state: order.shippingState || "",
      postal_code: order.shippingPostal,
      country: order.shippingCountry,
    };

    // プレビュー画像（Order.assetsから取得）
    let frontPreviewImage: string | undefined = undefined;
    let backPreviewImage: string | undefined = undefined;
    if (order.assets) {
      try {
        const assets = JSON.parse(order.assets) as string[];
        if (assets?.[0]) frontPreviewImage = assets[0];
        if (assets?.[1]) backPreviewImage = assets[1];
      } catch (e) {
        console.error("[Generate Spec] Failed to parse order.assets");
      }
    }

    const specData: SpecData = {
      frontPreviewImage,
      backPreviewImage: enableBack ? backPreviewImage : undefined,
      text,
      backText: enableBack && backText ? backText : undefined,
      bgColor,
      fontColor,
      backBgColor: enableBack && backBgColor ? backBgColor : undefined,
      backFontColor: enableBack && backFontColor ? backFontColor : undefined,
      font: font,
      quantity: order.quantity,
      customerName: order.shippingName || undefined,
      customerEmail: order.customerEmail || undefined,
      shippingName: order.shippingName || undefined,
      shippingPhone: order.shippingPhone || undefined,
      shippingAddress: shippingAddress,
    };

    if (format === "pdf") {
      // PDF生成は後で実装（puppeteerが必要）
      // 現時点ではHTMLを返す
      const html = generateSpecHTML(specData);
      return new NextResponse(html, {
        headers: {
          "Content-Type": "text/html",
        },
      });
    }

    // HTML形式で返す
    const html = generateSpecHTML(specData);
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "spec generation error" },
      { status: 500 }
    );
  }
}

