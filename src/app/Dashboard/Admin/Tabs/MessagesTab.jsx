import React from "react";

export default function MessagesTab({ theme, messages = [], loading, error, onDeleteMessage }) {
  return (
    <div className="space-y-6">
      <div className={`rounded-xl p-4 ${theme === "dark" ? "bg-neutral-800 border border-neutral-700" : "bg-white"} shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Contact Messages</h3>
            <p className="text-sm text-neutral-500">Recent messages from site contact form</p>
          </div>
        </div>

        {loading ? (
          <div className="py-10 text-center text-neutral-500">Loading messages...</div>
        ) : error ? (
          <div className="py-6 text-center text-red-500">{error}</div>
        ) : messages.length === 0 ? (
          <div className="py-6 text-center text-neutral-500">No messages</div>
        ) : (
          <div className="grid gap-4">
            {messages.map((m) => (
              <div key={m._id} className={`p-4 rounded-lg border transition-shadow hover:shadow-lg ${theme === "dark" ? "bg-neutral-900 border-neutral-700" : "bg-white border-neutral-100"}`}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold">{m.name?.split(" ")[0]?.[0] || "U"}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold truncate">{m.name}</div>
                        <div className="text-xs text-neutral-500 truncate">{m.email} • {m.phone}</div>
                      </div>
                      <div className="text-right text-xs text-neutral-400 flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          <div>{new Date(m.createdAt).toLocaleString()}</div>
                          <button onClick={() => onDeleteMessage && onDeleteMessage(m._id)} className="ml-2 text-sm text-red-600 hover:underline" title="Delete message">Delete</button>
                        </div>
                        <div className={`mt-1 inline-flex items-center gap-2 px-2 py-0.5 rounded-full text-xs ${m.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>{m.status}</div>
                      </div>
                    </div>

                    <div className="mt-3 text-sm text-neutral-700">{m.message}</div>

                    <div className="mt-3 flex items-center gap-2">
                      <div className="text-sm text-neutral-500">Inquiry:</div>
                      <div className="text-sm font-medium">{m.inquiryType || m.inquiry || "General"}</div>
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
