// src/components/designer/DesignerPage.tsx — デザイナー画面の共通シェル（公開 / キャンペーン）
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Designer from "./Designer";
import { getV2Texts } from "@/lib/i18n/v2";

export default function DesignerPage({
  locale,
  campaign,
  heading,
  description,
  accent,
}: {
  locale: string;
  campaign?: string;
  heading?: string;
  description?: string;
  accent?: string;
}) {
  const t = getV2Texts(locale);
  return (
    <>
      <Header locale={locale} />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
          <header className="mb-8 max-w-2xl">
            {campaign && <p className="eyebrow mb-2">{campaign}</p>}
            <h1 className="h2">{heading ?? t.hero.eyebrow}</h1>
            {description && <p className="muted mt-2">{description}</p>}
          </header>
          <Suspense>
            <Designer locale={locale} t={t.designer} campaign={campaign} accent={accent} />
          </Suspense>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
