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
    const palette = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#22c55e", "#06b6d4"];

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
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: "#eee" } } } },
    });

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [ready, data, title, type]);

  return (
    <div className={`w-full rounded-xl p-4 shadow transition-all duration-300 ${theme === "dark" ? "bg-neutral-800 border border-neutral-700" : "bg-white"}`}>
      <div className="text-sm font-semibold mb-2">{title}</div>
      <div className="h-36">
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
            <div key={i} className={`${theme === "dark" ? "bg-neutral-800 border-neutral-700" : "bg-white border"} rounded-xl p-4 animate-pulse`}>
              <div className="h-4 bg-neutral-600 rounded w-32 mb-3"></div>
              <div className="h-40 bg-neutral-600 rounded"></div>
            </div>
          ))}
        </div>
        <div className={`${theme === "dark" ? "bg-neutral-800 border-neutral-700" : "bg-white border"} rounded-xl p-4 animate-pulse`}>
          <div className="h-6 bg-neutral-600 rounded w-40 mb-4"></div>
          {[...Array(4)].map((_, i) => (<div key={i} className="h-4 bg-neutral-600 rounded w-48 mb-3"></div>))}
        </div>
        <div className={`${theme === "dark" ? "bg-neutral-800 border-neutral-700" : "bg-white border"} rounded-xl p-4 animate-pulse`}>
          <div className="h-6 bg-neutral-600 rounded w-56 mb-4"></div>
          {[...Array(3)].map((_, i) => (<div key={i} className="py-3 border-b"><div className="h-4 bg-neutral-600 rounded w-32 mb-2"></div><div className="h-3 bg-neutral-600 rounded w-24"></div></div>))}
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

      <div className={`rounded-xl p-4 ${theme === "dark" ? "bg-neutral-900 border border-neutral-800 text-white" : "bg-white border"}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Revenue Summary</h3>
          <div className="text-sm text-neutral-500">Updated just now</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-neutral-800 border border-neutral-700" : "bg-neutral-50 border"}`}><div className="text-xs text-neutral-500">Week</div><div className="text-xl font-bold mt-1">₹{weekRev.toLocaleString()}</div></div>
          <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-neutral-800 border border-neutral-700" : "bg-neutral-50 border"}`}><div className="text-xs text-neutral-500">15 Days</div><div className="text-xl font-bold mt-1">₹{fifteenDaysRev.toLocaleString()}</div></div>
          <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-neutral-800 border border-neutral-700" : "bg-neutral-50 border"}`}><div className="text-xs text-neutral-500">Month</div><div className="text-xl font-bold mt-1">₹{monthRev.toLocaleString()}</div></div>
          <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-gradient-to-br from-amber-900 to-amber-800 text-amber-100" : "bg-amber-50"}`}><div className="text-xs">All Time</div><div className="text-2xl font-bold mt-1">₹{allTimeRev.toLocaleString()}</div></div>
        </div>
      </div>

      <div className={`rounded-xl p-4 ${theme === "dark" ? "bg-neutral-900 border border-neutral-800 text-white" : "bg-white border"}`}>
        <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold">Expiring Subscriptions — Next 5 Days</h3><div className="text-sm text-neutral-500">{expiringSubscriptions.length} expiring</div></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-auto">
          {expiringSubscriptions.length > 0 ? (
            expiringSubscriptions.map((u, i) => (
              <div key={i} className={`p-4 rounded-lg flex items-center gap-4 ${theme === "dark" ? "bg-neutral-800 border border-neutral-700" : "bg-white border border-neutral-200"}`}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-rose-100 to-rose-200 text-rose-700 font-bold">{String(u.userName || u.user || "U").split(" ").map((p) => p[0]).slice(0, 2).join("")}</div>
                <div className="flex-1 min-w-0"><div className="flex items-center justify-between"><div className="font-medium truncate">{u.userName || u.user || "-"}</div><div className="text-sm text-neutral-400">₹{Number(u.totalAmount || 0).toLocaleString()}</div></div><div className="text-xs text-neutral-500 truncate">{u.userPhone || u.phone || "-"} • {u.mealName || u.plan || "-"}</div></div>
                <div className="text-right"><div className="text-sm font-semibold text-amber-600">{u.daysRemaining} days</div><div className="flex items-center gap-2 mt-2"><button onClick={() => setMessageUser(u)} className="px-3 py-1 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700">Notify</button><button onClick={() => alert("Renew request sent (demo)")} className="px-3 py-1 rounded-md bg-amber-600 text-white text-sm hover:bg-amber-700">Renew</button></div></div>
              </div>
            ))
          ) : (
            <div className="text-sm text-neutral-500">No subscriptions expiring soon</div>
          )}
        </div>
      </div>

      {messageUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${theme === "dark" ? "bg-neutral-800 text-white" : "bg-white"} rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl border ${theme === "dark" ? "border-neutral-700" : "border-neutral-200"}`}>
            <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">Message {messageUser.userName || messageUser.user || messageUser.email}</h3><button className={`${theme === "dark" ? "text-neutral-400 hover:text-white" : "text-neutral-500 hover:text-black"}`} onClick={() => setMessageUser(null)}>✕</button></div>
            <textarea className={`w-full border rounded p-2 text-sm ${theme === "dark" ? "bg-neutral-900 border-neutral-700" : ""}`} rows={5} placeholder="Type your message..." />
            <div className="flex gap-2 justify-end"><button className={`${theme === "dark" ? "bg-neutral-700 hover:bg-neutral-600 text-white" : "bg-neutral-100 hover:bg-neutral-200"} px-4 py-2 rounded`} onClick={() => setMessageUser(null)}>Cancel</button><button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded" onClick={() => { alert("Message sent (demo)"); setMessageUser(null); }}>Send</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
