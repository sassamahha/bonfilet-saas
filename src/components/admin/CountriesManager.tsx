"use client";
// src/components/admin/CountriesManager.tsx — 国一覧 + 国の追加
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useAdminFetch, errorMessage } from "./useAdminFetch";
import type { CountryRow } from "./types";
import { CountryRowItem } from "./CountryRowItem";
import { Notice, PageHeader, TH } from "./ui";

export function isShippable(c: CountryRow) {
  return c.enabled && c.dutiesType != null;
}

export function CountriesManager() {
  const api = useAdminFetch();
  const [countries, setCountries] = useState<CountryRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const d = await api<{ countries: CountryRow[] }>("/api/admin/countries");
      setCountries([...d.countries].sort((a, b) => a.sortOrder - b.sortOrder || a.code.localeCompare(b.code)));
      setError(null);
    } catch (e) {
      setError(errorMessage(e));
    }
  }, [api]);

  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  function onSaved(row: CountryRow) {
    setCountries((list) => {
      if (!list) return [row];
      const idx = list.findIndex((c) => c.code === row.code);
      const next = idx >= 0 ? list.map((c) => (c.code === row.code ? row : c)) : [...list, row];
      return next.sort((a, b) => a.sortOrder - b.sortOrder || a.code.localeCompare(b.code));
    });
  }

  const shippable = countries?.filter(isShippable).length ?? 0;

  return (
    <div>
      <PageHeader title="国・関税・送料">
        <span className="text-sm text-ink-2">
          {countries ? `配送可 ${shippable} / ${countries.length} か国` : ""}
        </span>
      </PageHeader>
      <p className="mb-4 text-sm text-ink-2">
        関税を設定した国だけが配送対象になります（<span className="font-medium text-ink">有効</span> かつ
        <span className="font-medium text-ink">関税タイプあり</span>）。
      </p>

      {error ? (
        <div className="mb-3">
          <Notice kind="error">{error}</Notice>
        </div>
      ) : null}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-line bg-bg-muted">
            <tr>
              <th className={TH}>状態</th>
              <th className={TH}>コード</th>
              <th className={TH}>国名</th>
              <th className={TH}>有効</th>
              <th className={TH}>関税</th>
              <th className={TH}>送料バンド</th>
              <th className={TH}>表示通貨</th>
              <th className={`${TH} text-right`}>並び順</th>
              <th className={TH}></th>
            </tr>
          </thead>
          <tbody>
            {!countries ? (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-ink-3">
                  読み込み中…
                </td>
              </tr>
            ) : countries.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-ink-3">
                  国が登録されていません。下のフォームから追加してください。
                </td>
              </tr>
            ) : (
              countries.map((c) => <CountryRowItem key={c.code} country={c} onSaved={onSaved} />)
            )}
          </tbody>
        </table>
      </div>

      <AddCountryForm onAdded={onSaved} />
    </div>
  );
}

function AddCountryForm({ onAdded }: { onAdded: (c: CountryRow) => void }) {
  const api = useAdminFetch();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const cc = code.trim().toUpperCase();
      const d = await api<{ country: CountryRow }>(`/api/admin/countries/${encodeURIComponent(cc)}`, {
        method: "PUT",
        json: { name: name.trim(), enabled: false, dutiesType: null, dutiesValue: 0, shipping: [], currencyDisplay: "jpy", sortOrder: 100 },
      });
      onAdded(d.country);
      setCode("");
      setName("");
      setMsg({ kind: "ok", text: `${cc} を追加しました。関税と送料を設定してください。` });
    } catch (err) {
      setMsg({ kind: "error", text: errorMessage(err) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="card mt-4 p-4">
      <h2 className="mb-3 text-sm font-semibold">国を追加</h2>
      <div className="flex flex-wrap items-end gap-3">
        <div className="w-28">
          <label className="label" htmlFor="new-code">
            コード
          </label>
          <input
            id="new-code"
            className="input font-mono uppercase"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="US"
            maxLength={2}
            pattern="[A-Za-z]{2}"
            required
          />
        </div>
        <div className="w-64">
          <label className="label" htmlFor="new-name">
            国名
          </label>
          <input
            id="new-name"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="United States"
            required
          />
        </div>
        <button type="submit" className="btn-primary btn-sm" disabled={busy || code.trim().length !== 2 || !name.trim()}>
          {busy ? "追加中…" : "追加"}
        </button>
        {msg ? <Notice kind={msg.kind}>{msg.text}</Notice> : null}
      </div>
      <p className="mt-2 text-xs text-ink-3">ISO 3166-1 alpha-2 の2文字コード。追加直後は「未設定」です。</p>
    </form>
  );
}
