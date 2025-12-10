"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { IoChevronDownOutline } from "react-icons/io5";
import {
  getNutrition,
  createNutritionOrder,
  verifyNutritionPayment,
  checkNutritionStatus,
} from "../api/admin";
import Script from "next/script";
const Page = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [calories, setCalories] = useState(null);
  const [plan, setPlan] = useState(null);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [faqOpen, setFaqOpen] = useState({});

  const [form, setForm] = useState({
    age: "30",
    weight: "70",
    height: "170",
    gender: "male",
    activity: "sedentary",
    goal: "maintenance",
    dietary: "omnivore",
  });

  const [nutritionData, setNutritionData] = useState(null);
  const [nutritionVisible, setNutritionVisible] = useState(false);

  const fetchNutritionData = async () => {
    try {
      const data = await getNutrition();
      console.log("Fetched nutrition data:", data);
      setNutritionData(data);
    } catch (error) {
      console.error("Error fetching nutrition data:", error);
    }
  };
  React.useEffect(() => {
    fetchNutritionData();
  }, []);

  // 🔥 PAGE REFRESH पर payment-status check
  React.useEffect(() => {
    if (!user) return;

    const fetchPaymentStatus = async () => {
      try {
        const res = await checkNutritionStatus(user.id || user._id);
        console.log("Payment status:", res);

        if (res.paid) {
          setNutritionVisible(true);

          // Update name & number from backend (safe way)
          setNutritionData((prev) => ({
            ...prev,
            data: {
              ...prev?.data,
              providerName: res?.data?.name,
              providerContact: res?.data?.number,
            },
          }));
        }
      } catch (err) {
        console.error("Status error:", err);
      }
    };

    fetchPaymentStatus();
  }, [user]);

  const handleNutritionPayment = async () => {
    // Check if user is logged in
    if (!isAuthenticated || !user) {
      alert("Please login/register first to book a nutrition session!");

      return;
    }

    try {
      if (!window.Razorpay) {
        alert("Payment system not loaded. Try again!");
        return;
      }

      const order = await createNutritionOrder();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: order.amount,
        order_id: order.id,
        name: "Nutrition Session",
        handler: async function (response) {
          try {
            const verify = await verifyNutritionPayment({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              purchaserName: user.name || user.username || "User", // user name from auth
              purchaserNumber:
                user.phone || user.phoneNumber || user.mobileNumber || "", // mobile number from auth
              userId: user.id || user._id || "", // logged in user id from auth
              amount: order.amount,
            });
            console.log("Payment verification result:", verify);

            if (verify.success) {
              alert("Payment Verified!");
              setNutritionVisible(true);
            } else {
              alert("Payment Verification Failed!");
            }
          } catch (err) {
            console.error(err);
            alert("Verification Error");
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed");
    }
  };

  const heroImage =
    "https://media.istockphoto.com/id/1457433817/photo/group-of-healthy-food-for-flexitarian-diet.jpg?s=612x612&w=0&k=20&c=v48RE0ZNWpMZOlSp13KdF1yFDmidorO2pZTu2Idmd3M=";
  const galleryImages = [
    "https://i0.wp.com/images-prod.healthline.com/hlcmsresource/images/AN_images/healthy-eating-ingredients-1296x728-header.jpg?w=1155&h=1528",
    "https://media.istockphoto.com/id/1433432507/photo/healthy-eating-plate-with-vegan-or-vegetarian-food-in-woman-hands-healthy-plant-based-diet.jpg?s=612x612&w=0&k=20&c=kQBPg4xNIiDMZ-Uu2r37OHZDQSaRroZlxo_YLioh5tA=",
    "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?cs=srgb&dl=pexels-janetrangdoan-1092730.jpg&fm=jpg",
    "https://www.naturemade.com/cdn/shop/articles/healthy-foods-to-eat_960x.jpg?v=1611988563",
  ];

  const handleChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const calculateCalories = (e) => {
    e && e.preventDefault && e.preventDefault();
    const age = Number(form.age) || 30;
    const weight = Number(form.weight) || 70;
    const height = Number(form.height) || 170;
    const genderFactor = form.gender === "male" ? 5 : -161;
    const bmr = 10 * weight + 6.25 * height - 5 * age + genderFactor;
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };
    const activityMul = activityMultipliers[form.activity] || 1.2;
    let maintenance = Math.round(bmr * activityMul);
    const goalAdjust = {
      weight_loss: 0.8,
      maintenance: 1,
      weight_gain: 1.2,
    };
    maintenance = Math.round(maintenance * (goalAdjust[form.goal] || 1));
    setCalories(maintenance);
    setPlan(null);
  };

  const getMacros = (cals) => {
    if (!cals) return null;
    const weight = Number(form.weight) || 70;
    const proteinPerKg =
      form.goal === "weight_loss"
        ? 2.0
        : form.goal === "weight_gain"
        ? 1.8
        : 1.6;
    const proteinGrams = Math.round(proteinPerKg * weight);
    const proteinCals = proteinGrams * 4;
    const fatPercent = form.dietary === "vegan" ? 0.3 : 0.25;
    const fatCals = Math.round(cals * fatPercent);
    const fatGrams = Math.round(fatCals / 9);
    const carbsCals = cals - proteinCals - fatCals;
    const carbsGrams = Math.max(0, Math.round(carbsCals / 4));
    return { proteinGrams, fatGrams, carbsGrams };
  };

  const macros = getMacros(calories);

  const generateAiPlan = () => {
    if (!calories) {
      setPlan({ error: "Please calculate calories first." });
      return;
    }
    const isVeg = form.dietary === "vegetarian" || form.dietary === "vegan";
    const isVegan = form.dietary === "vegan";
    const proteins = {
      omnivore: ["Grilled chicken", "Steamed fish", "Eggs", "Beef stir-fry"],
      vegetarian: ["Paneer", "Tofu", "Lentils", "Chickpeas"],
      vegan: ["Tofu", "Lentils", "Chickpeas", "Quinoa"],
    }[form.dietary];
    const carbs = ["Quinoa", "Brown rice", "Sweet potato", "Oats", "Millet"];
    const veggies = [
      "Salad",
      "Broccoli",
      "Spinach",
      "Mixed veggies",
      "Carrots",
    ];
    const fruits = ["Berries", "Apple", "Banana", "Orange"];
    const dairy = isVegan
      ? ["Almond milk", "Coconut yogurt"]
      : ["Greek yogurt", "Milk", "Cheese"];
    const days = Array.from({ length: 5 }, (_, dayIdx) => {
      const perMeal = Math.round(calories / 4);
      const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
      return {
        day: `Day ${dayIdx + 1}`,
        meals: [
          {
            name: "Breakfast",
            item: `${rand(dairy)} with ${rand(fruits)} and nuts (~${Math.round(
              perMeal * 0.8
            )} kcal)`,
          },
          {
            name: "Lunch",
            item: `${rand(proteins)} with ${rand(carbs)} and ${rand(
              veggies
            )} (~${Math.round(perMeal * 1.1)} kcal)`,
          },
          {
            name: "Snack",
            item: `${rand(fruits)} smoothie with ${
              isVegan ? "plant protein" : "whey"
            } (~${Math.round(perMeal * 0.6)} kcal)`,
          },
          {
            name: "Dinner",
            item: `${rand(proteins)} curry with ${rand(veggies)} (~${Math.round(
              perMeal * 1.0
            )} kcal)`,
          },
        ],
      };
    });
    setPlan({
      ai: aiEnabled,
      days,
      generatedAt: new Date().toISOString(),
      dietary: form.dietary,
    });
  };

  const getMealsForCalories = (cals, dietary) => {
    if (!cals) return [];
    const brackets = cals < 1800 ? "low" : cals < 2500 ? "medium" : "high";
    const isVeg = dietary === "vegetarian" || dietary === "vegan";
    const mealsByBracket = {
      low: [
        { name: "Breakfast", item: "Oats with berries" },
        {
          name: "Lunch",
          item: `${isVeg ? "Tofu salad" : "Grilled chicken salad"}`,
        },
        { name: "Dinner", item: "Veg soup" },
      ],
      medium: [
        { name: "Breakfast", item: "Yogurt parfait" },
        {
          name: "Lunch",
          item: `${isVeg ? "Paneer stir-fry" : "Fish with rice"}`,
        },
        { name: "Dinner", item: "Lentil curry" },
      ],
      high: [
        { name: "Breakfast", item: "Avocado toast with eggs" },
        { name: "Lunch", item: `${isVeg ? "Chickpea bowl" : "Beef stir-fry"}` },
        { name: "Dinner", item: "Quinoa salad" },
      ],
    };
    return mealsByBracket[brackets];
  };

  const meals = getMealsForCalories(calories, form.dietary);

  const toggleFaq = (idx) => setFaqOpen((s) => ({ ...s, [idx]: !s[idx] }));

  const faqs = [
    {
      q: "How accurate is the calculator?",
      a: "It's based on Mifflin-St Jeor, a reliable formula, but consult a professional for precise needs.",
    },
    {
      q: "What does AI-powered mean?",
      a: "Our simulator uses advanced heuristics to personalize plans based on your inputs.",
    },
    {
      q: "Is the call feature secure?",
      a: "Yes, all consultations are confidential and with certified nutritionists.",
    },
    {
      q: "Can I customize further?",
      a: "For advanced customization, use the paid call option.",
    },
  ];

  return (
    <main className="py-12 px-6 md:px-16 lg:px-24 bg-gradient-to-br from-white to-emerald-50 min-h-screen font-sans">
      {/* hero section */}
      <section className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div className="space-y-6">
          <h1 className="text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400">
            Premium Nutrition Hub
          </h1>
          <p className="text-lg text-gray-700 max-w-lg">
            Discover personalized calorie needs, macro breakdowns, AI-generated
            meal plans, and expert consultations. Elevate your diet with
            science-backed insights.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg transform hover:scale-105 transition">
              <div className="text-sm text-gray-500">AI-Driven</div>
              <div className="font-bold text-blue-600">Smart Meal Plans</div>
            </div>
            <div className="p-5 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg transform hover:scale-105 transition">
              <div className="text-sm text-gray-500">Expert Access</div>
              <div className="font-bold text-green-600">Paid Consults</div>
            </div>
          </div>
        </div>
        <div className="rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition">
          <img
            src="/hero10.jpg"
            alt="Nutrition Hero"
            className="w-full h-96 object-cover"
          />
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Why Focus on Nutrition?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-3">Boost Energy</h3>
            <p className="text-gray-600">
              Balanced macros keep you energized throughout the day.
            </p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-3">Weight Management</h3>
            <p className="text-gray-600">
              Achieve goals with precise calorie tracking.
            </p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-3">Health Benefits</h3>
            <p className="text-gray-600">
              Reduce risks of diseases with nutrient-rich diets.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Inspiration Gallery
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          {galleryImages.map((src, i) => (
            <figure
              key={i}
              className="rounded-2xl overflow-hidden shadow-lg transform hover:scale-105 transition"
            >
              <img
                src={src}
                alt={`Nutrition Inspiration ${i + 1}`}
                className="w-full h-64 object-cover"
              />
            </figure>
          ))}
        </div>
      </section>

      <section className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              AI Nutrition Calculator
            </h2>
            <form
              onSubmit={calculateCalories}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <input
                name="age"
                value={form.age}
                onChange={handleChange}
                type="number"
                placeholder="Age"
                className="p-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
              <input
                name="weight"
                value={form.weight}
                onChange={handleChange}
                type="number"
                placeholder="Weight (kg)"
                className="p-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
              <input
                name="height"
                value={form.height}
                onChange={handleChange}
                type="number"
                placeholder="Height (cm)"
                className="p-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="p-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <select
                name="activity"
                value={form.activity}
                onChange={handleChange}
                className="p-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              >
                <option value="sedentary">Sedentary</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="active">Active</option>
                <option value="very_active">Very Active</option>
              </select>
              <select
                name="goal"
                value={form.goal}
                onChange={handleChange}
                className="p-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              >
                <option value="weight_loss">Weight Loss</option>
                <option value="maintenance">Maintenance</option>
                <option value="weight_gain">Weight Gain</option>
              </select>
              <select
                name="dietary"
                value={form.dietary}
                onChange={handleChange}
                className="p-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition md:col-span-3"
              >
                <option value="omnivore">Omnivore</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
              </select>
              <div className="md:col-span-3 flex flex-wrap items-center gap-4 mt-4">
                <button
                  type="submit"
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition"
                >
                  Calculate Now
                </button>
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={aiEnabled}
                    onChange={() => setAiEnabled(!aiEnabled)}
                    className="accent-blue-500"
                  />
                  Enable AI Enhancements
                </label>
                {calories && (
                  <div className="text-xl font-bold text-green-600">
                    Daily: {calories} kcal
                  </div>
                )}
              </div>
            </form>

            {macros && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                {["Protein", "Carbs", "Fat"].map((key, i) => {
                  const grams = macros[`${key.toLowerCase()}Grams`];
                  const cals = key === "Fat" ? grams * 9 : grams * 4;
                  const percent = Math.round((cals / calories) * 100);
                  return (
                    <div
                      key={i}
                      className="p-5 bg-gradient-to-br from-white to-gray-100 rounded-2xl shadow-md"
                    >
                      <div className="text-sm text-gray-500">{key}</div>
                      <div className="text-2xl font-bold">{grams}g</div>
                      <div className="text-sm text-gray-400">
                        {cals} kcal ({percent}%)
                      </div>
                      <div className="mt-2 h-2 bg-gray-200 rounded-full">
                        <div
                          className={`h-full rounded-full ${
                            key === "Protein"
                              ? "bg-blue-500"
                              : key === "Carbs"
                              ? "bg-green-500"
                              : "bg-yellow-500"
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  AI Calculator
                </h3>
                {/* <button
                  onClick={generateAiPlan}
                  className="px-6 py-2 rounded-full bg-indigo-600 text-white font-semibold shadow-lg hover:scale-105 transition"
                >
                  Generate 5-Day Plan
                </button> */}
              </div>
              {!plan && (
                <p className="text-gray-500">
                  Calculate calories and click to generate a personalized plan.
                </p>
              )}
              {plan?.error && <p className="text-red-500">{plan.error}</p>}
              {plan?.days && (
                <div className="space-y-4">
                  {plan.days.map((d, idx) => (
                    <div
                      key={idx}
                      className="p-6 bg-white rounded-2xl shadow-md"
                    >
                      <div className="font-bold text-lg mb-3">{d.day}</div>
                      {d.meals.map((m, i) => (
                        <div
                          key={i}
                          className="flex justify-between text-sm mb-2"
                        >
                          <span className="text-gray-600">{m.name}:</span>
                          <span className="font-medium">{m.item}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                  <p className="text-xs text-gray-500 mt-2">
                    {plan.ai ? "AI-Enhanced" : "Basic"} Plan for{" "}
                    {plan.dietary.charAt(0).toUpperCase() +
                      plan.dietary.slice(1)}{" "}
                    · Generated: {new Date(plan.generatedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {calories && (
            <div className="bg-gradient-to-br from-amber-50 to-rose-50 rounded-3xl shadow-xl p-8">
              <h3 className="text-3xl font-bold mb-6 text-gray-800">
                Daily Meal Ideas
              </h3>
              <div className="space-y-4">
                {meals.map((m, i) => (
                  <div
                    key={i}
                    className="p-5 bg-white rounded-2xl shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <div className="text-sm text-gray-500">{m.name}</div>
                      <div className="font-medium">{m.item}</div>
                    </div>
                    <div className="text-sm text-gray-400">
                      ~{Math.round(calories / 3)} kcal
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-8">
          <Script
            src="https://checkout.razorpay.com/v1/checkout.js"
            strategy="afterInteractive"
          />
          <div className="bg-gradient-to-tr from-purple-700 to-pink-600 text-white rounded-3xl shadow-2xl p-8 sticky top-20">
            <div className="flex items-center gap-4 mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 11c2.21 0 4-1.79 4-4S14.21 3 12 3 8 4.79 8 7s1.79 4 4 4z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"
                />
              </svg>
              <div>
                <div className="text-2xl font-bold">Consult a Nutritionist</div>
                <div className="text-sm opacity-90">
                  Personalized expert advice
                </div>
              </div>
            </div>
            <div className="text-center mb-4">
              <div className="text-4xl font-extrabold">
                ₹{nutritionData?.data.nutritionPrice || "—"}
              </div>
              {/* <div className="text-4xl font-extrabold">₹299</div> */}
              <div className="text-sm opacity-90">/ 20-min session</div>
              {nutritionVisible && nutritionData && (
                <div className="mt-6 p-4 bg-gradient-to-tr from-purple-700 to-pink-600 text-white rounded-xl shadow">
                  <h3 className="text-lg font-bold">Nutritionist Details</h3>
                  <p>Name: {nutritionData.data.providerName}</p>
                  <p>Contact: {nutritionData.data.providerContact}</p>
                </div>
              )}
            </div>
            <button
              onClick={handleNutritionPayment}
              disabled={nutritionVisible} // agar payment ho gaya to disable
              className={`w-full py-3 rounded-full font-bold shadow-lg hover:scale-105 transition
    ${
      nutritionVisible
        ? "bg-gray-400 text-gray-700 cursor-not-allowed"
        : "bg-white text-purple-700"
    }
  `}
            >
              {nutritionVisible ? "Already Booked" : "Book Now"}
            </button>
            <p className="text-sm opacity-90 text-center mt-4">
              Secure payments · Instant scheduling · Certified pros
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-6">
            <h4 className="text-xl font-bold mb-4 text-gray-800">
              Quick Health Tips
            </h4>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span> Eat whole foods daily
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span> Hydrate with 3L water
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span> Include colorful
                veggies
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span> Monitor portions
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span> Exercise regularly
              </li>
            </ul>
          </div>
        </aside>
      </section>

      <section className="mt-16">
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4 max-w-4xl mx-auto">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 flex justify-between items-center text-left font-semibold text-gray-800"
              >
                {faq.q}
                <span
                  className={`transform transition ${
                    faqOpen[idx] ? "rotate-180" : ""
                  }`}
                >
                  <IoChevronDownOutline className="text-red-500 text-2xl" />
                </span>
              </button>
              {faqOpen[idx] && (
                <p className="p-5 pt-0 text-gray-600 border-t">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Page;
