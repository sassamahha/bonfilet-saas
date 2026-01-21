// src/app/api/admin/orders/[sessionId]/route.ts
import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    // 認証チェック
    await requireAdminAuth();

    const { sessionId } = await params;

    // DBから注文を取得（stripeSessionIdで検索）
    const order = await prisma.order.findUnique({
      where: { stripeSessionId: sessionId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const designData = JSON.parse(order.designJson || "{}");

    const orderDetail = {
      id: order.id,
      sessionId: order.stripeSessionId,
      createdAt: Math.floor(order.createdAt.getTime() / 1000), // Unix timestamp
      status: order.status,
      quantity: order.quantity,
      shippingName: order.shippingName,
      shippingPhone: order.shippingPhone,
      customerEmail: order.customerEmail,
      shippingAddress: {
        line1: order.shippingAddress1,
        line2: order.shippingAddress2 || "",
        city: order.shippingCity,
        state: order.shippingState || "",
        postal_code: order.shippingPostal,
        country: order.shippingCountry,
      },
      metadata: {
        text: designData.text || "",
        bgColor: designData.bgColor || "",
        fontColor: designData.fontColor || "",
        backText: designData.backText || "",
        backBgColor: designData.backBgColor || "",
        backFontColor: designData.backFontColor || "",
        enableBack: designData.enableBack || false,
        font: designData.font || "inter",
      },
      dutiesAck: order.dutiesAck,
      trackingNumber: order.trackingNumber,
      specLinks: {
        html: `/api/generate-spec?session_id=${sessionId}&format=html`,
        pdf: `/api/generate-spec?session_id=${sessionId}&format=pdf`,
      },
    };

    return NextResponse.json(orderDetail);
  } catch (e: any) {
    if (e.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: e?.message ?? "Failed to fetch order detail" },
      { status: 500 }
    );
  }
}

