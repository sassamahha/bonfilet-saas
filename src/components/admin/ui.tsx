// src/components/admin/ui.tsx — 管理画面の小さな共通部品
import type { ReactNode } from "react";
import { STATUS_LABEL, type OrderStatus } from "./types";

const STATUS_STYLE: Record<OrderStatus, string> = {
  PENDING: "border-amber-200 bg-amber-50 text-amber-800",
  IN_PRODUCTION: "border-blue-200 bg-blue-50 text-blue-800",
  QC: "border-violet-200 bg-violet-50 text-violet-800",
  PACKED: "border-slate-300 bg-slate-100 text-slate-800",
  SHIPPED: "border-emerald-200 bg-emerald-50 text-emerald-800",
};

export function StatusPill({ status }: { status: string }) {
  const s = status as OrderStatus;
  return <span className={`pill ${STATUS_STYLE[s] ?? ""}`}>{STATUS_LABEL[s] ?? status}</span>;
}

export function Notice({ kind, children }: { kind: "error" | "ok"; children: ReactNode }) {
  const cls =
    kind === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800";
  return <div className={`rounded-lg border px-3 py-2 text-sm ${cls}`}>{children}</div>;
}

export function PageHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <h1 className="h2">{title}</h1>
      {children}
    </div>
  );
}

export function ColorChip({ color }: { color?: string | null }) {
  if (!color) return <span className="text-ink-3">-</span>;
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-xs">
      <span className="inline-block h-4 w-4 rounded-full border border-line" style={{ background: color }} />
      {color}
    </span>
  );
}

/** 定義リスト風の行 */
export function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line py-2 text-sm last:border-b-0">
      <span className="shrink-0 text-ink-2">{label}</span>
      <span className="min-w-0 break-all text-right">{children}</span>
    </div>
  );
}

export const TH = "px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-ink-2 whitespace-nowrap";
export const TD = "px-3 py-2 align-middle whitespace-nowrap";
