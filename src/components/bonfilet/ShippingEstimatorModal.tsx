// src/components/bonfilet/ShippingEstimatorModal.tsx
"use client";

import React, { useMemo, useState } from "react";
import { MIN_QTY, normalizeQty } from "@/lib/bonfiletPricing";
import {
  getZoneByCountry,
  calculateShipping,
  getQuantityBand,
  type ShippingZone,
} from "@/lib/shippingPricing";
import { SORTED_COUNTRIES } from "@/lib/countries";
import { type BonfiletLocale, getBonfiletTexts } from "@/lib/i18n/bonfilet";

interface ShippingEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentQuantity: number;
  locale: BonfiletLocale;
}

export default function ShippingEstimatorModal({
  isOpen,
  onClose,
  currentQuantity,
  locale,
}: ShippingEstimatorModalProps) {
  const t = getBonfiletTexts(locale);

  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(currentQuantity);

  const zone = useMemo<ShippingZone | null>(() => {
    if (!selectedCountry) return null;
    return getZoneByCountry(selectedCountry);
  }, [selectedCountry]);

  const shippingCost = useMemo<number | null>(() => {
    if (!zone) return null;
    return calculateShipping(zone, quantity);
  }, [zone, quantity]);

  const quantityBand = useMemo<string | null>(() => {
    if (!zone) return null;
    return getQuantityBand(zone, quantity);
  }, [zone, quantity]);

  if (!isOpen) return null;

  const normalizedQty = normalizeQty(quantity);

  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">
              {t.shippingEstimator}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 transition hover:text-slate-600"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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

          <div className="space-y-4">
            {/* 国選択 */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                {t.selectCountry}
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              >
                <option value="">{t.selectCountry}</option>
                {SORTED_COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 数量入力 */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                {t.quantity} (min {MIN_QTY})
              </label>
              <input
                type="number"
                min={MIN_QTY}
                step={1}
                value={quantity}
                onChange={(e) =>
                  setQuantity(normalizeQty(Number(e.target.value)))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            {/* 送料計算結果 */}
            {selectedCountry && zone && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                {shippingCost !== null ? (
                  <>
                    <div className="mb-2 text-sm text-slate-600">
                      {t.estimatedShipping}:
                    </div>
                    <div className="text-2xl font-semibold text-slate-900">
                      ${shippingCost.toLocaleString()} USD
                    </div>
                    {quantityBand && (
                      <div className="mt-2 text-xs text-slate-500">
                        {t.quantityBand}: {quantityBand}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-sm text-slate-600">
                    {t.contactForQuote}
                  </div>
                )}
              </div>
            )}

            {/* アクションボタン */}
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                {t.close || "Close"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


