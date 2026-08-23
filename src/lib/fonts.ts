// src/lib/fonts.ts — next/font（canvas でも同じ family 名を使う）
import { Inter, Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";

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

export const FONT_OPTIONS = [
  { value: "inter", label: "Inter", family: inter.style.fontFamily },
  { value: "noto-sans", label: "Noto Sans", family: notoSansJp.style.fontFamily },
  { value: "noto-serif", label: "Noto Serif", family: notoSerifJp.style.fontFamily },
] as const;

export type FontValue = (typeof FONT_OPTIONS)[number]["value"];

export function fontFamilyOf(v: string) {
  return FONT_OPTIONS.find((f) => f.value === v)?.family ?? FONT_OPTIONS[0].family;
}
