import type { MetadataRoute } from "next";
import { BONFILET_LOCALES } from "@/lib/i18n/bonfilet";

const BASE = "https://bonfilet.jp";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const l of BONFILET_LOCALES) {
    const p = l === "en" ? "" : `/${l}`;
    entries.push(
      { url: `${BASE}${p || "/"}`, changeFrequency: "weekly", priority: l === "en" || l === "ja" ? 1 : 0.6 },
      { url: `${BASE}${p}/bonfilet`, changeFrequency: "weekly", priority: 0.9 }
    );
  }
  entries.push(
    { url: `${BASE}/tokushoho`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/privacy-policy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/terms-of-service`, changeFrequency: "yearly", priority: 0.2 }
  );
  return entries;
}
