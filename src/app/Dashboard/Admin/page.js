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
    <div
      className={
        theme === "dark"
          ? "h-screen flex bg-neutral-900 text-white overflow-hidden"
          : "h-screen flex bg-neutral-50 text-neutral-900 overflow-hidden"
      }
    >
      {/* Sidebar */}
      <aside
        className={
          theme === "dark"
            ? "hidden md:flex w-64 border-r border-neutral-800 bg-neutral-950 h-screen sticky top-0 flex-col"
            : "hidden md:flex w-64 border-r border-neutral-200 bg-white h-screen sticky top-0 flex-col"
        }
      >
        <div className="px-4 py-4 flex items-center justify-between border-b border-neutral-200/60 dark:border-neutral-800/60">
          <div className="font-semibold text-lg">Admin</div>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-xs px-3 py-1 rounded border"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>
        <div className="py-4 space-y-1 flex-1 overflow-hidden">
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
        <div className="border-t border-neutral-200/60 dark:border-neutral-800/60 p-4">
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2 rounded-md text-sm font-semibold bg-red-600 text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 h-screen overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Simple header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">
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
                <p className="text-xs text-neutral-500 mt-1">
                  Loading analytics...
                </p>
              )}
            </div>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="md:hidden px-3 py-1 rounded border text-sm"
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>

          {/* All users quick control */}
          <AllUsersControl theme={theme} />

          {/* Tabs */}
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
  );
}

