"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

// Tabs
import OverviewTab from "./Tabs/OverviewTab";
import SubscribersTab from "./Tabs/SubscribersTab";
import PaymentsTab from "./Tabs/PaymentsTab";
import MealPlansTab from "./Tabs/MealPlansTab";
import MessagesTab from "./Tabs/MessagesTab";
import FutureTab from "./Tabs/FutureTab";
import AllUsersControl from "./Tabs/AllUsersControl";

// Sidebar buttons
import HomeButton from "./SidebarButtons/HomeButton";
import SubscribersButton from "./SidebarButtons/SubscribersButton";
import PaymentsButton from "./SidebarButtons/PaymentsButton";
import MealPlansButton from "./SidebarButtons/MealPlansButton";
import MessagesButton from "./SidebarButtons/MessagesButton";
import UiUpdateButton from "./SidebarButtons/UiUpdateButton";

// APIs
import { getAnalytics, getAllMessages, deleteMessage } from "../../api/admin";
import { adminLogout } from "../../redux/slices/adminAuthSlice";

export default function Page() {
  const [active, setActive] = useState("overview");
  const [theme, setTheme] = useState("light");

  const [analyticsData, setAnalyticsData] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messagesError, setMessagesError] = useState("");

  const adminToken = useSelector((s) => s.adminAuth?.token);
  const dispatch = useDispatch();
  const router = useRouter();

  // Fetch analytics once
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoadingAnalytics(true);
        const data = await getAnalytics(adminToken);
        const payload = data?.data || data || null;
        setAnalyticsData(payload);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoadingAnalytics(false);
      }
    };

    fetchAnalytics();
  }, [adminToken]);

  // Fetch contact messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);
        const res = await getAllMessages(adminToken);
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
  }, [adminToken]);

  const handleDeleteMessage = async (id) => {
    if (!id) return;
    const ok = window.confirm(
      "Delete this message? This action cannot be undone."
    );
    if (!ok) return;
    try {
      setLoadingMessages(true);
      await deleteMessage(id, adminToken);
      setMessages((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Failed to delete message:", err);
      setMessagesError(err?.message || "Failed to delete message");
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleLogout = () => {
    dispatch(adminLogout());
    router.push("/Admin/auth");
  };


  return (
    <div className="h-screen flex bg-slate-50 text-slate-800 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-slate-200/80 bg-white h-screen sticky top-0 flex-col">
        <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">
          <div className="font-extrabold text-xl tracking-tight text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
            <span>FittBox Admin</span>
          </div>
        </div>
        <div className="py-6 space-y-1 flex-1 overflow-y-auto">
          <HomeButton
            active={active}
            setActive={setActive}
            theme={theme}
            setShowMobile={() => {}}
          />
          <SubscribersButton
            active={active}
            setActive={setActive}
            theme={theme}
            setShowMobile={() => {}}
          />
          <PaymentsButton
            active={active}
            setActive={setActive}
            theme={theme}
            setShowMobile={() => {}}
          />
          <MealPlansButton
            active={active}
            setActive={setActive}
            theme={theme}
            setShowMobile={() => {}}
          />
          <MessagesButton
            active={active}
            setActive={setActive}
            theme={theme}
            hasMessages={messages && messages.length > 0}
            setShowMobile={() => {}}
          />
          <UiUpdateButton
            active={active}
            setActive={setActive}
            theme={theme}
            setShowMobile={() => {}}
          />
        </div>
        <div className="border-t border-slate-100 p-5 bg-white">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2.5 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer text-center"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 h-screen overflow-y-auto p-6 md:p-8 bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Simple header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                {active === "overview"
                  ? "Overview"
                  : active === "subscribers"
                  ? "Subscribers"
                  : active === "payments"
                  ? "Payments"
                  : active === "mealplans"
                  ? "Meal Plans"
                  : active === "message"
                  ? "Messages"
                  : "UI Update"}
              </h1>
              {loadingAnalytics && active !== "message" && (
                <p className="text-xs text-slate-400 mt-1.5 animate-pulse">
                  Loading analytics data...
                </p>
              )}
            </div>
          </div>

          {/* All users quick control */}
          <AllUsersControl theme={theme} />

          {/* Tabs */}
          <div className="space-y-6">
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
        </div>
      </main>
    </div>
  );
}

