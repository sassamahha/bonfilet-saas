// src/components/bonfilet/BonfiletDesigner.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MIN_QTY,
  getUnitPriceUSD,
  calcTaxIncludedTotalUSD,
  normalizeQty,
} from "@/lib/bonfiletPricing";
import {
  type BonfiletLocale,
  getBonfiletTexts,
  BONFILET_LOCALES,
} from "@/lib/i18n/bonfilet";
import {
  type CurrencyCode,
  CURRENCIES,
  convertUSDToCurrency,
  getStripeAmount,
} from "@/lib/currency";
import { BAND_RECT_RATIO, BAND_RECT_RATIO_BACK } from "@/lib/bonfiletConfig";
import {
  getDeliveredPricingUSD,
  US_STATES,
  type USState,
} from "@/lib/bonfiletShipping";
import SpecPreviewModal from "./SpecPreviewModal";
import DutiesDetailModal from "./DutiesDetailModal";
import { useRouter } from "next/navigation";

// 3フォントに整理（ENベースの見え方で統一）
const FONT_OPTIONS = [
  { value: "inter", label: "Inter" },
  { value: "noto-sans", label: "Noto Sans" },
  { value: "noto-serif", label: "Noto Serif" },
] as const;

type FontValue = (typeof FONT_OPTIONS)[number]["value"];

const FONT_FAMILY_MAP: Record<FontValue, string> = {
  inter:
    "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  "noto-sans":
    "'Noto Sans', 'Noto Sans JP', system-ui, -apple-system, 'Segoe UI', sans-serif",
  "noto-serif":
    "'Noto Serif', 'Noto Serif JP', 'Times New Roman', serif",
};

function getBandRect(w: number, h: number) {
  return {
    x: Math.round(w * BAND_RECT_RATIO.x),
    y: Math.round(h * BAND_RECT_RATIO.y),
    width: Math.round(w * BAND_RECT_RATIO.width),
    height: Math.round(h * BAND_RECT_RATIO.height),
  };
}

function countFullWidthChars(str: string) {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 0xff) count++;
  }
  return count;
}

function calcTextCount(text: string) {
  const full = countFullWidthChars(text);
  const half = text.length - full;
  return full * 2 + half; // 全角は2文字、半角は1文字としてカウント
}

const MAX_TEXT_LENGTH = 40; // 最大40文字

function getBandRectBack(w: number, h: number) {
  return {
    x: Math.round(w * BAND_RECT_RATIO_BACK.x),
    y: Math.round(h * BAND_RECT_RATIO_BACK.y),
    width: Math.round(w * BAND_RECT_RATIO_BACK.width),
    height: Math.round(h * BAND_RECT_RATIO_BACK.height),
  };
}

