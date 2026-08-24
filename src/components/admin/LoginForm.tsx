"use client";
// src/components/admin/LoginForm.tsx — 管理者ログインフォーム
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Notice } from "@/components/admin/ui";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(res.status === 401 ? "メールアドレスまたはパスワードが正しくありません" : data.error ?? "ログインに失敗しました");
        return;
      }
      router.push("/admin/orders");
      router.refresh();
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto mt-16 max-w-sm">
      <div className="card p-6">
        <h1 className="mb-1 text-lg font-semibold tracking-tight">管理者ログイン</h1>
        <p className="mb-5 text-sm text-ink-2">メールアドレスとパスワードを入力してください。</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="label">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              required
              autoFocus
              autoComplete="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="label">
              パスワード
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error ? <Notice kind="error">{error}</Notice> : null}
          <button type="submit" className="btn-primary w-full" disabled={busy || !email || !password}>
            {busy ? "確認中…" : "ログイン"}
          </button>
        </form>
      </div>
    </div>
  );
}
