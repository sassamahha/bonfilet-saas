// src/lib/seo.ts — メタデータ生成（タイトルは英語ベース共通、説明文はロケール別）
import type { Metadata } from "next";
import { getV2Texts } from "./i18n/v2";
import { BONFILET_LOCALES } from "./i18n/bonfilet";

const SITE_URL = "https://bonfilet.jp";
const OG_IMAGE = "/images/connect01.jpg";

export function buildMetadata(locale: string, path = ""): Metadata {
  const t = getV2Texts(locale).meta;
  const prefix = locale === "en" ? "" : `/${locale}`;
  const canonical = `${SITE_URL}${prefix}${path}` || SITE_URL;
  const languages: Record<string, string> = { "x-default": `${SITE_URL}${path}` };
  for (const l of BONFILET_LOCALES) {
    languages[l] = `${SITE_URL}${l === "en" ? "" : `/${l}`}${path}`;
  }
  return {
    metadataBase: new URL(SITE_URL),
    title: t.title,
    description: t.description,
    alternates: { canonical, languages },
    openGraph: {
      type: "website",
      siteName: "Bonfilet",
      title: t.title,
      description: t.description,
      url: canonical,
      locale: locale === "ja" ? "ja_JP" : "en_US",
      images: [{ url: OG_IMAGE, width: 1184, height: 864, alt: "Bonfilet reversible fabric bands" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t.title,
      description: t.description,
      images: [OG_IMAGE],
    },
  };
}
