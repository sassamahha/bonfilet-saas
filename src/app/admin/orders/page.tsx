// src/app/admin/orders/page.tsx — 注文一覧
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getAdminEmail } from "@/lib/adminAuth";
import { OrdersTable } from "@/components/admin/OrdersTable";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  if (!(await getAdminEmail())) redirect("/admin/login");
  return (
    <Suspense fallback={<p className="text-sm text-ink-3">読み込み中…</p>}>
      <OrdersTable />
    </Suspense>
  );
}
