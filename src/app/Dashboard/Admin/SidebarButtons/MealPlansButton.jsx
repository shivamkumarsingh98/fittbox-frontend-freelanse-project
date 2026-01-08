import React from "react";
import { GiHotMeal } from "react-icons/gi";

export default function MealPlansButton({ active, setActive, theme, setShowMobile }) {
  return (
    <button
      onClick={() => {
        setActive("mealplans");
        setShowMobile(false);
      }}
      className={`w-full text-xl  font-extrabold text-left px-6 py-3 transition-colors ${
        active === "mealplans"
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
          <GiHotMeal />
        </span>
        <span>Meal Plans</span>
      </span>
    </button>
  );
}
