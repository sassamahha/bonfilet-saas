// GET /api/countries — 配送可能国と見積ルール
import { NextResponse } from "next/server";
import { listShippableCountries } from "@/lib/repo";
import { getUsdJpyRate } from "@/lib/currency";
import { getEnv } from "@/db";
import { DEFAULT_TIERS, MIN_QTY } from "@/lib/bonfiletPricing";

export const dynamic = "force-dynamic";

export async function GET() {
  const countries = await listShippableCountries();
  const env = await getEnv();
  return NextResponse.json({
    countries,
    tiers: DEFAULT_TIERS,
    minQty: MIN_QTY,
    usdJpyRate: getUsdJpyRate(env as unknown as { USD_TO_JPY_RATE?: string }),
  });
}
