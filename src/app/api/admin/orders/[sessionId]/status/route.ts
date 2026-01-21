// src/app/api/admin/orders/[sessionId]/status/route.ts
import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const VALID_STATUSES = ["PENDING", "IN_PRODUCTION", "QC", "PACKED", "SHIPPED"] as const;

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    // 認証チェック
    await requireAdminAuth();

    const { sessionId } = await params;
    const body = await req.json();
    const { status, trackingNumber } = body;

    // ステータスの検証
    if (!status || !VALID_STATUSES.includes(status as any)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    // SHIPPEDの場合はtrackingNumberが必須
    if (status === "SHIPPED" && !trackingNumber) {
      return NextResponse.json(
        { error: "Tracking number is required when status is SHIPPED" },
        { status: 400 }
      );
    }

    // DBから注文を取得
    const order = await prisma.order.findUnique({
      where: { stripeSessionId: sessionId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // ステータスと追跡番号を更新
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status,
        trackingNumber: status === "SHIPPED" ? trackingNumber : order.trackingNumber,
      },
    });

    return NextResponse.json({ success: true, status, trackingNumber });
  } catch (e: any) {
    if (e.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: e?.message ?? "Failed to update order status" },
      { status: 500 }
    );
  }
}
