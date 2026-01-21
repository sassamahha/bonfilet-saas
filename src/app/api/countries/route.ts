// src/app/api/countries/route.ts
import { NextResponse } from "next/server";
import { ENABLED_COUNTRIES_SORTED } from "@/lib/countryRules";
import { SUPPORTED_COUNTRY_CODES } from "@/lib/bonfiletShipping";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 固定定数から有効な国を取得し、FedEx対応国だけにフィルタ
    const filteredCountries = ENABLED_COUNTRIES_SORTED.filter((c) =>
      SUPPORTED_COUNTRY_CODES.includes(c.code)
    );

    return NextResponse.json(filteredCountries);
  } catch (error) {
    console.error("Error fetching countries:", error);
    return NextResponse.json(
      { error: "Failed to fetch countries" },
      { status: 500 }
    );
  }
}

