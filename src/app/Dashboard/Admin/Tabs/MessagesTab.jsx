import React from "react";

export default function MessagesTab({ theme, messages = [], loading, error, onDeleteMessage }) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl p-6 bg-white border border-neutral-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-neutral-800">Contact Messages</h3>
            <p className="text-xs text-neutral-500 mt-1 font-medium">Recent messages from site contact form</p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-neutral-500 font-medium">Loading messages...</div>
        ) : error ? (
          <div className="py-8 text-center text-red-500 font-semibold">{error}</div>
        ) : messages.length === 0 ? (
          <div className="py-12 text-center text-neutral-500 font-medium">No messages found</div>
        ) : (
          <div className="grid gap-4">
            {messages.map((m) => (
              <div key={m._id} className="p-5 rounded-2xl border border-neutral-200/85 bg-white transition-all hover:shadow-md duration-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 font-bold border border-red-100 flex-shrink-0">{m.name?.split(" ")[0]?.[0] || "U"}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-bold text-neutral-800 text-base">{m.name}</div>
                        <div className="text-xs text-neutral-500 mt-0.5">{m.email} • {m.phone}</div>
                      </div>
                      <div className="text-left sm:text-right text-xs text-neutral-400 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 flex-shrink-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{new Date(m.createdAt).toLocaleString()}</span>
                          <button onClick={() => onDeleteMessage && onDeleteMessage(m._id)} className="ml-2 text-xs font-semibold text-red-600 hover:text-red-700 transition" title="Delete message">Delete</button>
                        </div>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${m.status === "pending" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>{m.status}</div>
                      </div>
                    </div>

                    <div className="mt-4 text-sm text-neutral-700 leading-relaxed bg-neutral-50 p-3.5 rounded-xl border border-neutral-100">{m.message}</div>

                    <div className="mt-3 flex items-center gap-2 text-xs">
                      <span className="text-neutral-500 font-medium">Inquiry:</span>
                      <span className="font-bold text-neutral-700 bg-neutral-100 px-2 py-1 rounded">{m.inquiryType || m.inquiry || "General"}</span>
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
