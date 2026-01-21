// src/app/[lang]/layout.tsx
// This layout does NOT include <html> and <body> tags
// The root layout (src/app/layout.tsx) provides those
import type { ReactNode } from "react";

import { BONFILET_LOCALES, resolveBonfiletLocale } from "@/lib/i18n/bonfilet";

export const dynamicParams = false;

export function generateStaticParams() {
  return BONFILET_LOCALES.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = resolveBonfiletLocale(lang);

  // Just pass through children - html/body are provided by root layout
  // Footer is added in root layout to avoid duplication
  return <>{children}</>;
}
