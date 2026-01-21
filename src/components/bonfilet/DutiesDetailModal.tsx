// src/components/bonfilet/DutiesDetailModal.tsx
"use client";

import { getBonfiletTexts, type BonfiletLocale } from "@/lib/i18n/bonfilet";

interface DutiesDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: BonfiletLocale;
}

export default function DutiesDetailModal({
  isOpen,
  onClose,
  locale,
}: DutiesDetailModalProps) {
  const t = getBonfiletTexts(locale);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center bg-black/50 p-4">
      <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 transition hover:text-slate-600"
          aria-label="Close"
        >
          <svg
            className="h-6 w-6"
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

        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          {t.dutiesDetailTitle}
        </h2>

        <ul className="space-y-2 text-sm text-slate-700">
          {t.dutiesDetailItems.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="mt-1 text-slate-400">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}

