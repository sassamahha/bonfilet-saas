// src/components/landing/Landing.tsx — public landing page (server component)
import Link from "next/link";
import { getV2Texts } from "@/lib/i18n/v2";
import { localePath } from "@/lib/i18n/paths";

export type LandingCountry = { code: string; name: string };

type Props = {
  locale: string;
  countries: LandingCountry[];
};

export default function Landing({ locale, countries }: Props) {
  const t = getV2Texts(locale);
  const designerHref = localePath(locale, "/bonfilet");

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-14 sm:px-8 sm:pb-24 sm:pt-24">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <p className="eyebrow">{t.hero.eyebrow}</p>
            <h1 className="h1 mt-4 max-w-xl text-balance">{t.hero.title}</h1>
            <p className="muted mt-6 max-w-lg text-base leading-relaxed sm:text-lg">{t.hero.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={designerHref} className="btn-accent">
                {t.hero.cta}
              </Link>
              <a href="#how" className="btn-ghost">
                {t.hero.secondary}
              </a>
            </div>
          </div>
          <div className="lg:col-span-6">
            <img
              src="/images/connect01.jpg"
              width={1184}
              height={864}
              alt={t.hero.alt}
              className="w-full rounded-xl border border-line object-cover"
              fetchPriority="high"
            />
          </div>
        </div>
      </section>

      {/* Product strip */}
      <section className="border-y border-line bg-bg-muted">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="max-w-2xl">
            <p className="eyebrow">{t.gallery.eyebrow}</p>
            <h2 className="h2 mt-3 text-balance">{t.gallery.title}</h2>
          </div>
          <div className="mt-8 overflow-hidden rounded-xl border border-line bg-white">
            <img
              src="/images/bonfilets00.jpg"
              width={1960}
              height={676}
              alt={t.gallery.alt}
              loading="lazy"
              className="w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16 sm:px-8 sm:py-24">
        <h2 className="h2">{t.how.title}</h2>
        <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {t.how.steps.map((s, i) => (
            <li key={s.t} className="border-t border-line pt-5">
              <span className="text-xs font-semibold tabular-nums text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-base font-semibold text-ink">{s.t}</h3>
              <p className="muted mt-1.5 text-sm leading-relaxed">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Reversible */}
      <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 sm:pb-24">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="eyebrow">{t.reversible.eyebrow}</p>
            <h2 className="h2 mt-3 text-balance">{t.reversible.title}</h2>
            <p className="muted mt-4 text-base leading-relaxed">{t.reversible.body}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            <img
              src="/images/reversible01.jpg"
              width={1184}
              height={864}
              alt={t.reversible.alt1}
              loading="lazy"
              className="w-full rounded-xl border border-line object-cover"
            />
            <img
              src="/images/reversible02.jpg"
              width={1184}
              height={864}
              alt={t.reversible.alt2}
              loading="lazy"
              className="w-full rounded-xl border border-line object-cover"
            />
          </div>
        </div>
      </section>

      {/* Ships to */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="max-w-2xl">
            <h2 className="h2">{t.shipsTo.title}</h2>
            <p className="muted mt-3 text-base">{t.shipsTo.subtitle}</p>
          </div>
          {countries.length > 0 ? (
            <ul className="mt-8 flex flex-wrap gap-2">
              {countries.map((c) => (
                <li key={c.code} className="pill">
                  {c.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-8 text-sm text-ink-3">{t.shipsTo.empty}</p>
          )}
          <p className="mt-6 text-sm text-ink-3">{t.shipsTo.more}</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-line bg-ink text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 py-16 sm:px-8 sm:py-20 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="h2 text-balance">{t.finalCta.title}</h2>
            <p className="mt-2 text-base text-white/70">{t.finalCta.body}</p>
          </div>
          <Link href={designerHref} className="btn-accent shrink-0">
            {t.hero.cta}
          </Link>
        </div>
      </section>
    </main>
  );
}
