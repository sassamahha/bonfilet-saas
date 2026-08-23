import OrderSuccess from "@/components/OrderSuccess";
import { resolveBonfiletLocale } from "@/lib/i18n/bonfilet";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { lang } = await params;
  const { session_id } = await searchParams;
  return <OrderSuccess locale={resolveBonfiletLocale(lang)} sessionId={session_id} />;
}
