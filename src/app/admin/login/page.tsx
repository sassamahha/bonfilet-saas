// src/app/admin/login/page.tsx — 管理者ログイン（ログイン済みなら注文一覧へ）
import { redirect } from "next/navigation";
import { getAdminEmail } from "@/lib/adminAuth";
import { LoginForm } from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const email = await getAdminEmail();
  if (email) redirect("/admin/orders");
  return <LoginForm />;
}
