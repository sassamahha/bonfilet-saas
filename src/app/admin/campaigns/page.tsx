// src/app/admin/campaigns/page.tsx — キャンペーン管理
import { redirect } from "next/navigation";
import { getAdminEmail } from "@/lib/adminAuth";
import { CampaignsManager } from "@/components/admin/CampaignsManager";

export const dynamic = "force-dynamic";

export default async function AdminCampaignsPage() {
  if (!(await getAdminEmail())) redirect("/admin/login");
  return <CampaignsManager />;
}
