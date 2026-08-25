// src/components/designer/DesignerPage.tsx — デザイナー画面のシェル
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Designer from "./Designer";
import { getV2Texts } from "@/lib/i18n/v2";

export default function DesignerPage({ locale }: { locale: string }) {
  const t = getV2Texts(locale);
  return (
    <>
      <Header locale={locale} />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
          <header className="mb-8 max-w-2xl">
            <h1 className="h2">{t.hero.eyebrow}</h1>
          </header>
          <Suspense>
            <Designer locale={locale} t={t.designer} />
          </Suspense>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
