// /c/[slug] — キャンペーン用デザイナー（非公開URL）
import DesignerPage from "@/components/designer/DesignerPage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { campaignTheme, getOpenCampaign } from "@/lib/repo";
import { getV2Texts } from "@/lib/i18n/v2";
import { resolveBonfiletLocale } from "@/lib/i18n/bonfilet";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { slug } = await params;
  const { lang } = await searchParams;
  const locale = resolveBonfiletLocale(lang ?? "ja");
  const t = getV2Texts(locale);

  let campaign = null;
  try {
    campaign = await getOpenCampaign(slug);
  } catch {
    campaign = null;
  }

  if (!campaign) {
    return (
      <>
        <Header locale={locale} />
        <main className="flex flex-1 items-center justify-center px-4 py-24">
          <p className="muted text-center">{t.designer.campaignClosed}</p>
        </main>
        <Footer locale={locale} />
      </>
    );
  }

  const theme = campaignTheme(campaign);
  return (
    <DesignerPage
      locale={locale}
      campaign={campaign.slug}
      heading={theme.heading ?? campaign.name}
      description={theme.description}
      accent={theme.accent}
    />
  );
}
