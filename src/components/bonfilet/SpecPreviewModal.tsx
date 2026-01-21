// src/components/bonfilet/SpecPreviewModal.tsx
"use client";

import React, { useMemo, useRef } from "react";
import { type BonfiletLocale, getBonfiletTexts } from "@/lib/i18n/bonfilet";
import {
  type SpecData,
  generateSpecHTML,
} from "@/lib/bonfiletSpecTemplate";
import { normalizeQty } from "@/lib/bonfiletPricing";
import html2canvas from "html2canvas";

interface SpecPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
  locale: BonfiletLocale;
  // 仕様書データ
  frontPreviewImage: string;
  backPreviewImage?: string;
  text: string;
  backText?: string;
  bgColor: string;
  fontColor: string;
  backBgColor?: string;
  backFontColor?: string;
  quantity: number;
  enableBack: boolean;
}

export default function SpecPreviewModal({
  isOpen,
  onClose,
  onProceed,
  locale,
  frontPreviewImage,
  backPreviewImage,
  text,
  backText,
  bgColor,
  fontColor,
  backBgColor,
  backFontColor,
  quantity,
  enableBack,
}: SpecPreviewModalProps) {
  const t = getBonfiletTexts(locale);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 仕様書HTMLを生成
  const specHTML = useMemo(() => {
    const specData: SpecData = {
      frontPreviewImage,
      backPreviewImage: enableBack && backPreviewImage ? backPreviewImage : undefined,
      text,
      backText: enableBack && backText ? backText : undefined,
      bgColor,
      fontColor,
      backBgColor: enableBack && backBgColor ? backBgColor : undefined,
      backFontColor: enableBack && backFontColor ? backFontColor : undefined,
      quantity: normalizeQty(quantity),
      // 注文者情報・配送先は空（Stripe Checkout後に取得）
    };
    // フロント側の確認モーダルでは Print ボタン不要
    return generateSpecHTML(specData, { showPrintButton: false });
  }, [
    frontPreviewImage,
    backPreviewImage,
    text,
    backText,
    bgColor,
    fontColor,
    backBgColor,
    backFontColor,
    quantity,
    enableBack,
  ]);

  // JPG保存機能
  async function handleSaveAsJPG() {
    if (!iframeRef.current) return;

    try {
      const iframe = iframeRef.current;
      const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDocument) {
        alert("Unable to access iframe content");
        return;
      }

      const body = iframeDocument.body;
      if (!body) {
        alert("Unable to access iframe body");
        return;
      }

      // html2canvasでCanvasに変換
      const canvas = await html2canvas(body, {
        backgroundColor: "#ffffff",
        scale: 2, // 高解像度
        useCORS: true,
        logging: false,
      });

      // CanvasをJPGに変換してダウンロード
      const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
      const link = document.createElement("a");
      link.download = `bonfilet-order-spec-${Date.now()}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (error: any) {
      alert(`Failed to save as JPG: ${error?.message ?? String(error)}`);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center bg-black/50 p-4">
      <div className="flex h-[90vh] w-full max-w-5xl flex-col rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-2xl font-semibold text-slate-900">
            {locale === "ja"
              ? "工場向け仕様書"
              : locale === "es"
                ? "Especificación de Producción"
                : locale === "pt"
                  ? "Especificação de Produção"
                  : locale === "fr"
                    ? "Spécification de Production"
                    : locale === "de"
                      ? "Produktionsspezifikation"
                      : locale === "it"
                        ? "Specifica di Produzione"
                        : "Production Specification"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label={t.close}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* HTML Content */}
        <div className="flex-1 overflow-auto p-6">
          <iframe
            ref={iframeRef}
            srcDoc={specHTML}
            className="h-full w-full border-0"
            title="Production Specification"
            sandbox="allow-same-origin"
          />
        </div>

        {/* Footer with Actions */}
        <div className="border-t border-slate-200 px-6 py-4">
          {/* JPG保存ボタンと注意書き */}
          <div className="mb-4 flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={handleSaveAsJPG}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
            >
              {t.saveAsJPG}
            </button>
            <p className="text-xs text-slate-500">{t.saveNotice}</p>
          </div>

          {/* アクションボタン */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              {t.cancel}
            </button>
            <button
              type="button"
              onClick={onProceed}
              className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
              {t.proceed}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

