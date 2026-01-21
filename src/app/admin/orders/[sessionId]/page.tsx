// src/app/admin/orders/[sessionId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

const VALID_STATUSES = ["PENDING", "IN_PRODUCTION", "QC", "PACKED", "SHIPPED"] as const;
type ValidStatus = (typeof VALID_STATUSES)[number];

function StatusSelector({
  currentStatus,
  sessionId,
  onStatusChange,
}: {
  currentStatus: string;
  sessionId: string;
  onStatusChange: (status: string) => void;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [updating, setUpdating] = useState(false);

  async function handleStatusUpdate() {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${sessionId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          status,
          trackingNumber: status === "SHIPPED" ? trackingNumber : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data?.error ?? "Failed to update status");
        return;
      }

      onStatusChange(status);
      alert("Status updated successfully");
    } catch (e: any) {
      alert(e?.message ?? "Failed to update status");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-slate-400"
          disabled={updating}
        >
          {VALID_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          onClick={handleStatusUpdate}
          disabled={updating || status === currentStatus}
          className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          {updating ? "Updating..." : "Update"}
        </button>
      </div>
      {status === "SHIPPED" && (
        <div>
          <input
            type="text"
            placeholder="Tracking Number"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-slate-400"
          />
        </div>
      )}
      <span
        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
          status === "PENDING"
            ? "bg-yellow-100 text-yellow-800"
            : status === "IN_PRODUCTION"
              ? "bg-blue-100 text-blue-800"
              : status === "QC"
                ? "bg-purple-100 text-purple-800"
                : status === "PACKED"
                  ? "bg-indigo-100 text-indigo-800"
                  : status === "SHIPPED"
                    ? "bg-green-100 text-green-800"
                    : "bg-slate-100 text-slate-800"
        }`}
      >
        {status}
      </span>
    </div>
  );
}

interface OrderDetail {
  id: string;
  sessionId: string;
  createdAt: number;
  status: string;
  quantity: number;
  shippingName: string;
  shippingPhone: string | null;
  customerEmail: string | null;
  shippingAddress: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  metadata: {
    text: string;
    bgColor: string;
    fontColor: string;
    backText: string;
    backBgColor: string;
    backFontColor: string;
    enableBack: boolean;
    font: string;
  };
  dutiesAck: boolean;
  trackingNumber: string | null;
  specLinks: {
    html: string;
    pdf: string;
  };
}

export default function AdminOrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (sessionId) {
      loadOrderDetail();
    }
  }, [sessionId]);

  async function loadOrderDetail() {
    try {
      const res = await fetch(`/api/admin/orders/${sessionId}`, {
        credentials: "include",
      });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) {
        const data = await res.json();
        setError(data?.error ?? "Failed to load order detail");
        return;
      }
      const data = await res.json();
      setOrder(data);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load order detail");
    } finally {
      setLoading(false);
    }
  }

  function formatDate(timestamp: number) {
    return new Date(timestamp * 1000).toLocaleString();
  }


  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">Loading...</div>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error || "Order not found"}
          </div>
          <Link
            href="/admin/orders"
            className="mt-4 inline-block text-blue-600 hover:text-blue-800"
          >
            ← Back to Orders
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link
              href="/admin/orders"
              className="mb-2 inline-block text-sm text-blue-600 hover:text-blue-800"
            >
              ← Back to Orders
            </Link>
            <h1 className="text-2xl font-semibold text-slate-900">Order Detail</h1>
          </div>
        </div>

        <div className="space-y-6">
          {/* Order Info */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Order Information</h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-slate-500">Order ID</dt>
                <dd className="mt-1 font-mono text-sm text-slate-900">{order.sessionId}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Date</dt>
                <dd className="mt-1 text-sm text-slate-900">{formatDate(order.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Quantity</dt>
                <dd className="mt-1 text-sm text-slate-900">{order.quantity}</dd>
              </div>
              {order.trackingNumber && (
                <div>
                  <dt className="text-sm font-medium text-slate-500">Tracking Number</dt>
                  <dd className="mt-1 text-sm text-slate-900">{order.trackingNumber}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-slate-500">Status</dt>
                <dd className="mt-1">
                  <StatusSelector
                    currentStatus={order.status}
                    sessionId={order.sessionId}
                    onStatusChange={(newStatus) => {
                      setOrder({ ...order, status: newStatus });
                    }}
                  />
                </dd>
              </div>
            </dl>
          </div>

          {/* Shipping Address */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Shipping Address</h2>
            <div className="text-sm text-slate-900">
              {order.shippingName && <div className="font-medium mb-2">{order.shippingName}</div>}
              <div className="mt-2 space-y-1">
                {order.shippingAddress.line1 && (
                  <div>{order.shippingAddress.line1}</div>
                )}
                {order.shippingAddress.line2 && (
                  <div>{order.shippingAddress.line2}</div>
                )}
                {(order.shippingAddress.city || order.shippingAddress.state || order.shippingAddress.postal_code) && (
                  <div>
                    {[
                      order.shippingAddress.city,
                      order.shippingAddress.state,
                      order.shippingAddress.postal_code,
                    ].filter(Boolean).join(", ")}
                  </div>
                )}
                {order.shippingAddress.country && (
                  <div>{order.shippingAddress.country}</div>
                )}
                {order.shippingPhone && (
                  <div className="mt-2">
                    <span className="font-medium text-slate-500">Phone: </span>
                    {order.shippingPhone}
                  </div>
                )}
                {order.customerEmail && (
                  <div>
                    <span className="font-medium text-slate-500">Email: </span>
                    {order.customerEmail}
                  </div>
                )}
                {!order.shippingAddress.line1 && 
                 !order.shippingAddress.city && 
                 !order.shippingAddress.country && (
                  <div className="text-slate-400">-</div>
                )}
              </div>
            </div>
          </div>

          {/* Design Details */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Design Details</h2>
            <div className="space-y-3">
              {/* Front Design */}
              <div className="flex items-center gap-3 text-sm">
                <span className="font-medium text-slate-500">Front:</span>
                <span className="text-slate-900">{order.metadata.text || "-"}</span>
                <span className="text-slate-400">｜</span>
                <span className="text-slate-900">{order.metadata.bgColor}</span>
                <span
                  className="h-4 w-4 rounded border border-slate-300"
                  style={{ backgroundColor: order.metadata.bgColor }}
                />
                <span className="text-slate-400">｜</span>
                <span className="text-slate-900">{order.metadata.fontColor}</span>
                <span
                  className="h-4 w-4 rounded border border-slate-300"
                  style={{ backgroundColor: order.metadata.fontColor }}
                />
                <span className="text-slate-400">｜</span>
                <span className="text-slate-900">
                  {order.metadata.font === "inter" ? "Inter" : order.metadata.font === "noto-sans" ? "Noto Sans" : order.metadata.font === "noto-serif" ? "Noto Serif" : order.metadata.font || "Inter"}
                </span>
              </div>
              {/* Back Design */}
              {order.metadata.enableBack && (
                <div className="flex items-center gap-3 text-sm">
                  <span className="font-medium text-slate-500">Back:</span>
                  <span className="text-slate-900">{order.metadata.backText || "-"}</span>
                  <span className="text-slate-400">｜</span>
                  <span className="text-slate-900">{order.metadata.backBgColor}</span>
                  <span
                    className="h-4 w-4 rounded border border-slate-300"
                    style={{ backgroundColor: order.metadata.backBgColor }}
                  />
                  <span className="text-slate-400">｜</span>
                  <span className="text-slate-900">{order.metadata.backFontColor}</span>
                  <span
                    className="h-4 w-4 rounded border border-slate-300"
                    style={{ backgroundColor: order.metadata.backFontColor }}
                  />
                  <span className="text-slate-400">｜</span>
                  <span className="text-slate-900">
                    {order.metadata.font === "inter" ? "Inter" : order.metadata.font === "noto-sans" ? "Noto Sans" : order.metadata.font || "Inter"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Specification Links */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Production Specification</h2>
            <div className="flex flex-wrap gap-3">
              <a
                href={order.specLinks.html}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                View HTML
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

