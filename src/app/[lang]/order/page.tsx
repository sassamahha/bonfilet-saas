// src/app/[lang]/order/page.tsx
import BonfiletDesigner from "@/components/bonfilet/BonfiletDesigner";
import { resolveBonfiletLocale } from "@/lib/i18n/bonfilet";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = resolveBonfiletLocale(lang);
  return <BonfiletDesigner locale={locale} />;
}


