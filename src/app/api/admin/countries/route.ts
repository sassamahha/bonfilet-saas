// GET /api/admin/countries — 全国（関税未設定含む）
import { NextResponse } from "next/server";
import { listAllCountries } from "@/lib/repo";
import { adminRoute } from "@/lib/adminRoute";

export const dynamic = "force-dynamic";

export const GET = adminRoute(async () => {
  return NextResponse.json({ countries: await listAllCountries() });
});
