"use client";
// src/components/admin/CampaignForm.tsx — キャンペーン作成/編集フォーム
import { useState, type FormEvent } from "react";
import { useAdminFetch, errorMessage } from "./useAdminFetch";
import type { CampaignRow } from "./types";
import { fromLocalInput, toLocalInput } from "./format";
import { Notice } from "./ui";

const PRICE_PLACEHOLDER = '[{"upTo":49,"unitJpy":1100},{"upTo":99,"unitJpy":1000},{"upTo":100000,"unitJpy":900}]';
const COUNTRIES_PLACEHOLDER = '["JP","US"]';
const THEME_PLACEHOLDER = '{"accent":"#ff5a1f","heading":"Comicon 限定","description":"会場受取のチームバンド"}';

function validJson(s: string) {
  if (!s.trim()) return true;
  try {
    JSON.parse(s);
    return true;
  } catch {
    return false;
  }
}

export function CampaignForm({
  campaign,
  onSaved,
  onCancel,
}: {
  campaign: CampaignRow | null;
  onSaved: () => void | Promise<void>;
  onCancel: () => void;
}) {
  const api = useAdminFetch();
  const [slug, setSlug] = useState(campaign?.slug ?? "");
  const [name, setName] = useState(campaign?.name ?? "");
  const [status, setStatus] = useState<CampaignRow["status"]>(campaign?.status ?? "draft");
  const [opensAt, setOpensAt] = useState(toLocalInput(campaign?.opensAt));
  const [closesAt, setClosesAt] = useState(toLocalInput(campaign?.closesAt));
  const [minQty, setMinQty] = useState(campaign?.minQty != null ? String(campaign.minQty) : "");
  const [priceTableJson, setPriceTableJson] = useState(campaign?.priceTableJson ?? "");
  const [allowedCountriesJson, setAllowedCountriesJson] = useState(campaign?.allowedCountriesJson ?? "");
  const [themeJson, setThemeJson] = useState(campaign?.themeJson ?? "");
  const [note, setNote] = useState(campaign?.note ?? "");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const jsonOk = validJson(priceTableJson) && validJson(allowedCountriesJson) && validJson(themeJson);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const body = {
      slug: slug.trim().toLowerCase(),
      name: name.trim(),
      status,
      opensAt: fromLocalInput(opensAt),
      closesAt: fromLocalInput(closesAt),
      minQty: minQty.trim() === "" ? null : Number(minQty),
      priceTableJson: priceTableJson.trim() || null,
      allowedCountriesJson: allowedCountriesJson.trim() || null,
      themeJson: themeJson.trim() || null,
      note: note.trim() || null,
    };
    try {
      if (campaign) {
        await api(`/api/admin/campaigns/${encodeURIComponent(campaign.id)}`, { method: "PUT", json: body });
      } else {
        await api("/api/admin/campaigns", { method: "POST", json: body });
      }
      await onSaved();
    } catch (err) {
      setMsg(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  const jsonCls = (s: string) => `input min-h-[72px] font-mono text-xs ${validJson(s) ? "" : "border-red-400"}`;

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <div>
          <label className="label" htmlFor="c-slug">
            slug（URL）
          </label>
          <input
            id="c-slug"
            className="input font-mono"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="comicon-2026"
            pattern="[a-z0-9][a-z0-9-]{1,63}"
            required
          />
          <p className="mt-1 text-xs text-ink-3">公開URL: /c/{slug || "…"}</p>
        </div>
        <div>
          <label className="label" htmlFor="c-name">
            名前
          </label>
          <input id="c-name" className="input" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="label" htmlFor="c-status">
            ステータス
          </label>
          <select
            id="c-status"
            className="select"
            value={status}
            onChange={(e) => setStatus(e.target.value as CampaignRow["status"])}
          >
            <option value="draft">下書き</option>
            <option value="open">受付中</option>
            <option value="closed">終了</option>
          </select>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div>
          <label className="label" htmlFor="c-opens">
            受付開始
          </label>
          <input id="c-opens" type="datetime-local" className="input" value={opensAt} onChange={(e) => setOpensAt(e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="c-closes">
            受付終了
          </label>
          <input id="c-closes" type="datetime-local" className="input" value={closesAt} onChange={(e) => setClosesAt(e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="c-minqty">
            最低数量
          </label>
          <input
            id="c-minqty"
            type="number"
            min={1}
            className="input tabular-nums"
            value={minQty}
            onChange={(e) => setMinQty(e.target.value)}
            placeholder="空欄 = 制限なし"
          />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div>
          <label className="label" htmlFor="c-price">
            価格表 JSON（空欄 = 標準価格）
          </label>
          <textarea
            id="c-price"
            className={jsonCls(priceTableJson)}
            value={priceTableJson}
            onChange={(e) => setPriceTableJson(e.target.value)}
            placeholder={PRICE_PLACEHOLDER}
          />
        </div>
        <div>
          <label className="label" htmlFor="c-countries">
            対象国 JSON（空欄 = 全配送対象国）
          </label>
          <textarea
            id="c-countries"
            className={jsonCls(allowedCountriesJson)}
            value={allowedCountriesJson}
            onChange={(e) => setAllowedCountriesJson(e.target.value)}
            placeholder={COUNTRIES_PLACEHOLDER}
          />
        </div>
        <div>
          <label className="label" htmlFor="c-theme">
            テーマ JSON
          </label>
          <textarea
            id="c-theme"
            className={jsonCls(themeJson)}
            value={themeJson}
            onChange={(e) => setThemeJson(e.target.value)}
            placeholder={THEME_PLACEHOLDER}
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="c-note">
          メモ
        </label>
        <textarea id="c-note" className="input min-h-[60px]" value={note} onChange={(e) => setNote(e.target.value)} />
      </div>

      {msg ? <Notice kind="error">{msg}</Notice> : null}
      {!jsonOk ? <Notice kind="error">JSON の形式が正しくありません</Notice> : null}

      <div className="flex items-center gap-3">
        <button type="submit" className="btn-primary btn-sm" disabled={busy || !jsonOk}>
          {busy ? "保存中…" : campaign ? "保存" : "作成"}
        </button>
        <button type="button" className="btn-ghost btn-sm" onClick={onCancel} disabled={busy}>
          キャンセル
        </button>
      </div>
    </form>
  );
}
