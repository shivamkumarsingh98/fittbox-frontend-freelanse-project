"use client";

import React, { useEffect, useState } from "react";
import { FiUser, FiSettings } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  fetchUserProfile,
  updateUserProfile,
  changeUserPassword,
} from "../api/auth";
import toast from "react-hot-toast";

function Page() {
  const router = useRouter();
  const { token, user, isAuthenticated } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    postalcode: "",
  });
  const [pwd, setPwd] = useState({ currentPassword: "", newPassword: "" });
  const [activeTab, setActiveTab] = useState("overview"); // overview | update

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.replace("/");
      return;
    }
    let mounted = true;
    (async () => {
      try {
        setError("");
        setLoading(true);
        const res = await fetchUserProfile(token);
        if (!mounted) return;
        const u = res?.user || null;
        setProfile(u);
        setEdit({
          name: u?.name || "",
          phone: u?.phone || "",
          address: u?.address || "",
          city: u?.city || "",
          postalcode: u?.postalcode || "",
        });
      } catch (err) {
        if (!mounted) return;
        const msg = err?.message || "";
        setError(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, token, router]);

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen w-full bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="w-12 h-12 text-red-600 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <div className="text-sm text-neutral-600">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="w-full px-0">
        {/* <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">
            My Profile
          </h1>
          <p className="text-neutral-500">
            Manage your account and subscriptions
          </p>
        </div> */}

        {loading && (
          <div className="animate-pulse grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-40 rounded-xl bg-neutral-200" />
            <div className="h-40 rounded-xl bg-neutral-200" />
            <div className="h-40 rounded-xl bg-neutral-200" />
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {!loading && profile && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
            {/* Left nav (dashboard style) */}
            <aside className="hidden md:block md:col-span-3">
              <div className="bg-neutral-900 text-white p-6 sticky top-0 shadow-lg h-screen overflow-auto border-r border-neutral-800">
                <div className="mb-6">
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    My Profile
                  </h1>
                  <p className="text-neutral-500">
                    Manage your account and subscriptions
                  </p>
                </div>
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                      activeTab === "overview"
                        ? "bg-red-600 text-white shadow-md"
                        : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                    }`}
                  >
                    <FiUser className="text-lg" />
                    <span className="font-medium">Profile</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("update")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                      activeTab === "update"
                        ? "bg-red-600 text-white shadow-md"
                        : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                    }`}
                  >
                    <FiSettings className="text-lg" />
                    <span className="font-medium">Settings</span>
                  </button>
                </nav>
              </div>
            </aside>

            {/* Right content */}
            <section className="md:col-span-9 space-y-6  bg-white rounded-2xl">
              {/* Top card always visible */}
              <div
                className="rounded-3xl mt-2 p-6 flex flex-col sm:flex-row sm:items-center gap-5 bg-white 
shadow-[0_4px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.16)] 
transition-shadow duration-300 border border-neutral-100"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold text-2xl shadow-md">
                  {(profile?.name || user?.name || "U").charAt(0)}
                </div>

                {/* Main Info */}
                <div className="flex-1">
                  <div>
                    <div className="text-2xl font-bold text-neutral-900 tracking-wide">
                      {profile?.name || user?.name}
                    </div>
                    <div className="text-neutral-600 font-medium text-sm mt-1">
                      {profile?.email || user?.email}
                    </div>
                    <div className="text-sm font-semibold mt-2 inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700 shadow-sm">
                      {profile?.role || user?.role || "User"}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 text-center text-sm w-full sm:w-auto">
                  <div className="px-4 py-3 rounded-xl  bg-gradient-to-br from-amber-50 to-white shadow-sm">
                    <div className="text-amber-700 font-semibold uppercase text-[10px] tracking-wide">
                      Phone
                    </div>
                    <div className="font-bold text-neutral-900 text-base">
                      {profile?.phone || "—"}
                    </div>
                  </div>
                  <div className="px-4 py-3 rounded-xl  bg-gradient-to-br from-cyan-50 to-white shadow-sm">
                    <div className="text-cyan-700 font-semibold uppercase text-[10px] tracking-wide">
                      Subscriptions
                    </div>
                    <div className="font-bold text-neutral-900 text-base">
                      {Array.isArray(profile?.subscriptions)
                        ? profile.subscriptions.length
                        : 0}
                    </div>
                  </div>
                </div>
              </div>

              {activeTab === "overview" && (
                <div className="bg-white rounded-3xl p-6 shadow-[0_6px_25px_rgba(0,0,0,0.10)]">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-2xl font-bold text-neutral-900">
                      Subscriptions & Purchases
                    </h2>
                  </div>

                  {!profile?.subscriptions?.length ? (
                    <div className="text-sm text-neutral-500 font-medium">
                      No Active Subscriptions
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {profile.subscriptions.map((s, idx) => (
                        <div
                          key={idx}
                          className="rounded-2xl p-5 bg-gradient-to-br from-emerald-500/10 to-teal-100/30  shadow-sm 
                       hover:shadow-[0_10px_35px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1"
                        >
                          {/* TOP: PLAN INFO + STATUS */}
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="text-xl font-bold text-neutral-900">
                                {s?.plan?.name || "Premium Plan"}
                              </div>

                              {/* Badges */}
                              <div className="text-sm flex gap-2 mt-2 flex-wrap">
                                <span className="px-2 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs font-semibold">
                                  {s?.planType || "Plan Type"}
                                </span>
                                <span className="px-2 py-1 rounded-lg bg-purple-100 text-purple-700 text-xs font-semibold">
                                  {s?.plan?.category || "Category"}
                                </span>
                                <span className="px-2 py-1 rounded-lg bg-orange-100 text-orange-700 text-xs font-semibold">
                                  {s?.plan?.type || "Type"}
                                </span>
                              </div>
                            </div>

                            {/* PRICE + STATUS */}
                            <div className="text-right">
                              <div className="text-3xl font-extrabold text-emerald-600">
                                ₹{s?.totalAmount ?? s?.plan?.price ?? "—"}
                              </div>

                              <div
                                className={`mt-2 italic text-xs px-3 py-1 rounded-full font-semibold shadow-sm 
                  ${
                    s?.status === "active"
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                              >
                                {s?.status?.toUpperCase() || "INACTIVE"}
                              </div>
                            </div>
                          </div>

                          {/* BOTTOM: DETAILS GRID */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-neutral-200">
                            <div>
                              <div className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wide">
                                Price
                              </div>
                              <div className="text-neutral-900 font-bold text-lg">
                                ₹{s?.totalAmount ?? s?.plan?.price ?? "—"}
                              </div>
                            </div>

                            <div>
                              <div className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wide">
                                Start Date
                              </div>
                              <div className="text-neutral-900 font-medium text-sm">
                                {s?.startDate
                                  ? new Date(s.startDate).toLocaleDateString()
                                  : "—"}
                              </div>
                            </div>

                            <div>
                              <div className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wide">
                                End Date
                              </div>
                              <div className="text-neutral-900 font-medium text-sm">
                                {s?.endDate
                                  ? new Date(s.endDate).toLocaleDateString()
                                  : "—"}
                              </div>
                            </div>

                            <div>
                              <div className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wide">
                                Days Left
                              </div>
                              <div className="text-neutral-900 font-bold text-lg">
                                {s?.endDate
                                  ? Math.ceil(
                                      (new Date(s.endDate) - new Date()) /
                                        (1000 * 60 * 60 * 24)
                                    )
                                  : "—"}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "update" && (
                <>
                  {/* Update Profile */}
                  <div className="bg-gradient-to-br from-emerald-50 to-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all border border-emerald-100 mb-6">
                    <h2 className="text-xl font-bold mb-5 text-emerald-700">
                      Update Profile
                    </h2>

                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                          const res = await updateUserProfile(token, {
                            name: edit.name,
                            phone: edit.phone,
                          });
                          toast.success(
                            res?.message || "Profile updated successfully!"
                          );
                          const freshData = await fetchUserProfile(token);
                          setProfile(freshData?.user || null);
                        } catch (err) {
                          toast.error(err?.message || "Something went wrong");
                        }
                      }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-5"
                    >
                      <label className="text-sm font-medium text-neutral-700">
                        Name
                        <input
                          value={edit.name}
                          onChange={(e) =>
                            setEdit({ ...edit, name: e.target.value })
                          }
                          className="mt-1 w-full border-2 border-emerald-200 focus:border-emerald-500 outline-none rounded-xl px-4 py-3 bg-white transition"
                          placeholder="Enter your name"
                        />
                      </label>

                      <label className="text-sm font-medium text-neutral-700">
                        Phone
                        <input
                          value={edit.phone}
                          onChange={(e) =>
                            setEdit({ ...edit, phone: e.target.value })
                          }
                          className="mt-1 w-full border-2 border-emerald-200 focus:border-emerald-500 outline-none rounded-xl px-4 py-3 bg-white transition"
                          placeholder="Phone number"
                        />
                      </label>

                      <div className="sm:col-span-2 flex justify-end">
                        <button className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-all shadow-sm hover:shadow-md">
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all border border-emerald-100 mb-6">
                    <h2 className="text-xl font-bold mb-2 text-emerald-700">
                      Update Delivery Address
                    </h2>

                    <p className="text-sm text-neutral-600 mb-5 leading-relaxed">
                      <span className="font-semibold text-emerald-700">
                        Address Update Rules:
                      </span>
                      <br />• If you update your address <b>before 8:00 PM</b>,
                      your dinner will be delivered to the new address.
                      <br />• If you update your address <b>after 8:00 PM</b>,
                      today’s dinner will be delivered to the old address, and
                      future meals will go to the new address.
                      <br />• If you update your address <b>before 10:00 AM</b>,
                      lunch and dinner will be delivered to the new address.
                      <br />• If you update your address <b>after 10:00 AM</b>,
                      lunch will go to the old address and dinner to the new
                      address.
                    </p>

                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                          const res = await updateUserProfile(token, {
                            address: edit.address,
                            city: edit.city,
                            postalcode: edit.postalcode,
                          });
                          toast.success(
                            res?.message || "Profile updated successfully!"
                          );
                          const freshData = await fetchUserProfile(token);
                          setProfile(freshData?.user || null);
                        } catch (err) {
                          toast.error(err?.message || "Something went wrong");
                        }
                      }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-5"
                    >
                      <label className="text-sm font-medium text-neutral-700">
                        Update Delivery Address
                        <textarea
                          value={edit.address}
                          onChange={(e) =>
                            setEdit({ ...edit, address: e.target.value })
                          }
                          className="mt-1 w-full border-2 border-emerald-200 focus:border-emerald-500 outline-none rounded-xl px-4 py-3 bg-white transition"
                          placeholder="Delivery address"
                          type="text"
                        />
                      </label>
                      <label className="text-sm font-medium text-neutral-700">
                        City
                        <input
                          value={edit.city}
                          onChange={(e) =>
                            setEdit({ ...edit, city: e.target.value })
                          }
                          className="mt-1 w-full border-2 border-emerald-200 focus:border-emerald-500 outline-none rounded-xl px-4 py-3 bg-white transition"
                          placeholder="Delivery address"
                          type="text"
                        />
                      </label>
                      <label className="text-sm font-medium text-neutral-700">
                        Postalcode
                        <input
                          value={edit.postalcode}
                          onChange={(e) =>
                            setEdit({ ...edit, postalcode: e.target.value })
                          }
                          className="mt-1 w-full border-2 border-emerald-200 focus:border-emerald-500 outline-none rounded-xl px-4 py-3 bg-white transition"
                          placeholder="Delivery address"
                          type="text"
                        />
                      </label>

                      <div className="sm:col-span-2 flex justify-end">
                        <button className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-all shadow-sm hover:shadow-md">
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Change Password */}
                  <div className="bg-gradient-to-br from-purple-50 to-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all border border-purple-100">
                    <h2 className="text-xl font-bold mb-5 text-purple-700">
                      Change Password
                    </h2>

                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                          const res = await changeUserPassword(token, {
                            currentPassword: pwd.currentPassword,
                            newPassword: pwd.newPassword,
                          });
                          toast.success(res?.message || "Password updated!");
                          setPwd({ currentPassword: "", newPassword: "" });
                        } catch (err) {
                          toast.error(
                            err?.message || "Failed to change password"
                          );
                        }
                      }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-5"
                    >
                      <label className="text-sm font-medium text-neutral-700">
                        Current Password
                        <input
                          type="password"
                          value={pwd.currentPassword}
                          onChange={(e) =>
                            setPwd({ ...pwd, currentPassword: e.target.value })
                          }
                          className="mt-1 w-full border-2 border-purple-200 focus:border-purple-500 outline-none rounded-xl px-4 py-3 bg-white transition"
                          placeholder="Enter current password"
                        />
                      </label>

                      <label className="text-sm font-medium text-neutral-700">
                        New Password
                        <input
                          type="password"
                          value={pwd.newPassword}
                          onChange={(e) =>
                            setPwd({ ...pwd, newPassword: e.target.value })
                          }
                          className="mt-1 w-full border-2 border-purple-200 focus:border-purple-500 outline-none rounded-xl px-4 py-3 bg-white transition"
                          placeholder="Min 8 characters"
                        />
                      </label>

                      <div className="sm:col-span-2 flex justify-end">
                        <button className="px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-all shadow-sm hover:shadow-md">
                          Update Password
                        </button>
                      </div>
                    </form>
                  </div>
                </>
              )}
            </section>
          </div>
        )}
        {/* Mobile bottom bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 shadow-lg text-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 gap-2 py-2">
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg ${
                  activeTab === "overview"
                    ? "text-emerald-400 bg-neutral-800"
                    : "text-neutral-300"
                }`}
              >
                <FiUser />
                <span className="text-sm">Profile</span>
              </button>
              <button
                onClick={() => setActiveTab("update")}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg ${
                  activeTab === "update"
                    ? "text-emerald-400 bg-neutral-800"
                    : "text-neutral-300"
                }`}
              >
                <FiSettings />
                <span className="text-sm">Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
