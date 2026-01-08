"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import toast from "react-hot-toast";
import { useModal } from "../Component/ModalContext";
import { getTrialMeals, getMonthlyMeals } from "../api/Meals";

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
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                isSelected
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
                className={`w-5 h-5 rounded focus:ring-2 ${
                  type === "veg"
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
          className={`flex-1 px-4 py-2 rounded-lg font-semibold text-white transition shadow-md ${
            type === "veg"
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
        // console.error("Failed to fetch trial meals:", error);
        toast.error("Failed to load trial meals");
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
        console.error("Failed to fetch monthly meals:", error);
        toast.error("Failed to load monthly meals");
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
            })
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
      />
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
    (m) => m.category === "breakfast" && m.type === "vegetarian"
  );
  const breakfastNonvegList = trialMeals.filter(
    (m) => m.category === "breakfast" && m.type === "non-vegetarian"
  );

  const breakfastOptions = [0, 1, 2].map((idx) => {
    const foundVeg =
      trialMeals.find(
        (m) =>
          m.category === "breakfast" &&
          (m.mealOption === idx + 1 || Number(m.mealOption) === idx + 1) &&
          m.type === "vegetarian"
      ) ||
      breakfastVegList[idx] ||
      null;
    const foundNonveg =
      trialMeals.find(
        (m) =>
          m.category === "breakfast" &&
          (m.mealOption === idx + 1 || Number(m.mealOption) === idx + 1) &&
          m.type === "non-vegetarian"
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
    (m) => m.category === "lunch" && m.type === "vegetarian"
  );
  const lunchNonveg = trialMeals.find(
    (m) => m.category === "lunch" && m.type === "non-vegetarian"
  );

  const dinnerVeg = trialMeals.find(
    (m) => m.category === "dinner" && m.type === "vegetarian"
  );
  const dinnerNonveg = trialMeals.find(
    (m) => m.category === "dinner" && m.type === "non-vegetarian"
  );
  const handleAddMonthlyPlan = (meal, type) => {
    if (!meal || !meal._id) {
      console.error("Meal ID is missing!", meal);
      toast.error("Cannot add this meal to cart. Missing ID.");
      return;
    }

    const price =
      type === "veg" ? meal.price?.veg ?? 0 : meal.price?.nonVeg ?? 0;

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
      })
    );
    toast.success(`${meal.name} (${type}) added to cart!`);
  };

  return (
    <main className="bg-[#f7f8fa] flex items-center">
      <div className="w-full max-w-7xl mx-auto px-4 py-10">
        {/* Hero Section */}
        <section className="menu-hero flex flex-col md:flex-row gap-8 items-center relative border-b pb-10">
          <div className="hero-left flex-1 max-w-[60%]">
            <h1 className="text-[3.5rem] leading-none font-extrabold mb-5 animate-fadeUp">
              <span className="text-black">Our</span>{" "}
              <span className="text-red-600">Menu</span>
            </h1>
            <p
              className="text-black/80 max-w-[48ch] mb-6 animate-fadeUp"
              style={{ animationDelay: "120ms" }}
            >
              Fresh, zesty, and bursting with crunch—our meals are crafted to
              keep you energized and healthy every day!
            </p>
          </div>

          <div className="hero-right flex-1 flex items-center justify-end relative">
            <div
              className="relative w-[300px] h-[300px] rounded-full overflow-hidden shadow-lg animate-scaleIn"
              style={{ animationDelay: "200ms" }}
            >
              <Image
                src="/hero3.jpg"
                alt="Healthy bowl"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Trial Menu Section */}
        <section className="menu-section mt-20">
          <h2 className="text-3xl font-bold mb-8 text-[#07101a]">Trial Menu</h2>
          {loadingTrialMeals ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              <p className="text-gray-600 mt-3">Loading trial meals...</p>
            </div>
          ) : trialMeals.length === 0 ? (
            <p className="text-center text-gray-600 py-8">
              No trial meals available
            </p>
          ) : (
            <div className="space-y-8">
              {/* Breakfast - 3 option cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
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
                      className="w-full max-w-[420px] menu-card overflow-hidden shadow-md hover:shadow-lg transition flex flex-col bg-white border border-gray-200"
                      style={{ borderRadius: "0 0 1rem 1rem" }}
                    >
                      <div className="w-full h-56 relative -m-0">
                        <Image
                          src={cardImage}
                          alt={capitalizedName}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/hero2.jpg";
                          }}
                        />
                        <div className="absolute top-3 right-3">
                          <span className="px-3 py-1 bg-gray-800/85 text-white text-xs font-bold rounded-full uppercase tracking-wide shadow-md">
                            {opt.category} Option {opt.option}
                          </span>
                        </div>
                      </div>
                      <div className="px-6 pb-6 pt-4 flex flex-col flex-grow">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                          {capitalizedName}
                        </h2>
                        <div className="flex items-center gap-6 mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                          {vegPrice !== null && (
                            <div className="flex-1 text-center">
                              <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                                Veg Price
                              </div>
                              <div className="text-2xl font-bold text-green-500">
                                ₹{vegPrice}
                              </div>
                            </div>
                          )}
                          {nonvegPrice !== null && (
                            <div className="flex-1 text-center">
                              <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                                Non-Veg Price
                              </div>
                              <div className="text-2xl font-bold text-red-600">
                                ₹{nonvegPrice}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="mt-auto flex gap-3">
                          {opt.veg && (
                            <button
                              onClick={() => addSingleTrialToCart(opt.veg)}
                              className="flex-1 bg-green-500 text-white py-3 px-4 rounded-full font-bold hover:bg-emerald-600 transition text-sm uppercase tracking-wide shadow-md"
                            >
                              Add Veg
                            </button>
                          )}
                          {opt.nonveg && (
                            <button
                              onClick={() => addSingleTrialToCart(opt.nonveg)}
                              className="flex-1 bg-red-500 text-white py-3 px-4 rounded-full font-bold hover:bg-red-600 transition text-sm uppercase tracking-wide shadow-md"
                            >
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                {/* Lunch */}
                <div
                  className="w-full max-w-[420px] menu-card overflow-hidden shadow-md hover:shadow-lg transition flex flex-col bg-white border border-gray-200"
                  style={{ borderRadius: "0 0 1rem 1rem" }}
                >
                  <div className="w-full h-56 relative -m-0">
                    <Image
                      src={
                        (lunchVeg && lunchVeg.image) ||
                        (lunchNonveg && lunchNonveg.image) ||
                        "/hero2.jpg"
                      }
                      alt="Lunch"
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/hero2.jpg";
                      }}
                    />
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 bg-gray-800/85 text-white text-xs font-bold rounded-full uppercase tracking-wide shadow-md">
                        Lunch
                      </span>
                    </div>
                  </div>
                  <div className="px-6 pb-6 pt-4 flex flex-col flex-grow">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Lunch
                    </h2>
                    <div className="flex items-center gap-6 mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                      {lunchVeg && (
                        <div className="flex-1 text-center">
                          <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                            Veg Price
                          </div>
                          <div className="text-2xl font-bold text-emerald-600">
                            ₹{Number(lunchVeg.price)}
                          </div>
                        </div>
                      )}
                      {lunchNonveg && (
                        <div className="flex-1 text-center">
                          <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                            Non-Veg Price
                          </div>
                          <div className="text-2xl font-bold text-red-600">
                            ₹{Number(lunchNonveg.price)}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-auto flex gap-3">
                      {lunchVeg && (
                        <button
                          onClick={() => addSingleTrialToCart(lunchVeg)}
                          className="flex-1 bg-green-500 text-white py-3 px-4 rounded-full font-bold hover:bg-emerald-600 transition text-sm uppercase tracking-wide shadow-md"
                        >
                          Add Veg
                        </button>
                      )}
                      {lunchNonveg && (
                        <button
                          onClick={() => addSingleTrialToCart(lunchNonveg)}
                          className="flex-1 bg-red-500 text-white py-3 px-4 rounded-full font-bold hover:bg-red-600 transition text-sm uppercase tracking-wide shadow-md"
                        >
                          Add Non-Veg
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dinner */}
                <div
                  className="w-full max-w-[420px] menu-card overflow-hidden shadow-md hover:shadow-lg transition flex flex-col bg-white border border-gray-200"
                  style={{ borderRadius: "0 0 1rem 1rem" }}
                >
                  <div className="w-full h-56 relative -m-0">
                    <Image
                      src={
                        (dinnerVeg && dinnerVeg.image) ||
                        (dinnerNonveg && dinnerNonveg.image) ||
                        "/hero2.jpg"
                      }
                      alt="Dinner"
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/hero2.jpg";
                      }}
                    />
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 bg-gray-800/85 text-white text-xs font-bold rounded-full uppercase tracking-wide shadow-md">
                        Dinner
                      </span>
                    </div>
                  </div>
                  <div className="px-6 pb-6 pt-4 flex flex-col flex-grow">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Dinner
                    </h2>
                    <div className="flex items-center gap-6 mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                      {dinnerVeg && (
                        <div className="flex-1 text-center">
                          <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                            Veg Price
                          </div>
                          <div className="text-2xl font-bold text-emerald-600">
                            ₹{Number(dinnerVeg.price)}
                          </div>
                        </div>
                      )}
                      {dinnerNonveg && (
                        <div className="flex-1 text-center">
                          <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                            Non-Veg Price
                          </div>
                          <div className="text-2xl font-bold text-red-600">
                            ₹{Number(dinnerNonveg.price)}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-auto flex gap-3">
                      {dinnerVeg && (
                        <button
                          onClick={() => addSingleTrialToCart(dinnerVeg)}
                          className="flex-1 bg-green-500 text-white py-3 px-4 rounded-full font-bold hover:bg-emerald-600 transition text-sm uppercase tracking-wide shadow-md"
                        >
                          Add Veg
                        </button>
                      )}
                      {dinnerNonveg && (
                        <button
                          onClick={() => addSingleTrialToCart(dinnerNonveg)}
                          className="flex-1 bg-red-500 text-white py-3 px-4 rounded-full font-bold hover:bg-red-600 transition text-sm uppercase tracking-wide shadow-md"
                        >
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
        <section className="menu-section mt-20">
          <h2 className="text-3xl font-bold mb-8 text-[#07101a]">
            Monthly Menu
          </h2>
          {loadingMonthlyMeals ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-3">Loading monthly meals...</p>
            </div>
          ) : monthlyMeals.length === 0 ? (
            <p className="text-center text-gray-600 py-8">
              No monthly meals available
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
              {monthlyMeals.map((meal, i) => {
                const vegPrice = meal.veg || meal.price?.veg || 0;
                const nonvegPrice = meal.nonveg || meal.price?.nonVeg || 0;
                return (
                  <div
                    key={i}
                    className="w-full max-w-[420px] menu-card overflow-hidden shadow-md hover:shadow-lg transition flex flex-col bg-white border border-gray-200"
                    style={{ borderRadius: "0 0 1rem 1rem" }}
                  >
                    <div className="w-full h-56 relative -m-0">
                      <Image
                        src={meal.image || "/hero2.jpg"}
                        alt={meal.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/hero2.jpg";
                        }}
                      />
                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 bg-gray-800/85 text-white text-xs font-bold rounded-full uppercase tracking-wide shadow-md">
                          Monthly
                        </span>
                      </div>
                    </div>
                    <div className="px-6 pb-6 pt-4 flex flex-col flex-grow">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        {meal.name}
                      </h2>
                      <div className="flex items-center gap-6 mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                        <div className="flex-1 text-center">
                          <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                            Veg Price
                          </div>
                          <div className="text-2xl font-bold text-emerald-600">
                            ₹{vegPrice.toLocaleString()}
                          </div>
                        </div>
                        <div className="flex-1 text-center">
                          <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                            Non-Veg Price
                          </div>
                          <div className="text-2xl font-bold text-red-600">
                            ₹{nonvegPrice.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="mt-auto flex gap-3">
                        <button
                          onClick={() => handleAddMonthlyPlan(meal, "veg")}
                          className="flex-1 bg-green-500 text-white py-3 px-4 rounded-full font-bold hover:bg-emerald-600 transition text-sm uppercase tracking-wide shadow-md"
                        >
                          Add Veg
                        </button>
                        <button
                          onClick={() => handleAddMonthlyPlan(meal, "nonveg")}
                          className="flex-1 bg-red-500 text-white py-3 px-4 rounded-full font-bold hover:bg-red-600 transition text-sm uppercase tracking-wide shadow-md"
                        >
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
