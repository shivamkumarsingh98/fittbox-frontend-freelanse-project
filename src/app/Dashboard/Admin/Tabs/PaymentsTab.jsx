import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getAnalytics } from "../../../api/admin";

// Lightweight local chart component (mirrors OverviewTab)
function RevenueChart({ data, title, type = "bar", theme }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.Chart) {
      setReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/chart.js";
    script.async = true;
    script.onload = () => setReady(true);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!ready || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (chartRef.current) chartRef.current.destroy();

    const labels = (data || []).map((_, i) => `${i + 1}`);
    const palette = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4"];

    chartRef.current = new window.Chart(ctx, {
      type,
      data: {
        labels,
        datasets: [
          {
            label: title,
            data: data || [],
            backgroundColor: (data || []).map((_, i) => palette[i % palette.length] + (type === "bar" ? "80" : "")),
            borderColor: (data || []).map((_, i) => palette[i % palette.length]),
            borderWidth: 2,
            tension: 0.3,
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: "#f3f4f6" } } } },
    });

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [ready, data, title, type]);

  return (
    <div className="w-full rounded-2xl p-5 shadow-sm bg-white border border-neutral-200/80 hover:shadow-md transition duration-200">
      <div className="text-sm font-bold text-neutral-700 mb-4">{title}</div>
      <div className="h-40">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

// Small PaymentsTab extracted from page.js
export default function PaymentsTab({ theme, analyticsData }) {
  const adminToken = useSelector((s) => s.adminAuth?.token);
  const [messageUser, setMessageUser] = useState(null);
  const [localAnalytics, setLocalAnalytics] = useState(analyticsData || null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(!analyticsData);

  // Keep local copy in sync with parent-provided analytics
  useEffect(() => {
    if (analyticsData) {
      setLocalAnalytics(analyticsData);
      setLoadingAnalytics(false);
    }
  }, [analyticsData]);

  // Fetch analytics if not provided (PaymentsTab used standalone)
  useEffect(() => {
    if (analyticsData || !adminToken) return;
    let cancelled = false;
    const fetchAnalytics = async () => {
      try {
        setLoadingAnalytics(true);
        const data = await getAnalytics(adminToken);
        if (!cancelled) {
          const payload = data?.data || data || null;
          setLocalAnalytics(payload);
        }
      } catch (err) {
        if (!cancelled) console.error("PaymentsTab analytics fetch failed:", err);
      } finally {
        if (!cancelled) setLoadingAnalytics(false);
      }
    };
    fetchAnalytics();
    return () => {
      cancelled = true;
    };
  }, [analyticsData, adminToken]);

  const data = analyticsData || localAnalytics;

  if (loadingAnalytics || !data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm animate-pulse">
              <div className="h-4 bg-neutral-200 rounded w-32 mb-3"></div>
              <div className="h-40 bg-neutral-100 rounded"></div>
            </div>
          ))}
        </div>
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm animate-pulse">
          <div className="h-6 bg-neutral-200 rounded w-40 mb-4"></div>
          {[...Array(4)].map((_, i) => (<div key={i} className="h-4 bg-neutral-100 rounded w-48 mb-3"></div>))}
        </div>
      </div>
    );
  }

  const weekRev = data.revenue?.week || 0;
  const fifteenDaysRev = data.revenue?.fifteenDays || 0;
  const monthRev = data.revenue?.month || 0;
  const allTimeRev = data.revenue?.allTime || 0;

  const revenueSeries = { week: [weekRev], days15: [fifteenDaysRev], month: [monthRev] };

  const expiringSubscriptions = data.expiringSubscriptions || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChart data={revenueSeries.week} title="Revenue (Week)" theme={theme} />
        <RevenueChart data={revenueSeries.days15} title="Revenue (15 Days)" theme={theme} />
        <RevenueChart data={revenueSeries.month} title="Revenue (Month)" type="line" theme={theme} />
      </div>

      <div className="rounded-2xl p-6 bg-white border border-neutral-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-neutral-800">Revenue Summary</h3>
          <div className="text-xs text-neutral-400 font-medium bg-neutral-100 px-3 py-1 rounded-full">Updated just now</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/60"><div className="text-xs font-semibold text-neutral-500">Week</div><div className="text-xl font-bold text-neutral-800 mt-1">₹{weekRev.toLocaleString()}</div></div>
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/60"><div className="text-xs font-semibold text-neutral-500">15 Days</div><div className="text-xl font-bold text-neutral-800 mt-1">₹{fifteenDaysRev.toLocaleString()}</div></div>
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/60"><div className="text-xs font-semibold text-neutral-500">Month</div><div className="text-xl font-bold text-neutral-800 mt-1">₹{monthRev.toLocaleString()}</div></div>
          <div className="p-4 rounded-xl bg-red-50/60 border border-red-100"><div className="text-xs font-semibold text-red-700">All Time</div><div className="text-2xl font-bold text-red-600 mt-1">₹{allTimeRev.toLocaleString()}</div></div>
        </div>
      </div>

      <div className="rounded-2xl p-6 bg-white border border-neutral-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-neutral-800">Expiring Subscriptions — Next 5 Days</h3>
          <div className="text-xs font-semibold text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">{expiringSubscriptions.length} expiring</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-auto">
          {expiringSubscriptions.length > 0 ? (
            expiringSubscriptions.map((u, i) => (
              <div key={i} className="p-4 rounded-xl flex items-center gap-4 bg-white border border-neutral-200/80 shadow-sm hover:shadow-md transition duration-200">
                <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center bg-red-50 text-red-600 font-bold border border-red-100">{String(u.userName || u.user || "U").split(" ").map((p) => p[0]).slice(0, 2).join("")}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-neutral-800 truncate">{u.userName || u.user || "-"}</div>
                    <div className="text-sm font-bold text-neutral-800">₹{Number(u.totalAmount || 0).toLocaleString()}</div>
                  </div>
                  <div className="text-xs text-neutral-500 truncate mt-0.5">{u.userPhone || u.phone || "-"} • {u.mealName || u.plan || "-"}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full inline-block mb-1">{u.daysRemaining} days left</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <button onClick={() => setMessageUser(u)} className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-black text-white text-xs font-medium transition shadow-sm">Notify</button>
                    <button onClick={() => alert("Renew request sent (demo)")} className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition shadow-sm">Renew</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-neutral-500 text-center py-6 col-span-2">No subscriptions expiring soon</div>
          )}
        </div>
      </div>

      {messageUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between"><h3 className="text-lg font-bold text-neutral-800">Message {messageUser.userName || messageUser.user || messageUser.email}</h3><button className="text-neutral-500 hover:text-neutral-800 text-lg font-semibold" onClick={() => setMessageUser(null)}>✕</button></div>
            <textarea className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-neutral-800 bg-white" rows={5} placeholder="Type your message..." />
            <div className="flex gap-2 justify-end"><button className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-4 py-2 rounded-xl transition" onClick={() => setMessageUser(null)}>Cancel</button><button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition font-semibold" onClick={() => { alert("Message sent (demo)"); setMessageUser(null); }}>Send</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
