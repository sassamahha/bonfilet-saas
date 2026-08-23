// GET /api/admin/orders?page=1&status=PENDING
import { NextResponse } from "next/server";
import { desc, eq, sql } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { adminRoute } from "@/lib/adminRoute";

export const dynamic = "force-dynamic";

type Status = typeof schema.orders.$inferSelect.status;

export const GET = adminRoute(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);
  const limit = 50;
  const status = searchParams.get("status") as Status | null;
  const db = await getDb();
  const where = status ? eq(schema.orders.status, status) : undefined;

  const [rows, countRows] = await Promise.all([
    db
      .select()
      .from(schema.orders)
      .where(where)
      .orderBy(desc(schema.orders.createdAt))
      .limit(limit)
      .offset((page - 1) * limit),
    db.select({ count: sql<number>`count(*)` }).from(schema.orders).where(where),
  ]);
  return NextResponse.json({ orders: rows, total: Number(countRows[0]?.count ?? 0), page, limit });
});
