// src/app/page.tsx
// Root page - displays English version of LP
import Link from "next/link";
import { getBonfiletTexts } from "@/lib/i18n/bonfilet";

export default function RootPage() {
  const t = getBonfiletTexts("en");

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            {t.heroTitle}
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600 sm:text-xl">
            {t.heroSubtitle}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/order"
              className="rounded-xl bg-slate-900 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
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
            Features
          </h2>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            <div className="flex flex-col">
              <dt className="text-base font-semibold leading-7 text-slate-900">
                {t.features.customText}
              </dt>
              <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-slate-600">
                <p className="flex-auto">{t.features.customTextDesc}</p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="text-base font-semibold leading-7 text-slate-900">
                {t.features.customColors}
              </dt>
              <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-slate-600">
                <p className="flex-auto">{t.features.customColorsDesc}</p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="text-base font-semibold leading-7 text-slate-900">
                {t.features.backSide}
              </dt>
              <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-slate-600">
                <p className="flex-auto">{t.features.backSideDesc}</p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="text-base font-semibold leading-7 text-slate-900">
                {t.features.worldwideShipping}
              </dt>
              <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-slate-600">
                <p className="flex-auto">{t.features.worldwideShippingDesc}</p>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Create your custom Bonfilet with your preferred text and colors.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/order"
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

