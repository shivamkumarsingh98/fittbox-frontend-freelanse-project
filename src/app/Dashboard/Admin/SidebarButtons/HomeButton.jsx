import React from "react";
import { IoHomeOutline } from "react-icons/io5";

export default function HomeButton({ active, setActive, theme, setShowMobile }) {
  return (
    <button
      onClick={() => {
        setActive("overview");
        setShowMobile(false);
      }}
      className={`w-full text-xl  font-extrabold text-left px-6 py-3 transition-colors ${
        active === "overview"
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
          <IoHomeOutline />
        </span>
        <span>Home</span>
      </span>
    </button>
  );
}
