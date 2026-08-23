// src/app/admin/orders/[id]/page.tsx — 注文詳細
import { redirect } from "next/navigation";
import { getAdminEmail } from "@/lib/adminAuth";
import { OrderDetail } from "@/components/admin/OrderDetail";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminEmail())) redirect("/admin/login");
  const { id } = await params;
  return <OrderDetail id={id} />;
}
