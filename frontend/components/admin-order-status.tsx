"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AdminOrderStatusProps {
  orderId: string;
  currentStatus: string;
}

const statusOptions = ["pending", "shipped", "delivered", "cancelled"];

export default function AdminOrderStatus({ orderId, currentStatus }: AdminOrderStatusProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  async function updateStatus() {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: selectedStatus }),
      });

      const result = await response.json();
      if (!response.ok) {
        setMessage(result.error ?? "Failed to update order status.");
      } else {
        setMessage("Status updated.");
        router.refresh();
      }
    } catch (error) {
      setMessage("Unable to update order status.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={selectedStatus}
        onChange={(event) => setSelectedStatus(event.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 focus:border-sky-500 focus:outline-none transition-colors"
      >
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {status.toUpperCase()}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={updateStatus}
        disabled={loading || selectedStatus === currentStatus}
        className="rounded-full bg-slate-900 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
      >
        {loading ? "..." : "Save"}
      </button>
      {message && <p className="text-[10px] font-bold text-emerald-600">{message}</p>}
    </div>
  );
}
