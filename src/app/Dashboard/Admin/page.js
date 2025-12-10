"use client";
import {
  getHeroSection,
  createHeroSectionImage,
  updateHeroSectionImage,
  deleteHeroSectionImage,
  getAboutSection,
  createAboutSection,
  updateAboutSection,
  deleteAboutSection,
  getNutrition,
  createNutrition,
  updateNutrition,
  deleteNutrition,
  getContact,
  createContact,
  updateContact,
  deleteContact,
} from "../../api/admin";

import React, { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { adminLogout } from "../../redux/slices/adminAuthSlice";
import {
  getallUsers,
  getAnalytics,
  TrialMealCreation,
  MonthlyMealCreation,
  createTrialMeal,
  createMonthlyMeal,
  updateMonthlyMeal,
  deleteMonthlyMeal,
  updateTrialMeal,
  deleteTrialMeal,
  getAllTrialMeals,
  getAllMessages,
  deleteMessage,
} from "../../api/admin";
import { CgProfile } from "react-icons/cg";
import { GiHotMeal } from "react-icons/gi";
import { FaRegUser } from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";
import { FaOpencart } from "react-icons/fa6";
import { FaRupeeSign } from "react-icons/fa6";
import { CiMail } from "react-icons/ci";
import { IoMailUnreadOutline } from "react-icons/io5";
import { SiLivechat } from "react-icons/si";

// Load Chart.js from CDN and render a chart on a canvas
function RevenueChart({ data, title, type = "bar", theme }) {
  const canvasRef = React.useRef(null);
  const chartRef = React.useRef(null);
  const [ready, setReady] = useState(false);

  React.useEffect(() => {
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

  React.useEffect(() => {
    if (!ready || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    const labels = data.map((_, i) => `${i + 1}`);
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
            data,
            backgroundColor: data.map(
              (_, i) =>
                palette[i % palette.length] + (type === "bar" ? "80" : "")
            ),
            borderColor: data.map((_, i) => palette[i % palette.length]),
            borderWidth: 2,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: "#eee" } },
        },
      },
    });
    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [ready, data, title, type]);

  return (
    <div
      className={`w-full rounded-xl p-4 shadow-[0_10px_35px_rgba(0,0,0,0.70)] transition-all duration-300  ${
        theme === "dark"
          ? "bg-neutral-800 border border-neutral-700"
          : "bg-white "
      }`}
    >
      <div className="text-sm font-semibold mb-2">{title}</div>
      <div className="h-36">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

function Sidebar({
  active,
  setActive,
  showMobile,
  setShowMobile,
  theme,
  setTheme,
  hasMessages,
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const buttons = [
    { key: "overview", label: "Home", icon: <IoHomeOutline /> },
    { key: "subscribers", label: "Subscribers", icon: <FaRegUser /> },
    { key: "payments", label: "Payments", icon: <FaRupeeSign /> },
    { key: "mealplans", label: "Meal Plans", icon: <GiHotMeal /> },
    { key: "future", label: "Ui Update", icon: <FaOpencart /> },
    {
      key: "message",
      label: "Messages",
      icon: hasMessages ? (
        <IoMailUnreadOutline className="text-red-500" />
      ) : (
        <CiMail />
      ),
    },
  ];

  return (
    <div
      className={`fixed md:fixed top-0 left-0 h-screen z-40 md:z-10 w-72 md:w-64 ${
        theme === "dark"
          ? "bg-neutral-900 text-white border-r border-neutral-800"
          : "bg-blue-600 text-neutral-900 border-r"
      } flex flex-col transition-transform duration-300 ${
        showMobile
          ? "translate-x-0 pointer-events-auto"
          : "-translate-x-full md:translate-x-0 pointer-events-none md:pointer-events-auto"
      }`}
    >
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white rounded-2xl">
        <div>
          <CgProfile className="w-10 h-10 rounded-full" />
        </div>

        <div>
          <div className="font-bold text-white ">Admin</div>
          <div className="text-xs text-white ">Fittbox Dashboard</div>
        </div>
        <button
          className="ml-auto md:hidden text-neutral-400"
          onClick={() => setShowMobile(false)}
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        {buttons.map((b) => (
          <button
            key={b.key}
            onClick={() => {
              if (b.key === "logout") {
                try {
                  dispatch(adminLogout());
                } catch (e) {
                  console.error("Logout dispatch failed", e);
                }
                router.push("/Admin/auth");
                return;
              }
              setActive(b.key);
              setShowMobile(false);
            }}
            className={`w-full text-xl  font-extrabold text-left px-6 py-3 transition-colors ${
              active === b.key
                ? theme === "dark"
                  ? "bg-neutral-800 text-red-500"
                  : "bg-red-500 text-white"
                : theme === "dark"
                ? "hover:bg-neutral-800"
                : "hover:bg-neutral-50"
            }`}
          >
            <span className="inline-flex items-center gap-3">
              <span className="text-lg">{b.icon}</span>
              <span>{b.label}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="px-5 py-4 border-t border-neutral-800 hidden md:flex items-center gap-2">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold py-2 rounded"
        >
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
        <button
          onClick={() => {
            try {
              dispatch(adminLogout());
            } catch (e) {
              console.error("Logout dispatch failed", e);
            }
            router.push("/Admin/auth");
          }}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

function HeaderBar({ title, subtitle, theme, onAction }) {
  return (
    <div
      className={`mb-6 rounded-2xl p-4 md:p-6  border-none
                       shadow-[0_10px_35px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1 ${
                         theme === "dark"
                           ? "bg-gradient-to-r from-neutral-800 to-neutral-900"
                           : "bg-gradient-to-r from-white to-neutral-50 border"
                       } border-neutral-200`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xl font-extrabold uppercase tracking-wider text-red-500">
            Dashboard
          </div>
          <h1 className="text-xl md:text-2xl font-bold">{title}</h1>
          {subtitle && (
            <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onAction}
            className={`hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold shadow ${
              theme === "dark"
                ? "bg-neutral-700 hover:bg-neutral-600 text-white"
                : "bg-white hover:bg-neutral-100 border-blue-500"
            }`}
          >
            Quick Action
          </button>
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ theme, analyticsData }) {
  const [range, setRange] = useState("week");

  // Local UI state for subscriber rows (hooks must be top-level)
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
        {/* Stat cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`rounded-xl p-4 ${
                theme === "dark"
                  ? "bg-neutral-800 border border-neutral-700"
                  : "bg-white border"
              } animate-pulse`}
            >
              <div className="h-4 bg-neutral-600 rounded w-24 mb-3"></div>
              <div className="h-8 bg-neutral-600 rounded w-16"></div>
            </div>
          ))}
        </div>
        {/* Revenue chart skeleton */}
        <div
          className={`${
            theme === "dark"
              ? "bg-neutral-800 border-neutral-700"
              : "bg-white border"
          } rounded-xl p-4 animate-pulse`}
        >
          <div className="h-6 bg-neutral-600 rounded w-24 mb-4"></div>
          <div className="h-40 bg-neutral-600 rounded"></div>
        </div>
        {/* Active subscribers skeleton */}
        <div
          className={`${
            theme === "dark"
              ? "bg-neutral-800 border-neutral-700"
              : "bg-white border"
          } rounded-xl p-4 animate-pulse`}
        >
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
  const newSubscribers = analyticsData.subscribers;

  const weekRevenue = analyticsData.revenue?.week || 0;
  const fifteenDaysRevenue = analyticsData.revenue?.fifteenDays || 0;
  const monthRevenue = analyticsData.revenue?.month || 0;

  const revenueSeries = {
    week: [weekRevenue],
    days15: [fifteenDaysRevenue],
    month: [monthRevenue],
  };

  return (
    <div className="space-y-6 ">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ">
        <div
          className={`rounded-xl p-4 text-center
                       shadow-[0_10px_35px_rgba(0,0,0,0.30)] transition-all duration-300 hover:-translate-y-1 ${
                         theme === "dark" ? "bg-neutral-800 " : "bg-white "
                       }`}
        >
          <div className="text-xl text-neutral-500">Total Users</div>
          <div className="text-2xl font-bold mt-1">{totalUsers}</div>
        </div>
        <div
          className={`rounded-xl p-4 text-center
                       shadow-[0_10px_35px_rgba(0,0,0,0.30)] transition-all duration-300 hover:-translate-y-1 ${
                         theme === "dark"
                           ? "bg-neutral-800 border border-neutral-700"
                           : "bg-white"
                       }`}
        >
          <div className="text-xl text-neutral-500">New Subscribers</div>
          <div className="text-2xl font-bold mt-1 text-emerald-600">
            {newSubscribers.length}
          </div>
        </div>
        <div
          className={`rounded-xl p-4 text-center 
                       shadow-[0_10px_35px_rgba(0,0,0,0.30)] transition-all duration-300 hover:-translate-y-1 ${
                         theme === "dark"
                           ? "bg-neutral-800 border border-neutral-700"
                           : "bg-white"
                       }`}
        >
          <div className="text-xl text-neutral-500">Total Subscriber</div>
          <div className="text-2xl font-bold mt-1 text-amber-600">
            {activeSubs}
          </div>
        </div>
        <div
          className={`rounded-xl p-4 text-center
                shadow-[0_10px_35px_rgba(0,0,0,0.30)] transition-all duration-300 hover:-translate-y-1 ${
                  theme === "dark"
                    ? "bg-neutral-800 border border-neutral-700"
                    : "bg-white "
                }`}
        >
          <div className="text-xl text-neutral-500">All Time Revenue</div>
          <div className="text-3xl text-blue-500 font-bold mt-1">
            ₹{totalRevenue.toLocaleString()}
          </div>
        </div>
      </div>

      <div
        className={`shadow-[0_10px_35px_rgba(0,0,0,0.40)] transition-all duration-300 hover:-translate-y-1${
          theme === "dark" ? "bg-neutral-800 border-neutral-700" : "bg-white"
        } rounded-xl p-4`}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Revenue</h3>
          <div className="flex gap-2">
            {[
              { k: "week", l: "Week" },
              { k: "days15", l: "15 Days" },
              { k: "month", l: "Month" },
            ].map((o) => (
              <button
                key={o.k}
                onClick={() => setRange(o.k)}
                className={`px-3 py-1 rounded text-sm ${
                  range === o.k ? "bg-red-600 text-white" : "bg-blue-500"
                }`}
              >
                {o.l}
              </button>
            ))}
          </div>
        </div>
        <RevenueChart
          data={revenueSeries[range]}
          title={`Revenue (${range})`}
          type={range === "month" ? "line" : "bar"}
          theme={theme}
        />
      </div>

      <div
        className={` 
                        shadow-[0_10px_35px_rgba(0,0,0,0.12)] transition-all duration-300 ${
                          theme === "dark"
                            ? "bg-neutral-800 border-neutral-700"
                            : "bg-white"
                        } rounded-xl p-4`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Active Subscribers</h3>
          <span className="text-sm text-neutral-500">Latest</span>
        </div>

        <div className="divide-y">
          {newSubscribers.length > 0 ? (
            newSubscribers.map((s, idx) => {
              const subs = Array.isArray(s.activeSubscriptions)
                ? s.activeSubscriptions
                : [];
              const first = subs.length > 0 ? subs[0] : null;
              const planName =
                first?.plan?.name || first?.mealName || first?.planType || "-";
              const amount =
                first?.totalAmount ??
                (subs.length > 0
                  ? subs.reduce(
                      (sum, it) => sum + (Number(it.totalAmount) || 0),
                      0
                    )
                  : s.totalAmount || 0);

              const uid = s._id || `u-${idx}`;

              return (
                <div key={uid} className="py-3 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold text-lg">
                    {s.userName?.split(" ")[0]?.[0] || "U"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="font-medium truncate text-sm">
                          {s.userName}
                        </div>
                        <div className="text-xs text-neutral-500 truncate">
                          {planName} • {s.userPhone}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <div className="text-sm font-semibold text-emerald-600">
                          ₹{Number(amount).toLocaleString()}
                        </div>
                        <button
                          onClick={() =>
                            setOpenUserId(openUserId === uid ? null : uid)
                          }
                          className="p-1 rounded-md hover:bg-neutral-100"
                          aria-expanded={openUserId === uid}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-neutral-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {openUserId === uid && (
                      <div
                        className={`mt-3 p-4 rounded-xl border shadow-sm ${
                          theme === "dark"
                            ? "border-neutral-700 bg-neutral-900"
                            : "border-neutral-100 bg-neutral-50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-sm font-semibold">
                            Meals ({subs.length})
                          </div>
                          <div className="text-xs text-neutral-500">
                            Total: ₹
                            {subs
                              .reduce(
                                (sAcc, it) =>
                                  sAcc + (Number(it.totalAmount) || 0),
                                0
                              )
                              .toLocaleString()}
                          </div>
                        </div>

                        <div className="space-y-3">
                          {subs.length > 0 ? (
                            subs.map((sub, k) => {
                              const title =
                                sub.plan?.name ||
                                sub.mealName ||
                                sub.planType ||
                                "Plan";
                              const start = sub.startDate
                                ? new Date(sub.startDate)
                                : null;
                              const end = sub.endDate
                                ? new Date(sub.endDate)
                                : null;
                              const daysLeft =
                                sub.remainingDays ??
                                (end
                                  ? Math.max(
                                      0,
                                      Math.ceil(
                                        (end - Date.now()) /
                                          (1000 * 60 * 60 * 24)
                                      )
                                    )
                                  : null);
                              return (
                                <div
                                  key={sub._id || k}
                                  className={`flex items-center gap-3 p-3 rounded-lg ${
                                    theme === "dark"
                                      ? "bg-neutral-800"
                                      : "bg-white"
                                  } border ${
                                    theme === "dark"
                                      ? "border-neutral-800"
                                      : "border-neutral-200"
                                  }`}
                                >
                                  <div className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700 font-bold">
                                    {String(title)
                                      .split(" ")
                                      .map((w) => w[0])
                                      .slice(0, 2)
                                      .join("")}
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <div className="font-medium truncate">
                                        {title}
                                      </div>
                                      {sub.plan?.type && (
                                        <div className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                                          {sub.plan.type}
                                        </div>
                                      )}
                                    </div>
                                    <div className="text-xs text-neutral-400 truncate">
                                      {start ? start.toLocaleDateString() : "-"}{" "}
                                      {start && end ? "•" : ""}{" "}
                                      {end ? end.toLocaleDateString() : ""}
                                    </div>
                                  </div>

                                  <div className="flex flex-col items-end gap-2">
                                    <div className="text-sm font-semibold text-amber-600">
                                      ₹
                                      {Number(
                                        sub.totalAmount || 0
                                      ).toLocaleString()}
                                    </div>
                                    <div className="text-xs text-neutral-400">
                                      {daysLeft != null
                                        ? `${daysLeft} days`
                                        : "-"}
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-sm text-neutral-500">
                              No meals
                            </div>
                          )}
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <button
                            onClick={() => togglePauseLocal(uid)}
                            className="inline-flex items-center gap-2 px-3 py-1 text-sm rounded-md border hover:shadow-sm"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-neutral-600"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M6 19V5" />
                              <path d="M18 19V5" />
                            </svg>
                            <span>
                              {pausedIdsLocal.has(uid) ? "Restart" : "Pause"}
                            </span>
                          </button>

                          <button
                            onClick={() => alert("Renew request sent (demo)")}
                            className="inline-flex items-center gap-2 px-3 py-1 text-sm rounded-md bg-amber-600 text-white hover:bg-amber-700"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M21 10v6a2 2 0 0 1-2 2H7" />
                              <path d="M3 6v6a2 2 0 0 0 2 2h12" />
                              <path d="M7 10l5-5 5 5" />
                            </svg>
                            <span>Renew</span>
                          </button>

                          <button
                            onClick={() => setMessageTo(s)}
                            className="ml-auto inline-flex items-center gap-2 px-3 py-1 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
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
            <div className="py-3 text-sm text-neutral-500">
              No active subscriptions
            </div>
          )}
        </div>

        {/* Message modal */}
        {messageTo && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div
              className={`w-full max-w-md rounded-2xl p-6 ${
                theme === "dark"
                  ? "bg-neutral-800 text-white border border-neutral-700"
                  : "bg-white"
              } shadow-2xl`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">
                  Message {messageTo.userName}
                </h3>
                <button
                  className="text-neutral-400"
                  onClick={() => setMessageTo(null)}
                >
                  ✕
                </button>
              </div>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={5}
                className={`w-full p-3 rounded border ${
                  theme === "dark"
                    ? "bg-neutral-900 border-neutral-700"
                    : "bg-white border-neutral-200"
                }`}
                placeholder="Type your message..."
              />
              <div className="flex gap-2 justify-end mt-3">
                <button
                  onClick={() => setMessageTo(null)}
                  className={`px-3 py-1 rounded ${
                    theme === "dark"
                      ? "bg-neutral-700 hover:bg-neutral-600 text-white"
                      : "bg-neutral-100 hover:bg-neutral-200"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    sendMessage();
                  }}
                  className="px-3 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Send
                </button>
              </div>
            </div>
            {createdMonthly.oneMeal && (
              <div className="flex gap-2 mt-3">
                {editingMonthlyKey !== "oneMeal" ? (
                  <>
                    <button
                      onClick={() => startEditMonthly("oneMeal")}
                      className="px-3 py-1 rounded bg-yellow-600 text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMonthly("oneMeal")}
                      className="px-3 py-1 rounded bg-red-600 text-white"
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        handleUpdateMonthly("oneMeal");
                        setEditingMonthlyKey(null);
                      }}
                      className="px-3 py-1 rounded bg-emerald-600 text-white"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => cancelEditMonthly("oneMeal")}
                      className="px-3 py-1 rounded bg-gray-300 text-black"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SubscribersTab({ theme, analyticsData }) {
  // Local UI state
  const [detail, setDetail] = useState(null);
  const [openSubscriber, setOpenSubscriber] = useState(null);
  const [pausedIds, setPausedIds] = useState(new Set());
  const [messageUser, setMessageUser] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [completedMealIds, setCompletedMealIds] = useState(new Set());

  // Diagnose backend shape: prefer activeSubscriptions, fallback to subscribers
  const rawSubscribers =
    analyticsData?.activeSubscriptions || analyticsData?.subscribers || [];

  const subscribers = Array.isArray(rawSubscribers) ? rawSubscribers : [];

  const togglePause = (id) => {
    const next = new Set(pausedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setPausedIds(next);
    alert((next.has(id) ? "Paused" : "Restarted") + " (demo)");
  };

  const renewMeal = (meal) => {
    alert(
      `Renew request sent for ${
        meal.mealName || meal.plan?.name || "meal"
      } (demo)`
    );
  };

  const deleteComplete = (meal) => {
    alert(
      `Marked ${meal.mealName || meal.plan?.name || "meal"} as completed (demo)`
    );
  };

  const completeMeal = (mid) => {
    const next = new Set(completedMealIds);
    next.add(mid);
    setCompletedMealIds(next);
  };

  const sendMessage = () => {
    alert(
      `Message sent to ${
        messageUser?.userName || messageUser?.name || "user"
      }: ${messageText}`
    );
    setMessageText("");
    setMessageUser(null);
  };

  if (!analyticsData) {
    return (
      <div
        className={`${
          theme === "dark"
            ? "bg-neutral-800 border-neutral-700 text-white"
            : "bg-white border"
        } rounded-xl p-4 animate-pulse`}
      >
        <div className="h-6 bg-neutral-600 rounded w-40 mb-4"></div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-neutral-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl p-4 ${
        theme === "dark"
          ? "bg-neutral-900 border border-neutral-800 text-white"
          : "bg-white border"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Subscribers</h3>
        <div className="text-sm text-neutral-500">
          {subscribers.length} total
        </div>
      </div>

      <div className="space-y-3 max-h-[60vh] overflow-auto">
        {subscribers.length === 0 ? (
          <div className="text-sm text-neutral-500">No subscribers found</div>
        ) : (
          subscribers.map((s, idx) => {
            const subs = Array.isArray(s.activeSubscriptions)
              ? s.activeSubscriptions
              : [];
            const amount =
              subs.length > 0
                ? subs.reduce(
                    (acc, it) => acc + (Number(it.totalAmount) || 0),
                    0
                  )
                : Number(s.totalAmount || 0);
            const uid = s._id || s.id || `u-${idx}`;

            return (
              <div
                key={uid}
                className={`p-3 rounded-lg flex items-start gap-4 ${
                  theme === "dark"
                    ? "bg-neutral-800 border border-neutral-700"
                    : "bg-white border border-neutral-200"
                }`}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700 font-bold">
                  {String(s.userName || s.name || "U")
                    .split(" ")
                    .map((p) => p?.[0] || "")
                    .slice(0, 2)
                    .join("")}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="font-medium truncate">
                        {s.userName || s.name || "-"}
                      </div>
                      <div className="text-xs text-neutral-400 truncate">
                        {s.userPhone || s.phone || "-"}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-sm font-semibold text-emerald-600">
                        ₹{Number(amount).toLocaleString()}
                      </div>
                      <button
                        onClick={() =>
                          setOpenSubscriber(openSubscriber === uid ? null : uid)
                        }
                        className="p-1 rounded-md hover:bg-neutral-100"
                        aria-expanded={openSubscriber === uid}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-neutral-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => setMessageUser(s)}
                        className="ml-2 px-3 py-1 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700"
                      >
                        Message
                      </button>
                    </div>
                  </div>

                  {openSubscriber === uid && (
                    <div
                      className={`mt-3 p-3 rounded-lg ${
                        theme === "dark"
                          ? "bg-neutral-900 border border-neutral-800"
                          : "bg-neutral-50 border border-neutral-200"
                      }`}
                    >
                      <div className="text-sm font-semibold mb-2">
                        Meals ({subs.length})
                      </div>
                      <div className="space-y-2">
                        {subs.length === 0 ? (
                          <div className="text-sm text-neutral-500">
                            No meals
                          </div>
                        ) : (
                          subs.map((meal, mIdx) => {
                            const title =
                              meal.plan?.name ||
                              meal.mealName ||
                              meal.planType ||
                              "Meal";
                            const start = meal.startDate
                              ? new Date(meal.startDate)
                              : null;
                            const end = meal.endDate
                              ? new Date(meal.endDate)
                              : null;
                            const daysLeft =
                              meal.remainingDays ??
                              (end
                                ? Math.max(
                                    0,
                                    Math.ceil(
                                      (end - Date.now()) / (1000 * 60 * 60 * 24)
                                    )
                                  )
                                : null);
                            const mid =
                              meal._id || meal.id || `${uid}-m-${mIdx}`;

                            const isCompleted = completedMealIds.has(mid);

                            return (
                              <div
                                key={mid}
                                className={`flex items-center gap-3 p-3 rounded-md ${
                                  isCompleted
                                    ? "bg-emerald-50 border border-emerald-400"
                                    : theme === "dark"
                                    ? "bg-neutral-800 border border-neutral-700"
                                    : "bg-white border border-neutral-200"
                                }`}
                              >
                                <div className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700 font-bold">
                                  {String(title)
                                    .split(" ")
                                    .map((w) => w[0])
                                    .slice(0, 2)
                                    .join("")}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <div className="font-medium truncate">
                                      {title}
                                    </div>
                                    {meal.plan?.type && (
                                      <div className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                                        {meal.plan.type}
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-xs text-neutral-400 truncate">
                                    {start ? start.toLocaleDateString() : "-"}
                                    {start && end ? " • " : ""}
                                    {end ? end.toLocaleDateString() : ""}
                                  </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                  <div className="text-sm font-semibold text-amber-600">
                                    ₹
                                    {Number(
                                      meal.totalAmount || 0
                                    ).toLocaleString()}
                                  </div>
                                  <div className="text-xs text-neutral-400">
                                    {daysLeft != null
                                      ? `${daysLeft} days`
                                      : "-"}
                                  </div>
                                  <div className="flex items-center gap-2 mt-2">
                                    <button
                                      onClick={() => togglePause(mid)}
                                      className="px-2 py-1 rounded border text-xs"
                                    >
                                      {pausedIds.has(mid) ? "Restart" : "Pause"}
                                    </button>
                                    <button
                                      onClick={() => renewMeal(meal)}
                                      className="px-2 py-1 rounded bg-amber-600 text-white text-xs"
                                    >
                                      Renew
                                    </button>
                                    <button
                                      onClick={() => completeMeal(mid)}
                                      className="px-2 py-1 rounded bg-emerald-600 text-white text-xs"
                                    >
                                      Complete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {detail && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className={`${
              theme === "dark" ? "bg-neutral-800 text-white" : "bg-white"
            } rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl border ${
              theme === "dark" ? "border-neutral-700" : "border-neutral-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Subscriber Details</h3>
              <button
                className={`${
                  theme === "dark"
                    ? "text-neutral-400 hover:text-white"
                    : "text-neutral-500 hover:text-black"
                }`}
                onClick={() => setDetail(null)}
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {(() => {
                const subs = Array.isArray(detail.activeSubscriptions)
                  ? detail.activeSubscriptions
                  : [];
                const first = subs.length > 0 ? subs[0] : null;
                const planName =
                  first?.plan?.name ||
                  first?.mealName ||
                  first?.planType ||
                  "-";
                const amount =
                  first?.totalAmount ??
                  (subs.length > 0
                    ? subs.reduce(
                        (sum, it) => sum + (Number(it.totalAmount) || 0),
                        0
                      )
                    : detail.totalAmount || 0);

                return (
                  <>
                    <div>
                      <span className="text-neutral-500">Name:</span>{" "}
                      <span className="font-medium">{detail.userName}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Phone:</span>{" "}
                      <span className="font-medium">{detail.userPhone}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Email:</span>{" "}
                      <span className="font-medium">{detail.userEmail}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Amount:</span>{" "}
                      <span className="font-medium">
                        ₹{Number(amount).toLocaleString()}
                      </span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-neutral-500">Meal:</span>{" "}
                      <span className="font-medium">{planName}</span>
                      {subs.length > 1 && (
                        <span className="text-xs text-neutral-400">
                          {" "}
                          {` (+${subs.length - 1} more)`}
                        </span>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
            <div className="flex gap-2 justify-end">
              <button
                className={`${
                  theme === "dark"
                    ? "bg-neutral-700 hover:bg-neutral-600 text-white"
                    : "bg-neutral-100 hover:bg-neutral-200"
                } px-4 py-2 rounded`}
                onClick={() => setDetail(null)}
              >
                Close
              </button>
            </div>
            {createdMonthly.twoMealsBLD && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleUpdateMonthly("twoMealsBLD")}
                  className="px-3 py-1 rounded bg-yellow-600 text-white"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteMonthly("twoMealsBLD")}
                  className="px-3 py-1 rounded bg-red-600 text-white"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {messageUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div
            className={`${
              theme === "dark" ? "bg-neutral-800 text-white" : "bg-white"
            } rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl border ${
              theme === "dark" ? "border-neutral-700" : "border-neutral-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Message{" "}
                {messageUser.userName || messageUser.name || messageUser.email}
              </h3>
              <button
                className="text-neutral-400"
                onClick={() => setMessageUser(null)}
              >
                ✕
              </button>
            </div>
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              rows={5}
              className={`w-full p-3 rounded border ${
                theme === "dark"
                  ? "bg-neutral-900 border-neutral-700 text-white"
                  : "bg-white border-neutral-200"
              }`}
              placeholder="Type your message..."
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setMessageUser(null)}
                className={`px-3 py-1 rounded ${
                  theme === "dark"
                    ? "bg-neutral-700 hover:bg-neutral-600 text-white"
                    : "bg-neutral-100 hover:bg-neutral-200"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => sendMessage()}
                className="px-3 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Send
              </button>
            </div>
            {createdMonthly.twoMealsLD && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleUpdateMonthly("twoMealsLD")}
                  className="px-3 py-1 rounded bg-yellow-600 text-white"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteMonthly("twoMealsLD")}
                  className="px-3 py-1 rounded bg-red-600 text-white"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MessagesTab({
  theme,
  messages = [],
  loading,
  error,
  onDeleteMessage,
}) {
  return (
    <div className="space-y-6">
      <div
        className={`rounded-xl p-4 ${
          theme === "dark"
            ? "bg-neutral-800 border border-neutral-700"
            : "bg-white"
        } shadow-sm`}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Contact Messages</h3>
            <p className="text-sm text-neutral-500">
              Recent messages from site contact form
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-10 text-center text-neutral-500">
            Loading messages...
          </div>
        ) : error ? (
          <div className="py-6 text-center text-red-500">{error}</div>
        ) : messages.length === 0 ? (
          <div className="py-6 text-center text-neutral-500">No messages</div>
        ) : (
          <div className="grid gap-4">
            {messages.map((m) => (
              <div
                key={m._id}
                className={`p-4 rounded-lg border transition-shadow hover:shadow-lg ${
                  theme === "dark"
                    ? "bg-neutral-900 border-neutral-700"
                    : "bg-white border-neutral-100"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold">
                    {m.name?.split(" ")[0]?.[0] || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold truncate">{m.name}</div>
                        <div className="text-xs text-neutral-500 truncate">
                          {m.email} • {m.phone}
                        </div>
                      </div>
                      <div className="text-right text-xs text-neutral-400 flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          <div>{new Date(m.createdAt).toLocaleString()}</div>
                          <button
                            onClick={() =>
                              onDeleteMessage && onDeleteMessage(m._id)
                            }
                            className="ml-2 text-sm text-red-600 hover:underline"
                            title="Delete message"
                          >
                            Delete
                          </button>
                        </div>
                        <div
                          className={`mt-1 inline-flex items-center gap-2 px-2 py-0.5 rounded-full text-xs ${
                            m.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {m.status}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 text-sm text-neutral-700">
                      {m.message}
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <div className="text-sm text-neutral-500">Inquiry:</div>
                      <div className="text-sm font-medium">
                        {m.inquiryType || m.inquiry || "General"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AllUsersControl({ theme = "light" }) {
  const token = useSelector((state) => state.adminAuth?.token);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [messageToLocal, setMessageToLocal] = useState(null);
  const [messageTextLocal, setMessageTextLocal] = useState("");

  const fetchAll = async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await getallUsers(token);
      const list = Array.isArray(data) ? data : data?.users || [];
      setUsers(list);
      setOpen(true);
    } catch (err) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button
          onClick={fetchAll}
          disabled={loading}
          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
        >
          {loading ? "Loading..." : "All Users"}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
          <div
            className={`w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl ${
              theme === "dark"
                ? "bg-neutral-900 text-white border border-neutral-800"
                : "bg-white"
            }`}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold">All Users</h3>
                {error && <div className="text-sm text-red-500">{error}</div>}
              </div>
              <div className="flex items-center gap-2">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search users by name, email or phone"
                  className={`px-3 py-2 rounded-md border w-64 text-sm ${
                    theme === "dark"
                      ? "bg-neutral-800 border-neutral-700 text-white"
                      : "bg-white border-neutral-200"
                  }`}
                />
                <button
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 bg-neutral-100 rounded-md hover:bg-neutral-200"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="p-4 max-h-[70vh] overflow-auto">
              {users.length === 0 ? (
                <div className="text-sm text-neutral-500">No users found.</div>
              ) : (
                <div className="space-y-3">
                  {users
                    .filter((u) => {
                      const q = search.trim().toLowerCase();
                      if (!q) return true;
                      return (
                        (u.name || u.fullName || "")
                          .toLowerCase()
                          .includes(q) ||
                        (u.email || "").toLowerCase().includes(q) ||
                        (u.phone || u.mobile || "").toLowerCase().includes(q)
                      );
                    })
                    .map((u, idx) => (
                      <div
                        key={u._id || u.id || idx}
                        className={`flex items-center gap-4 p-3 rounded-lg ${
                          theme === "dark"
                            ? "bg-neutral-800 border border-neutral-800"
                            : "bg-white border border-neutral-200"
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700 font-bold">
                          {(u.name || u.fullName || "U")
                            .split(" ")
                            .map((p) => p[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">
                            {u.name || u.fullName || "-"}
                          </div>
                          <div className="text-xs text-neutral-400 truncate">
                            {u.email || "-"} • {u.phone || u.mobile || "-"}
                          </div>
                        </div>
                        <div className="text-sm text-neutral-500 mr-2">
                          {u.role || "user"}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setMessageToLocal(u)}
                            className="px-3 py-1 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700"
                          >
                            Message
                          </button>
                          <button
                            onClick={() => alert("Viewing user (demo)")}
                            className="px-3 py-1 rounded-md border text-sm hover:shadow-sm"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {messageToLocal && (
        <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
          <div
            className={`w-full max-w-md rounded-2xl p-5 ${
              theme === "dark"
                ? "bg-neutral-900 text-white border border-neutral-800"
                : "bg-white"
            } shadow-2xl`}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">
                Message{" "}
                {messageToLocal.name ||
                  messageToLocal.fullName ||
                  messageToLocal.email}
              </h4>
              <button
                onClick={() => setMessageToLocal(null)}
                className="text-neutral-400"
              >
                ✕
              </button>
            </div>
            <textarea
              value={messageTextLocal}
              onChange={(e) => setMessageTextLocal(e.target.value)}
              rows={5}
              className={`w-full p-3 rounded border ${
                theme === "dark"
                  ? "bg-neutral-800 border-neutral-700 text-white"
                  : "bg-white border-neutral-200"
              }`}
              placeholder="Write a message..."
            />
            <div className="flex gap-2 justify-end mt-3">
              <button
                onClick={() => setMessageToLocal(null)}
                className={`px-3 py-1 rounded ${
                  theme === "dark"
                    ? "bg-neutral-700 hover:bg-neutral-600 text-white"
                    : "bg-neutral-100 hover:bg-neutral-200"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(
                    `Message sent to ${
                      messageToLocal.email || messageToLocal.name
                    }: ${messageTextLocal}`
                  );
                  setMessageTextLocal("");
                  setMessageToLocal(null);
                }}
                className="px-3 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function PaymentsTab({ theme, analyticsData }) {
  const [messageUser, setMessageUser] = useState(null);

  if (!analyticsData) {
    return (
      <div className="space-y-6">
        {/* Revenue charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`${
                theme === "dark"
                  ? "bg-neutral-800 border-neutral-700"
                  : "bg-white border"
              } rounded-xl p-4 animate-pulse`}
            >
              <div className="h-4 bg-neutral-600 rounded w-32 mb-3"></div>
              <div className="h-40 bg-neutral-600 rounded"></div>
            </div>
          ))}
        </div>
        {/* Revenue Summary skeleton */}
        <div
          className={`${
            theme === "dark"
              ? "bg-neutral-800 border-neutral-700"
              : "bg-white border"
          } rounded-xl p-4 animate-pulse`}
        >
          <div className="h-6 bg-neutral-600 rounded w-40 mb-4"></div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 bg-neutral-600 rounded w-48 mb-3"></div>
          ))}
        </div>
        {/* Expiring subscriptions skeleton */}
        <div
          className={`${
            theme === "dark"
              ? "bg-neutral-800 border-neutral-700"
              : "bg-white border"
          } rounded-xl p-4 animate-pulse`}
        >
          <div className="h-6 bg-neutral-600 rounded w-56 mb-4"></div>
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

  const weekRev = analyticsData.revenue?.week || 0;
  const fifteenDaysRev = analyticsData.revenue?.fifteenDays || 0;
  const monthRev = analyticsData.revenue?.month || 0;
  const allTimeRev = analyticsData.revenue?.allTime || 0;

  const revenueSeries = {
    week: [weekRev],
    days15: [fifteenDaysRev],
    month: [monthRev],
  };

  const expiringSubscriptions = analyticsData.expiringSubscriptions || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChart
          data={revenueSeries.week}
          title="Revenue (Week)"
          theme={theme}
        />
        <RevenueChart
          data={revenueSeries.days15}
          title="Revenue (15 Days)"
          theme={theme}
        />
        <RevenueChart
          data={revenueSeries.month}
          title="Revenue (Month)"
          type="line"
          theme={theme}
        />
      </div>

      <div
        className={`rounded-xl p-4 ${
          theme === "dark"
            ? "bg-neutral-900 border border-neutral-800 text-white"
            : "bg-white border"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Revenue Summary</h3>
          <div className="text-sm text-neutral-500">Updated just now</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            className={`p-3 rounded-lg ${
              theme === "dark"
                ? "bg-neutral-800 border border-neutral-700"
                : "bg-neutral-50 border"
            }`}
          >
            <div className="text-xs text-neutral-500">Week</div>
            <div className="text-xl font-bold mt-1">
              ₹{weekRev.toLocaleString()}
            </div>
          </div>
          <div
            className={`p-3 rounded-lg ${
              theme === "dark"
                ? "bg-neutral-800 border border-neutral-700"
                : "bg-neutral-50 border"
            }`}
          >
            <div className="text-xs text-neutral-500">15 Days</div>
            <div className="text-xl font-bold mt-1">
              ₹{fifteenDaysRev.toLocaleString()}
            </div>
          </div>
          <div
            className={`p-3 rounded-lg ${
              theme === "dark"
                ? "bg-neutral-800 border border-neutral-700"
                : "bg-neutral-50 border"
            }`}
          >
            <div className="text-xs text-neutral-500">Month</div>
            <div className="text-xl font-bold mt-1">
              ₹{monthRev.toLocaleString()}
            </div>
          </div>
          <div
            className={`p-3 rounded-lg ${
              theme === "dark"
                ? "bg-gradient-to-br from-amber-900 to-amber-800 text-amber-100"
                : "bg-amber-50"
            }`}
          >
            <div className="text-xs">All Time</div>
            <div className="text-2xl font-bold mt-1">
              ₹{allTimeRev.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`rounded-xl p-4 ${
          theme === "dark"
            ? "bg-neutral-900 border border-neutral-800 text-white"
            : "bg-white border"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Expiring Subscriptions — Next 5 Days
          </h3>
          <div className="text-sm text-neutral-500">
            {expiringSubscriptions.length} expiring
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-auto">
          {expiringSubscriptions.length > 0 ? (
            expiringSubscriptions.map((u, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg flex items-center gap-4 ${
                  theme === "dark"
                    ? "bg-neutral-800 border border-neutral-700"
                    : "bg-white border border-neutral-200"
                }`}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-rose-100 to-rose-200 text-rose-700 font-bold">
                  {String(u.userName || u.user || "U")
                    .split(" ")
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join("")}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="font-medium truncate">
                      {u.userName || u.user || "-"}
                    </div>
                    <div className="text-sm text-neutral-400">
                      ₹{Number(u.totalAmount || 0).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-xs text-neutral-500 truncate">
                    {u.userPhone || u.phone || "-"} •{" "}
                    {u.mealName || u.plan || "-"}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-semibold text-amber-600">
                    {u.daysRemaining} days
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => setMessageUser(u)}
                      className="px-3 py-1 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700"
                    >
                      Notify
                    </button>
                    <button
                      onClick={() => alert("Renew request sent (demo)")}
                      className="px-3 py-1 rounded-md bg-amber-600 text-white text-sm hover:bg-amber-700"
                    >
                      Renew
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-neutral-500">
              No subscriptions expiring soon
            </div>
          )}
        </div>
      </div>

      {messageUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className={`${
              theme === "dark" ? "bg-neutral-800 text-white" : "bg-white"
            } rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl border ${
              theme === "dark" ? "border-neutral-700" : "border-neutral-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Message{" "}
                {messageUser.userName || messageUser.user || messageUser.email}
              </h3>
              <button
                className={`${
                  theme === "dark"
                    ? "text-neutral-400 hover:text-white"
                    : "text-neutral-500 hover:text-black"
                }`}
                onClick={() => setMessageUser(null)}
              >
                ✕
              </button>
            </div>
            <textarea
              className={`w-full border rounded p-2 text-sm ${
                theme === "dark" ? "bg-neutral-900 border-neutral-700" : ""
              }`}
              rows={5}
              placeholder="Type your message..."
            />
            <div className="flex gap-2 justify-end">
              <button
                className={`${
                  theme === "dark"
                    ? "bg-neutral-700 hover:bg-neutral-600 text-white"
                    : "bg-neutral-100 hover:bg-neutral-200"
                } px-4 py-2 rounded`}
                onClick={() => setMessageUser(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded"
                onClick={() => {
                  alert("Message sent (demo)");
                  setMessageUser(null);
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FutureTab({ theme }) {
  const token = useSelector((s) => s.adminAuth?.token);
  const [heroUrl, setHeroUrl] = useState(null);
  const [heroFile, setHeroFile] = useState(null);
  const [heroLoading, setHeroLoading] = useState(false);

  const [aboutText, setAboutText] = useState("");
  const [aboutLoading, setAboutLoading] = useState(false);

  // Nutrition state (list + form)
  const [nutritionList, setNutritionList] = useState([]);
  const [nutritionForm, setNutritionForm] = useState({
    providerName: "",
    providerContact: "",
    nutritionPrice: "",
  });
  const [nutritionLoading, setNutritionLoading] = useState(false);
  const [editingNutritionId, setEditingNutritionId] = useState(null);

  // Contact state
  const [contact, setContact] = useState({ address: "", email: "", phone: "" });
  const [contactLoading, setContactLoading] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    loadHero();
    loadAbout();
    loadNutrition();
    loadContact();
  }, []);

  // --- Hero handlers (use admin API helpers) ---
  const loadHero = async () => {
    try {
      setHeroLoading(true);
      const data = await getHeroSection(token);
      // admin.getHeroSection may return object with image/url
      setHeroUrl(data?.image || data?.url || data?.heroImage || null);
    } catch (err) {
      console.error(err);
      setHeroUrl(null);
    } finally {
      setHeroLoading(false);
    }
  };

  const uploadHero = async () => {
    if (!heroFile) return alert("Select an image first");
    try {
      setHeroLoading(true);
      const res = await createHeroSectionImage(heroFile, token);
      setHeroUrl(res?.image || res?.url || null);
      setHeroFile(null);
      alert("Hero image uploaded");
    } catch (err) {
      console.error(err);
      alert(err?.message || "Upload failed");
    } finally {
      setHeroLoading(false);
    }
  };

  const removeHero = async () => {
    if (!confirm("Delete current hero image?")) return;
    try {
      setHeroLoading(true);
      await deleteHeroSectionImage(token);
      setHeroUrl(null);
      alert("Hero image deleted");
    } catch (err) {
      console.error(err);
      alert(err?.message || "Delete failed");
    } finally {
      setHeroLoading(false);
    }
  };

  // --- About handlers ---
  const loadAbout = async () => {
    try {
      setAboutLoading(true);
      const data = await getAboutSection(token);
      setAboutText(data?.text || data?.about || "");
    } catch (err) {
      console.error(err);
      setAboutText("");
    } finally {
      setAboutLoading(false);
    }
  };

  const saveAbout = async () => {
    try {
      setAboutLoading(true);
      await createAboutSection({ about: aboutText }, null, token);
      alert("About text saved");
      await loadAbout();
    } catch (err) {
      console.error(err);
      alert(err?.message || "Save failed");
    } finally {
      setAboutLoading(false);
    }
  };

  const removeAbout = async () => {
    if (!confirm("Delete about text?")) return;
    try {
      setAboutLoading(true);
      await deleteAboutSection(token);
      setAboutText("");
      alert("About text deleted");
    } catch (err) {
      console.error(err);
      alert(err?.message || "Delete failed");
    } finally {
      setAboutLoading(false);
    }
  };

  // --- Nutrition handlers ---
  const loadNutrition = async () => {
    try {
      setNutritionLoading(true);
      const data = await getNutrition(token);
      // accept array or object
      const list = Array.isArray(data)
        ? data
        : data?.items || (data ? [data] : []);
      setNutritionList(list);
    } catch (err) {
      console.error(err);
      setNutritionList([]);
    } finally {
      setNutritionLoading(false);
    }
  };

  const saveNutrition = async () => {
    try {
      setNutritionLoading(true);
      const payload = {
        providerName: nutritionForm.providerName,
        providerContact: nutritionForm.providerContact,
        nutritionPrice: Number(nutritionForm.nutritionPrice || 0),
      };
      if (editingNutritionId) {
        await updateNutrition(
          { ...payload, _id: editingNutritionId },
          null,
          token
        );
        alert("Nutrition updated");
      } else {
        await createNutrition(payload, null, token);
        alert("Nutrition created");
      }
      setNutritionForm({ name: "", number: "", price: "" });
      setEditingNutritionId(null);
      await loadNutrition();
    } catch (err) {
      console.error(err);
      alert(err?.message || "Save failed");
    } finally {
      setNutritionLoading(false);
    }
  };

  const editNutrition = (item) => {
    setEditingNutritionId(item._id || item.id || null);
    setNutritionForm({
      providerName: item.providerName || "",
      providerContact: item.providerContact || "",
      nutritionPrice: item.nutritionPrice || "",
    });
  };

  const removeNutrition = async (id) => {
    if (!confirm("Delete nutrition item?")) return;
    try {
      setNutritionLoading(true);
      await deleteNutrition(id || editingNutritionId, token);
      alert("Nutrition deleted");
      setNutritionForm({ name: "", number: "", price: "" });
      setEditingNutritionId(null);
      await loadNutrition();
    } catch (err) {
      console.error(err);
      alert(err?.message || "Delete failed");
    } finally {
      setNutritionLoading(false);
    }
  };

  // --- Contact handlers ---
  const loadContact = async () => {
    try {
      setContactLoading(true);
      const data = await getContact(token);
      setContact({
        address: data?.address || data?.addr || "",
        email: data?.email || "",
        phone: data?.phone || data?.phoneNumber || "",
      });
    } catch (err) {
      console.error(err);
      setContact({ address: "", email: "", phone: "" });
    } finally {
      setContactLoading(false);
    }
  };

  const saveContact = async () => {
    try {
      setContactLoading(true);
      await createContact(contact, null, token);
      alert("Contact saved");
      await loadContact();
    } catch (err) {
      console.error(err);
      alert(err?.message || "Save failed");
    } finally {
      setContactLoading(false);
    }
  };

  const removeContact = async () => {
    if (!confirm("Delete contact info?")) return;
    try {
      setContactLoading(true);
      await deleteContact(token);
      setContact({ address: "", email: "", phone: "" });
      alert("Contact deleted");
    } catch (err) {
      console.error(err);
      alert(err?.message || "Delete failed");
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <div
      className={`${
        theme === "dark"
          ? "bg-neutral-800 border-neutral-700 text-white"
          : "bg-white border"
      } rounded-xl p-4 space-y-4`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Update UI</h3>
      </div>

      {/* Hero Image Section */}
      <div
        className={`p-4 rounded-lg border ${
          theme === "dark" ? "bg-neutral-900 border-neutral-800" : "bg-white"
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-semibold">Hero Section Image</h4>
            <div
              className={`text-sm ${
                theme === "dark" ? "text-neutral-400" : "text-neutral-500"
              }`}
            >
              Upload or manage the landing hero image
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="hero-file"
              type="file"
              accept="image/*"
              onChange={(e) => setHeroFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            <label
              htmlFor="hero-file"
              className="px-3 py-1 rounded border cursor-pointer text-sm"
            >
              Choose
            </label>
            <button
              onClick={uploadHero}
              disabled={heroLoading || !heroFile}
              className="px-3 py-1 rounded bg-emerald-600 text-white text-sm"
            >
              {heroLoading ? "Uploading..." : "Upload"}
            </button>
            {heroUrl && (
              <button
                onClick={removeHero}
                disabled={heroLoading}
                className="px-3 py-1 rounded bg-red-600 text-white text-sm"
              >
                Delete
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-48 h-28 bg-neutral-100 rounded overflow-hidden border">
            {heroFile ? (
              <img
                src={URL.createObjectURL(heroFile)}
                alt="preview"
                className="w-full h-full object-cover"
              />
            ) : heroUrl ? (
              <img
                src={heroUrl}
                alt="hero"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-neutral-400">
                No image
              </div>
            )}
          </div>
          <div className="text-sm text-neutral-500">
            Current: {heroUrl ? "Stored" : "None"}
          </div>
        </div>
      </div>

      {/* About Text Section */}
      <div
        className={`p-4 rounded-lg border ${
          theme === "dark" ? "bg-neutral-900 border-neutral-800" : "bg-white"
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-semibold">About Section Text</h4>
            <div
              className={`text-sm ${
                theme === "dark" ? "text-neutral-400" : "text-neutral-500"
              }`}
            >
              Create or update the about text shown on landing
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={saveAbout}
              disabled={aboutLoading}
              className="px-3 py-1 rounded bg-emerald-600 text-white text-sm"
            >
              {aboutLoading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={removeAbout}
              disabled={aboutLoading}
              className="px-3 py-1 rounded bg-red-600 text-white text-sm"
            >
              Delete
            </button>
          </div>
        </div>

        <textarea
          rows={6}
          value={aboutText}
          onChange={(e) => setAboutText(e.target.value)}
          className={`w-full rounded border p-3 ${
            theme === "dark"
              ? "bg-neutral-900 border-neutral-700 text-white"
              : "bg-white"
          }`}
          placeholder="Write about section text here..."
        />
      </div>

      {/* Nutrition Section */}
      <div
        className={`p-4 rounded-lg border ${
          theme === "dark" ? "bg-neutral-900 border-neutral-800" : "bg-white"
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-semibold">Nutrition Items</h4>
            <div
              className={`text-sm ${
                theme === "dark" ? "text-neutral-400" : "text-neutral-500"
              }`}
            >
              Create / update / delete nutrition entries
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
          <input
            value={nutritionForm.name}
            onChange={(e) =>
              setNutritionForm((s) => ({ ...s, providerName: e.target.value }))
            }
            placeholder="Name"
            className="px-3 py-2 rounded border"
          />
          <input
            value={nutritionForm.number}
            onChange={(e) =>
              setNutritionForm((s) => ({
                ...s,
                providerContact: e.target.value,
              }))
            }
            placeholder="Number"
            className="px-3 py-2 rounded border"
          />
          <input
            value={nutritionForm.price}
            onChange={(e) =>
              setNutritionForm((s) => ({
                ...s,
                nutritionPrice: e.target.value,
              }))
            }
            placeholder="Price"
            type="number"
            className="px-3 py-2 rounded border"
          />
        </div>
        <div className="flex gap-2 mb-3">
          <button
            onClick={saveNutrition}
            disabled={nutritionLoading}
            className="px-3 py-1 rounded bg-emerald-600 text-white"
          >
            {nutritionLoading
              ? "Saving..."
              : editingNutritionId
              ? "Update"
              : "Create"}
          </button>
          {editingNutritionId && (
            <button
              onClick={() => removeNutrition(editingNutritionId)}
              disabled={nutritionLoading}
              className="px-3 py-1 rounded bg-red-600 text-white"
            >
              Delete
            </button>
          )}
          <button
            onClick={() => {
              setNutritionForm({ name: "", number: "", price: "" });
              setEditingNutritionId(null);
            }}
            className="px-3 py-1 rounded border"
          >
            Clear
          </button>
        </div>

        <div className="space-y-2 max-h-40 overflow-auto">
          {nutritionList.length === 0 ? (
            <div className="text-sm text-neutral-500">No nutrition items</div>
          ) : (
            nutritionList.map((n) => (
              <div
                key={n._id || n.id || n.name}
                className="p-2 rounded border flex items-center justify-between"
              >
                <div
                  role="button"
                  onClick={() => editNutrition(n)}
                  className="cursor-pointer"
                  title="Click to load into form for editing"
                >
                  <div className="font-medium">{n.name}</div>
                  <div className="text-xs text-neutral-500">
                    Number: {n.number} • Price: ₹{n.price}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => removeNutrition(n._id || n.id)}
                    className="px-2 py-1 rounded bg-red-600 text-white text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Contact Section */}
      <div
        className={`p-4 rounded-lg border ${
          theme === "dark" ? "bg-neutral-900 border-neutral-800" : "bg-white"
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-semibold">Contact Info</h4>
            <div
              className={`text-sm ${
                theme === "dark" ? "text-neutral-400" : "text-neutral-500"
              }`}
            >
              Address, email and phone for landing contact
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
          <input
            value={contact.address}
            onChange={(e) =>
              setContact((s) => ({ ...s, address: e.target.value }))
            }
            placeholder="Address"
            className="px-3 py-2 rounded border"
          />
          <input
            value={contact.email}
            onChange={(e) =>
              setContact((s) => ({ ...s, email: e.target.value }))
            }
            placeholder="Email"
            className="px-3 py-2 rounded border"
          />
          <input
            value={contact.phone}
            onChange={(e) =>
              setContact((s) => ({ ...s, phone: e.target.value }))
            }
            placeholder="Phone"
            className="px-3 py-2 rounded border"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={saveContact}
            disabled={contactLoading}
            className="px-3 py-1 rounded bg-emerald-600 text-white"
          >
            {contactLoading ? "Saving..." : "Save"}
          </button>
          <button
            onClick={removeContact}
            disabled={contactLoading}
            className="px-3 py-1 rounded bg-red-600 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function PriceInput({ label, value, onChange, theme }) {
  return (
    <label className="block text-sm">
      <span
        className={`${
          theme === "dark" ? "text-neutral-300" : "text-neutral-700"
        }`}
      >
        {label}
      </span>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`mt-1 w-full rounded border px-3 py-2 ${
          theme === "dark"
            ? "bg-neutral-900 border-neutral-700 text-white"
            : "bg-white"
        }`}
      />
    </label>
  );
}

function MealCard({ title, img, children, theme }) {
  return (
    <div
      className={`${
        theme === "dark"
          ? "bg-neutral-800 border-neutral-700"
          : "bg-white border"
      } rounded-xl p-4 border`}
    >
      <div className="flex items-center gap-3 mb-3">
        <img
          src={img}
          alt={title}
          className="w-14 h-14 rounded-full object-cover border"
        />
        <h4 className="text-lg font-semibold">{title}</h4>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>
    </div>
  );
}

function MealPlansTab({ theme }) {
  const [trial, setTrial] = useState({
    breakfast: {
      img: "/hero2.jpg",
      options: [
        { label: "Breakfast 1", veg: 99, nonveg: 129, category: "breakfast" },
        { label: "Breakfast 2", veg: 119, nonveg: 149, category: "breakfast" },
        { label: "Breakfast 3", veg: 139, nonveg: 169, category: "breakfast" },
      ],
    },
    lunch: { veg: 149, nonveg: 179, img: "/hero3.jpg" },
    dinner: { veg: 149, nonveg: 189, img: "/hero4.jpg" },
  });

  const [monthly, setMonthly] = useState({
    breakfastOnly: { veg: 1999, nonveg: 2299, img: "/hero2.jpg" },
    oneMeal: { label: "Lunch/Dinner", veg: 2499, nonveg: 2799 },
    twoMealsBLD: { label: "Breakfast + Lunch/Dinner", veg: 3899, nonveg: 4299 },
    twoMealsLD: { label: "Lunch + Dinner", veg: 3999, nonveg: 4399 },
    threeMeals: { label: "3 Meals a day", veg: 5299, nonveg: 5799 },
  });

  const [savingTrial, setSavingTrial] = useState(false);
  const [savingMonthly, setSavingMonthly] = useState(false);
  const [error, setError] = useState(null);
  const [trialImages, setTrialImages] = useState({
    // breakfast can hold a default and per-option files: { default: File, 0: File, 1: File }
    breakfast: {},
    lunch: null,
    dinner: null,
  });

  const [monthlyImages, setMonthlyImages] = useState({
    breakfastOnly: null,
    oneMeal: null,
    twoMealsBLD: null,
    twoMealsLD: null,
    threeMeals: null,
  });

  const [createdMonthly, setCreatedMonthly] = useState({});
  // persist created monthly plans to localStorage so UI still shows them after a page refresh
  const persistCreatedMonthly = (obj) => {
    try {
      // normalize values (unwrap possible { data: ... } envelopes) before storing
      const normalized = {};
      Object.entries(obj || {}).forEach(([k, v]) => {
        normalized[k] = v && v.data ? v.data : v;
      });
      setCreatedMonthly(normalized);
      if (typeof window !== "undefined")
        localStorage.setItem("createdMonthly", JSON.stringify(normalized));
    } catch (e) {
      console.error("persistCreatedMonthly -> failed to write localStorage", e);
      setCreatedMonthly(obj || {});
    }
  };
  const [createdTrial, setCreatedTrial] = useState([]);
  // helper to compute a stable id for a trial item (DB id if present, fallback to name+mealOption)
  const trialItemId = (it) =>
    (it && (it._id || it.id)) || `${it?.name}-${it?.mealOption}`;
  const hasCreatedCategory = (cat) =>
    Array.isArray(createdTrial) &&
    createdTrial.some((it) => it.category === cat);
  // editing states
  const [editingTrial, setEditingTrial] = useState({}); // id -> boolean
  const [editTrialData, setEditTrialData] = useState({}); // id -> { name, price, type, mealOption }
  const [editTrialImage, setEditTrialImage] = useState({}); // id -> File

  const [editingMonthlyKey, setEditingMonthlyKey] = useState(null); // single key being edited
  const [editingAllTrial, setEditingAllTrial] = useState(false);

  const handleTrialImage = (key, file, idx = null) => {
    // support per-option images for breakfast: idx === null -> default, idx is number -> per-option
    setTrialImages((s) => {
      if (key === "breakfast") {
        const current = s.breakfast || {};
        if (idx === null) {
          return { ...s, breakfast: { ...current, default: file } };
        }
        return { ...s, breakfast: { ...current, [idx]: file } };
      }
      return { ...s, [key]: file };
    });
  };

  const handleMonthlyImage = (key, file) => {
    setMonthlyImages((s) => ({ ...s, [key]: file }));
  };

  const getMonthlyPayload = (key, obj) => {
    switch (key) {
      case "breakfastOnly":
        return {
          name: obj.label || "Breakfast Only",
          mealsIncluded: ["breakfast"],
          price: { veg: Number(obj.veg), nonVeg: Number(obj.nonveg) },
        };
      case "oneMeal": {
        const label = (obj.label || "1 Meal").toLowerCase();
        const meals = [];
        if (label.includes("breakfast")) meals.push("breakfast");
        if (label.includes("lunch")) meals.push("lunch");
        if (label.includes("dinner")) meals.push("dinner");
        if (meals.length === 0) meals.push("lunch");
        return {
          name: obj.label || "1 Meal",
          mealsIncluded: meals,
          price: { veg: Number(obj.veg), nonVeg: Number(obj.nonveg) },
        };
      }
      case "twoMealsBLD":
        return {
          name: obj.label || "Breakfast + Lunch/Dinner",
          mealsIncluded: ["breakfast", "lunch"],
          price: { veg: Number(obj.veg), nonVeg: Number(obj.nonveg) },
        };
      case "twoMealsLD":
        return {
          name: obj.label || "Lunch + Dinner",
          mealsIncluded: ["lunch", "dinner"],
          price: { veg: Number(obj.veg), nonVeg: Number(obj.nonveg) },
        };
      case "threeMeals":
        return {
          name: obj.label || "3 Meals a day",
          mealsIncluded: ["breakfast", "lunch", "dinner"],
          price: { veg: Number(obj.veg), nonVeg: Number(obj.nonveg) },
        };
      default:
        return null;
    }
  };

  const handleUpdateMonthly = async (key) => {
    try {
      const existing = createdMonthly[key];
      // support objects that may be wrapped (e.g. { data: {...} }) from different responses
      const actual = existing && (existing.data || existing);
      const id = actual && (actual._id || actual.id);
      if (!actual || !id) {
        console.debug(
          "[Admin] handleUpdateMonthly -> missing id for key",
          key,
          { existing }
        );
        alert("No existing monthly plan to update (missing id)");
        return;
      }
      const payload = getMonthlyPayload(key, monthly[key]);
      const res = await updateMonthlyMeal(id, payload, monthlyImages[key]);
      // update in state and persist (support response shapes)
      const newObj = res?.data || res || {};
      const updated = { ...(createdMonthly || {}), [key]: newObj };
      persistCreatedMonthly(updated);
      alert("Monthly plan updated");
    } catch (err) {
      console.error(err);
      alert(err?.message || "Update failed");
    }
  };

  const startEditMonthly = (key) => {
    // populate monthly[key] from createdMonthly entry if present
    const existing = createdMonthly[key];
    const actual = existing && (existing.data || existing);
    if (actual) {
      const p = actual.price || {};
      const priceVeg = p.veg ?? p?.veg ?? actual.price?.veg ?? 0;
      const priceNon = p.nonVeg ?? p?.nonVeg ?? actual.price?.nonVeg ?? 0;
      // map to monthly state structures used in UI
      setMonthly((s) => ({
        ...s,
        [key]: {
          ...(s[key] || {}),
          label: actual.name || s[key]?.label,
          veg: Number(priceVeg || 0),
          nonveg: Number(priceNon || 0),
        },
      }));
    }
    setEditingMonthlyKey(key);
    console.debug("[Admin] startEditMonthly ->", key, existing);
  };

  const cancelEditMonthly = (key) => {
    // revert monthly[key] to createdMonthly values if present
    const existing = createdMonthly[key];
    if (existing) {
      const p = existing.price || {};
      setMonthly((s) => ({
        ...s,
        [key]: {
          ...(s[key] || {}),
          label: existing.name || s[key]?.label,
          veg: Number(p.veg || 0),
          nonveg: Number(p.nonVeg || p.nonveg || 0),
        },
      }));
    }
    setEditingMonthlyKey(null);
    console.debug("[Admin] cancelEditMonthly ->", key);
  };

  const handleDeleteMonthly = async (key) => {
    try {
      const existing = createdMonthly[key];
      const actual = existing && (existing.data || existing);
      const id = actual && (actual._id || actual.id);
      if (!actual || !id) {
        console.debug(
          "[Admin] handleDeleteMonthly -> missing id for key",
          key,
          { existing }
        );
        alert("No existing monthly plan to delete (missing id)");
        return;
      }
      await deleteMonthlyMeal(id);
      // remove and persist
      const copy = { ...(createdMonthly || {}) };
      delete copy[key];
      persistCreatedMonthly(copy);
      alert("Monthly plan deleted");
    } catch (err) {
      console.error(err);
      alert(err?.message || "Delete failed");
    }
  };

  const handleDeleteTrial = async (id) => {
    try {
      await deleteTrialMeal(id);
      // refresh from server to ensure DB was updated
      await fetchTrialItems();
      alert("Trial meal deleted");
    } catch (err) {
      console.error(err);
      alert(err?.message || "Delete failed");
    }
  };

  const fetchTrialItems = async () => {
    try {
      console.debug("[Admin] fetchTrialItems -> calling getAllTrialMeals");
      const data = await getAllTrialMeals();
      const items = Array.isArray(data)
        ? data
        : data?.data || data?.meals || [];
      setCreatedTrial(items);
      console.debug("[Admin] fetchTrialItems -> got", items.length, "items");
    } catch (err) {
      console.error("Failed to fetch trial items:", err);
    }
  };

  // Section-level edit controls
  const startEditAllTrials = () => {
    const map = {};
    const dataMap = {};
    createdTrial.forEach((it) => {
      const id = it._id || it.id || `${it.name}-${it.mealOption}`;
      map[id] = true;
      dataMap[id] = {
        name: it.name || "",
        price: it.price || it.price || 0,
        type: it.type || "vegetarian",
        mealOption: it.mealOption || null,
        category: it.category || "",
      };
    });
    setEditingTrial(map);
    setEditTrialData(dataMap);
    setEditTrialImage({});
    setEditingAllTrial(true);
    console.debug("[Admin] startEditAllTrials ->", Object.keys(map).length);
  };

  const cancelEditAllTrials = () => {
    setEditingTrial({});
    setEditTrialData({});
    setEditTrialImage({});
    setEditingAllTrial(false);
    console.debug("[Admin] cancelEditAllTrials");
  };

  const saveAllEditedTrials = async () => {
    try {
      const ids = Object.keys(editTrialData || {});
      if (ids.length === 0) return alert("Nothing to save");
      for (const id of ids) {
        const data = editTrialData[id];
        const payload = {
          name: data.name,
          category: data.category,
          type: data.type,
          price: Number(data.price || 0),
        };
        if (data.mealOption !== null && data.mealOption !== undefined)
          payload.mealOption = data.mealOption;
        console.debug(
          "[Admin] saveAllEditedTrials -> updating",
          id,
          payload,
          editTrialImage[id]
        );
        try {
          await updateTrialMeal(id, payload, editTrialImage[id]);
        } catch (e) {
          console.error("Failed to update trial", id, e);
          // continue with other updates
        }
      }
      // refresh list from server
      await fetchTrialItems();
      cancelEditAllTrials();
      alert("All trial items updated");
    } catch (err) {
      console.error(err);
      alert(err?.message || "Failed to save all trial items");
    }
  };

  const startEditTrial = (item) => {
    const id = trialItemId(item);
    setEditingTrial((s) => ({ ...s, [id]: true }));
    setEditTrialData((s) => ({
      ...s,
      [id]: {
        name: item.name || "",
        price: item.price || item.price || 0,
        type: item.type || "vegetarian",
        mealOption: item.mealOption || null,
        category: item.category || "",
      },
    }));
    setEditTrialImage((s) => ({ ...s, [id]: null }));
    console.debug("[Admin] startEditTrial ->", id, item);
  };

  const cancelEditTrial = (id) => {
    setEditingTrial((s) => {
      const copy = { ...s };
      delete copy[id];
      return copy;
    });
    setEditTrialData((s) => {
      const copy = { ...s };
      delete copy[id];
      return copy;
    });
    setEditTrialImage((s) => {
      const copy = { ...s };
      delete copy[id];
      return copy;
    });
    console.debug("[Admin] cancelEditTrial ->", id);
  };

  const saveEditedTrial = async (id) => {
    try {
      const data = editTrialData[id];
      if (!data) return alert("No changes to save");
      console.debug(
        "[Admin] saveEditedTrial -> id, data, file:",
        id,
        data,
        editTrialImage[id]
      );
      const payload = {
        name: data.name,
        category: data.category,
        type: data.type,
        price: Number(data.price || 0),
      };
      if (data.mealOption !== null && data.mealOption !== undefined)
        payload.mealOption = data.mealOption;

      const res = await updateTrialMeal(id, payload, editTrialImage[id]);
      // refresh from server to ensure data is consistent
      await fetchTrialItems();
      cancelEditTrial(id);
      alert("Trial meal updated");
    } catch (err) {
      console.error(err);
      alert(err?.message || "Update failed");
    }
  };

  const saveTrial = async () => {
    setError(null);
    setSavingTrial(true);
    try {
      const stripImages = (obj) =>
        JSON.parse(
          JSON.stringify(obj, (k, v) => (k === "img" ? undefined : v))
        );

      const clean = stripImages(trial);

      // Build individual create requests expected by backend (one document per category/type)
      const creations = [];

      // Breakfast options: each option has veg and nonveg prices -> create two records per option
      clean.breakfast.options.forEach((opt, idx) => {
        const optionNumber = idx + 1;
        // vegetarian
        creations.push({
          payload: {
            category: "breakfast",
            type: "vegetarian",
            price: Number(opt.veg),
            mealOption: optionNumber,
            name: opt.label,
          },
          image:
            (trialImages.breakfast && trialImages.breakfast[idx]) ||
            (trialImages.breakfast && trialImages.breakfast.default) ||
            null,
        });
        // non-vegetarian
        creations.push({
          payload: {
            category: "breakfast",
            type: "non-vegetarian",
            price: Number(opt.nonveg),
            mealOption: optionNumber,
            name: opt.label,
          },
          image:
            (trialImages.breakfast && trialImages.breakfast[idx]) ||
            (trialImages.breakfast && trialImages.breakfast.default) ||
            null,
        });
      });

      // Lunch
      if (clean.lunch) {
        creations.push({
          payload: {
            category: "lunch",
            type: "vegetarian",
            price: Number(clean.lunch.veg),
            name: "Lunch",
          },
          image: trialImages.lunch,
        });
        creations.push({
          payload: {
            category: "lunch",
            type: "non-vegetarian",
            price: Number(clean.lunch.nonveg),
            name: "Lunch",
          },
          image: trialImages.lunch,
        });
      }

      // Dinner
      if (clean.dinner) {
        creations.push({
          payload: {
            category: "dinner",
            type: "vegetarian",
            price: Number(clean.dinner.veg),
            name: "Dinner",
          },
          image: trialImages.dinner,
        });
        creations.push({
          payload: {
            category: "dinner",
            type: "non-vegetarian",
            price: Number(clean.dinner.nonveg),
            name: "Dinner",
          },
          image: trialImages.dinner,
        });
      }
      // sequentially call createTrialMeal so uploads are handled predictably
      const results = [];
      for (const c of creations) {
        const res = await createTrialMeal(c.payload, c.image);
        results.push(res);
      }
      setCreatedTrial(results.map((r) => r.data || r));
      // refresh from server to ensure we have DB IDs
      await fetchTrialItems();
      alert("Trial meal plan updated successfully");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save trial meal");
      alert("Failed to save trial meal: " + (err.message || err));
    } finally {
      setSavingTrial(false);
    }
  };

  const saveMonthly = async () => {
    setError(null);
    setSavingMonthly(true);
    try {
      const stripImages = (obj) =>
        JSON.parse(
          JSON.stringify(obj, (k, v) => (k === "img" ? undefined : v))
        );

      const clean = stripImages(monthly);

      // Build per-plan payloads matching backend: { name, mealsIncluded: [...], price: { veg, nonVeg } }
      const toPayload = (key, obj) => {
        switch (key) {
          case "breakfastOnly":
            return {
              name: obj.label || "Breakfast Only",
              mealsIncluded: ["breakfast"],
              price: { veg: Number(obj.veg), nonVeg: Number(obj.nonveg) },
            };
          case "oneMeal": {
            const label = (obj.label || "1 Meal").toLowerCase();
            const meals = [];
            if (label.includes("breakfast")) meals.push("breakfast");
            if (label.includes("lunch")) meals.push("lunch");
            if (label.includes("dinner")) meals.push("dinner");
            if (meals.length === 0) meals.push("lunch");
            return {
              name: obj.label || "1 Meal",
              mealsIncluded: meals,
              price: { veg: Number(obj.veg), nonVeg: Number(obj.nonveg) },
            };
          }
          case "twoMealsBLD":
            return {
              name: obj.label || "Breakfast + Lunch/Dinner",
              mealsIncluded: ["breakfast", "lunch"],
              price: { veg: Number(obj.veg), nonVeg: Number(obj.nonveg) },
            };
          case "twoMealsLD":
            return {
              name: obj.label || "Lunch + Dinner",
              mealsIncluded: ["lunch", "dinner"],
              price: { veg: Number(obj.veg), nonVeg: Number(obj.nonveg) },
            };
          case "threeMeals":
            return {
              name: obj.label || "3 Meals a day",
              mealsIncluded: ["breakfast", "lunch", "dinner"],
              price: { veg: Number(obj.veg), nonVeg: Number(obj.nonveg) },
            };
          default:
            return null;
        }
      };

      const creations = [];
      Object.entries(clean).forEach(([k, v]) => {
        const p = toPayload(k, v);
        if (p)
          creations.push({
            key: k,
            payload: p,
            image: monthlyImages[k] || null,
          });
      });

      const results = [];
      for (const c of creations) {
        const res = await createMonthlyMeal(c.payload, c.image);
        results.push({ key: c.key, data: res.data || res });
      }
      const map = {};
      results.forEach((r) => (map[r.key] = r.data));
      persistCreatedMonthly(map);
      alert("Monthly meal plans updated successfully");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save monthly plans");
      alert("Failed to save monthly plans: " + (err.message || err));
    } finally {
      setSavingMonthly(false);
    }
  };

  // fetch trial items on mount
  React.useEffect(() => {
    fetchTrialItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // load persisted created monthly plans (fall back to empty)
  React.useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem("createdMonthly");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === "object") {
            // normalize any envelopes so each value is the actual plan object
            const normalized = {};
            Object.entries(parsed).forEach(([k, v]) => {
              normalized[k] = v && v.data ? v.data : v;
            });
            setCreatedMonthly(normalized);
          }
        }
      }
    } catch (e) {
      console.debug("Failed to load createdMonthly from localStorage", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-8">
      <div
        className={`${
          theme === "dark"
            ? "bg-neutral-800 border-neutral-700"
            : "bg-white border"
        } rounded-xl p-4 border`}
      >
        <h3 className="text-lg font-semibold mb-4">Trial Meal Plan</h3>
        <div className="grid grid-cols-1 gap-4">
          <MealCard
            title="Breakfast"
            img={trial.breakfast.img}
            theme={theme}
            className="flex flex-col rounded-xl bg-neutral-50 dark:bg-neutral-900 shadow-sm p-4 gap-4"
          >
            {!hasCreatedCategory("breakfast") ? (
              <>
                {trial.breakfast.options.map((opt, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-4 rounded-xl shadow-sm space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                        Option #{idx + 1}
                      </h3>
                      <button
                        className="text-xs px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 transition text-white"
                        onClick={() =>
                          setTrial({
                            ...trial,
                            breakfast: {
                              ...trial.breakfast,
                              options: trial.breakfast.options.filter(
                                (_, i) => i !== idx
                              ),
                            },
                          })
                        }
                      >
                        Remove
                      </button>
                    </div>

                    {/* Upload Image */}
                    <div className="space-y-2">
                      <label className="text-xs text-neutral-500">
                        Upload Option Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleTrialImage("breakfast", e.target.files[0], idx)
                        }
                        className="file:px-4 file:py-1 file:rounded-lg file:bg-neutral-200 dark:file:bg-neutral-700 file:text-xs text-xs"
                      />
                      {trialImages.breakfast?.[idx] && (
                        <img
                          src={URL.createObjectURL(trialImages.breakfast[idx])}
                          alt="preview"
                          className="w-24 h-24 rounded-lg border object-cover"
                        />
                      )}
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-xs font-medium mb-1 text-neutral-600 dark:text-neutral-300">
                        Name
                      </label>
                      <input
                        type="text"
                        value={opt.label}
                        onChange={(e) =>
                          setTrial({
                            ...trial,
                            breakfast: {
                              ...trial.breakfast,
                              options: trial.breakfast.options.map((o, i) =>
                                i === idx ? { ...o, label: e.target.value } : o
                              ),
                            },
                          })
                        }
                        className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-sm bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white"
                      />
                    </div>

                    <div className="text-xs text-neutral-500">
                      Category: <span className="font-semibold">Breakfast</span>
                    </div>

                    {/* Prices */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <PriceInput
                        label="Veg Price"
                        value={opt.veg}
                        theme={theme}
                        onChange={(v) =>
                          setTrial({
                            ...trial,
                            breakfast: {
                              ...trial.breakfast,
                              options: trial.breakfast.options.map((o, i) =>
                                i === idx ? { ...o, veg: v } : o
                              ),
                            },
                          })
                        }
                      />
                      <PriceInput
                        label="Non-Veg Price"
                        value={opt.nonveg}
                        theme={theme}
                        onChange={(v) =>
                          setTrial({
                            ...trial,
                            breakfast: {
                              ...trial.breakfast,
                              options: trial.breakfast.options.map((o, i) =>
                                i === idx ? { ...o, nonveg: v } : o
                              ),
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                ))}

                {/* ADD OPTION BUTTON */}
                <button
                  className="rounded-xl py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm transition mt-2"
                  onClick={() =>
                    setTrial({
                      ...trial,
                      breakfast: {
                        ...trial.breakfast,
                        options: [
                          ...trial.breakfast.options,
                          {
                            label: "New Option",
                            veg: 0,
                            nonveg: 0,
                            category: "breakfast",
                          },
                        ],
                      },
                    })
                  }
                >
                  + Add Breakfast Option
                </button>
              </>
            ) : (
              <div className="border text-sm text-neutral-500">
                items already created
              </div>
            )}

            {/* Already Created Trial Items */}
            {createdTrial
              .filter((it) => it.category === "breakfast")
              .map((it) => {
                const id = trialItemId(it);
                const editing = !!editingTrial[id];

                return (
                  <div
                    key={id}
                    className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-sm p-4 mt-4 transition-all"
                  >
                    {!editing ? (
                      <div className="flex justify-between items-center gap-3">
                        {/* Item Info */}
                        <div className="flex flex-col">
                          <p className="font-semibold text-sm md:text-base">
                            {it.name}
                          </p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            {it.type} • {it.category}
                          </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-2">
                          <button
                            className="text-xs md:text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-1 transition"
                            onClick={() => startEditTrial(it)}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="text-xs md:text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg px-3 py-1 transition"
                            onClick={() => handleDeleteTrial(id)}
                          >
                            🗑 Delete
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col md:flex-row md:flex-wrap gap-3 items-center">
                        {/* Name */}
                        <input
                          type="text"
                          value={editTrialData[id]?.name}
                          onChange={(e) =>
                            setEditTrialData((s) => ({
                              ...s,
                              [id]: { ...s[id], name: e.target.value },
                            }))
                          }
                          className="w-full md:w-auto px-3 py-2 text-xs md:text-sm rounded-lg border dark:border-neutral-600 bg-white dark:bg-neutral-800"
                          placeholder="Food name"
                        />

                        {/* Price */}
                        <input
                          type="number"
                          min={0}
                          value={editTrialData[id]?.price}
                          onChange={(e) =>
                            setEditTrialData((s) => ({
                              ...s,
                              [id]: { ...s[id], price: Number(e.target.value) },
                            }))
                          }
                          className="w-full md:w-24 px-3 py-2 text-xs md:text-sm rounded-lg border dark:border-neutral-600 bg-white dark:bg-neutral-800"
                          placeholder="Price"
                        />

                        {/* Image */}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setEditTrialImage((s) => ({
                              ...s,
                              [id]: e.target.files[0],
                            }))
                          }
                          className="w-full text-xs md:text-sm"
                        />

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-2">
                          <button
                            className="text-xs md:text-sm px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white transition"
                            onClick={() => saveEditedTrial(id)}
                          >
                            💾 Save
                          </button>
                          <button
                            className="text-xs md:text-sm px-4 py-2 bg-neutral-300 dark:bg-neutral-700 hover:opacity-80 rounded-lg text-black dark:text-white transition"
                            onClick={() => cancelEditTrial(id)}
                          >
                            ❌ Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </MealCard>

          <div className="grid  grid-cols-1 md:grid-cols-2 gap-6">
            {/* LUNCH CARD */}
            <MealCard title="Lunch" img={trial.lunch.img} theme={theme}>
              {!hasCreatedCategory("lunch") && (
                <div className="w-[210%] rounded-xl bg-white dark:bg-neutral-900 shadow p-5 border border-neutral-200/60 dark:border-neutral-800/60">
                  {/* Header with Image + Title */}
                  <div className="flex items-center gap-3 mb-4">
                    {trialImages.lunch ? (
                      <img
                        src={URL.createObjectURL(trialImages.lunch)}
                        alt="Preview"
                        className="w-12 h-12 rounded-full object-cover border shadow-sm"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
                    )}

                    <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                      Lunch
                    </h2>
                  </div>

                  {/* Upload Section */}
                  <label className="text-sm text-neutral-600 dark:text-neutral-300">
                    Upload Option Image
                  </label>

                  <div className="flex items-center gap-3 mt-1">
                    <input
                      type="file"
                      accept="image/*"
                      className="text-sm file:px-3 file:py-1 file:border file:rounded-md file:bg-neutral-100 dark:file:bg-neutral-800 file:border-neutral-300 dark:file:border-neutral-700 file:text-neutral-700 dark:file:text-neutral-300 cursor-pointer"
                      onChange={(e) =>
                        handleTrialImage("lunch", e.target.files[0])
                      }
                    />
                  </div>

                  {/* Prices */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <PriceInput
                      label="Veg Price"
                      value={trial.lunch.veg}
                      theme={theme}
                      onChange={(v) =>
                        setTrial({
                          ...trial,
                          lunch: { ...trial.lunch, veg: v },
                        })
                      }
                    />

                    <PriceInput
                      label="Non-Veg Price"
                      value={trial.lunch.nonveg}
                      theme={theme}
                      onChange={(v) =>
                        setTrial({
                          ...trial,
                          lunch: { ...trial.lunch, nonveg: v },
                        })
                      }
                    />
                  </div>
                </div>
              )}

              {/* Render Lunch Items */}
              <div className="space-y-3 mt-4 flex flex-col w-[400px]">
                {createdTrial
                  .filter((it) => it.category === "lunch")
                  .map((it) => {
                    const id = trialItemId(it);
                    const editing = !!editingTrial[id];

                    return (
                      <div
                        key={id}
                        className="mt-4 p-3  border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-xl shadow-sm"
                      >
                        {!editing ? (
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold">{it.name}</p>
                              <span className="text-[10px] text-neutral-500">
                                {it.type}
                              </span>
                            </div>

                            <div className="flex gap-2">
                              <button
                                className="px-3 py-1 text-xs rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
                                onClick={() => startEditTrial(it)}
                              >
                                Edit
                              </button>
                              <button
                                className="px-3 py-1 text-xs rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
                                onClick={() => handleDeleteTrial(id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={editTrialData[id]?.name || it.name}
                              onChange={(e) =>
                                setEditTrialData((s) => ({
                                  ...s,
                                  [id]: { ...s[id], name: e.target.value },
                                }))
                              }
                              className="px-3 py-2 text-sm rounded-lg border dark:border-neutral-700 bg-white dark:bg-neutral-800"
                            />
                            <input
                              type="number"
                              min={0}
                              value={editTrialData[id]?.price || it.price}
                              onChange={(e) =>
                                setEditTrialData((s) => ({
                                  ...s,
                                  [id]: {
                                    ...s[id],
                                    price: Number(e.target.value),
                                  },
                                }))
                              }
                              className="px-3 py-2 text-sm rounded-lg border dark:border-neutral-700 bg-white dark:bg-neutral-800"
                            />

                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                setEditTrialImage((s) => ({
                                  ...s,
                                  [id]: e.target.files[0],
                                }))
                              }
                              className="text-xs"
                            />

                            <div className="flex gap-2">
                              <button
                                className="px-3 py-2 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition"
                                onClick={() => saveEditedTrial(id)}
                              >
                                Save
                              </button>
                              <button
                                className="px-3 py-2 text-xs rounded-lg bg-gray-300 dark:bg-neutral-700 text-black dark:text-white transition"
                                onClick={() => cancelEditTrial(id)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </MealCard>

            {/* DINNER CARD - Same Styling */}
            <MealCard title="Dinner" img={trial.dinner.img} theme={theme}>
              {!hasCreatedCategory("dinner") && (
                <div className="w-[210%] rounded-xl bg-white dark:bg-neutral-900 shadow p-5 border border-neutral-200/60 dark:border-neutral-800/60">
                  {/* Header with Image + Title */}
                  <div className="flex items-center gap-3 mb-4">
                    {trialImages.dinner ? (
                      <img
                        src={URL.createObjectURL(trialImages.dinner)}
                        alt="Preview"
                        className="w-12 h-12 rounded-full object-cover border shadow-sm"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
                    )}

                    <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                      Dinner
                    </h2>
                  </div>

                  {/* Upload Section */}
                  <label className="text-sm text-neutral-600 dark:text-neutral-300">
                    Upload Option Image
                  </label>

                  <div className="flex items-center gap-3 mt-1">
                    <input
                      type="file"
                      accept="image/*"
                      className="text-sm file:px-3 file:py-1 file:border file:rounded-md file:bg-neutral-100 dark:file:bg-neutral-800 file:border-neutral-300 dark:file:border-neutral-700 file:text-neutral-700 dark:file:text-neutral-300 cursor-pointer"
                      onChange={(e) =>
                        handleTrialImage("dinner", e.target.files[0])
                      }
                    />
                  </div>

                  {/* Prices */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <PriceInput
                      label="Veg Price"
                      value={trial.dinner.veg}
                      theme={theme}
                      onChange={(v) =>
                        setTrial({
                          ...trial,
                          dinner: { ...trial.dinner, veg: v },
                        })
                      }
                    />

                    <PriceInput
                      label="Non-Veg Price"
                      value={trial.dinner.nonveg}
                      theme={theme}
                      onChange={(v) =>
                        setTrial({
                          ...trial,
                          dinner: { ...trial.dinner, nonveg: v },
                        })
                      }
                    />
                  </div>
                </div>
              )}

              {/* Render Dinner Items */}
              {/* (Same layout as above mapping) */}
              <div className="space-y-3 mt-4 flex flex-col w-[400px]">
                {createdTrial
                  .filter((it) => it.category === "dinner")
                  .map((it) => {
                    // Same mapping component as Lunch (reuse)
                    const id = trialItemId(it);
                    const editing = !!editingTrial[id];

                    return (
                      <div
                        key={id}
                        className="mt-4 p-3 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-xl shadow-sm"
                      >
                        {!editing ? (
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold">{it.name}</p>
                              <span className="text-[10px] text-neutral-500">
                                {it.type}
                              </span>
                            </div>

                            <div className="flex gap-2">
                              <button
                                className="px-3 py-1 text-xs rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
                                onClick={() => startEditTrial(it)}
                              >
                                Edit
                              </button>
                              <button
                                className="px-3 py-1 text-xs rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
                                onClick={() => handleDeleteTrial(id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={editTrialData[id]?.name || it.name}
                              onChange={(e) =>
                                setEditTrialData((s) => ({
                                  ...s,
                                  [id]: { ...s[id], name: e.target.value },
                                }))
                              }
                              className="px-3 py-2 rounded-lg border text-sm dark:border-neutral-700 bg-white dark:bg-neutral-800"
                            />
                            <input
                              type="number"
                              min={0}
                              value={editTrialData[id]?.price || it.price}
                              onChange={(e) =>
                                setEditTrialData((s) => ({
                                  ...s,
                                  [id]: {
                                    ...s[id],
                                    price: Number(e.target.value),
                                  },
                                }))
                              }
                              className="px-3 py-2 rounded-lg border text-sm dark:border-neutral-700 bg-white dark:bg-neutral-800"
                            />

                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                setEditTrialImage((s) => ({
                                  ...s,
                                  [id]: e.target.files[0],
                                }))
                              }
                              className="text-xs"
                            />

                            <div className="flex gap-2">
                              <button
                                className="px-3 py-2 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition"
                                onClick={() => saveEditedTrial(id)}
                              >
                                Save
                              </button>
                              <button
                                className="px-3 py-2 text-xs rounded-lg bg-gray-300 dark:bg-neutral-700 text-black dark:text-white transition"
                                onClick={() => cancelEditTrial(id)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </MealCard>
          </div>
        </div>
        <div className="mt-4 flex  justify-end items-center gap-3">
          {error && <div className="text-sm text-red-500">{error}</div>}
          <button
            onClick={saveTrial}
            disabled={savingTrial}
            className={`px-4 py-2 rounded text-white ${
              savingTrial
                ? "bg-gray-400"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {savingTrial ? "Saving..." : "Save Trial Prices"}
          </button>
        </div>
      </div>

      <div
        className={`${
          theme === "dark"
            ? "bg-neutral-800 border-neutral-700"
            : "bg-white border"
        } rounded-xl p-4 border`}
      >
        <h3 className="text-lg font-semibold mb-4">Monthly Meal Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MealCard
            title="Breakfast Only"
            img={monthly.breakfastOnly.img}
            theme={theme}
          >
            {createdMonthly.breakfastOnly &&
            editingMonthlyKey !== "breakfastOnly" ? (
              // show created summary when present and not editing
              <div className=" rounded border bg-white dark:bg-neutral-800">
                <div className="font-medium">
                  {createdMonthly.breakfastOnly.name}
                </div>
                <div className="text-xs text-neutral-500">
                  Meals:{" "}
                  {(createdMonthly.breakfastOnly.mealsIncluded || []).join(
                    ", "
                  )}
                </div>
                <div className="mt-2 text-sm">
                  Veg: ₹{createdMonthly.breakfastOnly.price?.veg ?? "-"} •
                  Non-Veg: ₹
                  {createdMonthly.breakfastOnly.price?.nonVeg ??
                    createdMonthly.breakfastOnly.price?.nonveg ??
                    "-"}
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => startEditMonthly("breakfastOnly")}
                    className="px-3 py-1 rounded bg-yellow-600 text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteMonthly("breakfastOnly")}
                    className="px-3 py-1 rounded bg-red-600 text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              // show inputs (either creating or editing)
              <>
                <div className="mb-3">
                  <label className="block text-sm">Image (optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleMonthlyImage("breakfastOnly", e.target.files[0])
                    }
                    className="mt-1"
                  />
                  {monthlyImages.breakfastOnly && (
                    <img
                      src={URL.createObjectURL(monthlyImages.breakfastOnly)}
                      alt="preview"
                      className="w-20 h-20 rounded mt-2 object-cover"
                    />
                  )}
                </div>
                <PriceInput
                  label="Veg Price"
                  value={monthly.breakfastOnly.veg}
                  theme={theme}
                  onChange={(v) =>
                    setMonthly({
                      ...monthly,
                      breakfastOnly: { ...monthly.breakfastOnly, veg: v },
                    })
                  }
                />
                <PriceInput
                  label="Non-Veg Price"
                  value={monthly.breakfastOnly.nonveg}
                  theme={theme}
                  onChange={(v) =>
                    setMonthly({
                      ...monthly,
                      breakfastOnly: { ...monthly.breakfastOnly, nonveg: v },
                    })
                  }
                />
                {createdMonthly.breakfastOnly &&
                  editingMonthlyKey === "breakfastOnly" && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => {
                          handleUpdateMonthly("breakfastOnly");
                          setEditingMonthlyKey(null);
                        }}
                        className="px-3 py-1 rounded bg-emerald-600 text-white"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => cancelEditMonthly("breakfastOnly")}
                        className="px-3 py-1 rounded bg-gray-300 text-black"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
              </>
            )}
          </MealCard>

          <div
            className={`${
              theme === "dark"
                ? "bg-neutral-800 border-neutral-700"
                : "bg-white border"
            } rounded-xl p-4 border`}
          >
            <h4 className="text-lg font-semibold mb-2">
              1 Meal ({monthly.oneMeal.label})
            </h4>
            {createdMonthly.oneMeal && editingMonthlyKey !== "oneMeal" ? (
              <div className="p-3 rounded border bg-white dark:bg-neutral-800">
                <div className="font-medium">{createdMonthly.oneMeal.name}</div>
                <div className="text-xs text-neutral-500">
                  Meals:{" "}
                  {(createdMonthly.oneMeal.mealsIncluded || []).join(", ")}
                </div>
                <div className="mt-2 text-sm">
                  Veg: ₹{createdMonthly.oneMeal.price?.veg ?? "-"} • Non-Veg: ₹
                  {createdMonthly.oneMeal.price?.nonVeg ??
                    createdMonthly.oneMeal.price?.nonveg ??
                    "-"}
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => startEditMonthly("oneMeal")}
                    className="px-3 py-1 rounded bg-yellow-600 text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteMonthly("oneMeal")}
                    className="px-3 py-1 rounded bg-red-600 text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-3 ">
                  <label className="block text-sm">Image (optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleMonthlyImage("oneMeal", e.target.files[0])
                    }
                    className="mt-1"
                  />
                  {monthlyImages.oneMeal && (
                    <img
                      src={URL.createObjectURL(monthlyImages.oneMeal)}
                      alt="preview"
                      className="w-20 h-20 rounded mt-2 object-cover"
                    />
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <PriceInput
                    label="Veg Price"
                    value={monthly.oneMeal.veg}
                    theme={theme}
                    onChange={(v) =>
                      setMonthly({
                        ...monthly,
                        oneMeal: { ...monthly.oneMeal, veg: v },
                      })
                    }
                  />
                  <PriceInput
                    label="Non-Veg Price"
                    value={monthly.oneMeal.nonveg}
                    theme={theme}
                    onChange={(v) =>
                      setMonthly({
                        ...monthly,
                        oneMeal: { ...monthly.oneMeal, nonveg: v },
                      })
                    }
                  />
                </div>
                {createdMonthly.oneMeal && editingMonthlyKey === "oneMeal" && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => {
                        handleUpdateMonthly("oneMeal");
                        setEditingMonthlyKey(null);
                      }}
                      className="px-3 py-1 rounded bg-emerald-600 text-white"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => cancelEditMonthly("oneMeal")}
                      className="px-3 py-1 rounded bg-gray-300 text-black"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <div
            className={`${
              theme === "dark"
                ? "bg-neutral-800 border-neutral-700"
                : "bg-white border"
            } rounded-xl p-4 border`}
          >
            <h4 className="text-lg font-semibold mb-2">
              2 Meals ({monthly.twoMealsBLD.label})
            </h4>
            {createdMonthly.twoMealsBLD &&
            editingMonthlyKey !== "twoMealsBLD" ? (
              <div className="p-3 rounded border bg-white dark:bg-neutral-800">
                <div className="font-medium">
                  {createdMonthly.twoMealsBLD.name}
                </div>
                <div className="text-xs text-neutral-500">
                  Meals:{" "}
                  {(createdMonthly.twoMealsBLD.mealsIncluded || []).join(", ")}
                </div>
                <div className="mt-2 text-sm">
                  Veg: ₹{createdMonthly.twoMealsBLD.price?.veg ?? "-"} •
                  Non-Veg: ₹
                  {createdMonthly.twoMealsBLD.price?.nonVeg ??
                    createdMonthly.twoMealsBLD.price?.nonveg ??
                    "-"}
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => startEditMonthly("twoMealsBLD")}
                    className="px-3 py-1 rounded bg-yellow-600 text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteMonthly("twoMealsBLD")}
                    className="px-3 py-1 rounded bg-red-600 text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-3">
                  <label className="block text-sm">Image (optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleMonthlyImage("twoMealsBLD", e.target.files[0])
                    }
                    className="mt-1"
                  />
                  {monthlyImages.twoMealsBLD && (
                    <img
                      src={URL.createObjectURL(monthlyImages.twoMealsBLD)}
                      alt="preview"
                      className="w-20 h-20 rounded mt-2 object-cover"
                    />
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <PriceInput
                    label="Veg Price"
                    value={monthly.twoMealsBLD.veg}
                    theme={theme}
                    onChange={(v) =>
                      setMonthly({
                        ...monthly,
                        twoMealsBLD: { ...monthly.twoMealsBLD, veg: v },
                      })
                    }
                  />
                  <PriceInput
                    label="Non-Veg Price"
                    value={monthly.twoMealsBLD.nonveg}
                    theme={theme}
                    onChange={(v) =>
                      setMonthly({
                        ...monthly,
                        twoMealsBLD: { ...monthly.twoMealsBLD, nonveg: v },
                      })
                    }
                  />
                </div>
                {createdMonthly.twoMealsBLD &&
                  editingMonthlyKey === "twoMealsBLD" && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => {
                          handleUpdateMonthly("twoMealsBLD");
                          setEditingMonthlyKey(null);
                        }}
                        className="px-3 py-1 rounded bg-emerald-600 text-white"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => cancelEditMonthly("twoMealsBLD")}
                        className="px-3 py-1 rounded bg-gray-300 text-black"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
              </>
            )}
          </div>

          <div
            className={`${
              theme === "dark"
                ? "bg-neutral-800 border-neutral-700"
                : "bg-white border"
            } rounded-xl p-4 border`}
          >
            <h4 className="text-lg font-semibold mb-2">
              2 Meals ({monthly.twoMealsLD.label})
            </h4>
            {createdMonthly.twoMealsLD && editingMonthlyKey !== "twoMealsLD" ? (
              <div className="p-3 rounded border bg-white dark:bg-neutral-800">
                <div className="font-medium">
                  {createdMonthly.twoMealsLD.name}
                </div>
                <div className="text-xs text-neutral-500">
                  Meals:{" "}
                  {(createdMonthly.twoMealsLD.mealsIncluded || []).join(", ")}
                </div>
                <div className="mt-2 text-sm">
                  Veg: ₹{createdMonthly.twoMealsLD.price?.veg ?? "-"} • Non-Veg:
                  ₹
                  {createdMonthly.twoMealsLD.price?.nonVeg ??
                    createdMonthly.twoMealsLD.price?.nonveg ??
                    "-"}
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => startEditMonthly("twoMealsLD")}
                    className="px-3 py-1 rounded bg-yellow-600 text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteMonthly("twoMealsLD")}
                    className="px-3 py-1 rounded bg-red-600 text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-3">
                  <label className="block text-sm">Image (optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleMonthlyImage("twoMealsLD", e.target.files[0])
                    }
                    className="mt-1"
                  />
                  {monthlyImages.twoMealsLD && (
                    <img
                      src={URL.createObjectURL(monthlyImages.twoMealsLD)}
                      alt="preview"
                      className="w-20 h-20 rounded mt-2 object-cover"
                    />
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <PriceInput
                    label="Veg Price"
                    value={monthly.twoMealsLD.veg}
                    theme={theme}
                    onChange={(v) =>
                      setMonthly({
                        ...monthly,
                        twoMealsLD: { ...monthly.twoMealsLD, veg: v },
                      })
                    }
                  />
                  <PriceInput
                    label="Non-Veg Price"
                    value={monthly.twoMealsLD.nonveg}
                    theme={theme}
                    onChange={(v) =>
                      setMonthly({
                        ...monthly,
                        twoMealsLD: { ...monthly.twoMealsLD, nonveg: v },
                      })
                    }
                  />
                </div>
                {createdMonthly.twoMealsLD &&
                  editingMonthlyKey === "twoMealsLD" && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => {
                          handleUpdateMonthly("twoMealsLD");
                          setEditingMonthlyKey(null);
                        }}
                        className="px-3 py-1 rounded bg-emerald-600 text-white"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => cancelEditMonthly("twoMealsLD")}
                        className="px-3 py-1 rounded bg-gray-300 text-black"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
              </>
            )}
          </div>

          <div
            className={`${
              theme === "dark"
                ? "bg-neutral-800 border-neutral-700"
                : "bg-white border"
            } rounded-xl p-4 border`}
          >
            <h4 className="text-lg font-semibold mb-2">3 Meals a Day</h4>
            {createdMonthly.threeMeals && editingMonthlyKey !== "threeMeals" ? (
              <div className="p-3 rounded border bg-white dark:bg-neutral-800">
                <div className="font-medium">
                  {createdMonthly.threeMeals.name}
                </div>
                <div className="text-xs text-neutral-500">
                  Meals:{" "}
                  {(createdMonthly.threeMeals.mealsIncluded || []).join(", ")}
                </div>
                <div className="mt-2 text-sm">
                  Veg: ₹{createdMonthly.threeMeals.price?.veg ?? "-"} • Non-Veg:
                  ₹
                  {createdMonthly.threeMeals.price?.nonVeg ??
                    createdMonthly.threeMeals.price?.nonveg ??
                    "-"}
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => startEditMonthly("threeMeals")}
                    className="px-3 py-1 rounded bg-yellow-600 text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteMonthly("threeMeals")}
                    className="px-3 py-1 rounded bg-red-600 text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-3">
                  <label className="block text-sm">Image (optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleMonthlyImage("threeMeals", e.target.files[0])
                    }
                    className="mt-1"
                  />
                  {monthlyImages.threeMeals && (
                    <img
                      src={URL.createObjectURL(monthlyImages.threeMeals)}
                      alt="preview"
                      className="w-20 h-20 rounded mt-2 object-cover"
                    />
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <PriceInput
                    label="Veg Price"
                    value={monthly.threeMeals.veg}
                    theme={theme}
                    onChange={(v) =>
                      setMonthly({
                        ...monthly,
                        threeMeals: { ...monthly.threeMeals, veg: v },
                      })
                    }
                  />
                  <PriceInput
                    label="Non-Veg Price"
                    value={monthly.threeMeals.nonveg}
                    theme={theme}
                    onChange={(v) =>
                      setMonthly({
                        ...monthly,
                        threeMeals: { ...monthly.threeMeals, nonveg: v },
                      })
                    }
                  />
                </div>
                {createdMonthly.threeMeals &&
                  editingMonthlyKey === "threeMeals" && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => {
                          handleUpdateMonthly("threeMeals");
                          setEditingMonthlyKey(null);
                        }}
                        className="px-3 py-1 rounded bg-emerald-600 text-white"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => cancelEditMonthly("threeMeals")}
                        className="px-3 py-1 rounded bg-gray-300 text-black"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
              </>
            )}
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={saveMonthly}
            disabled={savingMonthly}
            className={`px-4 py-2 rounded text-white ${
              savingMonthly
                ? "bg-gray-400"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {savingMonthly ? "Saving..." : "Save Monthly Prices"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Page() {
  const [active, setActive] = useState("overview");
  const [showMobile, setShowMobile] = useState(false);
  const [theme, setTheme] = useState("light");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoadingAnalytics(true);
        const data = await getAnalytics();
        if (data && data.data) {
          setAnalyticsData(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoadingAnalytics(false);
      }
    };

    fetchAnalytics();
  }, []);

  // messages state
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messagesError, setMessagesError] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);
        const res = await getAllMessages();
        // backend returns { data: [...] }
        const arr = res?.data ?? res ?? [];
        setMessages(Array.isArray(arr) ? arr : []);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setMessagesError(err?.message || "Failed to load messages");
      } finally {
        setLoadingMessages(false);
      }
    };
    fetchMessages();
  }, []);

  const handleDeleteMessage = async (id) => {
    if (!id) return;
    const ok = window.confirm(
      "Delete this message? This action cannot be undone."
    );
    if (!ok) return;
    try {
      setLoadingMessages(true);
      await deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Failed to delete message:", err);
      setMessagesError(err?.message || "Failed to delete message");
    } finally {
      setLoadingMessages(false);
    }
  };

  return (
    <div
      className={`${
        theme === "dark"
          ? "bg-neutral-900 text-white"
          : "bg-white text-neutral-900"
      } min-h-screen`}
    >
      <div
        className={`md:hidden sticky top-0 z-30 ${
          theme === "dark"
            ? "bg-neutral-800 border-neutral-700 text-white"
            : "bg-white border-neutral-200"
        } border-b px-4 py-3 flex items-center gap-3`}
      >
        <div className="font-semibold flex-1">Admin Dashboard</div>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={`px-3 py-1 rounded text-sm ${
            theme === "dark" ? "bg-neutral-700" : "bg-neutral-200"
          }`}
        >
          {theme === "dark" ? "Light" : "Dark"}
        </button>
      </div>

      {showMobile && (
        <div
          onClick={() => setShowMobile(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        />
      )}

      <div className="flex">
        <Sidebar
          active={active}
          setActive={setActive}
          showMobile={showMobile}
          setShowMobile={setShowMobile}
          theme={theme}
          setTheme={setTheme}
          hasMessages={messages && messages.length > 0}
        />

        <main
          className={`flex-1 min-w-0 p-4 md:p-6 lg:p-8 md:ml-64 ${
            theme === "dark" ? "text-white" : ""
          }`}
        >
          <div className="max-w-7xl mx-auto">
            <HeaderBar
              title={
                active === "overview"
                  ? "Overall"
                  : active === "subscribers"
                  ? "Subscribers"
                  : active === "payments"
                  ? "Payments"
                  : active === "mealplans"
                  ? "Update Meal Plans"
                  : active === "message"
                  ? "Messages"
                  : "Future"
              }
              subtitle={
                active === "overview"
                  ? "Key metrics and recent activity"
                  : active === "subscribers"
                  ? "Manage and inspect all subscribers"
                  : active === "payments"
                  ? "Revenue, dues and payment status"
                  : active === "mealplans"
                  ? "Configure trial and monthly meal plan pricing"
                  : active === "message"
                  ? "Contact form messages from the site"
                  : "Upcoming features preview"
              }
              theme={theme}
              onAction={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            />
            <AllUsersControl theme={theme} />
            {active === "overview" && (
              <OverviewTab theme={theme} analyticsData={analyticsData} />
            )}
            {active === "subscribers" && (
              <SubscribersTab theme={theme} analyticsData={analyticsData} />
            )}
            {active === "payments" && (
              <PaymentsTab theme={theme} analyticsData={analyticsData} />
            )}
            {active === "mealplans" && <MealPlansTab theme={theme} />}
            {active === "message" && (
              <MessagesTab
                theme={theme}
                messages={messages}
                loading={loadingMessages}
                error={messagesError}
                onDeleteMessage={handleDeleteMessage}
              />
            )}
            {active === "future" && <FutureTab theme={theme} />}
          </div>
        </main>
      </div>

      <button
        type="button"
        onClick={() => setShowMobile(true)}
        className={`md:hidden fixed bottom-4 left-4 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center ${
          theme === "dark"
            ? "bg-emerald-600 text-white"
            : "bg-emerald-500 text-white"
        }`}
        aria-label="Open menu"
      >
        ☰
      </button>
    </div>
  );
}

export default Page;
