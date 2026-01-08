import React from "react";
import { FaOpencart } from "react-icons/fa6";

export default function UiUpdateButton({ active, setActive, theme, setShowMobile }) {
  return (
    <button
      onClick={() => {
        setActive("future");
        setShowMobile(false);
      }}
      className={`w-full text-xl  font-extrabold text-left px-6 py-3 transition-colors ${
        active === "future"
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
          <FaOpencart />
        </span>
        <span>Ui Update</span>
      </span>
    </button>
  );
}
