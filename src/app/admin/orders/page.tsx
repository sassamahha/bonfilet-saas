// src/app/admin/orders/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Order {
  id: string;
  sessionId: string;
  createdAt: number;
  status: string;
  quantity: number;
  text: string;
  bgColor: string;
  fontColor: string;
  enableBack: boolean;
  backText: string;
  backBgColor: string;
  backFontColor: string;
  shippingAddress: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const res = await fetch("/api/admin/orders", {
        credentials: "include", // Cookieを送信するために必要
      });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) {
        const data = await res.json();
        setError(data?.error ?? "Failed to load orders");
        return;
      }
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (e) {
      console.error("Logout error:", e);
    }
  }

  function formatDate(timestamp: number) {
    return new Date(timestamp * 1000).toLocaleString();
  }

  function formatShippingAddress(address: Order["shippingAddress"]) {
    if (!address) return "-";
    
    const parts = [];
    
    // 住所1
    if (address.line1) parts.push(address.line1);
    
    // 住所2（存在する場合）
    if (address.line2) parts.push(address.line2);
    
    // 市区町村、州、郵便番号を1行にまとめる
    const cityStatePostal = [
      address.city,
      address.state,
      address.postal_code,
    ].filter(Boolean).join(", ");
    
    if (cityStatePostal) parts.push(cityStatePostal);
    
    // 国
    if (address.country) parts.push(address.country);
    
    return parts.length > 0 ? parts.join(", ") : "-";
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">Loading...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">Orders</h1>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>
        )}

        {/* Orders Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
                  Quantity
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
                  Design
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
                  Shipping Address
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-mono text-slate-600">
                      {order.sessionId.substring(0, 20)}...
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          order.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "IN_PRODUCTION"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "QC"
                                ? "bg-purple-100 text-purple-800"
                                : order.status === "PACKED"
                                  ? "bg-indigo-100 text-indigo-800"
                                  : order.status === "SHIPPED"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{order.quantity}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      <div>
                        <div className="font-medium">Front: {order.text || "-"}</div>
                        {order.enableBack && order.backText && (
                          <div className="text-xs text-slate-500 mt-1">
                            Back: {order.backText}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className="inline-block h-4 w-4 rounded border border-slate-300"
                            style={{ backgroundColor: order.bgColor }}
                            title={`BG: ${order.bgColor}`}
                          />
                          <span
                            className="inline-block h-4 w-4 rounded border border-slate-300"
                            style={{ backgroundColor: order.fontColor }}
                            title={`Text: ${order.fontColor}`}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      <div className="max-w-xs truncate" title={formatShippingAddress(order.shippingAddress)}>
                        {formatShippingAddress(order.shippingAddress)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Link
                        href={`/admin/orders/${order.sessionId}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

