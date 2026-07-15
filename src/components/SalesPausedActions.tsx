import type { BonfiletLocale } from "@/lib/i18n/bonfilet";

const OEM_URL = "https://eidendo.co.jp/bonfilet/";

export default function SalesPausedActions({
  locale,
  compact = false,
}: {
  locale: BonfiletLocale;
  compact?: boolean;
}) {
  const isJapanese = locale === "ja";

  return (
    <div className="flex flex-col items-center gap-3">
      <span
        aria-disabled="true"
        className={`cursor-not-allowed rounded-xl bg-slate-300 font-semibold text-slate-600 shadow-sm ${
          compact ? "px-6 py-3 text-base" : "px-8 py-4 text-lg"
        }`}
      >
        {isJapanese ? "カスタムオーダー準備中" : "Custom Ordering Coming Soon"}
      </span>
      <a
        href={OEM_URL}
        className="rounded-xl border border-slate-900 bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
      >
        {isJapanese ? "日本向けOEMはこちら" : "OEM Inquiries for Japan"}
      </a>
    </div>
  );
}
