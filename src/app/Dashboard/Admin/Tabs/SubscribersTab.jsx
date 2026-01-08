import React, { useState } from "react";

export default function SubscribersTab({ theme, analyticsData, createMonthlyMeal = {}, handleUpdateMonthly = () => {}, handleDeleteMonthly = () => {} }) {
  const [detail, setDetail] = useState(null);
  const [openSubscriber, setOpenSubscriber] = useState(null);
  const [pausedIds, setPausedIds] = useState(new Set());
  const [messageUser, setMessageUser] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [completedMealIds, setCompletedMealIds] = useState(new Set());

  const rawSubscribers = analyticsData?.activeSubscriptions || analyticsData?.subscribers || [];
  const subscribers = Array.isArray(rawSubscribers) ? rawSubscribers : [];

  const togglePause = (id) => {
    const next = new Set(pausedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setPausedIds(next);
    alert((next.has(id) ? "Paused" : "Restarted") + " (demo)");
  };

  const renewMeal = (meal) => {
    alert(`Renew request sent for ${meal.mealName || meal.plan?.name || "meal"} (demo)`);
  };

  const deleteComplete = (meal) => {
    alert(`Marked ${meal.mealName || meal.plan?.name || "meal"} as completed (demo)`);
  };

  const completeMeal = (mid) => {
    const next = new Set(completedMealIds);
    next.add(mid);
    setCompletedMealIds(next);
  };

  const sendMessage = () => {
    alert(`Message sent to ${messageUser?.userName || messageUser?.name || "user"}: ${messageText}`);
    setMessageText("");
    setMessageUser(null);
  };

  if (!analyticsData) {
    return (
      <div className={` ${theme === "dark" ? "bg-neutral-800 border-neutral-700 text-white" : "bg-white border"} rounded-xl p-4 animate-pulse`}>
        <div className="h-6 bg-neutral-600 rounded w-40 mb-4"></div>
        <div className="space-y-3">{[...Array(4)].map((_, i) => (<div key={i} className="h-20 bg-neutral-700 rounded"></div>))}</div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl p-4 ${theme === "dark" ? "bg-neutral-900 border border-neutral-800 text-white" : "bg-white border"}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Subscribers</h3>
        <div className="text-sm text-neutral-500">{subscribers.length} total</div>
      </div>

      <div className="space-y-3 max-h-[60vh] overflow-auto">
        {subscribers.length === 0 ? (
          <div className="text-sm text-neutral-500">No subscribers found</div>
        ) : (
          subscribers.map((s, idx) => {
            const subs = Array.isArray(s.activeSubscriptions) ? s.activeSubscriptions : [];
            const amount = subs.length > 0 ? subs.reduce((acc, it) => acc + (Number(it.totalAmount) || 0), 0) : Number(s.totalAmount || 0);
            const uid = s._id || s.id || `u-${idx}`;

            return (
              <div key={uid} className={`p-3 rounded-lg flex items-start gap-4 ${theme === "dark" ? "bg-neutral-800 border border-neutral-700" : "bg-white border border-neutral-200"}`}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700 font-bold">{String(s.userName || s.name || "U").split(" ").map((p) => p?.[0] || "").slice(0, 2).join("")}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{s.userName || s.name || "-"}</div>
                      <div className="text-xs text-neutral-400 truncate">{s.userPhone || s.phone || "-"}</div>
                      <div className="text-xs text-neutral-400 truncate">
  {s.address?.length
    ? `${s.address[s.address.length - 1].street}, ${s.address[s.address.length - 1].city} - ${s.address[s.address.length - 1].postalCode}`
    : "-"
  }
</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-sm font-semibold text-emerald-600">₹{Number(amount).toLocaleString()}</div>
                      <button onClick={() => setOpenSubscriber(openSubscriber === uid ? null : uid)} className="p-1 rounded-md hover:bg-neutral-100" aria-expanded={openSubscriber === uid}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
                      </button>
                      <button onClick={() => setMessageUser(s)} className="ml-2 px-3 py-1 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700">Message</button>
                    </div>
                  </div>

                  {openSubscriber === uid && (
                    <div className={`mt-3 p-3 rounded-lg ${theme === "dark" ? "bg-neutral-900 border border-neutral-800" : "bg-neutral-50 border border-neutral-200"}`}>
                      <div className="text-sm font-semibold mb-2">Meals ({subs.length})</div>
                      <div className="space-y-2">
                        {subs.length === 0 ? (
                          <div className="text-sm text-neutral-500">No meals</div>
                        ) : (
                          subs.map((meal, mIdx) => {
                            const title = meal.plan?.name || meal.mealName || meal.planType || "Meal";
                            const start = meal.startDate ? new Date(meal.startDate) : null;
                            const end = meal.endDate ? new Date(meal.endDate) : null;
                            const daysLeft = meal.remainingDays ?? (end ? Math.max(0, Math.ceil((end - Date.now()) / (1000 * 60 * 60 * 24))) : null);
                            const mid = meal._id || meal.id || `${uid}-m-${mIdx}`;
                            const isCompleted = completedMealIds.has(mid);

                            return (
                              <div key={mid} className={`flex items-center gap-3 p-3 rounded-md ${isCompleted ? "bg-emerald-50 border border-emerald-400" : theme === "dark" ? "bg-neutral-800 border border-neutral-700" : "bg-white border border-neutral-200"}`}>
                                <div className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700 font-bold">{String(title).split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <div className="font-medium truncate">{title}</div>
                                    {meal.plan?.type && <div className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">{meal.plan.type}</div>}
                                  </div>
                                  <div className="text-xs text-neutral-400 truncate">{start ? start.toLocaleDateString() : "-"}{start && end ? " • " : ""}{end ? end.toLocaleDateString() : ""}</div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                  <div className="text-sm font-semibold text-amber-600">₹{Number(meal.totalAmount || 0).toLocaleString()}</div>
                                  <div className="text-xs text-neutral-400">{daysLeft != null ? `${daysLeft} days` : "-"}</div>
                                  <div className="flex items-center gap-2 mt-2">
                                    <button onClick={() => togglePause(mid)} className="px-2 py-1 rounded border text-xs">{pausedIds.has(mid) ? "Restart" : "Pause"}</button>
                                    <button onClick={() => renewMeal(meal)} className="px-2 py-1 rounded bg-amber-600 text-white text-xs">Renew</button>
                                    <button onClick={() => completeMeal(mid)} className="px-2 py-1 rounded bg-emerald-600 text-white text-xs">Complete</button>
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
          <div className={`${theme === "dark" ? "bg-neutral-800 text-white" : "bg-white"} rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl border ${theme === "dark" ? "border-neutral-700" : "border-neutral-200"}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Subscriber Details</h3>
              <button className={`${theme === "dark" ? "text-neutral-400 hover:text-white" : "text-neutral-500 hover:text-black"}`} onClick={() => setDetail(null)}>✕</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {(() => {
                const subs = Array.isArray(detail.activeSubscriptions) ? detail.activeSubscriptions : [];
                const first = subs.length > 0 ? subs[0] : null;
                const planName = first?.plan?.name || first?.mealName || first?.planType || "-";
                const amount = first?.totalAmount ?? (subs.length > 0 ? subs.reduce((sum, it) => sum + (Number(it.totalAmount) || 0), 0) : detail.totalAmount || 0);
                return (
                  <>
                    <div><span className="text-neutral-500">Name:</span> <span className="font-medium">{detail.userName}</span></div>
                    <div><span className="text-neutral-500">Phone:</span> <span className="font-medium">{detail.userPhone}</span></div>
                    <div><span className="text-neutral-500">Email:</span> <span className="font-medium">{detail.userEmail}</span></div>
                    <div><span className="text-neutral-500">Amount:</span> <span className="font-medium">₹{Number(amount).toLocaleString()}</span></div>
                    <div className="sm:col-span-2"><span className="text-neutral-500">Meal:</span> <span className="font-medium">{planName}</span>{subs.length > 1 && <span className="text-xs text-neutral-400"> {` (+${subs.length - 1} more)`}</span>}</div>
                  </>
                );
              })()}
            </div>
            <div className="flex gap-2 justify-end"><button className={`${theme === "dark" ? "bg-neutral-700 hover:bg-neutral-600 text-white" : "bg-neutral-100 hover:bg-neutral-200"} px-4 py-2 rounded`} onClick={() => setDetail(null)}>Close</button></div>
            {createMonthlyMeal?.twoMealsBLD && (
              <div className="flex gap-2 mt-3">
                <button onClick={() => handleUpdateMonthly("twoMealsBLD")} className="px-3 py-1 rounded bg-yellow-600 text-white">Update</button>
                <button onClick={() => handleDeleteMonthly("twoMealsBLD")} className="px-3 py-1 rounded bg-red-600 text-white">Delete</button>
              </div>
            )}
          </div>
        </div>
      )}

      {messageUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className={`${theme === "dark" ? "bg-neutral-800 text-white" : "bg-white"} rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl border ${theme === "dark" ? "border-neutral-700" : "border-neutral-200"}`}>
            <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">Message {messageUser.userName || messageUser.name || messageUser.email}</h3><button className="text-neutral-400" onClick={() => setMessageUser(null)}>✕</button></div>
            <textarea value={messageText} onChange={(e) => setMessageText(e.target.value)} rows={5} className={`w-full p-3 rounded border ${theme === "dark" ? "bg-neutral-900 border-neutral-700 text-white" : "bg-white border-neutral-200"}`} placeholder="Type your message..." />
            <div className="flex gap-2 justify-end"><button onClick={() => setMessageUser(null)} className={`px-3 py-1 rounded ${theme === "dark" ? "bg-neutral-700 hover:bg-neutral-600 text-white" : "bg-neutral-100 hover:bg-neutral-200"}`}>Cancel</button><button onClick={() => sendMessage()} className="px-3 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700">Send</button></div>
            {createMonthlyMeal?.twoMealsLD && (
              <div className="flex gap-2 mt-3"><button onClick={() => handleUpdateMonthly("twoMealsLD")} className="px-3 py-1 rounded bg-yellow-600 text-white">Update</button><button onClick={() => handleDeleteMonthly("twoMealsLD")} className="px-3 py-1 rounded bg-red-600 text-white">Delete</button></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
