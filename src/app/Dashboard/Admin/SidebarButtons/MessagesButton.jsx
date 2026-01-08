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
      className={`w-full text-xl  font-extrabold text-left px-6 py-3 transition-colors ${
        active === "message"
          ? theme === "dark"
            ? "bg-neutral-800 text-red-500"
            : "bg-red-500 text-white"
          : theme === "dark"
          ? "hover:bg-neutral-800"
          : "hover:bg-neutral-50"
      }`}
    >
      <span className="inline-flex items-center gap-3">
        <span className="text-lg">
          {hasMessages ? <IoMailUnreadOutline className="text-red-500" /> : <CiMail />}
        </span>
        <span>Messages</span>
      </span>
    </button>
  );
}
