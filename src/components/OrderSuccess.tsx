// src/components/OrderSuccess.tsx — 決済完了
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getV2Texts } from "@/lib/i18n/v2";

export default function OrderSuccess({ locale, sessionId }: { locale: string; sessionId?: string }) {
  const t = getV2Texts(locale).success;
  const home = locale === "en" ? "/" : "/" + locale;
  return (
    <>
      <Header locale={locale} />
      <main className="flex flex-1 items-center">
        <div className="mx-auto w-full max-w-xl px-4 py-24 text-center">
          <span className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-ink">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </span>
          <h1 className="h2">{t.title}</h1>
          <p className="muted mt-4">{t.body}</p>
          <p className="mt-3 text-sm text-ink-2">{t.dutiesNote}</p>
          {sessionId && (
            <p className="mt-6 text-xs text-ink-3">
              Ref: <span className="font-mono">{sessionId.slice(-12)}</span>
            </p>
          )}
          <Link href={home} className="btn-ghost mt-10">
            {t.back}
          </Link>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
