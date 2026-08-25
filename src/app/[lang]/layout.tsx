// src/app/[lang]/layout.tsx
// This layout does NOT include <html> and <body> tags — the root layout provides those.
// Pages under [lang] compose their own Header/Footer.
// 未定義の lang（/admin など任意のパス）は 404 にする。
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { BONFILET_LOCALES } from "@/lib/i18n/bonfilet";

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
  if (!(BONFILET_LOCALES as readonly string[]).includes(lang)) notFound();
  return <>{children}</>;
}
