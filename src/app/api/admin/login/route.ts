import { readJson } from "@/lib/readJson";
import { NextResponse } from "next/server";
import { setAdminSession, verifyCredentials } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await readJson(req);
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });
  if (!(await verifyCredentials(email, password))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await setAdminSession(email);
  return NextResponse.json({ success: true });
}
