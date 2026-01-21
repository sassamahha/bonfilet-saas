// src/components/Footer.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { resolveBonfiletLocale } from "@/lib/i18n/bonfilet";

// 表示する言語（英語と日本語のみ）
const DISPLAY_LOCALES = ["en", "ja"] as const;

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  ja: "日本語",
};

export default function Footer() {
  const pathname = usePathname();
  
  // 現在のパスから言語を取得
  const currentLang = pathname?.startsWith("/") 
    ? pathname.split("/")[1] 
    : "en";
  const currentLocale = resolveBonfiletLocale(currentLang);

  // パスから言語プレフィックスを除去してベースパスを取得
  const getBasePath = (path: string): string => {
    if (!path || path === "/") return "/";
    
    const segments = path.split("/").filter(Boolean);
    if (segments.length === 0) return "/";
    
    // 最初のセグメントが言語コードかチェック（en, jaのみ）
    const firstSegment = segments[0];
    if (firstSegment === "en" || firstSegment === "ja") {
      // 言語コードの場合は除去
      const rest = segments.slice(1);
      return rest.length > 0 ? `/${rest.join("/")}` : "/";
    }
    // 言語コードでない場合はそのまま
    return `/${segments.join("/")}`;
  };

  const basePath = getBasePath(pathname || "/");

  // 各言語のURLを生成
  const getLanguageUrl = (lang: string): string => {
    if (lang === "en") {
      // 英語の場合は言語プレフィックスなし
      return basePath;
    }
    // その他の言語は言語プレフィックス付き
    return `/${lang}${basePath === "/" ? "" : basePath}`;
  };

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-sm text-slate-600">
            © {new Date().getFullYear()} Bonfilet. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {/* Navigation links */}
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <Link
                href={currentLocale === "ja" ? "/ja" : "/"}
                className="text-slate-600 transition hover:text-slate-900"
              >
                {currentLocale === "ja" ? "トップ" : "Top"}
              </Link>
              <span className="text-slate-400">/</span>
              <Link
                href={currentLocale === "ja" ? "/ja/order" : "/order"}
                className="text-slate-600 transition hover:text-slate-900"
              >
                {currentLocale === "ja" ? "オーダー" : "Order"}
              </Link>
            </div>

            {/* Legal links */}
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <Link
                href={currentLocale === "ja" ? "/ja/privacy-policy" : "/privacy-policy"}
                className="text-slate-600 transition hover:text-slate-900"
              >
                {currentLocale === "ja" ? "プライバシーポリシー" : "Privacy Policy"}
              </Link>
              <span className="text-slate-400">/</span>
              <Link
                href={currentLocale === "ja" ? "/ja/terms-of-service" : "/terms-of-service"}
                className="text-slate-600 transition hover:text-slate-900"
              >
                {currentLocale === "ja" ? "利用規約" : "Terms of Service"}
              </Link>
              <span className="text-slate-400">/</span>
              <Link
                href="/tokushoho"
                className="text-slate-600 transition hover:text-slate-900"
              >
                特定商取引法
              </Link>
            </div>

            {/* Language selector */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-slate-600">Language:</span>
              {DISPLAY_LOCALES.map((lang) => {
                const isActive = resolveBonfiletLocale(lang) === currentLocale;
                const url = getLanguageUrl(lang);
                
                return (
                  <Link
                    key={lang}
                    href={url}
                    className={`text-sm transition ${
                      isActive
                        ? "font-semibold text-slate-900"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {LANGUAGE_NAMES[lang] || lang}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

