"use client";
// src/components/designer/Designer.tsx — v2 デザイナー（プレビュー主役 / 見積常時表示）
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FONT_OPTIONS, type FontValue } from "@/lib/fonts";
import { BAND_PRESETS, TEXT_PRESETS } from "@/lib/bonfiletConfig";
import { MAX_TEXT_LENGTH, MIN_QTY, type Tier } from "@/lib/bonfiletPricing";
import { buildQuote, type CountryRule } from "@/lib/quote";
import { convertFromJpy, formatMoney, toCurrencyCode } from "@/lib/currency";
import { drawSide, ensureFont, loadBaseImage, renderPreviewDataUrl } from "@/lib/render";
import type { V2Texts } from "@/lib/i18n/v2";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Loose = Record<string, any>;
type Config = { countries: CountryRule[]; tiers: Tier[]; minQty: number; usdJpyRate: number };

export default function Designer({
  locale,
  t,
  campaign,
  accent,
}: {
  locale: string;
  t: V2Texts["designer"];
  campaign?: string;
  accent?: string;
}) {
  const search = useSearchParams();
  const canceled = search.get("canceled") === "1";

  const [cfg, setCfg] = useState<Config | null>(null);
  const [cfgError, setCfgError] = useState<string | null>(null);

  const [side, setSide] = useState<"front" | "back">("front");
  const [text, setText] = useState("");
  const [font, setFont] = useState<FontValue>("inter");
  const [bgColor, setBgColor] = useState("#0A0A0A");
  const [fontColor, setFontColor] = useState("#FFFFFF");
  const [enableBack, setEnableBack] = useState(false);
  const [backText, setBackText] = useState("");
  const [backBgColor, setBackBgColor] = useState("#E60012");
  const [backFontColor, setBackFontColor] = useState("#FFFFFF");

  const [country, setCountry] = useState("");
  const [qtyInput, setQtyInput] = useState(String(MIN_QTY));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const frontRef = useRef<HTMLCanvasElement>(null);
  const backRef = useRef<HTMLCanvasElement>(null);

  // ---- config
  useEffect(() => {
    const url = campaign ? `/api/countries?campaign=${encodeURIComponent(campaign)}` : "/api/countries";
    fetch(url)
      .then(async (r) => {
        if (!r.ok) throw new Error(((await r.json().catch(() => ({}))) as Loose)?.error ?? "config error");
        return r.json() as Promise<Config>;
      })
      .then((c) => {
        setCfg(c);
        setQtyInput(String(c.minQty));
        const preferred = locale === "ja" ? "JP" : "US";
        const first = c.countries.find((x) => x.code === preferred) ?? c.countries[0];
        if (first) setCountry(first.code);
      })
      .catch((e) => setCfgError(e.message));
  }, [campaign, locale]);

  // ---- live preview
  const draw = useCallback(async () => {
    const img = await loadBaseImage();
    await ensureFont(font, text + backText);
    if (frontRef.current) drawSide(frontRef.current, img, { text, font, bgColor, fontColor }, 0.6);
    if (backRef.current)
      drawSide(backRef.current, img, { text: backText, font, bgColor: backBgColor, fontColor: backFontColor }, 0.6);
    // enableBack はキャンバスの差し替えトリガー
  }, [text, font, bgColor, fontColor, backText, backBgColor, backFontColor, enableBack]);

  useEffect(() => {
    const id = window.setTimeout(() => void draw(), 60);
    return () => window.clearTimeout(id);
  }, [draw]);

  // ---- quote
  const minQty = cfg?.minQty ?? MIN_QTY;
  const quantity = Math.max(minQty, Math.floor(Number(qtyInput) || 0));
  const rule = useMemo(() => cfg?.countries.find((c) => c.code === country) ?? null, [cfg, country]);
  const quote = useMemo(
    () => (rule ? buildQuote({ quantity, hasBack: enableBack, rule, tiers: cfg?.tiers, minQty }) : null),
    [rule, quantity, enableBack, cfg, minQty]
  );
  const cur = toCurrencyCode(rule?.currencyDisplay);
  const rate = cfg?.usdJpyRate ?? 150;
  const money = (jpy: number) => formatMoney(convertFromJpy(jpy, cur, rate), cur);

  const textLen = (s: string) => s.length;
  const frontValid = text.trim().length > 0 && textLen(text) <= MAX_TEXT_LENGTH;
  const backValid = !enableBack || (backText.trim().length > 0 && textLen(backText) <= MAX_TEXT_LENGTH);
  const canCheckout = !!cfg && !!rule && frontValid && backValid && !busy;

  // ---- checkout
  async function checkout() {
    if (!canCheckout || !rule) return;
    setBusy(true);
    setError(null);
    try {
      const frontPreviewImage = await renderPreviewDataUrl({ text, font, bgColor, fontColor });
      const backPreviewImage = enableBack
        ? await renderPreviewDataUrl({ text: backText, font, bgColor: backBgColor, fontColor: backFontColor })
        : null;
      const design = { text, font, bgColor, fontColor, enableBack, backText, backBgColor, backFontColor };

      const d = await fetch("/api/order-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frontPreviewImage, backPreviewImage, designJson: JSON.stringify(design) }),
      });
      const dj = (await d.json()) as Loose;
      if (!d.ok) throw new Error(dj?.error ?? "draft error");

      const r = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...design,
          quantity,
          countryCode: rule.code,
          lang: locale,
          draftId: dj.draftId,
          campaign: campaign ?? "",
        }),
      });
      const rj = (await r.json()) as Loose;
      if (!r.ok || !rj?.url) throw new Error(rj?.error ?? "checkout error");
      window.location.href = rj.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "error");
      setBusy(false);
    }
  }

  const accentStyle = accent ? ({ "--accent": accent } as React.CSSProperties) : undefined;

  const activeText = side === "front" ? text : backText;
  const setActiveText = side === "front" ? setText : setBackText;
  const activeBg = side === "front" ? bgColor : backBgColor;
  const setActiveBg = side === "front" ? setBgColor : setBackBgColor;
  const activeFg = side === "front" ? fontColor : backFontColor;
  const setActiveFg = side === "front" ? setFontColor : setBackFontColor;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-12" style={accentStyle}>
      {/* ---- Preview ---- */}
      <section className="lg:sticky lg:top-24 lg:self-start">
        <div className="card overflow-hidden bg-bg-muted p-4 sm:p-8">
          <div className="flex flex-col gap-4">
            <figure className={side === "front" || !enableBack ? "" : "opacity-40"}>
              <canvas ref={frontRef} className="w-full rounded-lg" aria-label="Front preview" />
              <figcaption className="mt-2 text-center text-xs font-medium uppercase tracking-wide text-ink-3">
                {t.frontLabel}
              </figcaption>
            </figure>
            {enableBack && (
              <figure className={side === "back" ? "" : "opacity-40"}>
                <canvas ref={backRef} className="w-full rounded-lg" aria-label="Back preview" />
                <figcaption className="mt-2 text-center text-xs font-medium uppercase tracking-wide text-ink-3">
                  {t.backLabel}
                </figcaption>
              </figure>
            )}
          </div>
        </div>
      </section>

      {/* ---- Controls ---- */}
      <section className="flex flex-col gap-6">
        {canceled && <p className="rounded-lg bg-bg-muted px-4 py-3 text-sm text-ink-2">Payment canceled.</p>}

        {/* side tabs */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-full border border-line p-1">
            {(["front", "back"] as const).map((s) => (
              <button
                key={s}
                type="button"
                disabled={s === "back" && !enableBack}
                onClick={() => setSide(s)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition disabled:opacity-30 ${
                  side === s ? "bg-ink text-white" : "text-ink-2 hover:text-ink"
                }`}
              >
                {s === "front" ? t.frontLabel : t.backLabel}
              </button>
            ))}
          </div>
          <label className="ml-auto flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={enableBack}
              onChange={(e) => {
                setEnableBack(e.target.checked);
                if (!e.target.checked) setSide("front");
              }}
              className="h-4 w-4 accent-[var(--accent)]"
            />
            <span>{t.addBack}</span>
            <span className="text-xs text-ink-3">{t.backAdd}</span>
          </label>
        </div>

        {/* message */}
        <div>
          <label className="label" htmlFor="msg">
            {t.message}
            <span className="ml-2 normal-case tracking-normal text-ink-3">
              {textLen(activeText)}/{MAX_TEXT_LENGTH}
            </span>
          </label>
          <input
            id="msg"
            className="input text-base"
            value={activeText}
            maxLength={MAX_TEXT_LENGTH}
            onChange={(e) => setActiveText(e.target.value)}
            placeholder={side === "front" ? "Start before you're ready" : "Team 2026"}
          />
        </div>

        {/* font */}
        <div>
          <span className="label">{t.font}</span>
          <div className="flex flex-wrap gap-2">
            {FONT_OPTIONS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFont(f.value)}
                style={{ fontFamily: f.family }}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  font === f.value ? "border-ink bg-ink text-white" : "border-line hover:border-ink"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* colors */}
        <div className="grid gap-5 sm:grid-cols-2">
          <ColorField label={t.band} value={activeBg} onChange={setActiveBg} presets={BAND_PRESETS} />
          <ColorField label={t.text} value={activeFg} onChange={setActiveFg} presets={TEXT_PRESETS} />
        </div>

        <hr className="border-line" />

        {/* destination + qty */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="country">
              {t.destination}
            </label>
            {cfg && cfg.countries.length === 0 ? (
              <p className="text-sm text-ink-2">{t.noCountries}</p>
            ) : (
              <select id="country" className="select" value={country} onChange={(e) => setCountry(e.target.value)}>
                {cfg?.countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="label" htmlFor="qty">
              {t.quantity}
              <span className="ml-2 normal-case tracking-normal text-ink-3">
                {t.min} {minQty}
              </span>
            </label>
            <input
              id="qty"
              className="input"
              type="number"
              inputMode="numeric"
              min={minQty}
              value={qtyInput}
              onChange={(e) => setQtyInput(e.target.value)}
              onBlur={() => setQtyInput(String(quantity))}
            />
          </div>
        </div>

        {/* summary */}
        <div className="card p-5">
          <h3 className="mb-3 text-sm font-semibold">{t.summary}</h3>
          {cfgError && <p className="text-sm text-red-600">{cfgError}</p>}
          {quote ? (
            <dl className="space-y-2 text-sm">
              <Row k={`${t.unit} × ${quote.quantity}`} v={money(quote.unitJpy + quote.backAdditionJpy)} muted />
              <Row k={t.product} v={money(quote.subtotalJpy)} />
              <Row k={t.shipping} v={money(quote.shippingJpy + quote.dutiesJpy)} />
              <div className="my-2 border-t border-line" />
              <Row k={t.total} v={money(quote.totalJpy)} strong />
            </dl>
          ) : (
            <p className="text-sm text-ink-3">{t.preparing}</p>
          )}
          {rule && rule.shipping.length > 0 && (
            <p className="mt-3 text-xs text-ink-3">
              {t.bands}:{" "}
              {rule.shipping.map((b, i) => {
                const from = i === 0 ? minQty : rule.shipping[i - 1].upToQty + 1;
                const to = i === rule.shipping.length - 1 ? "" : String(b.upToQty);
                return (
                  <span key={b.upToQty} className="mr-2 whitespace-nowrap tabular-nums">
                    {from}–{to} {money(b.jpy)}
                  </span>
                );
              })}
            </p>
          )}
          {cur === "usd" && <p className="mt-1 text-xs text-ink-3">{t.rateNote.replace("{rate}", String(rate))}</p>}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="button" className="btn-accent w-full py-4 text-base" disabled={!canCheckout} onClick={checkout}>
          {busy ? t.preparing : t.checkout}
        </button>
      </section>
    </div>
  );
}

function Row({ k, v, strong, muted }: { k: string; v: string; strong?: boolean; muted?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between ${muted ? "text-ink-3" : ""}`}>
      <dt className={strong ? "font-semibold" : ""}>{k}</dt>
      <dd className={strong ? "text-lg font-semibold tabular-nums" : "tabular-nums"}>{v}</dd>
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
  presets,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  presets: readonly string[];
}) {
  return (
    <div>
      <span className="label">{label}</span>
      <div className="flex flex-wrap items-center gap-2">
        {presets.map((c) => (
          <button
            key={c}
            type="button"
            aria-label={c}
            className="swatch"
            style={{ background: c }}
            data-active={value.toLowerCase() === c.toLowerCase()}
            onClick={() => onChange(c)}
          />
        ))}
        <label className="swatch relative overflow-hidden" style={{ background: value }} title="Custom">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-[10px] font-bold mix-blend-difference text-white">
            +
          </span>
        </label>
      </div>
    </div>
  );
}