async function buildPreviewDataUrl(params: {
  text: string;
  bgColor: string;
  fontName: FontValue;
  fontColor: string;
  enableBack?: boolean;
  backText?: string;
  backBgColor?: string;
  backFontColor?: string;
}) {
  const {
    text,
    bgColor,
    fontName,
    fontColor,
    enableBack,
    backText,
    backBgColor,
    backFontColor,
  } = params;

  // @ts-ignore
  if (document?.fonts?.ready) {
    // @ts-ignore
    await document.fonts.ready;
  }

  const img = new Image();
  img.src = "/bonfilet/bonfilet_base.png";
  await img.decode();

  const baseWidth = img.naturalWidth;
  const baseHeight = img.naturalHeight;

  // Back sideが有効な場合は高さを2倍にする
  const canvasHeight =
    enableBack && backText && backText.trim() ? baseHeight * 2 : baseHeight;

  const canvas = document.createElement("canvas");
  canvas.width = baseWidth;
  canvas.height = canvasHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context error");

  // 1) Front ベース画像（上半分）
  ctx.drawImage(img, 0, 0);

  // 2) Front プリント帯
  const band = getBandRect(baseWidth, baseHeight);
  ctx.save();
  ctx.fillStyle = bgColor;
  ctx.fillRect(band.x, band.y, band.width, band.height);
  ctx.restore();

  // 3) Front テキスト
  const fontFamily = FONT_FAMILY_MAP[fontName];

  let fontSize = Math.floor(band.height * 0.55);
  const maxWidth = band.width * 0.9;

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = fontColor;

  while (fontSize > 10) {
    ctx.font = `${fontSize}px ${fontFamily}`;
    const w = ctx.measureText(text).width;
    if (w <= maxWidth) break;
    fontSize -= 2;
  }

  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillText(text, band.x + band.width / 2, band.y + band.height / 2);

  // 4) Back side (if enabled)
  if (enableBack && backText && backText.trim()) {
    // Back ベース画像（下半分に描画）
    ctx.drawImage(img, 0, baseHeight);

    // Back プリント帯
    const bandBack = getBandRectBack(baseWidth, baseHeight);
    const bandBackY = baseHeight + bandBack.y; // Y座標をオフセット

    ctx.save();
    ctx.fillStyle = backBgColor || "#cccccc";
    ctx.fillRect(bandBack.x, bandBackY, bandBack.width, bandBack.height);
    ctx.restore();

    let fontSizeBack = Math.floor(bandBack.height * 0.55);
    const maxWidthBack = bandBack.width * 0.9;

    ctx.fillStyle = backFontColor || "#000000";

    while (fontSizeBack > 10) {
      ctx.font = `${fontSizeBack}px ${fontFamily}`;
      const w = ctx.measureText(backText).width;
      if (w <= maxWidthBack) break;
      fontSizeBack -= 2;
    }

    ctx.font = `${fontSizeBack}px ${fontFamily}`;
    ctx.fillText(
      backText,
      bandBack.x + bandBack.width / 2,
      bandBackY + bandBack.height / 2
    );
  }

  return canvas.toDataURL("image/png");
}

