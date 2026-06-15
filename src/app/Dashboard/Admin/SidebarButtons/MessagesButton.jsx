import React from "react";
import { CiMail } from "react-icons/ci";
import { IoMailUnreadOutline } from "react-icons/io5";

export default function MessagesButton({ active, setActive, theme, setShowMobile, hasMessages }) {
  return (
    <button
      onClick={() => {
        setActive("message");
        setShowMobile(false);
      }}
      className={`w-full text-base font-bold text-left py-3.5 transition-all duration-200 flex items-center ${
        active === "message"
          ? "border-l-4 border-red-600 bg-red-50/70 text-red-600 px-5"
          : "text-slate-700 hover:bg-slate-50 hover:text-slate-950 px-6 border-l-4 border-transparent"
      }`}
    >
      <span className="inline-flex items-center gap-3">
        <span className="text-lg">
          {hasMessages ? <IoMailUnreadOutline className="text-red-500" /> : <CiMail className={active === "message" ? "text-red-600" : "text-slate-400"} />}
        </span>
        <span>Messages</span>
      </span>
    </button>
  );
}
