// src/app/admin/layout.tsx — 管理画面レイアウト（ログイン時のみナビ表示）
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { getAdminEmail } from "@/lib/adminAuth";
import { AdminNav } from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bonfilet Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const email = await getAdminEmail();
  return (
    <div className="flex min-h-screen flex-col bg-bg-muted text-ink">
      {email ? <AdminNav email={email} /> : null}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
