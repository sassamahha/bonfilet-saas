// src/lib/adminRoute.ts — 管理者 API 共通ラッパ
import { NextResponse } from "next/server";
import { AdminAuthError, requireAdmin } from "./adminAuth";

export function adminRoute<T extends unknown[]>(
  handler: (...args: T) => Promise<Response>
) {
  return async (...args: T): Promise<Response> => {
    try {
      await requireAdmin();
      return await handler(...args);
    } catch (e) {
      if (e instanceof AdminAuthError) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const msg = e instanceof Error ? e.message : "error";
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  };
}
