import React, { useState, useEffect, useRef } from "react";

// Local copy of RevenueChart used by OverviewTab
function RevenueChart({ data, title, type = "bar", theme }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.Chart) {
      setReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/chart.js";
    script.async = true;
    script.onload = () => setReady(true);
    document.body.appendChild(script);
    return () => {};
  }, []);

  useEffect(() => {
    if (!ready || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (chartRef.current) chartRef.current.destroy();
    const labels = (data || []).map((_, i) => `${i + 1}`);
    const palette = [
      "#10b981",
      "#3b82f6",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
      "#22c55e",
      "#06b6d4",
    ];
    chartRef.current = new window.Chart(ctx, {
      type,
      data: {
        labels,
        datasets: [
          {
            label: title,
            data: data || [],
            backgroundColor: (data || []).map((_, i) =>
              palette[i % palette.length] + (type === "bar" ? "80" : "")
            ),
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

export default function OverviewTab({ theme, analyticsData }) {
  const [range, setRange] = useState("week");
  const [openUserId, setOpenUserId] = useState(null);
  const [pausedIdsLocal, setPausedIdsLocal] = useState(new Set());
  const [messageTo, setMessageTo] = useState(null);
  const [messageText, setMessageText] = useState("");

  const togglePauseLocal = (id) => {
    const next = new Set(pausedIdsLocal);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setPausedIdsLocal(next);
    alert((next.has(id) ? "Paused" : "Restarted") + " subscription (demo)");
  };

  const sendMessage = () => {
    alert(`Message sent to ${messageTo?.userName || "user"}: ${messageText}`);
    setMessageText("");
    setMessageTo(null);
  };

  if (!analyticsData) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`rounded-xl p-4 ${theme === "dark" ? "bg-neutral-800 border border-neutral-700" : "bg-white border"} animate-pulse`}>
              <div className="h-4 bg-neutral-600 rounded w-24 mb-3"></div>
              <div className="h-8 bg-neutral-600 rounded w-16"></div>
            </div>
          ))}
        </div>
        <div className={`${theme === "dark" ? "bg-neutral-800 border-neutral-700" : "bg-white border"} rounded-xl p-4 animate-pulse`}>
          <div className="h-6 bg-neutral-600 rounded w-24 mb-4"></div>
          <div className="h-40 bg-neutral-600 rounded"></div>
        </div>
        <div className={`${theme === "dark" ? "bg-neutral-800 border-neutral-700" : "bg-white border"} rounded-xl p-4 animate-pulse`}>
          <div className="h-6 bg-neutral-600 rounded w-32 mb-4"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="py-3 border-b">
              <div className="h-4 bg-neutral-600 rounded w-32 mb-2"></div>
              <div className="h-3 bg-neutral-600 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const totalUsers = analyticsData.totalUsers || 0;
  const activeSubs = analyticsData.totalSubscribers || 0;
  const totalRevenue = analyticsData.revenue?.allTime || 0;
  const newSubscribers = analyticsData.subscribers || [];

  const weekRevenue = analyticsData.revenue?.week || 0;
  const fifteenDaysRevenue = analyticsData.revenue?.fifteenDays || 0;
  const monthRevenue = analyticsData.revenue?.month || 0;

  const revenueSeries = { week: [weekRevenue], days15: [fifteenDaysRevenue], month: [monthRevenue] };

  return (
    <div className="space-y-8 text-slate-800">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-3xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-white border border-slate-100 flex flex-col justify-center min-h-[120px]">
          <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Total Users</div>
          <div className="text-3xl font-black mt-2 text-slate-900">{totalUsers}</div>
        </div>
        <div className="rounded-3xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-white border border-slate-100 flex flex-col justify-center min-h-[120px]">
          <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">New Subscribers</div>
          <div className="text-3xl font-black mt-2 text-red-600">{newSubscribers.length}</div>
        </div>
        <div className="rounded-3xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-white border border-slate-100 flex flex-col justify-center min-h-[120px]">
          <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Total Subscribers</div>
          <div className="text-3xl font-black mt-2 text-amber-600">{activeSubs}</div>
        </div>
        <div className="rounded-3xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-white border border-slate-100 flex flex-col justify-center min-h-[120px]">
          <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">All Time Revenue</div>
          <div className="text-3xl font-black mt-2 text-slate-900">₹{totalRevenue.toLocaleString()}</div>
        </div>
      </div>

      {/* Chart container */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-950">Revenue Analytics</h3>
          <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl">
            {[{ k: "week", l: "Week" }, { k: "days15", l: "15 Days" }, { k: "month", l: "Month" }].map((o) => (
              <button
                key={o.k}
                onClick={() => setRange(o.k)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  range === o.k
                    ? "bg-red-600 text-white shadow"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {o.l}
              </button>
            ))}
          </div>
        </div>
        <RevenueChart data={revenueSeries[range]} title={`Revenue (${range})`} type={range === "month" ? "line" : "bar"} theme={theme} />
      </div>

      {/* Active Subscribers Panel */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-950">Active Subscribers</h3>
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Latest</span>
        </div>

        <div className="divide-y divide-slate-100">
          {newSubscribers.length > 0 ? (
            newSubscribers.map((s, idx) => {
              const subs = Array.isArray(s.activeSubscriptions) ? s.activeSubscriptions : [];
              const first = subs.length > 0 ? subs[0] : null;
              const planName = first?.plan?.name || first?.mealName || first?.planType || "-";
              const amount = first?.totalAmount ?? (subs.length > 0 ? subs.reduce((sum, it) => sum + (Number(it.totalAmount) || 0), 0) : s.totalAmount || 0);
              const uid = s._id || `u-${idx}`;

              return (
                <div key={uid} className="py-4 flex flex-col md:flex-row md:items-center gap-4 justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center bg-red-50 text-red-600 font-bold text-lg shadow-inner">
                      {s.userName?.split(" ")[0]?.[0] || "U"}
                    </div>

                    <div className="flex-1 min-w-0 text-left">
                      <div className="font-bold text-slate-900 text-base">{s.userName}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{planName} • {s.userPhone}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 mt-2 md:mt-0">
                    <div className="text-base font-extrabold text-red-600">₹{Number(amount).toLocaleString()}</div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setOpenUserId(openUserId === uid ? null : uid)}
                        className={`p-2 rounded-xl border transition cursor-pointer ${
                          openUserId === uid ? "border-red-200 bg-red-50 text-red-600" : "border-slate-200 hover:bg-slate-50 text-slate-400"
                        }`}
                        aria-expanded={openUserId === uid}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {openUserId === uid && (
                    <div className="w-full mt-3 p-5 rounded-2xl border border-slate-100 bg-slate-50/50 shadow-inner md:col-span-full">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm font-bold text-slate-800">Meals Details ({subs.length})</div>
                        <div className="text-xs font-extrabold text-slate-500">Total: ₹{subs.reduce((sAcc, it) => sAcc + (Number(it.totalAmount) || 0), 0).toLocaleString()}</div>
                      </div>

                      <div className="space-y-3">
                        {subs.length > 0 ? (
                          subs.map((sub, k) => {
                            const title = sub.plan?.name || sub.mealName || sub.planType || "Plan";
                            const start = sub.startDate ? new Date(sub.startDate) : null;
                            const end = sub.endDate ? new Date(sub.endDate) : null;
                            const daysLeft = sub.remainingDays ?? (end ? Math.max(0, Math.ceil((end - Date.now()) / (1000 * 60 * 60 * 24))) : null);
                            return (
                              <div key={sub._id || k} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                                <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 text-red-600 font-bold">{String(title).split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>

                                <div className="flex-1 min-w-0 text-left">
                                  <div className="flex items-center gap-2">
                                    <div className="font-bold text-slate-900 truncate text-sm">{title}</div>
                                    {sub.plan?.type && <div className="text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{sub.plan.type}</div>}
                                  </div>
                                  <div className="text-[11px] text-slate-400 mt-1 truncate">{start ? start.toLocaleDateString() : "-"} {start && end ? "•" : ""} {end ? end.toLocaleDateString() : ""}</div>
                                </div>

                                <div className="flex flex-col items-end gap-1">
                                  <div className="text-sm font-black text-red-600">₹{Number(sub.totalAmount || 0).toLocaleString()}</div>
                                  <div className="text-xs text-slate-500 font-medium">{daysLeft != null ? `${daysLeft} days left` : "-"}</div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-sm text-slate-500 text-center py-4 bg-white rounded-xl border border-dashed border-slate-200">No meals found.</div>
                        )}
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2.5">
                        <button onClick={() => togglePauseLocal(uid)} className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl border border-slate-250 hover:bg-slate-100 text-slate-700 shadow-sm transition cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 19V5" /><path d="M18 19V5" /></svg>
                          <span>{pausedIdsLocal.has(uid) ? "Restart" : "Pause"}</span>
                        </button>

                        <button onClick={() => alert("Renew request sent (demo)")} className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-amber-600 text-white hover:bg-amber-700 shadow-sm transition cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10v6a2 2 0 0 1-2 2H7" /><path d="M3 6v6a2 2 0 0 0 2 2h12" /><path d="M7 10l5-5 5 5" /></svg>
                          <span>Renew</span>
                        </button>

                        <button onClick={() => setMessageTo(s)} className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-red-500/10 transition cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                          <span>Message</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-8 text-sm text-slate-500 text-center">No active subscriptions.</div>
          )}
        </div>

        {messageTo && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl p-6 bg-white shadow-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900">Message {messageTo.userName}</h3>
                <button className="text-slate-400 hover:text-slate-650 font-bold" onClick={() => setMessageTo(null)}>✕</button>
              </div>
              <textarea value={messageText} onChange={(e) => setMessageText(e.target.value)} rows={5} className="w-full p-4 rounded-2xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition resize-none" placeholder="Type your message..." />
              <div className="flex gap-2 justify-end mt-4">
                <button onClick={() => setMessageTo(null)} className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all duration-200 cursor-pointer">Cancel</button>
                <button onClick={() => { sendMessage(); }} className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 font-bold text-sm shadow-md hover:shadow-lg transition cursor-pointer">Send</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
