// src/app/admin/page.tsx — /admin → /admin/orders
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function AdminIndex() {
  redirect("/admin/orders");
}
