// src/app/[lang]/layout.tsx
// This layout does NOT include <html> and <body> tags — the root layout provides those.
// Pages under [lang] compose their own Header/Footer.
// Note: no `dynamicParams = false` here so that `force-dynamic` pages render freely;
// unknown langs fall back to en via resolveBonfiletLocale in each page.
import type { ReactNode } from "react";
import { BONFILET_LOCALES } from "@/lib/i18n/bonfilet";

export function generateStaticParams() {
  return BONFILET_LOCALES.map((lang) => ({ lang }));
}

export default function LangLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
