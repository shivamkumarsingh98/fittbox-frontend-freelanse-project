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
        <button onClick={fetchAll} disabled={loading} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded">{loading ? "Loading..." : "All Users"}</button>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
          <div className={`w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl ${theme === "dark" ? "bg-neutral-900 text-white border border-neutral-800" : "bg-white"}`}>
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold">All Users</h3>
                {error && <div className="text-sm text-red-500">{error}</div>}
              </div>
              <div className="flex items-center gap-2">
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users by name, email or phone" className={`px-3 py-2 rounded-md border w-64 text-sm ${theme === "dark" ? "bg-neutral-800 border-neutral-700 text-white" : "bg-white border-neutral-200"}`} />
                <button onClick={() => setOpen(false)} className="px-3 py-2 bg-neutral-100 rounded-md hover:bg-neutral-200">Close</button>
              </div>
            </div>

            <div className="p-4 max-h-[70vh] overflow-auto">
              {users.length === 0 ? (
                <div className="text-sm text-neutral-500">No users found.</div>
              ) : (
                <div className="space-y-3">
                  {users.filter((u) => {
                    const q = search.trim().toLowerCase();
                    if (!q) return true;
                    return ((u.name || u.fullName || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q) || (u.phone || u.mobile || "").toLowerCase().includes(q));
                  }).map((u, idx) => (
                    <div key={u._id || u.id || idx} className={`flex items-center gap-4 p-3 rounded-lg ${theme === "dark" ? "bg-neutral-800 border border-neutral-800" : "bg-white border border-neutral-200"}`}>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700 font-bold">{(u.name || u.fullName || "U").split(" ").map((p) => p[0]).slice(0, 2).join("")}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{u.name || u.fullName || "-"}</div>
                        <div className="text-xs text-neutral-400 truncate">{u.email || "-"} • {u.phone || u.mobile || "-"}</div>
                      </div>
                      <div className="text-sm text-neutral-500 mr-2">{u.role || "user"}</div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setMessageToLocal(u)} className="px-3 py-1 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700">Message</button>
                        <button onClick={() => alert("Viewing user (demo)")} className="px-3 py-1 rounded-md border text-sm hover:shadow-sm">View</button>
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
          <div className={`w-full max-w-md rounded-2xl p-5 ${theme === "dark" ? "bg-neutral-900 text-white border border-neutral-800" : "bg-white"} shadow-2xl`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">Message {messageToLocal.name || messageToLocal.fullName || messageToLocal.email}</h4>
              <button onClick={() => setMessageToLocal(null)} className="text-neutral-400">✕</button>
            </div>
            <textarea value={messageTextLocal} onChange={(e) => setMessageTextLocal(e.target.value)} rows={5} className={`w-full p-3 rounded border ${theme === "dark" ? "bg-neutral-800 border-neutral-700 text-white" : "bg-white border-neutral-200"}`} placeholder="Write a message..." />
            <div className="flex gap-2 justify-end mt-3">
              <button onClick={() => setMessageToLocal(null)} className={`px-3 py-1 rounded ${theme === "dark" ? "bg-neutral-700 hover:bg-neutral-600 text-white" : "bg-neutral-100 hover:bg-neutral-200"}`}>Cancel</button>
              <button onClick={() => { alert(`Message sent to ${messageToLocal.email || messageToLocal.name}: ${messageTextLocal}`); setMessageTextLocal(""); setMessageToLocal(null); }} className="px-3 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700">Send</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
