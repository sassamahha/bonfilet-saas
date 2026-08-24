"use client";
// src/components/admin/OrdersTable.tsx — 注文一覧（ステータス絞込 + ページング）
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAdminFetch, errorMessage } from "./useAdminFetch";
import { ORDER_STATUSES, STATUS_LABEL, type DesignJson, type OrderRow } from "./types";
import { dateTime, safeParse, shortId } from "./format";
import { Notice, PageHeader, StatusPill, TD, TH } from "./ui";

type Resp = { orders: OrderRow[]; total: number; page: number; limit: number };

export function OrdersTable() {
  const api = useAdminFetch();
  const router = useRouter();
  const params = useSearchParams();
  const status = params.get("status") ?? "";
  const page = Math.max(1, Number(params.get("page") ?? 1) || 1);

  const [data, setData] = useState<Resp | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const q = new URLSearchParams({ page: String(page) });
    if (status) q.set("status", status);
    Promise.resolve()
      .then(() => {
        if (!alive) return;
        setLoading(true);
        setError(null);
        return api<Resp>(`/api/admin/orders?${q}`);
      })
      .then((d) => alive && d && setData(d))
      .catch((e) => alive && setError(errorMessage(e)))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [api, page, status]);

  function go(next: { status?: string; page?: number }) {
    const q = new URLSearchParams();
    const s = next.status ?? status;
    const p = next.page ?? 1;
    if (s) q.set("status", s);
    if (p > 1) q.set("page", String(p));
    router.push(`/admin/orders${q.toString() ? `?${q}` : ""}`);
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  return (
    <div>
      <PageHeader title="注文">
        <span className="text-sm text-ink-2">{data ? `${data.total.toLocaleString()} 件` : ""}</span>
      </PageHeader>

      <div className="mb-3 flex flex-wrap gap-1">
        {[{ value: "", label: "すべて" }, ...ORDER_STATUSES.map((s) => ({ value: s, label: STATUS_LABEL[s] }))].map(
          (t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => go({ status: t.value, page: 1 })}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                status === t.value ? "bg-ink text-white" : "border border-line bg-white text-ink-2 hover:bg-bg-muted"
              }`}
            >
              {t.label}
            </button>
          )
        )}
      </div>

      {error ? (
        <div className="mb-3">
          <Notice kind="error">{error}</Notice>
        </div>
      ) : null}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-line bg-bg-muted">
            <tr>
              <th className={TH}>作成日</th>
              <th className={TH}>ID</th>
              <th className={TH}>国</th>
              <th className={`${TH} text-right`}>数量</th>
              <th className={TH}>デザイン</th>
              <th className={TH}>ステータス</th>
              <th className={TH}>追跡番号</th>
            </tr>
          </thead>
          <tbody>
            {loading && !data ? (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-ink-3">
                  読み込み中…
                </td>
              </tr>
            ) : data && data.orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-ink-3">
                  注文はありません
                </td>
              </tr>
            ) : (
              data?.orders.map((o) => (
                <tr
                  key={o.id}
                  className="cursor-pointer border-b border-line last:border-b-0 hover:bg-bg-muted"
                  onClick={() => router.push(`/admin/orders/${o.id}`)}
                >
                  <td className={`${TD} text-ink-2`}>{dateTime(o.createdAt)}</td>
                  <td className={`${TD} font-mono text-xs`}>
                    <Link href={`/admin/orders/${o.id}`} className="hover:underline" onClick={(e) => e.stopPropagation()}>
                      {shortId(o.id)}
                    </Link>
                  </td>
                  <td className={TD}>{o.country}</td>
                  <td className={`${TD} text-right tabular-nums`}>{o.quantity.toLocaleString()}</td>
                  <td className={`${TD} max-w-[200px] truncate`}>{designText(o.designJson)}</td>
                  <td className={TD}>
                    <StatusPill status={o.status} />
                  </td>
                  <td className={`${TD} font-mono text-xs`}>{o.trackingNumber ?? <span className="text-ink-3">-</span>}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data && totalPages > 1 ? (
        <div className="mt-3 flex items-center justify-end gap-2 text-sm">
          <button type="button" className="btn-ghost btn-sm" disabled={page <= 1} onClick={() => go({ page: page - 1 })}>
            前へ
          </button>
          <span className="text-ink-2">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            className="btn-ghost btn-sm"
            disabled={page >= totalPages}
            onClick={() => go({ page: page + 1 })}
          >
            次へ
          </button>
        </div>
      ) : null}
    </div>
  );
}

/** designJson からテキストを取り出して 16 文字程度に切り詰める */
function designText(designJson: string) {
  const text = safeParse<DesignJson>(designJson, {}).text ?? "";
  if (!text) return <span className="text-ink-3">-</span>;
  return text.length > 16 ? `${text.slice(0, 16)}…` : text;
}
