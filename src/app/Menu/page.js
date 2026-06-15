"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import toast from "react-hot-toast";
import { useModal } from "../Component/ModalContext";
import { getTrialMeals, getMonthlyMeals } from "../api/Meals";

const getErrorMessage = (error, fallback) => {
  if (!error) return fallback;
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.data?.message ||
    error?.message ||
    fallback
  );
};

// Breakfast items for selection
const breakfastItems = [
  { id: "bf1", name: "Oats & Fruits Bowl", price: 160, img: "/hero2.jpg" },
  { id: "bf2", name: "Scrambled Eggs & Toast", price: 180, img: "/hero3.jpg" },
  { id: "bf3", name: "Smoothie Bowl", price: 150, img: "/hero4.jpg" },
];

// Breakfast Selection Modal Component
function BreakfastSelectionModal({ type, onAddToCart, options = null }) {
  const [selected, setSelected] = useState(new Set());
  const modal = useModal();

  // Build item list from backend options if provided, otherwise fall back to static breakfastItems
  const items = options
    ? options.map((opt) => {
      const id = `opt${opt.option}`;
      const price =
        type === "veg"
          ? opt.veg && Number(opt.veg.price)
          : opt.nonveg && Number(opt.nonveg.price);
      return { id, name: opt.name || `Breakfast ${opt.option}`, price };
    })
    : breakfastItems.map((it) => ({
      id: it.id,
      name: it.name,
      price: it.price,
    }));

  const handleToggle = (itemId) => {
    const newSet = new Set(selected);
    if (newSet.has(itemId)) newSet.delete(itemId);
    else newSet.add(itemId);
    setSelected(newSet);
  };

  const handleAdd = () => {
    if (selected.size === 0) {
      toast.error("Please select at least one breakfast item");
      return;
    }
    onAddToCart(type, selected);
    setSelected(new Set());
    modal.closeModal();
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Select {type === "veg" ? "Veg" : "Non-Veg"} Breakfast Items
      </h2>
      <div className="space-y-3 mb-6">
        {items.map((item) => {
          const isSelected = selected.has(item.id);
          const displayPrice = item.price != null ? `₹${item.price}` : "-";
          return (
            <label
              key={item.id}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${isSelected
                  ? type === "veg"
                    ? "bg-emerald-50 border-emerald-300"
                    : "bg-gray-50 border-gray-300"
                  : "hover:bg-gray-50"
                }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleToggle(item.id)}
                className={`w-5 h-5 rounded focus:ring-2 ${type === "veg"
                    ? "text-emerald-600 focus:ring-emerald-500"
                    : "text-gray-600 focus:ring-gray-500"
                  }`}
              />
              <div className="flex-1">
                <div className="font-medium text-base">{item.name}</div>
                <div className="text-sm text-gray-500">{displayPrice}</div>
              </div>
            </label>
          );
        })}
      </div>
      <div className="flex gap-3">
        <button
          onClick={modal.closeModal}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleAdd}
          className={`flex-1 px-4 py-2 rounded-lg font-semibold text-white transition shadow-md ${type === "veg"
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-[#07101a] hover:bg-[#0c1b2a]"
            }`}
        >
          Add Selected ({selected.size})
        </button>
      </div>
    </div>
  );
}

