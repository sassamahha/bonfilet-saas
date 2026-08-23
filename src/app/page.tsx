// src/app/page.tsx — landing (en)
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Landing from "@/components/landing/Landing";
import { loadLandingCountries } from "@/lib/landingCountries";

export const dynamic = "force-dynamic";

export default async function Page() {
  const countries = await loadLandingCountries();
  return (
    <>
      <Header locale="en" />
      <Landing locale="en" countries={countries} />
      <Footer locale="en" />
    </>
  );
}
