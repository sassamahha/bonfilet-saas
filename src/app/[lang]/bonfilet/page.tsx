import DesignerPage from "@/components/designer/DesignerPage";
import { resolveBonfiletLocale } from "@/lib/i18n/bonfilet";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <DesignerPage locale={resolveBonfiletLocale(lang)} />;
}
