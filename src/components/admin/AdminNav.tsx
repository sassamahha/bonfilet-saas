"use client";
// src/components/admin/AdminNav.tsx — 管理画面ナビ
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/admin/orders", label: "注文" },
  { href: "/admin/countries", label: "国・関税・送料" },
  { href: "/admin/campaigns", label: "キャンペーン" },
];

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST", credentials: "same-origin" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex h-12 max-w-6xl items-center gap-6 px-4">
        <Link href="/admin/orders" className="text-sm font-semibold tracking-tight">
          Bonfilet <span className="text-ink-3">Admin</span>
        </Link>
        <nav className="flex items-center gap-1">
          {LINKS.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-md px-3 py-1.5 text-sm transition ${
                  active ? "bg-ink text-white" : "text-ink-2 hover:bg-bg-muted hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <span className="hidden text-xs text-ink-3 sm:inline">{email}</span>
          <button type="button" onClick={logout} className="btn-ghost btn-sm">
            ログアウト
          </button>
        </div>
      </div>
    </header>
  );
}
