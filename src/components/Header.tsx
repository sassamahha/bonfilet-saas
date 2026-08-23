// src/components/Header.tsx — sticky top bar: wordmark / language switch / CTA
import Link from "next/link";
import { getV2Texts } from "@/lib/i18n/v2";
import { localePath } from "@/lib/i18n/paths";

const SWITCH_LOCALES = [
  { code: "en", label: "EN" },
  { code: "ja", label: "JA" },
] as const;

export default function Header({ locale }: { locale: string }) {
  const t = getV2Texts(locale);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          href={localePath(locale)}
          className="text-sm font-semibold tracking-[0.2em] text-ink transition hover:text-ink-2"
          aria-label="Bonfilet home"
        >
          BONFILET
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <nav aria-label="Language" className="flex items-center text-xs font-medium">
            {SWITCH_LOCALES.map((l, i) => {
              const active = l.code === locale;
              return (
                <span key={l.code} className="flex items-center">
                  {i > 0 && <span className="mx-1.5 text-ink-3">/</span>}
                  <Link
                    href={localePath(l.code)}
                    hrefLang={l.code}
                    aria-current={active ? "page" : undefined}
                    className={active ? "text-ink" : "text-ink-3 transition hover:text-ink"}
                  >
                    {l.label}
                  </Link>
                </span>
              );
            })}
          </nav>
          <Link href={localePath(locale, "/bonfilet")} className="btn-primary btn-sm">
            {t.nav.design}
          </Link>
        </div>
      </div>
    </header>
  );
}
