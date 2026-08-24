// src/lib/fonts.ts — next/font（canvas でも同じ family 名を使う）
import {
  Inter,
  Noto_Sans_JP,
  Noto_Serif_JP,
  Kosugi_Maru,
  Zen_Maru_Gothic,
  M_PLUS_1p,
} from "next/font/google";

export const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
export const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-jp",
  display: "swap",
});
export const notoSerifJp = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-noto-serif-jp",
  display: "swap",
});
export const kosugiMaru = Kosugi_Maru({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-kosugi-maru",
  display: "swap",
});
export const zenMaruGothic = Zen_Maru_Gothic({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-zen-maru",
  display: "swap",
});
export const mPlus1p = M_PLUS_1p({
  subsets: ["latin"],
  weight: ["500", "800"],
  variable: "--font-mplus",
  display: "swap",
});

export const FONT_OPTIONS = [
  { value: "inter", label: "Inter", family: inter.style.fontFamily },
  { value: "noto-sans", label: "ゴシック", family: notoSansJp.style.fontFamily },
  { value: "noto-serif", label: "明朝", family: notoSerifJp.style.fontFamily },
  { value: "kosugi-maru", label: "丸ゴシック", family: kosugiMaru.style.fontFamily },
  { value: "zen-maru", label: "丸ゴ 太字", family: zenMaruGothic.style.fontFamily },
  { value: "mplus", label: "太ゴシック", family: mPlus1p.style.fontFamily },
] as const;

export type FontValue = (typeof FONT_OPTIONS)[number]["value"];

/** canvas 描画・プレビュー時のウェイト */
export function fontWeightOf(v: string) {
  return v === "zen-maru" || v === "mplus" ? 700 : 500;
}

export function fontFamilyOf(v: string) {
  return FONT_OPTIONS.find((f) => f.value === v)?.family ?? FONT_OPTIONS[0].family;
}
