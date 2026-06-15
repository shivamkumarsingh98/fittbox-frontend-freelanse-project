"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlice";
import toast from "react-hot-toast";
import { getMonthlyMeals } from "../../api/Meals";

const planStaticData = {
  "fat-loss": {
    title: "Fat Loss Plan",
    name: "3 Meals a day",
    queryName: "3 Meals a day",
    image: "/hero3.jpg",
    vegPrice: 5299,
    nonVegPrice: 5799,
    description: "Ready to transform your body? Our macro-specific meals help you shed unwanted pounds while staying energized. Enjoy 3 fresh, calorie-controlled meals daily: Breakfast, Lunch, and Dinner.",
  },
  "muscle-building": {
    title: "Muscle Building Plan",
    name: "Lunch + Dinner",
    queryName: "Lunch + Dinner",
    image: "/hero4.jpg",
    vegPrice: 3999,
    nonVegPrice: 4399,
    description: "Bulk up with high-protein, fiber-rich meals perfect for post-workout recovery. Fuel your muscles with 2 heavy-duty nutrient-dense meals: Lunch and Dinner.",
  },
  "balanced-nourishment": {
    title: "Balanced Nourishment Plan",
    name: "Breakfast + Lunch/Dinner",
    queryName: "Breakfast + Lunch/Dinner",
    image: "/hero5.jpg",
    vegPrice: 3899,
    nonVegPrice: 4299,
    description: "Maintain a healthy lifestyle with our macro-balanced meals — delicious, convenient, delivered daily. Enjoy Breakfast along with your choice of Lunch or Dinner.",
  },
};

export default function Page({ params }) {
  const { planId } = use(params);
  const dispatch = useDispatch();
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  const staticPlan = planStaticData[planId] || planStaticData["fat-loss"];

  useEffect(() => {
    const fetchAndFilterPlan = async () => {
      try {
        setLoading(true);
        const meals = await getMonthlyMeals();
        console.log("[plans/page] Fetched meals:", meals);

        if (Array.isArray(meals) && meals.length > 0) {
          // Filter matching the queryName (case-insensitive or partial match)
          const target = staticPlan.queryName.toLowerCase();
          const found = meals.find((m) =>
            m.name && m.name.toLowerCase().includes(target)
          );

          if (found) {
            setMealPlan(found);
            return;
          }
        }
      } catch (err) {
        console.error("Failed to load backend monthly meals for plan details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilterPlan();
  }, [planId, staticPlan]);

  // Determine pricing and image dynamically
  const planTitle = staticPlan.title;
  const planDescription = mealPlan?.description || staticPlan.description;
  const vegPrice = mealPlan
    ? mealPlan.veg || mealPlan.price?.veg || staticPlan.vegPrice
    : staticPlan.vegPrice;
  const nonvegPrice = mealPlan
    ? mealPlan.nonveg || mealPlan.price?.nonVeg || staticPlan.nonVegPrice
    : staticPlan.nonVegPrice;
  const planImage = (mealPlan?.image?.[0] || mealPlan?.image) || staticPlan.image;
  const mealName = mealPlan?.name || staticPlan.name;

  const handleAddPlan = (type) => {
    const price = type === "veg" ? vegPrice : nonvegPrice;
    
    // Fallback ID if mealPlan is not active
    const productId = mealPlan?._id || `static-${planId}`;

    const cartItem = {
      id: `${productId}-${type}`,
      productId: productId,
      name: `${mealName} (${type === "veg" ? "Veg" : "Non-Veg"})`,
      type: type === "veg" ? "vegetarian" : "non-vegetarian",
      category: "monthly",
      planType: "MealPlan",
      price: Number(price),
      days: 30,
      quantity: 1,
      image: planImage || null,
    };

    console.log("🛒 Adding landing plan to cart:", cartItem);
    dispatch(addToCart(cartItem));
    toast.success(`${cartItem.name} added to cart!`);
  };

  return (
    <main className="bg-white font-sans antialiased text-slate-800 min-h-screen pt-4 pb-16 md:pt-6 md:pb-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-2">
          <Link href="/" className="text-slate-400 hover:text-slate-600 text-xs font-medium transition inline-flex items-center gap-1.5">
            ← Back to Home
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 bg-white">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            <p className="text-slate-500 mt-4 font-semibold">Loading plan details...</p>
          </div>
        ) : (
          <div className="bg-white py-2 md:py-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              
              {/* Left Column: Image */}
              <div className="relative w-full h-[350px] md:h-[480px] rounded-3xl overflow-hidden shadow-md bg-slate-50 border border-slate-100">
                <Image
                  src={planImage}
                  alt={planTitle}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.src = staticPlan.image;
                  }}
                />
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-4 py-2 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
                    30 Days Plan
                  </span>
                </div>
              </div>

              {/* Right Column: Pricing & Add to Cart */}
              <div className="flex flex-col h-full justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-extrabold uppercase tracking-widest mb-4 w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                  Active Subscription
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">
                  {planTitle}
                </h1>
                
                <p className="text-slate-500 text-base leading-relaxed mb-8">
                  {planDescription}
                </p>

                {/* USA style pricing section */}
                <div className="grid grid-cols-2 gap-6 border-y border-slate-100 py-6 mb-8">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Vegetarian
                    </span>
                    <span className="text-3xl font-black text-slate-800">₹{vegPrice.toLocaleString()}</span>
                    <span className="text-slate-400 text-xs mt-1">For 30 Days</span>
                  </div>

                  <div className="flex flex-col border-l border-slate-100 pl-6">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span> Non-Vegetarian
                    </span>
                    <span className="text-3xl font-black text-slate-800">₹{nonvegPrice.toLocaleString()}</span>
                    <span className="text-slate-400 text-xs mt-1">For 30 Days</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => handleAddPlan("veg")}
                    className="flex-1 py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-200 active:scale-[0.97] hover:shadow-lg hover:shadow-emerald-600/10 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Add Veg Subscription
                  </button>

                  <button
                    onClick={() => handleAddPlan("nonveg")}
                    className="flex-1 py-4 px-6 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-200 active:scale-[0.97] hover:shadow-lg hover:shadow-rose-600/10 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Add Non-Veg Subscription
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </main>
  );
}