function Page() {
  const dispatch = useDispatch();
  const modal = useModal();
  const [trialMeals, setTrialMeals] = useState([]);
  const [monthlyMeals, setMonthlyMeals] = useState([]);
  const [loadingTrialMeals, setLoadingTrialMeals] = useState(true);
  const [loadingMonthlyMeals, setLoadingMonthlyMeals] = useState(true);

  useEffect(() => {
    const fetchTrialMeals = async () => {
      try {
        setLoadingTrialMeals(true);
        const data = await getTrialMeals();
        console.log("getTrialMeals:", data);
        // Handle both direct array and nested data structure
        const meals = Array.isArray(data) ? data : data?.data || [];
        setTrialMeals(meals);
      } catch (error) {
        const message = getErrorMessage(error, "Failed to load trial meals");
        console.error("Failed to fetch trial meals:", error);
        toast.error(message);
      } finally {
        setLoadingTrialMeals(false);
      }
    };

    const fetchMonthlyMeals = async () => {
      try {
        setLoadingMonthlyMeals(true);
        const data = await getMonthlyMeals();
        // Handle both direct array and nested data structure
        console.log("getMonthlyMeals:", data);
        const meals = Array.isArray(data) ? data : data?.meals || [];
        setMonthlyMeals(meals);
      } catch (error) {
        const message = getErrorMessage(error, "Failed to load monthly meals");
        console.error("Failed to fetch monthly meals:", error);
        toast.error(message);
      } finally {
        setLoadingMonthlyMeals(false);
      }
    };

    fetchTrialMeals();
    fetchMonthlyMeals();
  }, []);

  const handleBreakfastAddToCart = (type, selected) => {
    // Selected may contain backend option ids like 'opt1' or static ids like 'bf1'
    selected.forEach((itemId) => {
      if (String(itemId).startsWith("opt")) {
        const optNum = Number(String(itemId).replace("opt", ""));
        const opt = breakfastOptions.find((o) => o.option === optNum);
        if (!opt) return;
        const mealDoc = type === "veg" ? opt.veg : opt.nonveg;
        if (!mealDoc) return;
        addSingleTrialToCart(mealDoc);
      } else {
        const item = breakfastItems.find((i) => i.id === itemId);
        if (item) {
          const price = type === "veg" ? item.price : item.price + 40;
          dispatch(
            addToCart({
              // id: `breakfast-${itemId}-${type}`,
              id: `${itemId}-${type}`,
              name: `${item.name} (${type})`,
              price: price,
              image: item.img,
              days: 1,
            }),
          );
        }
      }
    });
    toast.success(`${selected.size} item(s) added to cart!`);
  };

  const openBreakfastModal = (type) => {
    modal.openModal(
      <BreakfastSelectionModal
        type={type}
        options={breakfastOptions}
        onAddToCart={handleBreakfastAddToCart}
      />,
    );
  };

  const addSingleTrialToCart = (meal) => {
    const price =
      typeof meal.price === "number" ? meal.price : Number(meal.price) || 0;
    const cartItem = {
      id: `${meal._id}-${meal.type}`, // always unique
      _id: meal._id,
      category: meal.category,
      name: meal.name,
      type: meal.type,
      planType: meal.planType || "TrialMeal",
      price: price,
      days: 1,
      image: meal.image || null,
    };

    console.log("🛒 Sending to cart:", cartItem); // debug

    dispatch(addToCart(cartItem));
    toast.success(`${meal.name} (${meal.type}) added to cart!`);
  };

  // Group trial meals into breakfast (3 options), lunch and dinner
  // If backend doesn't provide `mealOption`, fall back to list order.
  const breakfastVegList = trialMeals.filter(
    (m) => m.category === "breakfast" && m.type === "vegetarian",
  );
  const breakfastNonvegList = trialMeals.filter(
    (m) => m.category === "breakfast" && m.type === "non-vegetarian",
  );

  const breakfastOptions = [0, 1, 2].map((idx) => {
    const foundVeg =
      trialMeals.find(
        (m) =>
          m.category === "breakfast" &&
          (m.mealOption === idx + 1 || Number(m.mealOption) === idx + 1) &&
          m.type === "vegetarian",
      ) ||
      breakfastVegList[idx] ||
      null;
    const foundNonveg =
      trialMeals.find(
        (m) =>
          m.category === "breakfast" &&
          (m.mealOption === idx + 1 || Number(m.mealOption) === idx + 1) &&
          m.type === "non-vegetarian",
      ) ||
      breakfastNonvegList[idx] ||
      null;

    // normalize price field to `price` and ensure number type
    const veg = foundVeg
      ? { ...foundVeg, price: Number(foundVeg.price ?? foundVeg.price ?? 0) }
      : null;
    const nonveg = foundNonveg
      ? {
        ...foundNonveg,
        price: Number(foundNonveg.price ?? foundNonveg.price ?? 0),
      }
      : null;

    const name =
      (veg && (veg.name || `Breakfast ${idx + 1}`)) ||
      (nonveg && (nonveg.name || `Breakfast ${idx + 1}`)) ||
      `Breakfast ${idx + 1}`;

    const rawCategory =
      (veg && veg.category) || (nonveg && nonveg.category) || "breakfast";
    const category = rawCategory
      ? rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1)
      : "Breakfast";

    return { option: idx + 1, veg, nonveg, name, category };
  });

  const lunchVeg = trialMeals.find(
    (m) => m.category === "lunch" && m.type === "vegetarian",
  );
  const lunchNonveg = trialMeals.find(
    (m) => m.category === "lunch" && m.type === "non-vegetarian",
  );

  const dinnerVeg = trialMeals.find(
    (m) => m.category === "dinner" && m.type === "vegetarian",
  );
  const dinnerNonveg = trialMeals.find(
    (m) => m.category === "dinner" && m.type === "non-vegetarian",
  );
  const handleAddMonthlyPlan = (meal, type) => {
    if (!meal || !meal._id) {
      console.error("Meal ID is missing!", meal);
      toast.error("Cannot add this meal to cart. Missing ID.");
      return;
    }

    const price =
      type === "veg" ? (meal.price?.veg ?? 0) : (meal.price?.nonVeg ?? 0);

    const cartItem = {
      // id: `${meal._id}-${meal.type}-monthly`,
      id: `${meal._id}-${type}`,
      productId: meal._id,
      name: meal.name,
      type: type === "veg" ? "vegetarian" : "non-vegetarian",
      category: "monthly",
      planType: "MealPlan",
      price: Number(price),
      days: 30,
      quantity: 1,
    };

    console.log("Cart item object:", cartItem);

    dispatch(addToCart(cartItem));

    toast.success(`${meal.name} (${type}) added to cart!`);
  };

  const handleAddToCart = (meal, type) => {
    const price = type === "veg" ? meal.veg : meal.nonveg;
    // Check if it's a trial meal (Breakfast, Lunch, Dinner, 1 Day)
    const isTrialMeal =
      meal.name === "Breakfast" ||
      meal.name === "Lunch" ||
      meal.name === "Dinner" ||
      meal.name.includes("1 Day");

    dispatch(
      addToCart({
        id: `${meal.name}-${type}`,
        productId: meal._id || null,
        name: `${meal.name} ${meal.type}`,
        price: price,
        image: meal.image,
        days: isTrialMeal ? 1 : undefined, // Add days for trial meals only
        planType: meal.planType,
      }),
    );
    toast.success(`${meal.name} (${type}) added to cart!`);
  };

  return (
    <main className="bg-[#f8fafc] font-sans antialiased text-slate-800 flex items-center">
      <div className="w-full max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="menu-hero flex flex-col md:flex-row gap-10 items-center relative border-b border-slate-100 pb-12 pt-4">
          <div className="hero-left flex-1 md:max-w-[60%]">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-extrabold uppercase tracking-widest mb-4 animate-fadeUp">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              Fresh & Delicious
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight animate-fadeUp leading-tight">
              <span className="text-slate-900">Our Premium</span>{" "}
              <span className="bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent">Menu</span>
            </h1>
            <p
              className="text-slate-600 text-lg leading-relaxed max-w-[48ch] mb-8 animate-fadeUp"
              style={{ animationDelay: "120ms" }}
            >
              Fresh, zesty, and bursting with crunch—our meals are crafted by professional nutritionists to keep you energized, fit, and healthy every day!
            </p>
          </div>

          <div className="hero-right flex-1 flex items-center justify-center md:justify-end relative">
            <div
              className="relative w-[300px] h-[300px] md:w-[350px] md:h-[350px] rounded-full p-3 bg-white shadow-2xl border border-slate-100/80 animate-scaleIn"
              style={{ animationDelay: "200ms" }}
            >
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <Image
                  src="/hero3.jpg"
                  alt="Healthy bowl"
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-700 ease-out"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Trial Menu Section */}
        <section className="menu-section mt-16 bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900">Trial Menu Plan</h2>
              <p className="text-slate-500 text-sm mt-1">Start your health journey with our delicious 1-day trial meals</p>
            </div>
            <div className="h-1 w-20 bg-red-500 rounded-full md:hidden"></div>
          </div>

          {loadingTrialMeals ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-600"></div>
              <p className="text-slate-500 mt-4 font-semibold text-sm">Loading trial meals...</p>
            </div>
          ) : trialMeals.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-3xl">
              <p className="text-slate-500 font-medium">No trial meals available at the moment.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Breakfast - 3 option cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                {breakfastOptions.map((opt) => {
                  const vegPrice = opt.veg ? Number(opt.veg.price) : null;
                  const nonvegPrice = opt.nonveg
                    ? Number(opt.nonveg.price)
                    : null;
                  const cardImage =
                    (opt.veg && opt.veg.image) ||
                    (opt.nonveg && opt.nonveg.image) ||
                    "/hero2.jpg";
                  const capitalizedName =
                    opt.name.charAt(0).toUpperCase() + opt.name.slice(1);

                  return (
                    <div
                      key={`bf-${opt.option}`}
                      className="group relative w-full max-w-[380px] flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-out overflow-hidden"
                    >
                      <div className="w-full h-64 relative overflow-hidden bg-slate-100">
                        <Image
                          src={cardImage}
                          alt={capitalizedName}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          onError={(e) => {
                            e.currentTarget.src = "/hero2.jpg";
                          }}
                        />
                        <div className="absolute top-4 left-4 z-10">
                          <span className="px-3.5 py-1.5 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-extrabold rounded-full uppercase tracking-wider shadow-md">
                            {opt.category} • Opt {opt.option}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-red-600 transition-colors duration-300 mb-5 line-clamp-1">
                          {capitalizedName}
                        </h3>

                        <div className="flex items-center gap-4 mb-6">
                          {vegPrice !== null && (
                            <div className="flex-1 p-3 bg-emerald-50/70 rounded-2xl border border-emerald-100/50 flex flex-col items-center">
                              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest mb-1">Veg Price</span>
                              <span className="text-xl font-black text-emerald-600">₹{vegPrice}</span>
                            </div>
                          )}
                          {nonvegPrice !== null && (
                            <div className="flex-1 p-3 bg-rose-50/70 rounded-2xl border border-rose-100/50 flex flex-col items-center">
                              <span className="text-[10px] font-bold text-rose-800 uppercase tracking-widest mb-1">Non-Veg</span>
                              <span className="text-xl font-black text-rose-600">₹{nonvegPrice}</span>
                            </div>
                          )}
                        </div>

                        <div className="mt-auto flex gap-3">
                          {opt.veg && (
                            <button
                              onClick={() => addSingleTrialToCart(opt.veg)}
                              className="flex-1 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/15 hover:shadow-emerald-600/25 active:scale-[0.96] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                              Add Veg
                            </button>
                          )}
                          {opt.nonveg && (
                            <button
                              onClick={() => addSingleTrialToCart(opt.nonveg)}
                              className="flex-1 py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-red-600/15 hover:shadow-red-600/25 active:scale-[0.96] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                              Add Non-Veg
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Lunch & Dinner single cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                {/* Lunch */}
                <div className="group relative w-full max-w-[380px] flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-out overflow-hidden">
                  <div className="w-full h-64 relative overflow-hidden bg-slate-100">
                    <Image
                      src={
                        (lunchVeg && lunchVeg.image) ||
                        (lunchNonveg && lunchNonveg.image) ||
                        "/hero2.jpg"
                      }
                      alt="Lunch"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      onError={(e) => {
                        e.currentTarget.src = "/hero2.jpg";
                      }}
                    />
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3.5 py-1.5 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-extrabold rounded-full uppercase tracking-wider shadow-md">
                        Lunch Meal
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-red-600 transition-colors duration-300 mb-5">
                      Healthy Lunch
                    </h3>

                    <div className="flex items-center gap-4 mb-6">
                      {lunchVeg && (
                        <div className="flex-1 p-3 bg-emerald-50/70 rounded-2xl border border-emerald-100/50 flex flex-col items-center">
                          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest mb-1">Veg Price</span>
                          <span className="text-xl font-black text-emerald-600">₹{Number(lunchVeg.price)}</span>
                        </div>
                      )}
                      {lunchNonveg && (
                        <div className="flex-1 p-3 bg-rose-50/70 rounded-2xl border border-rose-100/50 flex flex-col items-center">
                          <span className="text-[10px] font-bold text-rose-800 uppercase tracking-widest mb-1">Non-Veg</span>
                          <span className="text-xl font-black text-rose-600">₹{Number(lunchNonveg.price)}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-auto flex gap-3">
                      {lunchVeg && (
                        <button
                          onClick={() => addSingleTrialToCart(lunchVeg)}
                          className="flex-1 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/15 hover:shadow-emerald-600/25 active:scale-[0.96] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                          Add Veg
                        </button>
                      )}
                      {lunchNonveg && (
                        <button
                          onClick={() => addSingleTrialToCart(lunchNonveg)}
                          className="flex-1 py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-red-600/15 hover:shadow-red-600/25 active:scale-[0.96] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                          Add Non-Veg
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dinner */}
                <div className="group relative w-full max-w-[380px] flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-out overflow-hidden">
                  <div className="w-full h-64 relative overflow-hidden bg-slate-100">
                    <Image
                      src={
                        (dinnerVeg && dinnerVeg.image) ||
                        (dinnerNonveg && dinnerNonveg.image) ||
                        "/hero2.jpg"
                      }
                      alt="Dinner"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      onError={(e) => {
                        e.currentTarget.src = "/hero2.jpg";
                      }}
                    />
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3.5 py-1.5 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-extrabold rounded-full uppercase tracking-wider shadow-md">
                        Dinner Meal
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-red-600 transition-colors duration-300 mb-5">
                      Healthy Dinner
                    </h3>

                    <div className="flex items-center gap-4 mb-6">
                      {dinnerVeg && (
                        <div className="flex-1 p-3 bg-emerald-50/70 rounded-2xl border border-emerald-100/50 flex flex-col items-center">
                          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest mb-1">Veg Price</span>
                          <span className="text-xl font-black text-emerald-600">₹{Number(dinnerVeg.price)}</span>
                        </div>
                      )}
                      {dinnerNonveg && (
                        <div className="flex-1 p-3 bg-rose-50/70 rounded-2xl border border-rose-100/50 flex flex-col items-center">
                          <span className="text-[10px] font-bold text-rose-800 uppercase tracking-widest mb-1">Non-Veg</span>
                          <span className="text-xl font-black text-rose-600">₹{Number(dinnerNonveg.price)}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-auto flex gap-3">
                      {dinnerVeg && (
                        <button
                          onClick={() => addSingleTrialToCart(dinnerVeg)}
                          className="flex-1 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/15 hover:shadow-emerald-600/25 active:scale-[0.96] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                          Add Veg
                        </button>
                      )}
                      {dinnerNonveg && (
                        <button
                          onClick={() => addSingleTrialToCart(dinnerNonveg)}
                          className="flex-1 py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-red-600/15 hover:shadow-red-600/25 active:scale-[0.96] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                          Add Non-Veg
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Monthly Menu Section */}
        <section className="menu-section mt-16 bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900">Monthly Subscription Plans</h2>
              <p className="text-slate-500 text-sm mt-1">Get fresh, nutritionist-approved meals delivered daily for 30 days</p>
            </div>
            <div className="h-1 w-20 bg-red-500 rounded-full md:hidden"></div>
          </div>

          {loadingMonthlyMeals ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-600"></div>
              <p className="text-slate-500 mt-4 font-semibold text-sm">Loading subscription plans...</p>
            </div>
          ) : monthlyMeals.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-3xl">
              <p className="text-slate-500 font-medium">No subscription plans available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {monthlyMeals.map((meal, i) => {
                const vegPrice = meal.veg || meal.price?.veg || 0;
                const nonvegPrice = meal.nonveg || meal.price?.nonVeg || 0;
                return (
                  <div
                    key={i}
                    className="group relative w-full max-w-[380px] flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-out overflow-hidden"
                  >
                    <div className="w-full h-64 relative overflow-hidden bg-slate-100">
                      <Image
                        src={meal.image?.[0] || "/hero2.jpg"}
                        alt={meal.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        onError={(e) => {
                          e.currentTarget.src = "/hero2.jpg";
                        }}
                      />
                      <div className="absolute top-4 left-4 z-10">
                        <span className="px-3.5 py-1.5 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-extrabold rounded-full uppercase tracking-wider shadow-md">
                          30 Days Plan
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-red-600 transition-colors duration-300 mb-5 line-clamp-1">
                        {meal.name}
                      </h3>

                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1 p-3 bg-emerald-50/70 rounded-2xl border border-emerald-100/50 flex flex-col items-center">
                          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest mb-1">Veg Price</span>
                          <span className="text-xl font-black text-emerald-600">₹{vegPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex-1 p-3 bg-rose-50/70 rounded-2xl border border-rose-100/50 flex flex-col items-center">
                          <span className="text-[10px] font-bold text-rose-800 uppercase tracking-widest mb-1">Non-Veg</span>
                          <span className="text-xl font-black text-rose-600">₹{nonvegPrice.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="mt-auto flex gap-3">
                        <button
                          onClick={() => handleAddMonthlyPlan(meal, "veg")}
                          className="flex-1 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/15 hover:shadow-emerald-600/25 active:scale-[0.96] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                          Add Veg
                        </button>
                        <button
                          onClick={() => handleAddMonthlyPlan(meal, "nonveg")}
                          className="flex-1 py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-red-600/15 hover:shadow-red-600/25 active:scale-[0.96] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                          Add Non-Veg
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Page;
