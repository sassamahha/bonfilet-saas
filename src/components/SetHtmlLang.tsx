"use client";
// <html lang> はルートレイアウト固定のため、ロケール付きページでクライアント側から上書きする
import { useEffect } from "react";

export default function SetHtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
