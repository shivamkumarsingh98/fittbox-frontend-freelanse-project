import React from "react";
import { FaRupeeSign } from "react-icons/fa6";

export default function PaymentsButton({ active, setActive, theme, setShowMobile }) {
  return (
    <button
      onClick={() => {
        setActive("payments");
        setShowMobile(false);
      }}
      className={`w-full text-xl  font-extrabold text-left px-6 py-3 transition-colors ${
        active === "payments"
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
          <FaRupeeSign />
        </span>
        <span>Payments</span>
      </span>
    </button>
  );
}
