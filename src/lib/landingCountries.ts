// src/lib/landingCountries.ts — server-only: shippable countries for the landing page,
// tolerant of missing Cloudflare bindings (e.g. during `next build` prerendering).
import { listShippableCountries } from "@/lib/repo";
import type { LandingCountry } from "@/components/landing/Landing";

export async function loadLandingCountries(): Promise<LandingCountry[]> {
  try {
    const rows = await listShippableCountries();
    return rows.map((c) => ({ code: c.code, name: c.name }));
  } catch (err) {
    console.warn("[landing] listShippableCountries failed; rendering without countries", err);
    return [];
  }
}
