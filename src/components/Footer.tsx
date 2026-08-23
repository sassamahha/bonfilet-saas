// src/components/Footer.tsx — minimal footer: wordmark, legal links, maker, copyright
import Link from "next/link";
import { getV2Texts } from "@/lib/i18n/v2";
import { localePath } from "@/lib/i18n/paths";

export default function Footer({ locale }: { locale: string }) {
  const t = getV2Texts(locale);
  const year = new Date().getFullYear();

  const legal = [
    // tokushoho is a Japanese legal notice; it only exists at the root path.
    { href: "/tokushoho", label: t.footer.legal.tokushoho },
    { href: localePath(locale, "/privacy-policy"), label: t.footer.legal.privacy },
    { href: localePath(locale, "/terms-of-service"), label: t.footer.legal.terms },
  ];

  return (
    <footer className="mt-auto border-t border-line bg-white">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <Link
            href={localePath(locale)}
            className="text-sm font-semibold tracking-[0.2em] text-ink transition hover:text-ink-2"
          >
            BONFILET
          </Link>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink-2">
            {legal.map((l) => (
              <Link key={l.href} href={l.href} className="transition hover:text-ink">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-2 text-xs text-ink-3 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {t.footer.madeBy}{" "}
            <a
              href="https://eidendo.co.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-2 transition hover:text-ink"
            >
              株式会社英伝堂
            </a>
          </p>
          <p>
            &copy; {year} Bonfilet. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
