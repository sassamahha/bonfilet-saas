"use client";
// src/components/admin/OrderDetail.tsx — 注文詳細（プレビュー・デザイン・配送先・ステータス更新）
import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useAdminFetch, errorMessage } from "./useAdminFetch";
import { ORDER_STATUSES, STATUS_LABEL, type DesignJson, type OrderDetailRow } from "./types";
import { dateTime, safeParse } from "./format";
import { ColorChip, Notice, PageHeader, Row, StatusPill } from "./ui";

type Resp = { order: OrderDetailRow };

export function OrderDetail({ id }: { id: string }) {
  const api = useAdminFetch();
  const [data, setData] = useState<Resp | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState<string>("PENDING");
  const [tracking, setTracking] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [purging, setPurging] = useState(false);
  const [purgeMsg, setPurgeMsg] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    api<Resp>(`/api/admin/orders/${encodeURIComponent(id)}`)
      .then((d) => {
        if (!alive) return;
        setData(d);
        setStatus(d.order.status);
        setTracking(d.order.trackingNumber ?? "");
      })
      .catch((e) => alive && setError(errorMessage(e)));
    return () => {
      alive = false;
    };
  }, [api, id]);

  async function save(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveMsg(null);
    try {
      await api(`/api/admin/orders/${encodeURIComponent(id)}/status`, {
        method: "PATCH",
        json: { status, trackingNumber: tracking },
      });
      setSaveMsg({ kind: "ok", text: "保存しました" });
      setData((d) => (d ? { ...d, order: { ...d.order, status, trackingNumber: tracking || null } } : d));
    } catch (err) {
      setSaveMsg({ kind: "error", text: errorMessage(err) });
    } finally {
      setSaving(false);
    }
  }

  async function purgePii() {
    if (!window.confirm("発送先情報・氏名・電話番号を完全に削除します。元に戻せません。よろしいですか？")) return;
    setPurging(true);
    setPurgeMsg(null);
    try {
      await api(`/api/admin/orders/${encodeURIComponent(id)}/purge-pii`, { method: "POST" });
      window.location.reload();
    } catch (err) {
      setPurgeMsg(errorMessage(err));
      setPurging(false);
    }
  }

  if (error) return <Notice kind="error">{error}</Notice>;
  if (!data) return <p className="text-sm text-ink-3">読み込み中…</p>;

  const { order: o } = data;
  const design = safeParse<DesignJson>(o.designJson, {});
  const previews = safeParse<{ front?: string; back?: string }>(o.previewKeysJson, {});

  return (
    <div>
      <div className="mb-2 text-sm">
        <Link href="/admin/orders" className="text-ink-2 hover:underline">
          ← 注文一覧
        </Link>
      </div>
      <PageHeader title="注文詳細">
        <div className="flex items-center gap-3">
          <StatusPill status={o.status} />
          <a
            href={`/api/generate-spec?order_id=${encodeURIComponent(o.id)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost btn-sm"
          >
            仕様書
          </a>
        </div>
      </PageHeader>
      <p className="mb-5 font-mono text-xs text-ink-2">{o.id}</p>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* 左: プレビュー + デザイン */}
        <div className="space-y-4 lg:col-span-2">
          <section className="card p-4">
            <h2 className="mb-3 text-sm font-semibold">プレビュー</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Preview label="表" keyName={previews.front} />
              <Preview label="裏" keyName={previews.back} />
            </div>
          </section>

          <section className="card p-4">
            <h2 className="mb-3 text-sm font-semibold">デザイン</h2>
            <div className="grid gap-x-8 sm:grid-cols-2">
              <div>
                <Row label="表テキスト">{design.text || "-"}</Row>
                <Row label="フォント">{design.font || "-"}</Row>
                <Row label="背景色">
                  <ColorChip color={design.bgColor} />
                </Row>
                <Row label="文字色">
                  <ColorChip color={design.fontColor} />
                </Row>
              </div>
              <div>
                <Row label="裏面">{design.enableBack ? "あり" : "なし"}</Row>
                {design.enableBack ? (
                  <>
                    <Row label="裏テキスト">{design.backText || "-"}</Row>
                    <Row label="裏背景色">
                      <ColorChip color={design.backBgColor} />
                    </Row>
                    <Row label="裏文字色">
                      <ColorChip color={design.backFontColor} />
                    </Row>
                  </>
                ) : null}
              </div>
            </div>
          </section>

        </div>

        {/* 右: ステータス更新 + 配送先 + メタ */}
        <div className="space-y-4">
          <form onSubmit={save} className="card p-4">
            <h2 className="mb-3 text-sm font-semibold">ステータス更新</h2>
            <div className="space-y-3">
              <div>
                <label className="label" htmlFor="status">
                  ステータス
                </label>
                <select id="status" className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABEL[s]} ({s})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="tracking">
                  追跡番号
                </label>
                <input
                  id="tracking"
                  className="input font-mono"
                  value={tracking}
                  onChange={(e) => setTracking(e.target.value)}
                  placeholder="FedEx 追跡番号"
                />
              </div>
              {saveMsg ? <Notice kind={saveMsg.kind}>{saveMsg.text}</Notice> : null}
              <button type="submit" className="btn-primary btn-sm w-full" disabled={saving}>
                {saving ? "保存中…" : "保存"}
              </button>
            </div>
          </form>

          <section className="card p-4">
            <h2 className="mb-3 text-sm font-semibold">配送先</h2>
            {o.shippingAddress1 == null ? (
              <p className="text-sm text-ink-3">消去済み</p>
            ) : (
              <address className="space-y-0.5 text-sm not-italic">
                <div className="font-medium">{o.shippingName ?? "-"}</div>
                <div>{o.shippingAddress1}</div>
                {o.shippingAddress2 ? <div>{o.shippingAddress2}</div> : null}
                <div>
                  {[o.shippingCity, o.shippingState, o.shippingPostal].filter(Boolean).join(", ")}
                </div>
                <div>{o.shippingCountry ?? o.country}</div>
                {o.shippingPhone ? <div className="text-ink-2">TEL {o.shippingPhone}</div> : null}
              </address>
            )}
            <div className="mt-3 border-t border-line pt-3">
              <button
                type="button"
                className="btn-ghost btn-sm w-full"
                disabled={o.status !== "SHIPPED" || purging}
                onClick={purgePii}
              >
                {purging ? "消去中…" : "個人情報を消去"}
              </button>
              <p className="mt-1 text-xs text-ink-3">配送が完了した注文は個人情報を消去してください</p>
              {purgeMsg ? (
                <div className="mt-2">
                  <Notice kind="error">{purgeMsg}</Notice>
                </div>
              ) : null}
            </div>
          </section>

          <section className="card p-4">
            <h2 className="mb-3 text-sm font-semibold">情報</h2>
            <Row label="国">{o.country}</Row>
            <Row label="数量">{o.quantity.toLocaleString()} 個</Row>
            <Row label="作成">{dateTime(o.createdAt)}</Row>
            <Row label="更新">{dateTime(o.updatedAt)}</Row>
          </section>
        </div>
      </div>
    </div>
  );
}

function Preview({ label, keyName }: { label: string; keyName?: string }) {
  return (
    <div>
      <div className="label">{label}</div>
      {keyName ? (
        <a href={`/api/assets/${keyName}`} target="_blank" rel="noopener noreferrer" className="block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/assets/${keyName}`}
            alt={`${label}プレビュー`}
            className="max-h-48 w-full rounded-lg border border-line bg-bg-muted object-contain"
          />
        </a>
      ) : (
        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-line text-xs text-ink-3">
          なし
        </div>
      )}
    </div>
  );
}
