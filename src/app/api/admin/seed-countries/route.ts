// src/app/api/admin/seed-countries/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const initialCountries = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "NZ", name: "New Zealand" },
  { code: "SG", name: "Singapore" },
  { code: "HK", name: "Hong Kong" },
  { code: "TW", name: "Taiwan" },
  { code: "MY", name: "Malaysia" },
  { code: "TH", name: "Thailand" },
  { code: "VN", name: "Vietnam" },
  { code: "JP", name: "Japan" },
];

export async function POST() {
  try {
    console.log("Seeding countries...");

    for (const country of initialCountries) {
      await prisma.country.upsert({
        where: { code: country.code },
        update: { enabled: true },
        create: {
          code: country.code,
          name: country.name,
          enabled: true,
        },
      });
    }

    console.log(`Seeded ${initialCountries.length} countries.`);

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${initialCountries.length} countries`,
    });
  } catch (error) {
    console.error("Error seeding countries:", error);
    return NextResponse.json(
      { error: "Failed to seed countries", details: String(error) },
      { status: 500 }
    );
  }
}

