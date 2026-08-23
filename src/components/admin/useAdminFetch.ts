"use client";
// src/components/admin/useAdminFetch.ts — 管理 API 呼び出し。401 なら /admin/login へ
import { useCallback } from "react";
import { useRouter } from "next/navigation";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type Init = Omit<RequestInit, "body"> & { json?: unknown };

export function useAdminFetch() {
  const router = useRouter();
  return useCallback(
    async <T = unknown>(url: string, init: Init = {}): Promise<T> => {
      const { json, headers, ...rest } = init;
      const res = await fetch(url, {
        ...rest,
        credentials: "same-origin",
        cache: "no-store",
        headers: {
          ...(json !== undefined ? { "Content-Type": "application/json" } : {}),
          ...(headers as Record<string, string> | undefined),
        },
        body: json !== undefined ? JSON.stringify(json) : undefined,
      });
      if (res.status === 401) {
        router.push("/admin/login");
        throw new ApiError(401, "ログインが必要です");
      }
      const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      if (!res.ok) throw new ApiError(res.status, String(data?.error ?? `HTTP ${res.status}`));
      return data as T;
    },
    [router]
  );
}

export function errorMessage(e: unknown) {
  return e instanceof Error ? e.message : String(e);
}
