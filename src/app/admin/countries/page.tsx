// src/app/admin/countries/page.tsx — 国・関税・送料
import { redirect } from "next/navigation";
import { getAdminEmail } from "@/lib/adminAuth";
import { CountriesManager } from "@/components/admin/CountriesManager";

export const dynamic = "force-dynamic";

export default async function AdminCountriesPage() {
  if (!(await getAdminEmail())) redirect("/admin/login");
  return <CountriesManager />;
}
