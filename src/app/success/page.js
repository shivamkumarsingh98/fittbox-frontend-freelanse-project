"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function SuccessPage() {
  const router = useRouter();
  const auth = useSelector((s) => s.auth);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("lastPayment");
      if (!raw) {
        // Nothing to show — navigate home
        toast("No payment details found", { icon: "ℹ️" });
        router.push("/");
        return;
      }
      const parsed = JSON.parse(raw);
      setData(parsed);
    } catch (err) {
      console.error(err);
      toast.error("Failed to read payment details");
      router.push("/");
    }
  }, [router]);

  if (!data) return null;

  const { order, subscription, payloads, payHistory } = data;

  const handleDone = () => {
    try {
      localStorage.removeItem("lastPayment");
    } catch (e) {}
    router.push("/Profile");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-neutral-50">
      <div className="w-full max-w-3xl bg-white rounded-xl p-6 shadow">
        <h1 className="text-2xl font-bold mb-2">Payment Successful</h1>
        <p className="text-sm text-neutral-600 mb-4">
          Thank you for your order. Below are the payment and subscription
          details.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="p-4 border rounded">
            <div className="text-xs text-neutral-500">Order ID</div>
            <div className="font-medium">
              {order?.id || order?.orderId || "—"}
            </div>
          </div>
          <div className="p-4 border rounded">
            <div className="text-xs text-neutral-500">Amount Paid</div>
            <div className="font-medium">
              ₹{(order?.amount || 0).toLocaleString()}
            </div>
          </div>
          <div className="p-4 border rounded">
            <div className="text-xs text-neutral-500">Subscription ID</div>
            <div className="font-medium">
              {subscription?._id || subscription?.id || "—"}
            </div>
          </div>
          <div className="p-4 border rounded">
            <div className="text-xs text-neutral-500">User</div>
            <div className="font-medium">{auth.user?.name || "—"}</div>
            <div className="text-sm text-neutral-500">
              {auth.user?.email || ""}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Items / Subscriptions</h3>
          <div className="space-y-2">
            {Array.isArray(payloads) && payloads.length > 0 ? (
              payloads.map((p, i) => (
                <div
                  key={i}
                  className="p-3 border rounded flex justify-between items-start"
                >
                  <div>
                    <div className="font-medium">
                      {p.planType} — {p.plan}
                    </div>
                    <div className="text-sm text-neutral-500">
                      Start: {new Date(p.startDate).toLocaleString()}
                    </div>
                    <div className="text-sm text-neutral-500">
                      End: {new Date(p.endDate).toLocaleString()}
                    </div>
                  </div>
                  <div className="font-semibold">
                    ₹{(p.totalAmount || 0).toFixed(2)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-neutral-500">
                No item details available.
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded border"
          >
            Print
          </button>
          <button
            onClick={handleDone}
            className="px-4 py-2 rounded bg-emerald-600 text-white"
          >
            Go to Profile
          </button>
        </div>
      </div>
    </div>
  );
}
