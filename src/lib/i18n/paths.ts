// src/lib/i18n/paths.ts — URL helpers for the `/` (en) + `/{lang}` scheme
export function localePrefix(locale: string): string {
  return locale === "en" ? "" : `/${locale}`;
}

/** Localized path: `/` for en home, `/ja` for ja home, `/ja/bonfilet` … */
export function localePath(locale: string, path = "/"): string {
  const prefix = localePrefix(locale);
  if (path === "/" || path === "") return prefix || "/";
  return `${prefix}${path.startsWith("/") ? path : `/${path}`}`;
}
