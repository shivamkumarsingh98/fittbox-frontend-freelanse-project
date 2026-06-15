import React from "react";
import { FaRupeeSign } from "react-icons/fa6";

export default function PaymentsButton({ active, setActive, theme, setShowMobile }) {
  return (
    <button
      onClick={() => {
        setActive("payments");
        setShowMobile(false);
      }}
      className={`w-full text-base font-bold text-left py-3.5 transition-all duration-200 flex items-center ${
        active === "payments"
          ? "border-l-4 border-red-600 bg-red-50/70 text-red-600 px-5"
          : "text-slate-700 hover:bg-slate-50 hover:text-slate-950 px-6 border-l-4 border-transparent"
      }`}
    >
      <span className="inline-flex items-center gap-3">
        <span className="text-lg">
          <FaRupeeSign className={active === "payments" ? "text-red-600" : "text-slate-400"} />
        </span>
        <span>Payments</span>
      </span>
    </button>
  );
}
