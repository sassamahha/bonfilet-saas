// src/app/api/admin/orders/route.ts
import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    // 認証チェック
    await requireAdminAuth();

    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);
    const skip = Number(searchParams.get("skip")) || 0;

    // DBから注文一覧を取得
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        take: limit,
        skip,
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count(),
    ]);

    // 注文データを整形（金額・個人情報は除外）
    const formattedOrders = orders.map((order) => {
      const designData = JSON.parse(order.designJson || "{}");

      return {
        id: order.id,
        sessionId: order.stripeSessionId,
        createdAt: Math.floor(order.createdAt.getTime() / 1000), // Unix timestamp
        status: order.status,
        quantity: order.quantity,
        text: designData.text || "",
        bgColor: designData.bgColor || "",
        fontColor: designData.fontColor || "",
        enableBack: designData.enableBack || false,
        backText: designData.backText || "",
        backBgColor: designData.backBgColor || "",
        backFontColor: designData.backFontColor || "",
        shippingAddress: {
          line1: order.shippingAddress1,
          line2: order.shippingAddress2 || "",
          city: order.shippingCity,
          state: order.shippingState || "",
          postal_code: order.shippingPostal,
          country: order.shippingCountry,
        },
      };
    });

    return NextResponse.json({
      orders: formattedOrders,
      total,
      hasMore: skip + limit < total,
    });
  } catch (e: any) {
    if (e.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: e?.message ?? "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
