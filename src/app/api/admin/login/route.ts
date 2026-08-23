import { readJson } from "@/lib/readJson";
import { NextResponse } from "next/server";
import { isAllowedEmail, setAdminSession } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await readJson(req);
  const email = String(body?.email ?? "").trim().toLowerCase();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });
  if (!(await isAllowedEmail(email))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await setAdminSession(email);
  return NextResponse.json({ success: true });
}
