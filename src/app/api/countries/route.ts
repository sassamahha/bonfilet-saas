// GET /api/countries?campaign=slug — 配送可能国と見積ルール
import { NextResponse } from "next/server";
import { campaignAllowedCountries, campaignTiers, getOpenCampaign, listShippableCountries } from "@/lib/repo";
import { getUsdJpyRate } from "@/lib/currency";
import { getEnv } from "@/db";
import { MIN_QTY } from "@/lib/bonfiletPricing";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("campaign");

  let countries = await listShippableCountries();
  let campaign = null;
  if (slug) {
    campaign = await getOpenCampaign(slug);
    if (!campaign) return NextResponse.json({ error: "campaign not found" }, { status: 404 });
    const allowed = campaignAllowedCountries(campaign);
    if (allowed) countries = countries.filter((c) => allowed.includes(c.code));
  }

  const env = await getEnv();
  return NextResponse.json({
    countries,
    tiers: campaignTiers(campaign),
    minQty: campaign?.minQty ?? MIN_QTY,
    usdJpyRate: getUsdJpyRate(env as unknown as { USD_TO_JPY_RATE?: string }),
  });
}
