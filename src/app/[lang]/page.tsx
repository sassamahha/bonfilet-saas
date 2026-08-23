// src/app/[lang]/page.tsx — landing (localized)
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Landing from "@/components/landing/Landing";
import { resolveBonfiletLocale } from "@/lib/i18n/bonfilet";
import { loadLandingCountries } from "@/lib/landingCountries";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = resolveBonfiletLocale(lang);
  const countries = await loadLandingCountries();
  return (
    <>
      <Header locale={locale} />
      <Landing locale={locale} countries={countries} />
      <Footer locale={locale} />
    </>
  );
}
