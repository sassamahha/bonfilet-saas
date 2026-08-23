"use client";
// src/components/admin/CountryRowItem.tsx — 国1行 + 展開式の編集フォーム
import { useState, type FormEvent } from "react";
import { useAdminFetch, errorMessage } from "./useAdminFetch";
import { DUTIES_OPTIONS, type CountryRow, type DutiesType, type ShippingBand } from "./types";
import { jpy, safeParse } from "./format";
import { Notice, TD } from "./ui";

function dutiesSummary(c: CountryRow) {
  if (!c.dutiesType) return <span className="text-ink-3">未設定</span>;
  if (c.dutiesType === "rate") return `${c.dutiesValue}%`;
  if (c.dutiesType === "fixed_per_unit") return `${jpy(c.dutiesValue)} / 個`;
  return `${jpy(c.dutiesValue)} / 注文`;
}

function shippingSummary(bands: ShippingBand[]) {
  return bands.map((b) => `〜${b.upToQty}: ${jpy(b.jpy)}`).join(" / ");
}

export function CountryRowItem({ country: c, onSaved }: { country: CountryRow; onSaved: (c: CountryRow) => void }) {
  const [open, setOpen] = useState(false);
  const bands = safeParse<ShippingBand[]>(c.shippingJson, []);
  const shippable = c.enabled && c.dutiesType != null;

  return (
    <>
      <tr
        className={`cursor-pointer border-b border-line hover:bg-bg-muted ${open ? "bg-bg-muted" : ""}`}
        onClick={() => setOpen((v) => !v)}
      >
        <td className={TD}>
          {shippable ? (
            <span className="pill border-emerald-200 bg-emerald-50 text-emerald-800">配送可</span>
          ) : (
            <span className="pill border-line bg-bg-muted text-ink-3">未設定</span>
          )}
        </td>
        <td className={`${TD} font-mono text-xs`}>{c.code}</td>
        <td className={`${TD} font-medium`}>{c.name}</td>
        <td className={TD}>{c.enabled ? "有効" : <span className="text-ink-3">無効</span>}</td>
        <td className={TD}>{dutiesSummary(c)}</td>
        <td className={`${TD} max-w-[280px] truncate text-xs`} title={shippingSummary(bands)}>
          {bands.length === 0 ? <span className="text-ink-3">なし</span> : shippingSummary(bands)}
        </td>
        <td className={`${TD} uppercase`}>{c.currencyDisplay}</td>
        <td className={`${TD} text-right tabular-nums`}>{c.sortOrder}</td>
        <td className={`${TD} text-right text-xs text-ink-2`}>{open ? "閉じる" : "編集"}</td>
      </tr>
      {open ? (
        <tr className="border-b border-line">
          <td colSpan={9} className="bg-white px-4 py-4">
            <CountryEditForm
              country={c}
              onSaved={(row) => {
                onSaved(row);
                setOpen(false);
              }}
              onCancel={() => setOpen(false)}
            />
          </td>
        </tr>
      ) : null}
    </>
  );
}

