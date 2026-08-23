// src/lib/readJson.ts — Request body を緩く読む（workers-types では json() が unknown）
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Loose = Record<string, any>;

export async function readJson(req: Request): Promise<Loose> {
  try {
    const v = await req.json();
    return v && typeof v === "object" ? (v as Loose) : {};
  } catch {
    return {};
  }
}
