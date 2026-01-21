// src/app/api/admin/login/route.ts
import { NextResponse } from "next/server";
import { isAllowedEmail, setAdminSession } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email ?? "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // デバッグ用（開発環境のみ）
    if (process.env.NODE_ENV === "development") {
      console.log("[Admin Login] Email:", email);
      console.log("[Admin Login] ADMIN_EMAILS:", process.env.ADMIN_EMAILS);
    }

    if (!isAllowedEmail(email)) {
      return NextResponse.json(
        { error: "Unauthorized. Please check your email address." },
        { status: 401 }
      );
    }

    // セッションを設定
    await setAdminSession(email);

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Login error" },
      { status: 500 }
    );
  }
}

