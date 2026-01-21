// src/app/[lang]/order/success/page.tsx
import { resolveBonfiletLocale, getBonfiletTexts } from "@/lib/i18n/bonfilet";
import Link from "next/link";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { lang } = await params;
  const { session_id } = await searchParams;
  const locale = resolveBonfiletLocale(lang);
  const t = getBonfiletTexts(locale);
  const sessionId = session_id;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="text-center mb-8">
          <h1 className="mb-2 text-3xl font-bold text-slate-900">{t.thankYou}</h1>
          <p className="text-lg text-slate-700">{t.paymentCompleted}</p>
        </div>

        {sessionId && (
          <div className="space-y-6">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="mb-2 text-sm font-semibold text-slate-600">
                {t.orderId}
              </div>
              <div className="font-mono text-lg font-semibold text-slate-900 break-all">
                {sessionId}
              </div>
            </div>

            {/* 関税に関する注意文 */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-600">{t.dutiesSuccessNotice}</p>
            </div>

            {/* トップに戻るリンク */}
            <div className="border-t border-slate-200 pt-6">
              <div className="text-center">
                <Link
                  href={locale === "en" ? "/" : `/${locale}`}
                  className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  {t.backToTop}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

