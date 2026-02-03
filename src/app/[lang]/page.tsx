// src/app/[lang]/page.tsx
import { redirect } from "next/navigation";
import Link from "next/link";
import { resolveBonfiletLocale, getBonfiletTexts } from "@/lib/i18n/bonfilet";
import ImageSlider from "@/components/ImageSlider";
import FeatureImage from "@/components/FeatureImage";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  
  // /en にアクセスした場合は / にリダイレクト
  if (lang === "en") {
    redirect("/");
  }
  
  const locale = resolveBonfiletLocale(lang);
  const t = getBonfiletTexts(locale);

  const orderPath = locale === "en" ? "/order" : `/${locale}/order`;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Image Slider Section */}
      <section className="w-full">
        <ImageSlider />
      </section>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <div className="text-center">
          <p className="mt-6 text-lg leading-8 text-slate-600 sm:text-xl">
            {t.heroSubtitle}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href={orderPath}
              className="rounded-xl bg-slate-900 px-8 py-4 text-lg font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              {t.startCustomizing}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-slate-600">
            {locale === "ja" ? "特徴" : "Features"}
          </h2>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {/* Column 1: One-Click Buckle */}
            <div className="flex flex-col">
              <FeatureImage src="/images/connect01.jpg" alt="One-Click Buckle" />
              <dt className="text-base font-semibold leading-7 text-slate-900">
                One-Click Buckle
              </dt>
              <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-slate-600">
                <p className="flex-auto">
                  Put it on. Take it off. Stretchy fabric. One size fits all.
                </p>
              </dd>
            </div>

            {/* Column 2: Two Sides, Two Messages */}
            <div className="flex flex-col">
              <FeatureImage src="/images/reversible01.jpg" alt="Two Sides, Two Messages" />
              <dt className="text-base font-semibold leading-7 text-slate-900">
                Two Sides, Two Messages
              </dt>
              <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-slate-600">
                <p className="flex-auto">
                  Side A for the world. Side B for you. Fully customizable.
                </p>
              </dd>
            </div>

            {/* Column 3: Envelope Shipping */}
            <div className="flex flex-col">
              <FeatureImage src="/images/deliver01.jpg" alt="Envelope Shipping" />
              <dt className="text-base font-semibold leading-7 text-slate-900">
                Envelope Shipping
              </dt>
              <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-slate-600">
                <p className="flex-auto">
                  Ships worldwide for $3. No sizing. No warehouse hassle.
                </p>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {locale === "ja"
              ? "今すぐカスタマイズを始めましょう"
              : "Ready to get started?"}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-600">
            {locale === "ja"
              ? "お好みのテキストとカラーで、あなただけのボンフィレットを作成できます。"
              : "Create your custom Bonfilet with your preferred text and colors."}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href={orderPath}
              className="rounded-xl bg-slate-900 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              {t.startCustomizing}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
