import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 初期対応12カ国
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

async function main() {
  console.log("Seeding countries...");

  for (const country of initialCountries) {
    await prisma.country.upsert({
      where: { code: country.code },
      update: { enabled: true }, // 既存の場合はenabledをtrueに更新
      create: {
        code: country.code,
        name: country.name,
        enabled: true,
      },
    });
  }

  console.log(`Seeded ${initialCountries.length} countries.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

