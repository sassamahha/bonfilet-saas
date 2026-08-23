"use client";
// src/components/admin/CampaignsManager.tsx — キャンペーン一覧 + 作成/編集/削除
import { useCallback, useEffect, useState } from "react";
import { useAdminFetch, errorMessage } from "./useAdminFetch";
import type { CampaignRow } from "./types";
import { dateTime } from "./format";
import { CampaignForm } from "./CampaignForm";
import { Notice, PageHeader, TD, TH } from "./ui";

const STATUS_LABEL: Record<CampaignRow["status"], string> = { draft: "下書き", open: "受付中", closed: "終了" };
const STATUS_STYLE: Record<CampaignRow["status"], string> = {
  draft: "border-line bg-bg-muted text-ink-2",
  open: "border-emerald-200 bg-emerald-50 text-emerald-800",
  closed: "border-slate-300 bg-slate-100 text-slate-700",
};

type Mode = { kind: "none" } | { kind: "create" } | { kind: "edit"; campaign: CampaignRow };

export function CampaignsManager() {
  const api = useAdminFetch();
  const [campaigns, setCampaigns] = useState<CampaignRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>({ kind: "none" });
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const d = await api<{ campaigns: CampaignRow[] }>("/api/admin/campaigns");
      setCampaigns(d.campaigns);
      setError(null);
    } catch (e) {
      setError(errorMessage(e));
    }
  }, [api]);

  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  async function remove(c: CampaignRow) {
    if (!window.confirm(`キャンペーン「${c.name}」(/c/${c.slug}) を削除しますか？この操作は取り消せません。`)) return;
    try {
      await api(`/api/admin/campaigns/${encodeURIComponent(c.id)}`, { method: "DELETE" });
      if (mode.kind === "edit" && mode.campaign.id === c.id) setMode({ kind: "none" });
      await load();
    } catch (e) {
      setError(errorMessage(e));
    }
  }

  async function copyUrl(slug: string) {
    const url = `${window.location.origin}/c/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(slug);
      setTimeout(() => setCopied((s) => (s === slug ? null : s)), 1500);
    } catch {
      window.prompt("URL をコピーしてください", url);
    }
  }

  return (
    <div>
      <PageHeader title="キャンペーン">
        <button type="button" className="btn-primary btn-sm" onClick={() => setMode({ kind: "create" })}>
          新規作成
        </button>
      </PageHeader>
      <p className="mb-4 text-sm text-ink-2">
        非公開 URL <span className="font-mono">/c/{"{slug}"}</span> 単位の販売ページです。ステータスが「受付中」かつ期間内のときだけ注文できます。
      </p>

      {error ? (
        <div className="mb-3">
          <Notice kind="error">{error}</Notice>
        </div>
      ) : null}

      {mode.kind !== "none" ? (
        <div className="card mb-4 p-4">
          <h2 className="mb-3 text-sm font-semibold">{mode.kind === "create" ? "新規キャンペーン" : `編集: ${mode.campaign.name}`}</h2>
          <CampaignForm
            key={mode.kind === "edit" ? mode.campaign.id : "new"}
            campaign={mode.kind === "edit" ? mode.campaign : null}
            onSaved={async () => {
              setMode({ kind: "none" });
              await load();
            }}
            onCancel={() => setMode({ kind: "none" })}
          />
        </div>
      ) : null}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-line bg-bg-muted">
            <tr>
              <th className={TH}>状態</th>
              <th className={TH}>名前</th>
              <th className={TH}>URL</th>
              <th className={TH}>受付期間</th>
              <th className={`${TH} text-right`}>最低数量</th>
              <th className={TH}>価格表</th>
              <th className={TH}>対象国</th>
              <th className={TH}></th>
            </tr>
          </thead>
          <tbody>
            {!campaigns ? (
              <tr>
                <td colSpan={8} className="px-3 py-8 text-center text-ink-3">
                  読み込み中…
                </td>
              </tr>
            ) : campaigns.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-3 py-8 text-center text-ink-3">
                  キャンペーンはありません
                </td>
              </tr>
            ) : (
              campaigns.map((c) => (
                <tr key={c.id} className="border-b border-line last:border-b-0 hover:bg-bg-muted">
                  <td className={TD}>
                    <span className={`pill ${STATUS_STYLE[c.status]}`}>{STATUS_LABEL[c.status]}</span>
                  </td>
                  <td className={`${TD} font-medium`}>{c.name}</td>
                  <td className={TD}>
                    <span className="inline-flex items-center gap-2">
                      <a href={`/c/${c.slug}`} target="_blank" rel="noopener noreferrer" className="font-mono text-xs hover:underline">
                        /c/{c.slug}
                      </a>
                      <button type="button" className="btn-ghost btn-sm" onClick={() => copyUrl(c.slug)}>
                        {copied === c.slug ? "コピー済" : "コピー"}
                      </button>
                    </span>
                  </td>
                  <td className={`${TD} text-xs text-ink-2`}>
                    {dateTime(c.opensAt)} <span className="text-ink-3">→</span> {dateTime(c.closesAt)}
                  </td>
                  <td className={`${TD} text-right tabular-nums`}>{c.minQty ?? <span className="text-ink-3">-</span>}</td>
                  <td className={`${TD} text-xs`}>{c.priceTableJson ? "独自" : <span className="text-ink-3">標準</span>}</td>
                  <td className={`${TD} text-xs`}>{c.allowedCountriesJson ?? <span className="text-ink-3">全配送対象国</span>}</td>
                  <td className={`${TD} text-right`}>
                    <span className="inline-flex gap-1">
                      <button type="button" className="btn-ghost btn-sm" onClick={() => setMode({ kind: "edit", campaign: c })}>
                        編集
                      </button>
                      <button type="button" className="btn-ghost btn-sm text-red-700" onClick={() => remove(c)}>
                        削除
                      </button>
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
