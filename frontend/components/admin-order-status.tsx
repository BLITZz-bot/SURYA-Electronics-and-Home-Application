"use client";

import { useState } from "react";

interface AdminOrderStatusProps {
  orderId: string;
  currentStatus: string;
  onUpdate: () => void;
}

const statusOptions = ["pending", "shipped", "delivered", "cancelled"];

export default function AdminOrderStatus({ orderId, currentStatus, onUpdate }: AdminOrderStatusProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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
        setMessage("Order status updated.");
        onUpdate();
      }
    } catch (error) {
      setMessage("Unable to update order status.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <select
          value={selectedStatus}
          onChange={(event) => setSelectedStatus(event.target.value)}
          className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={updateStatus}
          disabled={loading}
          className="rounded-full bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {loading ? "Saving..." : "Update"}
        </button>
      </div>
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
    </div>
  );
}
