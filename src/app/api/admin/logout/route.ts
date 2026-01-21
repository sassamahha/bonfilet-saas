// src/app/api/admin/logout/route.ts
import { NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    await clearAdminSession();
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Logout error" },
      { status: 500 }
    );
  }
}


