import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const frontPreviewImage = String(body?.frontPreviewImage ?? "");
    const backPreviewImageRaw = String(body?.backPreviewImage ?? "");
    const backPreviewImage = backPreviewImageRaw ? backPreviewImageRaw : null;
    const designJson = body?.designJson ? String(body.designJson) : null;

    if (!frontPreviewImage.startsWith("data:image/")) {
      return NextResponse.json(
        { error: "frontPreviewImage must be a data:image/* data URL" },
        { status: 400 }
      );
    }

    if (backPreviewImage && !backPreviewImage.startsWith("data:image/")) {
      return NextResponse.json(
        { error: "backPreviewImage must be a data:image/* data URL" },
        { status: 400 }
      );
    }

    const draft = await prisma.orderDraft.create({
      data: {
        frontPreviewImage,
        backPreviewImage,
        designJson,
      },
      select: { id: true },
    });

    return NextResponse.json({ draftId: draft.id });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "order draft error" },
      { status: 500 }
    );
  }
}