export default function BonfiletDesigner({
  locale,
}: {
  locale: BonfiletLocale;
}) {
  const t = getBonfiletTexts(locale);

  const [text, setText] = useState("");
  const [fontName, setFontName] = useState<FontValue>("inter");
  const [bgColor, setBgColor] = useState("#cccccc");
  const [fontColor, setFontColor] = useState("#000000");

  const [enableBack, setEnableBack] = useState(false);
  const [backText, setBackText] = useState("");
  const [backBgColor, setBackBgColor] = useState("#cccccc");
  const [backFontColor, setBackFontColor] = useState("#000000");

  const router = useRouter();
  const [quantity, setQuantity] = useState<number>(MIN_QTY);
  const [quantityInput, setQuantityInput] = useState<string>(String(MIN_QTY));
  const [currency, setCurrency] = useState<CurrencyCode>(
    locale === "ja" ? "jpy" : "usd"
  ); // ja以外はUSD

  const [previewSrc, setPreviewSrc] = useState<string>(
    "/bonfilet/bonfilet_base.png"
  );
  const [loading, setLoading] = useState(false);
  const [showSpecModal, setShowSpecModal] = useState(false);
  const [showDutiesDetailModal, setShowDutiesDetailModal] = useState(false);
  const [dutyAccepted, setDutyAccepted] = useState(false);

  // Ship to（国）: ロケールに応じたデフォルト
  const [shipCountry, setShipCountry] = useState<string>(() => {
    switch (locale) {
      case "ja":
        return "JP";
      case "es":
        return "MX";
      case "pt":
        return "BR";
      case "fr":
        return "FR";
      case "de":
        return "DE";
      case "it":
        return "IT";
      default:
        return "US";
    }
  });

  // US州選択（US選択時のみ使用）
  const [usState, setUsState] = useState<string>("");

  const debounceRef = useRef<number | null>(null);

  const textCount = useMemo(() => calcTextCount(text), [text]);
  const isTextOver = textCount > MAX_TEXT_LENGTH;
  const backTextCount = useMemo(() => calcTextCount(backText), [backText]);
  const isBackTextOver = backTextCount > MAX_TEXT_LENGTH;

  // DBから有効な国一覧を取得
  const [availableCountries, setAvailableCountries] = useState<
    Array<{ code: string; name: string }>
  >([]);

  useEffect(() => {
    fetch("/api/countries")
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`countries API failed: ${res.status}\n${text}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAvailableCountries(data);
          // デフォルト国が利用可能な国に含まれていない場合、USにフォールバック
          const currentCountry = shipCountry;
          const isCurrentAvailable = data.some((c) => c.code === currentCountry);
          if (!isCurrentAvailable) {
            // USが利用可能ならUS、そうでなければ最初の国
            const usCountry = data.find((c) => c.code === "US");
            setShipCountry(usCountry ? "US" : data[0].code);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to fetch countries:", err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 初回のみ実行

  const priceInfo = useMemo(() => {
    const q = normalizeQty(quantity);

    // USD基準でDelivered価格（送料込）を計算
    const delivered = getDeliveredPricingUSD({
      quantity: q,
      countryCode: shipCountry,
      stateCode: shipCountry === "US" ? usState : null,
      hasBackSide: enableBack,
    });
    const unitUSD = delivered.deliveredUnitUSD;
    const totalUSD = delivered.deliveredTotalUSD;
    const productUnitUSD = delivered.productUnitUSD;
    const productTotalUSD = delivered.productTotalUSD;
    const shippingUSD = delivered.shippingUSD;

    const currencyInfo = CURRENCIES.find((c) => c.code === currency);
    const symbol = currencyInfo?.symbol ?? "$";
    const stripeMinUnit = currencyInfo?.stripeMinUnit ?? 100;

    // Stripeと同じロジックで金額（最小単位）を算出
    const unitAmountInCurrency = convertUSDToCurrency(unitUSD, currency);
    const shippingInCurrency = convertUSDToCurrency(shippingUSD, currency);
    const unitAmountForStripe = getStripeAmount(unitAmountInCurrency, currency);
    const shippingAmountForStripe = getStripeAmount(shippingInCurrency, currency);

    const productTotalStripe = unitAmountForStripe * q; // 最小単位（例: cents）
    const totalStripe = productTotalStripe + shippingAmountForStripe;

    // Stripe最小単位から通貨単位に戻した「素の金額」
    const unitInCurrency = unitAmountForStripe / stripeMinUnit;
    const productTotalInCurrency = productTotalStripe / stripeMinUnit;
    const shippingInCurrencyRounded = shippingAmountForStripe / stripeMinUnit;
    const totalInCurrency = totalStripe / stripeMinUnit;

    // 表示用に丸める（JPYは整数、その他は小数点2桁）
    const decimals = currency === "jpy" ? 0 : 2;
    const unitDisp =
      Math.round(unitInCurrency * Math.pow(10, decimals)) / Math.pow(10, decimals);
    const productTotalDisp =
      Math.round(productTotalInCurrency * Math.pow(10, decimals)) /
      Math.pow(10, decimals);
    const shippingDisp =
      Math.round(shippingInCurrencyRounded * Math.pow(10, decimals)) /
      Math.pow(10, decimals);
    const totalDisp =
      Math.round(totalInCurrency * Math.pow(10, decimals)) / Math.pow(10, decimals);

    return {
      unitUSD,
      totalUSD,
      unitInCurrency,
      totalInCurrency,
      productUnitUSD,
      productTotalUSD,
      shippingUSD,
      productTotalInCurrency,
      shippingInCurrency: shippingInCurrencyRounded,
      displayUnit: `${symbol}${unitDisp.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}`,
      displayTotal: `${symbol}${totalDisp.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}`,
      displayProduct: `${symbol}${productTotalDisp.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}`,
      displayShipping: `${symbol}${shippingDisp.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}`,
    };
  }, [quantity, currency, enableBack, shipCountry, usState]);

  // 言語切替ハンドラー
  const handleLanguageChange = (newLocale: BonfiletLocale) => {
    if (newLocale === locale) return;
    const path = newLocale === "en" ? "/order" : `/${newLocale}/order`;
    router.push(path);
  };

  // 入力変更で自動プレビュー（0.8s）
  useEffect(() => {
    if (!text.trim() || isTextOver) return;
    if (enableBack && (!backText.trim() || isBackTextOver)) return;

    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      void generatePreview();
    }, 800);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    text,
    bgColor,
    fontColor,
    fontName,
    enableBack,
    backText,
    backBgColor,
    backFontColor,
  ]);

  async function generatePreview() {
    if (!text.trim()) {
      setPreviewSrc("/bonfilet/bonfilet_base.png");
      return;
    }
    if (isTextOver) return;
    if (enableBack && isBackTextOver) return;

    try {
      setLoading(true);
      const dataUrl = await buildPreviewDataUrl({
        text,
        bgColor,
        fontName,
        fontColor,
        enableBack,
        backText,
        backBgColor,
        backFontColor,
      });
      setPreviewSrc(dataUrl);
    } catch (e: any) {
      alert(t.previewError + ": " + (e?.message ?? String(e)));
    } finally {
      setLoading(false);
    }
  }

  async function goCheckout() {
    if (!text.trim()) {
      alert(t.textRequired);
      return;
    }
    if (isTextOver) {
      alert(t.textTooLong);
      return;
    }
    if (enableBack && (isBackTextOver || !backText.trim())) {
      if (isBackTextOver) {
        alert(t.backTextTooLong);
      } else {
        alert(t.backTextRequired);
      }
      return;
    }

    const q = normalizeQty(quantity);
    if (q < MIN_QTY) {
      alert(t.qtyMin);
      return;
    }

    // 仕様書確認モーダルを表示
    setShowSpecModal(true);
  }

  async function confirmSpecAndProceed() {
    setShowSpecModal(false);

    const q = normalizeQty(quantity);

    try {
      setLoading(true);

      // Stripe metadataには画像を載せられない（500文字制限）ので、先にDraftとして保存してdraftIdだけ渡す
      const designJson = JSON.stringify({
        text,
        bgColor,
        fontColor,
        backText,
        backBgColor,
        backFontColor,
        enableBack,
        font: fontName,
      });

      // フロントのみ画像
      const frontPreviewImage = await buildPreviewDataUrl({
        text,
        bgColor,
        fontName,
        fontColor,
        enableBack: false,
      });

      // バックのみ画像（裏面がある場合）
      let backPreviewImage: string | undefined = undefined;
      if (enableBack && backText.trim()) {
        backPreviewImage = await buildPreviewDataUrl({
          text: backText,
          bgColor: backBgColor,
          fontName,
          fontColor: backFontColor,
          enableBack: false,
        });
      }

      const draftRes = await fetch("/api/order-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          frontPreviewImage,
          backPreviewImage: backPreviewImage ?? null,
          designJson,
        }),
      });
      const draftData = await draftRes.json();
      if (!draftRes.ok) {
        throw new Error(draftData?.error ?? "Failed to create order draft");
      }
      const draftId = String(draftData?.draftId ?? "");
      if (!draftId) throw new Error("draftId missing");

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          bgColor,
          font: fontName,
          fontColor,
          quantity: q,
          currency,
          enableBack,
          backText,
          backBgColor,
          backFontColor,
          lang: locale, // 言語情報を送信
          countryCode: shipCountry, // 国コードを送信
          stateCode: shipCountry === "US" ? usState : null, // USの場合は州コードも送信
          dutiesAck: dutyAccepted, // 関税同意を送信
          draftId, // 画像はDraftに保存し、StripeにはdraftIdだけ渡す
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? t.checkoutError);

      if (data?.url) {
        window.location.href = data.url as string;
      } else {
        throw new Error(t.stripeUrlError);
      }
    } catch (e: any) {
      alert(t.paymentError + ": " + (e?.message ?? String(e)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="mx-auto max-w-5xl px-4 py-10">
        {/* Header with Language Selector */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            {t.title}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-300">Language</span>
            <select
              className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm text-white outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-500"
              value={locale}
              onChange={(e) => handleLanguageChange(e.target.value as BonfiletLocale)}
            >
              {/* 英語と日本語のみをドロップダウンに表示 */}
              <option value="en">English</option>
              <option value="ja">日本語</option>
            </select>
          </div>
        </div>

        {/* Preview */}
        <div className="rounded-3xl bg-white shadow-xl ring-1 ring-black/5">
          <div className="p-6 text-center sm:p-8">
            <img
              src={previewSrc}
              alt="Bonfilet Preview"
              className="mx-auto block h-auto w-full max-w-4xl select-none"
              draggable={false}
            />

            <button
              type="button"
              onClick={generatePreview}
              disabled={loading || !text.trim() || isTextOver}
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t.previewUpdate}
            </button>
          </div>
        </div>

        {/* Customize */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Text */}
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              {t.textSection}
            </h2>

            <label className="mb-1 block text-sm font-medium text-slate-700">
              {t.textLabel}
            </label>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t.textPlaceholder}
            />

            <div
              className={`mt-1 text-xs ${
                isTextOver ? "text-red-600" : "text-slate-500"
              }`}
            >
              {textCount}/{MAX_TEXT_LENGTH}
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                {t.fontLabel}
              </label>
              <select
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                value={fontName}
                onChange={(e) => setFontName(e.target.value as FontValue)}
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Back side toggle */}
            <div className="mt-6 border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">
                  {t.backSideLabel}
                </label>
                <button
                  type="button"
                  onClick={() => setEnableBack(!enableBack)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    enableBack ? "bg-emerald-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      enableBack ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {enableBack && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      {t.backTextLabel}
                    </label>
                    <input
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                      value={backText}
                      onChange={(e) => setBackText(e.target.value)}
                      placeholder={t.backTextPlaceholder}
                    />
                    <div
                      className={`mt-1 text-xs ${
                        isBackTextOver ? "text-red-600" : "text-slate-500"
                      }`}
                    >
                      {backTextCount}/{MAX_TEXT_LENGTH}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Colors */}
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              {t.colorSection}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  {t.bgColor} ({t.frontSide})
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-10 w-14 cursor-pointer rounded-md border border-slate-300 bg-white p-1"
                  />
                  <span
                    className="inline-block h-7 w-7 rounded-full border border-slate-300"
                    style={{ background: bgColor }}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  {t.fontColor} ({t.frontSide})
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={fontColor}
                    onChange={(e) => setFontColor(e.target.value)}
                    className="h-10 w-14 cursor-pointer rounded-md border border-slate-300 bg-white p-1"
                  />
                  <span
                    className="inline-block h-7 w-7 rounded-full border border-slate-300"
                    style={{ background: fontColor }}
                  />
                </div>
              </div>

              {enableBack && (
                <>
                  <div className="mt-4 border-t border-slate-200 pt-4">
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      {t.bgColor} ({t.backSide})
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={backBgColor}
                        onChange={(e) => setBackBgColor(e.target.value)}
                        className="h-10 w-14 cursor-pointer rounded-md border border-slate-300 bg-white p-1"
                      />
                      <span
                        className="inline-block h-7 w-7 rounded-full border border-slate-300"
                        style={{ background: backBgColor }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      {t.fontColor} ({t.backSide})
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={backFontColor}
                        onChange={(e) => setBackFontColor(e.target.value)}
                        className="h-10 w-14 cursor-pointer rounded-md border border-slate-300 bg-white p-1"
                      />
                      <span
                        className="inline-block h-7 w-7 rounded-full border border-slate-300"
                        style={{ background: backFontColor }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Order */}
        <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">
              {t.orderSection}
            </h2>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">
                {t.currency}
              </span>
              <select
                className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                {t.selectCountry}
              </label>
              <select
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                value={shipCountry}
                onChange={(e) => {
                  setShipCountry(e.target.value);
                  // US以外に変更したら州選択をリセット
                  if (e.target.value !== "US") {
                    setUsState("");
                  }
                }}
              >
                {availableCountries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* US選択時のみ州ドロップダウンを表示 */}
            {shipCountry === "US" && (
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  {locale === "ja" ? "州" : "State"}
                </label>
                <select
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  value={usState}
                  onChange={(e) => setUsState(e.target.value)}
                >
                  <option value="">
                    {locale === "ja" ? "州を選択" : "Select State"}
                  </option>
                  {US_STATES.map((state) => (
                    <option key={state.code} value={state.code}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                {t.qtyLabel}
              </label>
              <input
                type="number"
                min={MIN_QTY}
                step={1}
                value={quantityInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setQuantityInput(val);
                  if (val === "" || isNaN(Number(val))) {
                    return; // 入力中はそのまま保持
                  }
                  const num = Number(val);
                  if (num >= MIN_QTY) {
                    setQuantity(normalizeQty(num));
                  }
                }}
                onBlur={(e) => {
                  const val = e.target.value;
                  if (val === "" || isNaN(Number(val)) || Number(val) < MIN_QTY) {
                    setQuantityInput(String(MIN_QTY));
                    setQuantity(MIN_QTY);
                  } else {
                    const normalized = normalizeQty(Number(val));
                    setQuantityInput(String(normalized));
                    setQuantity(normalized);
                  }
                }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div className="md:col-span-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-slate-700">
                    {t.total}:
                  </span>
                  <span className="text-2xl font-bold text-red-600">
                    {priceInfo.displayTotal}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 重要注意ボックス */}
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h3 className="mb-2 text-sm font-semibold text-slate-700">
              {t.dutiesNoticeTitle}
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {t.dutiesNoticeItems.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="mt-0.5 text-slate-400">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setShowDutiesDetailModal(true)}
              className="mt-2 text-xs text-slate-600 underline transition hover:text-slate-800"
            >
              {t.dutiesDetailLink}
            </button>
          </div>

          {/* チェックボックス */}
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <label className="flex items-start gap-2 text-xs text-slate-700">
              <input
                type="checkbox"
                checked={dutyAccepted}
                onChange={(e) => setDutyAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>{t.dutiesCheckboxText}</span>
            </label>
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={goCheckout}
              disabled={
                loading ||
                !text.trim() ||
                isTextOver ||
                (enableBack && (isBackTextOver || !backText.trim())) ||
                !dutyAccepted
              }
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t.confirmOrder}
            </button>
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 z-[9999] grid place-items-center bg-black/50">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white" />
        </div>
      )}

      {/* Spec Preview Modal */}
      <SpecPreviewModal
        isOpen={showSpecModal}
        onClose={() => setShowSpecModal(false)}
        onProceed={confirmSpecAndProceed}
        locale={locale}
        frontPreviewImage={previewSrc}
        backPreviewImage={undefined}
        text={text}
        backText={enableBack ? backText : undefined}
        bgColor={bgColor}
        fontColor={fontColor}
        backBgColor={enableBack ? backBgColor : undefined}
        backFontColor={enableBack ? backFontColor : undefined}
        quantity={quantity}
        enableBack={enableBack}
      />

      {/* Duties Detail Modal */}
      <DutiesDetailModal
        isOpen={showDutiesDetailModal}
        onClose={() => setShowDutiesDetailModal(false)}
        locale={locale}
      />
    </div>
  );
}
