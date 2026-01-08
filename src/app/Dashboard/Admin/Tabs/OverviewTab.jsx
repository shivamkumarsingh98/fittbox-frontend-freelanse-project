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
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`rounded-xl p-4 text-center shadow transition-all duration-300 hover:-translate-y-1 ${theme === "dark" ? "bg-neutral-800" : "bg-white"}`}>
          <div className="text-xl text-neutral-500">Total Users</div>
          <div className="text-2xl font-bold mt-1">{totalUsers}</div>
        </div>
        <div className={`rounded-xl p-4 text-center shadow transition-all duration-300 hover:-translate-y-1 ${theme === "dark" ? "bg-neutral-800 border border-neutral-700" : "bg-white"}`}>
          <div className="text-xl text-neutral-500">New Subscribers</div>
          <div className="text-2xl font-bold mt-1 text-emerald-600">{newSubscribers.length}</div>
        </div>
        <div className={`rounded-xl p-4 text-center shadow transition-all duration-300 hover:-translate-y-1 ${theme === "dark" ? "bg-neutral-800 border border-neutral-700" : "bg-white"}`}>
          <div className="text-xl text-neutral-500">Total Subscriber</div>
          <div className="text-2xl font-bold mt-1 text-amber-600">{activeSubs}</div>
        </div>
        <div className={`rounded-xl p-4 text-center shadow transition-all duration-300 hover:-translate-y-1 ${theme === "dark" ? "bg-neutral-800 border border-neutral-700" : "bg-white"}`}>
          <div className="text-xl text-neutral-500">All Time Revenue</div>
          <div className="text-3xl text-blue-500 font-bold mt-1">₹{totalRevenue.toLocaleString()}</div>
        </div>
      </div>

      <div className={`shadow transition-all duration-300 hover:-translate-y-1 ${theme === "dark" ? "bg-neutral-800 border-neutral-700" : "bg-white"} rounded-xl p-4`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Revenue</h3>
          <div className="flex gap-2">
            {[{ k: "week", l: "Week" }, { k: "days15", l: "15 Days" }, { k: "month", l: "Month" }].map((o) => (
              <button key={o.k} onClick={() => setRange(o.k)} className={`px-3 py-1 rounded text-sm ${range === o.k ? "bg-red-600 text-white" : "bg-blue-500"}`}>
                {o.l}
              </button>
            ))}
          </div>
        </div>
        <RevenueChart data={revenueSeries[range]} title={`Revenue (${range})`} type={range === "month" ? "line" : "bar"} theme={theme} />
      </div>

      <div className={`shadow transition-all duration-300 ${theme === "dark" ? "bg-neutral-800 border-neutral-700" : "bg-white"} rounded-xl p-4`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Active Subscribers</h3>
          <span className="text-sm text-neutral-500">Latest</span>
        </div>

        <div className="divide-y">
          {newSubscribers.length > 0 ? (
            newSubscribers.map((s, idx) => {
              const subs = Array.isArray(s.activeSubscriptions) ? s.activeSubscriptions : [];
              const first = subs.length > 0 ? subs[0] : null;
              const planName = first?.plan?.name || first?.mealName || first?.planType || "-";
              const amount = first?.totalAmount ?? (subs.length > 0 ? subs.reduce((sum, it) => sum + (Number(it.totalAmount) || 0), 0) : s.totalAmount || 0);
              const uid = s._id || `u-${idx}`;

              return (
                <div key={uid} className="py-3 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold text-lg">{s.userName?.split(" ")[0]?.[0] || "U"}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="font-medium truncate text-sm">{s.userName}</div>
                        <div className="text-xs text-neutral-500 truncate">{planName} • {s.userPhone}</div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <div className="text-sm font-semibold text-emerald-600">₹{Number(amount).toLocaleString()}</div>
                        <button onClick={() => setOpenUserId(openUserId === uid ? null : uid)} className="p-1 rounded-md hover:bg-neutral-100" aria-expanded={openUserId === uid}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {openUserId === uid && (
                      <div className={`mt-3 p-4 rounded-xl border shadow-sm ${theme === "dark" ? "border-neutral-700 bg-neutral-900" : "border-neutral-100 bg-neutral-50"}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-sm font-semibold">Meals ({subs.length})</div>
                          <div className="text-xs text-neutral-500">Total: ₹{subs.reduce((sAcc, it) => sAcc + (Number(it.totalAmount) || 0), 0).toLocaleString()}</div>
                        </div>

                        <div className="space-y-3">
                          {subs.length > 0 ? (
                            subs.map((sub, k) => {
                              const title = sub.plan?.name || sub.mealName || sub.planType || "Plan";
                              const start = sub.startDate ? new Date(sub.startDate) : null;
                              const end = sub.endDate ? new Date(sub.endDate) : null;
                              const daysLeft = sub.remainingDays ?? (end ? Math.max(0, Math.ceil((end - Date.now()) / (1000 * 60 * 60 * 24))) : null);
                              return (
                                <div key={sub._id || k} className={`flex items-center gap-3 p-3 rounded-lg ${theme === "dark" ? "bg-neutral-800" : "bg-white"} border ${theme === "dark" ? "border-neutral-800" : "border-neutral-200"}`}>
                                  <div className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700 font-bold">{String(title).split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <div className="font-medium truncate">{title}</div>
                                      {sub.plan?.type && <div className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">{sub.plan.type}</div>}
                                    </div>
                                    <div className="text-xs text-neutral-400 truncate">{start ? start.toLocaleDateString() : "-"} {start && end ? "•" : ""} {end ? end.toLocaleDateString() : ""}</div>
                                  </div>

                                  <div className="flex flex-col items-end gap-2">
                                    <div className="text-sm font-semibold text-amber-600">₹{Number(sub.totalAmount || 0).toLocaleString()}</div>
                                    <div className="text-xs text-neutral-400">{daysLeft != null ? `${daysLeft} days` : "-"}</div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-sm text-neutral-500">No meals</div>
                          )}
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <button onClick={() => togglePauseLocal(uid)} className="inline-flex items-center gap-2 px-3 py-1 text-sm rounded-md border hover:shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 19V5" /><path d="M18 19V5" /></svg>
                            <span>{pausedIdsLocal.has(uid) ? "Restart" : "Pause"}</span>
                          </button>

                          <button onClick={() => alert("Renew request sent (demo)")} className="inline-flex items-center gap-2 px-3 py-1 text-sm rounded-md bg-amber-600 text-white hover:bg-amber-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10v6a2 2 0 0 1-2 2H7" /><path d="M3 6v6a2 2 0 0 0 2 2h12" /><path d="M7 10l5-5 5 5" /></svg>
                            <span>Renew</span>
                          </button>

                          <button onClick={() => setMessageTo(s)} className="ml-auto inline-flex items-center gap-2 px-3 py-1 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                            <span>Message</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-3 text-sm text-neutral-500">No active subscriptions</div>
          )}
        </div>

        {messageTo && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className={`w-full max-w-md rounded-2xl p-6 ${theme === "dark" ? "bg-neutral-800 text-white border border-neutral-700" : "bg-white"} shadow-2xl`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Message {messageTo.userName}</h3>
                <button className="text-neutral-400" onClick={() => setMessageTo(null)}>✕</button>
              </div>
              <textarea value={messageText} onChange={(e) => setMessageText(e.target.value)} rows={5} className={`w-full p-3 rounded border ${theme === "dark" ? "bg-neutral-900 border-neutral-700" : "bg-white border-neutral-200"}`} placeholder="Type your message..." />
              <div className="flex gap-2 justify-end mt-3">
                <button onClick={() => setMessageTo(null)} className={`px-3 py-1 rounded ${theme === "dark" ? "bg-neutral-700 hover:bg-neutral-600 text-white" : "bg-neutral-100 hover:bg-neutral-200"}`}>Cancel</button>
                <button onClick={() => { sendMessage(); }} className="px-3 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700">Send</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
