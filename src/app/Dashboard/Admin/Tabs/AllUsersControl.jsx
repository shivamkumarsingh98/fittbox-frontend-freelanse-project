import React, { useState } from "react";
import { useSelector } from "react-redux";
import { getallUsers } from "../../../api/admin";

export default function AllUsersControl({ theme = "light" }) {
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
        <button onClick={fetchAll} disabled={loading} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 text-sm cursor-pointer">{loading ? "Loading..." : "All Users"}</button>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl bg-white border border-slate-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-bold text-slate-900">All Users</h3>
                {error && <div className="text-sm text-red-600 font-semibold">{error}</div>}
              </div>
              <div className="flex items-center gap-3">
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users by name, email or phone" className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 w-64 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition" />
                <button onClick={() => setOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 font-bold text-sm transition-all duration-200 cursor-pointer">Close</button>
              </div>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto bg-slate-50/50">
              {users.length === 0 ? (
                <div className="text-sm text-slate-500 text-center py-8">No users found.</div>
              ) : (
                <div className="space-y-3">
                  {users.filter((u) => {
                    const q = search.trim().toLowerCase();
                    if (!q) return true;
                    return ((u.name || u.fullName || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q) || (u.phone || u.mobile || "").toLowerCase().includes(q));
                  }).map((u, idx) => (
                    <div key={u._id || u.id || idx} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-250">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 text-red-600 font-bold">{(u.name || u.fullName || "U").split(" ").map((p) => p[0]).slice(0, 2).join("")}</div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="font-bold text-slate-900 truncate">{u.name || u.fullName || "-"}</div>
                        <div className="text-xs text-slate-400 mt-0.5 truncate">{u.email || "-"} • {u.phone || u.mobile || "-"}</div>
                      </div>
                      <div className="text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full mr-2">{u.role || "user"}</div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setMessageToLocal(u)} className="px-3.5 py-1.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 shadow-sm hover:shadow-red-500/10 active:scale-95 transition-all cursor-pointer">Message</button>
                        <button onClick={() => alert("Viewing user (demo)")} className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 active:scale-95 transition-all cursor-pointer">View</button>
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
        <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl p-6 bg-white border border-slate-100 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h4 className="font-bold text-slate-900 text-lg">Message {messageToLocal.name || messageToLocal.fullName || messageToLocal.email}</h4>
              <button onClick={() => setMessageToLocal(null)} className="text-slate-400 hover:text-slate-650 font-bold">✕</button>
            </div>
            <textarea value={messageTextLocal} onChange={(e) => setMessageTextLocal(e.target.value)} rows={5} className="w-full p-4 rounded-2xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition resize-none" placeholder="Write a message..." />
            <div className="flex gap-2 justify-end mt-4">
              <button onClick={() => setMessageToLocal(null)} className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all duration-200 cursor-pointer">Cancel</button>
              <button onClick={() => { alert(`Message sent to ${messageToLocal.email || messageToLocal.name}: ${messageTextLocal}`); setMessageTextLocal(""); setMessageToLocal(null); }} className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">Send</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
