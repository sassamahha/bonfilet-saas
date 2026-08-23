// src/components/admin/format.ts — 表示用フォーマッタ
export function jpy(n: number | null | undefined) {
  if (n == null) return "-";
  return "¥" + n.toLocaleString("ja-JP");
}

export function charged(currency: string | null, amount: number | null) {
  if (!currency || amount == null) return "-";
  const c = currency.toLowerCase();
  if (c === "jpy") return "¥" + amount.toLocaleString("ja-JP");
  if (c === "usd") return "$" + (amount / 100).toFixed(2);
  return `${amount} ${currency.toUpperCase()}`;
}

export function dateTime(iso: string | null | undefined) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function shortId(id: string) {
  return id.length > 14 ? id.slice(0, 14) + "…" : id;
}

/** ISO → <input type="datetime-local"> 用 (ローカル時刻) */
export function toLocalInput(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** datetime-local → ISO (空なら null) */
export function fromLocalInput(v: string) {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export function safeParse<T>(json: string | null | undefined, fallback: T): T {
  if (!json) return fallback;
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}
