// src/app/[lang]/bonfilet/success/page.tsx
import { redirect } from "next/navigation";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { lang } = await params;
  const { session_id } = await searchParams;
  const sessionId = session_id ? `?session_id=${session_id}` : "";
  redirect(`/${lang}/order/success${sessionId}`);
}
