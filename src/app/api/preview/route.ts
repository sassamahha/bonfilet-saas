// app/preview/route.ts
import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // FormDataを受け取れる形にしておく（将来の実装に備える）
    const formData = await req.formData();
    const text = String(formData.get("text") ?? "");

    // まずはベース画像を返すだけ
    const filePath = path.join(
      process.cwd(),
      "public",
      "bonfilet",
      "bonfilet_base.png"
    );

    const buf = await fs.readFile(filePath);
    const base64 = buf.toString("base64");

    return NextResponse.json({
      success: true,
      image: base64,
      // デバッグ用。邪魔なら消してOK
      debug: { text },
    });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e?.message ?? "Preview error" },
      { status: 500 }
    );
  }
}