function CountryEditForm({
  country: c,
  onSaved,
  onCancel,
}: {
  country: CountryRow;
  onSaved: (c: CountryRow) => void;
  onCancel: () => void;
}) {
  const api = useAdminFetch();
  const [name, setName] = useState(c.name);
  const [enabled, setEnabled] = useState(c.enabled);
  const [dutiesType, setDutiesType] = useState<"" | DutiesType>(c.dutiesType ?? "");
  const [dutiesValue, setDutiesValue] = useState(String(c.dutiesValue ?? 0));
  const [dutiesNote, setDutiesNote] = useState(c.dutiesNote ?? "");
  const [bands, setBands] = useState<{ upToQty: string; jpy: string }[]>(
    safeParse<ShippingBand[]>(c.shippingJson, []).map((b) => ({ upToQty: String(b.upToQty), jpy: String(b.jpy) }))
  );
  const [currencyDisplay, setCurrencyDisplay] = useState<"jpy" | "usd">(c.currencyDisplay === "usd" ? "usd" : "jpy");
  const [sortOrder, setSortOrder] = useState(String(c.sortOrder));
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const valueLabel =
    dutiesType === "rate" ? "関税率 (%)" : dutiesType === "" ? "関税値" : "関税額 (JPY)";

  function updateBand(i: number, key: "upToQty" | "jpy", v: string) {
    setBands((list) => list.map((b, j) => (j === i ? { ...b, [key]: v } : b)));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const shipping = bands
        .map((b) => ({ upToQty: Number(b.upToQty), jpy: Number(b.jpy) }))
        .filter((b) => Number.isFinite(b.upToQty) && Number.isFinite(b.jpy) && b.upToQty > 0);
      const d = await api<{ country: CountryRow }>(`/api/admin/countries/${encodeURIComponent(c.code)}`, {
        method: "PUT",
        json: {
          name: name.trim() || c.name,
          enabled,
          dutiesType: dutiesType || null,
          dutiesValue: Number(dutiesValue) || 0,
          dutiesNote: dutiesNote.trim() || null,
          shipping,
          currencyDisplay,
          sortOrder: Number(sortOrder) || 100,
        },
      });
      onSaved(d.country);
    } catch (err) {
      setMsg(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  const willShip = enabled && dutiesType !== "";

  return (
    <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="label" htmlFor={`name-${c.code}`}>
                国名
              </label>
              <input id={`name-${c.code}`} className="input" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <label className="flex h-[42px] cursor-pointer items-center gap-2 text-sm">
              <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="h-4 w-4 accent-[var(--accent)]" />
              有効
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor={`dt-${c.code}`}>
                関税タイプ
              </label>
              <select
                id={`dt-${c.code}`}
                className="select"
                value={dutiesType}
                onChange={(e) => setDutiesType(e.target.value as "" | DutiesType)}
              >
                {DUTIES_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor={`dv-${c.code}`}>
                {valueLabel}
              </label>
              <input
                id={`dv-${c.code}`}
                type="number"
                step="any"
                min={0}
                className="input tabular-nums"
                value={dutiesValue}
                onChange={(e) => setDutiesValue(e.target.value)}
                disabled={dutiesType === ""}
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor={`note-${c.code}`}>
              メモ（工場からの回答など）
            </label>
            <textarea
              id={`note-${c.code}`}
              className="input min-h-[72px]"
              value={dutiesNote}
              onChange={(e) => setDutiesNote(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor={`cur-${c.code}`}>
                表示通貨
              </label>
              <select
                id={`cur-${c.code}`}
                className="select"
                value={currencyDisplay}
                onChange={(e) => setCurrencyDisplay(e.target.value === "usd" ? "usd" : "jpy")}
              >
                <option value="jpy">JPY</option>
                <option value="usd">USD</option>
              </select>
            </div>
            <div>
              <label className="label" htmlFor={`so-${c.code}`}>
                並び順
              </label>
              <input
                id={`so-${c.code}`}
                type="number"
                className="input tabular-nums"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="label">送料バンド（数量がこの値以下なら適用・JPY）</div>
          <div className="space-y-2">
            {bands.length === 0 ? <p className="text-xs text-ink-3">送料バンドがありません。</p> : null}
            {bands.map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-8 text-xs text-ink-3">〜</span>
                <input
                  type="number"
                  min={1}
                  className="input tabular-nums"
                  placeholder="数量上限"
                  value={b.upToQty}
                  onChange={(e) => updateBand(i, "upToQty", e.target.value)}
                />
                <span className="text-xs text-ink-3">個</span>
                <input
                  type="number"
                  min={0}
                  className="input tabular-nums"
                  placeholder="送料 JPY"
                  value={b.jpy}
                  onChange={(e) => updateBand(i, "jpy", e.target.value)}
                />
                <button
                  type="button"
                  className="btn-ghost btn-sm shrink-0"
                  onClick={() => setBands((list) => list.filter((_, j) => j !== i))}
                  aria-label="削除"
                >
                  削除
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn-ghost btn-sm"
              onClick={() => setBands((list) => [...list, { upToQty: "", jpy: "" }])}
            >
              バンドを追加
            </button>
          </div>
          <p className="mt-2 text-xs text-ink-3">
            例: 〜300 個 ¥1,500 / 〜100000 個 ¥2,500。上限は小さい順に自動で並びます。
          </p>
        </div>
      </div>

      {msg ? <Notice kind="error">{msg}</Notice> : null}

      <div className="flex items-center gap-3">
        <button type="submit" className="btn-primary btn-sm" disabled={busy}>
          {busy ? "保存中…" : "保存"}
        </button>
        <button type="button" className="btn-ghost btn-sm" onClick={onCancel} disabled={busy}>
          キャンセル
        </button>
        <span className={`text-xs ${willShip ? "text-emerald-700" : "text-ink-3"}`}>
          保存後: {willShip ? "配送可" : "未設定（配送対象外）"}
        </span>
      </div>
    </form>
  );
}
