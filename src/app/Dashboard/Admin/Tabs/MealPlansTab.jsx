import React, { useState, useEffect } from "react";
import {
  createTrialMeal,
  createMonthlyMeal,
  updateMonthlyMeal,
  deleteMonthlyMeal,
  updateTrialMeal,
  deleteTrialMeal,
  getAllTrialMeals,
} from "../../../api/admin";
import { getMonthlyMeals } from "../../../api/Meals";

function PriceInput({ label, value, onChange, theme }) {
  return (
    <label className="block text-sm">
      <span className={`${theme === "dark" ? "text-neutral-300" : "text-neutral-700"}`}>{label}</span>
      <input type="number" min={0} value={value} onChange={(e) => onChange(Number(e.target.value))} className={`mt-1 w-full rounded border px-3 py-2 ${theme === "dark" ? "bg-neutral-900 border-neutral-700 text-white" : "bg-white"}`} />
    </label>
  );
}

function MealCard({ title, img, children, theme }) {
  return (
    <div className={`${theme === "dark" ? "bg-neutral-800 border-neutral-700" : "bg-white border"} rounded-xl p-4 border`}>
      <div className="flex items-center gap-3 mb-3">
        <img src={img} alt={title} className="w-14 h-14 rounded-full object-cover border" />
        <h4 className="text-lg font-semibold">{title}</h4>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>
    </div>
  );
}

export default function MealPlansTab({ theme }) {
  const [trial, setTrial] = useState({
    breakfast: {
      img: "/hero2.jpg",
      options: [
        { label: "Breakfast 1", veg: 99, nonveg: 129, category: "breakfast" },
        { label: "Breakfast 2", veg: 119, nonveg: 149, category: "breakfast" },
        { label: "Breakfast 3", veg: 139, nonveg: 169, category: "breakfast" },
      ],
    },
    lunch: { veg: 149, nonveg: 179, img: "/hero3.jpg" },
    dinner: { veg: 149, nonveg: 189, img: "/hero4.jpg" },
  });

  const [monthly, setMonthly] = useState({
    breakfastOnly: { veg: 1999, nonveg: 2299, img: "/hero2.jpg" },
    // oneMeal: { label: "Lunch/Dinner", veg: 2499, nonveg: 2799 },
    twoMealsBLD: { label: "Breakfast + Lunch/Dinner", veg: 3899, nonveg: 4299 },
    twoMealsLorD: { label: "Lunch / Dinner", veg: 2499, nonveg: 2799 }, // OR
    twoMealsLandD: { label: "Lunch + Dinner", veg: 3999, nonveg: 4399 },
    threeMeals: { label: "3 Meals a day", veg: 5299, nonveg: 5799 },
  });

  const [savingTrial, setSavingTrial] = useState(false);
  const [savingMonthly, setSavingMonthly] = useState(false);
  const [error, setError] = useState(null);
  const [trialImages, setTrialImages] = useState({
    // breakfast can hold a default and per-option files: { default: File, 0: File, 1: File }
    breakfast: {},
    lunch: null,
    dinner: null,
  });

  const [monthlyImages, setMonthlyImages] = useState({
    breakfastOnly: null,
    twoMealsBLD: null,
    twoMealsLorD: null,
    twoMealsLandD: null,
    threeMeals: null,
  });

  const [createdMonthly, setCreatedMonthly] = useState({});
  const [createdTrial, setCreatedTrial] = useState([]);
  const hasCreatedMonthly = Object.keys(createdMonthly).length > 0;
  const hasCreatedTrial = Object.keys(createdTrial).length > 0;

  // helper to compute a stable id for a trial item (DB id if present, fallback to name+mealOption)
  const trialItemId = (it) =>
    (it && (it._id || it.id)) || `${it?.name}-${it?.mealOption}`;
  const hasCreatedCategory = (cat) =>
    Array.isArray(createdTrial) &&
    createdTrial.some((it) => it.category === cat);
  // editing states
  const [editingTrial, setEditingTrial] = useState({}); // id -> boolean
  const [editTrialData, setEditTrialData] = useState({}); // id -> { name, price, type, mealOption }
  const [editTrialImage, setEditTrialImage] = useState({}); // id -> File

  const [editingMonthlyKey, setEditingMonthlyKey] = useState(null); // single key being edited
  const [editingAllTrial, setEditingAllTrial] = useState(false);

  const handleTrialImage = (key, file, idx = null) => {
    // support per-option images for breakfast: idx === null -> default, idx is number -> per-option
    setTrialImages((s) => {
      if (key === "breakfast") {
        const current = s.breakfast || {};
        if (idx === null) {
          return { ...s, breakfast: { ...current, default: file } };
        }
        return { ...s, breakfast: { ...current, [idx]: file } };
      }
      return { ...s, [key]: file };
    });
  };

  const handleMonthlyImage = (key, file) => {
    setMonthlyImages((s) => ({ ...s, [key]: file }));
  };

  const getMonthlyPayload = (key, obj) => {
    switch (key) {
      case "breakfastOnly":
        return {
          name: obj.label || "Breakfast Only",
          mealsIncluded: ["breakfast"],
          price: { veg: Number(obj.veg), nonVeg: Number(obj.nonveg) },
        };
      case "oneMeal": {
        const label = (obj.label || "1 Meal").toLowerCase();
        const meals = [];
        if (label.includes("breakfast")) meals.push("breakfast");
        if (label.includes("lunch")) meals.push("lunch");
        if (label.includes("dinner")) meals.push("dinner");
        if (meals.length === 0) meals.push("lunch");
        return {
          name: obj.label || "1 Meal",
          mealsIncluded: meals,
          price: { veg: Number(obj.veg), nonVeg: Number(obj.nonveg) },
        };
      }
      case "twoMealsBLD":
        return {
          name: obj.label || "Breakfast + Lunch/Dinner",
          mealsIncluded: ["breakfast", "lunch"],
          price: { veg: Number(obj.veg), nonVeg: Number(obj.nonveg) },
        };
      case "twoMealsLD":
        return {
          name: obj.label || "Lunch + Dinner",
          mealsIncluded: ["lunch", "dinner"],
          price: { veg: Number(obj.veg), nonVeg: Number(obj.nonveg) },
        };
      case "threeMeals":
        return {
          name: obj.label || "3 Meals a day",
          mealsIncluded: ["breakfast", "lunch", "dinner"],
          price: { veg: Number(obj.veg), nonVeg: Number(obj.nonveg) },
        };
      default:
        return null;
    }
  };

  const handleUpdateMonthly = async (key) => {
    try {
      const existing = createdMonthly[key];
      const actual = (existing && existing?.mealPlan) || existing;
      const id = actual && (actual._id || actual.id);

      if (!actual || !id) {
        alert("No existing monthly plan to update (missing id)");
        return;
      }

      const payload = getMonthlyPayload(key, monthly[key]);

      const res = await updateMonthlyMeal(id, payload, monthlyImages[key]);

      // 🔥 Refresh DB data (same as Trial)
      await fetchMonthlyItems();

      alert("Monthly plan updated");
    } catch (err) {
      console.error(err);
      alert(err?.message || "Update failed");
    }
  };

  const startEditMonthly = (key) => {
    // populate monthly[key] from createdMonthly entry if present
    const existing = createdMonthly[key];
    const actual = existing && (existing.data || existing);
    if (actual) {
      const p = actual.price || {};
      const priceVeg = p.veg ?? p?.veg ?? actual.price?.veg ?? 0;
      const priceNon = p.nonVeg ?? p?.nonVeg ?? actual.price?.nonVeg ?? 0;
      // map to monthly state structures used in UI
      setMonthly((s) => ({
        ...s,
        [key]: {
          ...(s[key] || {}),
          label: actual.name || s[key]?.label,
          veg: Number(priceVeg || 0),
          nonveg: Number(priceNon || 0),
        },
      }));
    }
    setEditingMonthlyKey(key);
    console.debug("[Admin] startEditMonthly ->", key, existing);
  };

  const mapMonthlyKey = (name, mealsIncluded = [], isChoice = false) => {
    const meals = mealsIncluded.map((m) => m.toLowerCase());

    // Breakfast only
    if (meals.length === 1 && meals.includes("breakfast")) {
      return "breakfastOnly";
    }

    // 1 meal (lunch OR dinner)
    if (
      meals.length === 1 &&
      (meals.includes("lunch") || meals.includes("dinner"))
    ) {
      return "oneMeal";
    }

    // Breakfast + Lunch/Dinner
    if (meals.includes("breakfast") && meals.length === 2) {
      return "twoMealsBLD";
    }

    // Lunch OR Dinner (choice = true)
    if (
      meals.length === 2 &&
      meals.includes("lunch") &&
      meals.includes("dinner") &&
      isChoice === true
    ) {
      return "twoMealsLorD";
    }

    // Lunch + Dinner (fixed = false)
    if (
      meals.length === 2 &&
      meals.includes("lunch") &&
      meals.includes("dinner") &&
      isChoice === false
    ) {
      return "twoMealsLandD";
    }

    // 3 meals
    if (meals.length === 3) {
      return "threeMeals";
    }

    return null;
  };

  const fetchMonthlyItems = async () => {
    try {
      const data = await getMonthlyMeals();
      console.log("[Admin.page] fetchMonthlyItems -> fetched data", data);

      const items = Array.isArray(data)
        ? data
        : data?.meals || data?.data || [];
      console.log("Fetched monthly items:", items);

      const mapped = {};
      console.log("mapped", mapped);

      items.forEach((item) => {
        const key = mapMonthlyKey(item.name, item.mealsIncluded, item.isChoice);

        if (key) mapped[key] = item;
      });

      setCreatedMonthly(mapped);
    } catch (err) {
      console.error("Failed to fetch monthly items:", err);
    }
  };

  const cancelEditMonthly = (key) => {
    // revert monthly[key] to createdMonthly values if present
    const existing = createdMonthly[key];
    if (existing) {
      const p = existing.price || {};
      setMonthly((s) => ({
        ...s,
        [key]: {
          ...(s[key] || {}),
          label: existing.name || s[key]?.label,
          veg: Number(p.veg || 0),
          nonveg: Number(p.nonVeg || p.nonveg || 0),
        },
      }));
    }
    setEditingMonthlyKey(null);
    console.debug("[Admin] cancelEditMonthly ->", key);
  };

  // const handleDeleteMonthly = async (key) => {
  //   try {
  //     const existing = createdMonthly[key];
  //     const actual = (existing && existing?.mealPlan) || existing;
  //     const id = actual && (actual._id || actual.id);

  //     if (!actual || !id) {
  //       alert("No existing monthly plan to delete (missing id)");
  //       return;
  //     }

  //     await deleteMonthlyMeal(id);

  //     // 🔥 Now only refresh from DB (same as Trial)
  //     await fetchMonthlyItems();

  //     alert("Monthly plan deleted");
  //   } catch (err) {
  //     console.error(err);
  //     alert(err?.message || "Delete failed");
  //   }
  // };

  const handleDeleteMonthly = async (key) => {
    try {
      const existing = createdMonthly[key];
      const actual = existing?.mealPlan || existing;
      const id = actual?._id || actual?.id;

      if (!id) {
        alert("Missing monthly plan id");
        return;
      }

      await deleteMonthlyMeal(id);

      // ✅ ONLY remove deleted one from state
      const copy = { ...createdMonthly };
      delete copy[key];
      setCreatedMonthly(copy);

      alert("Monthly plan deleted");
    } catch (err) {
      console.error(err);
      alert(err?.message || "Delete failed");
    }
  };

  const handleDeleteTrial = async (id) => {
    try {
      await deleteTrialMeal(id);
      // refresh from server to ensure DB was updated
      await fetchTrialItems();
      alert("Trial meal deleted");
    } catch (err) {
      console.error(err);
      alert(err?.message || "Delete failed");
    }
  };

  const fetchTrialItems = async () => {
    try {
      // console.log("[Admin] fetchTrialItems -> calling getAllTrialMeals");
      const data = await getAllTrialMeals();
      const items = Array.isArray(data)
        ? data
        : data?.data || data?.meals || [];
      setCreatedTrial(items);
      console.debug("[Admin] fetchTrialItems -> got", items.length, "items");
    } catch (err) {
      console.error("Failed to fetch trial items:", err);
    }
  };

  // Section-level edit controls
  const startEditAllTrials = () => {
    const map = {};
    const dataMap = {};
    createdTrial.forEach((it) => {
      const id = it._id || it.id || `${it.name}-${it.mealOption}`;
      map[id] = true;
      dataMap[id] = {
        name: it.name || "",
        price: it.price || it.price || 0,
        type: it.type || "vegetarian",
        mealOption: it.mealOption || null,
        category: it.category || "",
      };
    });
    setEditingTrial(map);
    setEditTrialData(dataMap);
    setEditTrialImage({});
    setEditingAllTrial(true);
    console.debug("[Admin] startEditAllTrials ->", Object.keys(map).length);
  };

  const cancelEditAllTrials = () => {
    setEditingTrial({});
    setEditTrialData({});
    setEditTrialImage({});
    setEditingAllTrial(false);
    console.debug("[Admin] cancelEditAllTrials");
  };

  const saveAllEditedTrials = async () => {
    try {
      const ids = Object.keys(editTrialData || {});
      if (ids.length === 0) return alert("Nothing to save");
      for (const id of ids) {
        const data = editTrialData[id];
        const payload = {
          name: data.name,
          category: data.category,
          type: data.type,
          price: Number(data.price || 0),
        };
        if (data.mealOption !== null && data.mealOption !== undefined)
          payload.mealOption = data.mealOption;
        console.debug(
          "[Admin] saveAllEditedTrials -> updating",
          id,
          payload,
          editTrialImage[id]
        );
        try {
          await updateTrialMeal(id, payload, editTrialImage[id]);
        } catch (e) {
          console.error("Failed to update trial", id, e);
          // continue with other updates
        }
      }
      // refresh list from server
      await fetchTrialItems();
      cancelEditAllTrials();
      alert("All trial items updated");
    } catch (err) {
      console.error(err);
      alert(err?.message || "Failed to save all trial items");
    }
  };

  const startEditTrial = (item) => {
    const id = trialItemId(item);
    setEditingTrial((s) => ({ ...s, [id]: true }));
    setEditTrialData((s) => ({
      ...s,
      [id]: {
        name: item.name || "",
        price: item.price || item.price || 0,
        type: item.type || "vegetarian",
        mealOption: item.mealOption || null,
        category: item.category || "",
      },
    }));
    setEditTrialImage((s) => ({ ...s, [id]: null }));
    console.debug("[Admin] startEditTrial ->", id, item);
  };

  const cancelEditTrial = (id) => {
    setEditingTrial((s) => {
      const copy = { ...s };
      delete copy[id];
      return copy;
    });
    setEditTrialData((s) => {
      const copy = { ...s };
      delete copy[id];
      return copy;
    });
    setEditTrialImage((s) => {
      const copy = { ...s };
      delete copy[id];
      return copy;
    });
    console.debug("[Admin] cancelEditTrial ->", id);
  };

  const saveEditedTrial = async (id) => {
    try {
      const data = editTrialData[id];
      if (!data) return alert("No changes to save");
      console.debug(
        "[Admin] saveEditedTrial -> id, data, file:",
        id,
        data,
        editTrialImage[id]
      );
      const payload = {
        name: data.name,
        category: data.category,
        type: data.type,
        price: Number(data.price || 0),
      };
      if (data.mealOption !== null && data.mealOption !== undefined)
        payload.mealOption = data.mealOption;

      const res = await updateTrialMeal(id, payload, editTrialImage[id]);
      // refresh from server to ensure data is consistent
      await fetchTrialItems();
      cancelEditTrial(id);
      alert("Trial meal updated");
    } catch (err) {
      console.error(err);
      alert(err?.message || "Update failed");
    }
  };

  const saveTrial = async () => {
    setError(null);
    setSavingTrial(true);
    try {
      const stripImages = (obj) =>
        JSON.parse(
          JSON.stringify(obj, (k, v) => (k === "img" ? undefined : v))
        );

      const clean = stripImages(trial);

      // Build individual create requests expected by backend (one document per category/type)
      const creations = [];

      // Breakfast options: each option has veg and nonveg prices -> create two records per option
      clean.breakfast.options.forEach((opt, idx) => {
        const optionNumber = idx + 1;
        // vegetarian
        creations.push({
          payload: {
            category: "breakfast",
            type: "vegetarian",
            price: Number(opt.veg),
            mealOption: optionNumber,
            name: opt.label,
          },
          image:
            (trialImages.breakfast && trialImages.breakfast[idx]) ||
            (trialImages.breakfast && trialImages.breakfast.default) ||
            null,
        });
        // non-vegetarian
        creations.push({
          payload: {
            category: "breakfast",
            type: "non-vegetarian",
            price: Number(opt.nonveg),
            mealOption: optionNumber,
            name: opt.label,
          },
          image:
            (trialImages.breakfast && trialImages.breakfast[idx]) ||
            (trialImages.breakfast && trialImages.breakfast.default) ||
            null,
        });
      });

      // Lunch
      if (clean.lunch) {
        creations.push({
          payload: {
            category: "lunch",
            type: "vegetarian",
            price: Number(clean.lunch.veg),
            name: "Lunch",
          },
          image: trialImages.lunch,
        });
        creations.push({
          payload: {
            category: "lunch",
            type: "non-vegetarian",
            price: Number(clean.lunch.nonveg),
            name: "Lunch",
          },
          image: trialImages.lunch,
        });
      }

      // Dinner
      if (clean.dinner) {
        creations.push({
          payload: {
            category: "dinner",
            type: "vegetarian",
            price: Number(clean.dinner.veg),
            name: "Dinner",
          },
          image: trialImages.dinner,
        });
        creations.push({
          payload: {
            category: "dinner",
            type: "non-vegetarian",
            price: Number(clean.dinner.nonveg),
            name: "Dinner",
          },
          image: trialImages.dinner,
        });
      }
      // sequentially call createTrialMeal so uploads are handled predictably
      const results = [];
      for (const c of creations) {
        const res = await createTrialMeal(c.payload, c.image);
        results.push(res);
      }
      setCreatedTrial(results.map((r) => r.data || r));
      // refresh from server to ensure we have DB IDs
      await fetchTrialItems();
      alert("Trial meal plan updated successfully");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save trial meal");
      alert("Failed to save trial meal: " + (err.message || err));
    } finally {
      setSavingTrial(false);
    }
  };

  const saveMonthly = async () => {
    setError(null);
    setSavingMonthly(true);
    try {
      const stripImages = (obj) =>
        JSON.parse(
          JSON.stringify(obj, (k, v) => (k === "img" ? undefined : v))
        );

      const clean = stripImages(monthly);

      // Build per-plan payloads matching backend: { name, mealsIncluded: [...], price: { veg, nonVeg } }
      const toPayload = (key, obj) => {
        switch (key) {
          case "breakfastOnly":
            return {
              name: obj.label || "Breakfast Only",
              mealsIncluded: ["breakfast"],
              price: { veg: Number(obj.veg), nonVeg: Number(obj.nonveg) },
            };
          case "oneMeal": {
            const label = (obj.label || "1 Meal").toLowerCase();
            const meals = [];
            if (label.includes("breakfast")) meals.push("breakfast");
            if (label.includes("lunch")) meals.push("lunch");
            if (label.includes("dinner")) meals.push("dinner");
            if (meals.length === 0) meals.push("lunch");
            return {
              name: obj.label || "1 Meal",
              mealsIncluded: meals,
              price: { veg: Number(obj.veg), nonVeg: Number(obj.nonveg) },
            };
          }
          case "twoMealsBLD":
            return {
              name: obj.label || "Breakfast + Lunch/Dinner",
              mealsIncluded: ["breakfast", "lunch"],
              price: { veg: Number(obj.veg), nonVeg: Number(obj.nonveg) },
            };
          case "twoMealsLorD":
            return {
              name: obj.label || "Lunch / Dinner",
              mealsIncluded: ["lunch", "dinner"],
              price: { veg: Number(obj.veg), nonVeg: Number(obj.nonveg) },
              isChoice: true,
            };
          case "twoMealsLandD":
            return {
              name: obj.label || "Lunch + Dinner",
              mealsIncluded: ["lunch", "dinner"],
              price: { veg: Number(obj.veg), nonVeg: Number(obj.nonveg) },
              isChoice: false,
            };
          case "threeMeals":
            return {
              name: obj.label || "3 Meals a day",
              mealsIncluded: ["breakfast", "lunch", "dinner"],
              price: { veg: Number(obj.veg), nonVeg: Number(obj.nonveg) },
            };
          default:
            return null;
        }
      };

      const creations = [];
      Object.entries(clean).forEach(([k, v]) => {
        const p = toPayload(k, v);
        if (p)
          creations.push({
            key: k,
            payload: p,
            image: monthlyImages[k] || null,
          });
      });

      const results = [];
      for (const c of creations) {
        const res = await createMonthlyMeal(c.payload, c.image);
        results.push({ key: c.key, data: res.data || res });
      }
      const map = {};
      results.forEach((r) => (map[r.key] = r.data));
      console.log("[DEBUG] createdMonthly after creation:", map);
      setCreatedMonthly(map); // 🔥 UI me turant reflect hoga
      alert("Monthly meal plans create successfully");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save monthly plans");
      alert("Failed to save monthly plans: " + (err.message || err));
    } finally {
      setSavingMonthly(false);
    }
  };

  // fetch trial items on mount
  React.useEffect(() => {
    fetchTrialItems();
    fetchMonthlyItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // load persisted created monthly plans (fall back to empty)
  // React.useEffect(() => {
  //   try {
  //     if (typeof window !== "undefined") {
  //       const raw = localStorage.getItem("createdMonthly");
  //       if (raw) {
  //         const parsed = JSON.parse(raw);
  //         if (parsed && typeof parsed === "object") {
  //           // normalize any envelopes so each value is the actual plan object
  //           const normalized = {};
  //           Object.entries(parsed).forEach(([k, v]) => {
  //             normalized[k] = v && v.data ? v.data : v;
  //           });
  //           setCreatedMonthly(normalized);
  //         }
  //       }
  //     }
  //   } catch (e) {
  //     console.debug("Failed to load createdMonthly from localStorage", e);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <div className="space-y-8">
      <div
        className={`${
          theme === "dark"
            ? "bg-neutral-800 border-neutral-700"
            : "bg-white border"
        } rounded-xl p-4 border`}
      >
        <h3 className="text-lg font-semibold mb-4">Trial Meal Plan</h3>
        <div className="grid grid-cols-1 gap-4">
          <MealCard
            title="Breakfast"
            img={trial.breakfast.img}
            theme={theme}
            className="flex flex-col rounded-xl bg-neutral-50 dark:bg-neutral-900 shadow-sm p-4 gap-4"
          >
            {!hasCreatedCategory("breakfast") ? (
              <>
                {trial.breakfast.options.map((opt, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-4 rounded-xl shadow-sm space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                        Option #{idx + 1}
                      </h3>
                      <button
                        className="text-xs px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 transition text-white"
                        onClick={() =>
                          setTrial({
                            ...trial,
                            breakfast: {
                              ...trial.breakfast,
                              options: trial.breakfast.options.filter(
                                (_, i) => i !== idx
                              ),
                            },
                          })
                        }
                      >
                        Remove
                      </button>
                    </div>

                    {/* Upload Image */}
                    <div className="space-y-2">
                      <label className="text-xs text-neutral-500">
                        Upload Option Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleTrialImage("breakfast", e.target.files[0], idx)
                        }
                        className="file:px-4 file:py-1 file:rounded-lg file:bg-neutral-200 dark:file:bg-neutral-700 file:text-xs text-xs"
                      />
                      {trialImages.breakfast?.[idx] && (
                        <img
                          src={URL.createObjectURL(trialImages.breakfast[idx])}
                          alt="preview"
                          className="w-24 h-24 rounded-lg border object-cover"
                        />
                      )}
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-xs font-medium mb-1 text-neutral-600 dark:text-neutral-300">
                        Name
                      </label>
                      <input
                        type="text"
                        value={opt.label}
                        onChange={(e) =>
                          setTrial({
                            ...trial,
                            breakfast: {
                              ...trial.breakfast,
                              options: trial.breakfast.options.map((o, i) =>
                                i === idx ? { ...o, label: e.target.value } : o
                              ),
                            },
                          })
                        }
                        className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-sm bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white"
                      />
                    </div>

                    <div className="text-xs text-neutral-500">
                      Category: <span className="font-semibold">Breakfast</span>
                    </div>

                    {/* Prices */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <PriceInput
                        label="Veg Price"
                        value={opt.veg}
                        theme={theme}
                        onChange={(v) =>
                          setTrial({
                            ...trial,
                            breakfast: {
                              ...trial.breakfast,
                              options: trial.breakfast.options.map((o, i) =>
                                i === idx ? { ...o, veg: v } : o
                              ),
                            },
                          })
                        }
                      />
                      <PriceInput
                        label="Non-Veg Price"
                        value={opt.nonveg}
                        theme={theme}
                        onChange={(v) =>
                          setTrial({
                            ...trial,
                            breakfast: {
                              ...trial.breakfast,
                              options: trial.breakfast.options.map((o, i) =>
                                i === idx ? { ...o, nonveg: v } : o
                              ),
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                ))}

                {/* ADD OPTION BUTTON */}
                <button
                  className="rounded-xl py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm transition mt-2"
                  onClick={() =>
                    setTrial({
                      ...trial,
                      breakfast: {
                        ...trial.breakfast,
                        options: [
                          ...trial.breakfast.options,
                          {
                            label: "New Option",
                            veg: 0,
                            nonveg: 0,
                            category: "breakfast",
                          },
                        ],
                      },
                    })
                  }
                >
                  + Add Breakfast Option
                </button>
              </>
            ) : (
              <div className="border text-sm text-neutral-500">
                items already created
              </div>
            )}

            {/* Already Created Trial Items */}
            {createdTrial
              .filter((it) => it.category === "breakfast")
              .map((it) => {
                const id = trialItemId(it);
                const editing = !!editingTrial[id];

                return (
                  <div
                    key={id}
                    className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-sm p-4 mt-4 transition-all"
                  >
                    {!editing ? (
                      <div className="flex justify-between items-center gap-3">
                        {/* Item Info */}
                        <div className="flex flex-col">
                          <p className="font-semibold text-sm md:text-base">
                            {it.name}
                          </p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            {it.type} • {it.category}
                          </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-2">
                          <button
                            className="text-xs md:text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-1 transition"
                            onClick={() => startEditTrial(it)}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="text-xs md:text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg px-3 py-1 transition"
                            onClick={() => handleDeleteTrial(id)}
                          >
                            🗑 Delete
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col md:flex-row md:flex-wrap gap-3 items-center">
                        {/* Name */}
                        <input
                          type="text"
                          value={editTrialData[id]?.name}
                          onChange={(e) =>
                            setEditTrialData((s) => ({
                              ...s,
                              [id]: { ...s[id], name: e.target.value },
                            }))
                          }
                          className="w-full md:w-auto px-3 py-2 text-xs md:text-sm rounded-lg border dark:border-neutral-600 bg-white dark:bg-neutral-800"
                          placeholder="Food name"
                        />

                        {/* Price */}
                        <input
                          type="number"
                          min={0}
                          value={editTrialData[id]?.price}
                          onChange={(e) =>
                            setEditTrialData((s) => ({
                              ...s,
                              [id]: { ...s[id], price: Number(e.target.value) },
                            }))
                          }
                          className="w-full md:w-24 px-3 py-2 text-xs md:text-sm rounded-lg border dark:border-neutral-600 bg-white dark:bg-neutral-800"
                          placeholder="Price"
                        />

                        {/* Image */}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setEditTrialImage((s) => ({
                              ...s,
                              [id]: e.target.files[0],
                            }))
                          }
                          className="w-full text-xs md:text-sm"
                        />

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-2">
                          <button
                            className="text-xs md:text-sm px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white transition"
                            onClick={() => saveEditedTrial(id)}
                          >
                            💾 Save
                          </button>
                          <button
                            className="text-xs md:text-sm px-4 py-2 bg-neutral-300 dark:bg-neutral-700 hover:opacity-80 rounded-lg text-black dark:text-white transition"
                            onClick={() => cancelEditTrial(id)}
                          >
                            ❌ Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </MealCard>

          <div className="grid  grid-cols-1 md:grid-cols-2 gap-6">
            {/* LUNCH CARD */}
            <MealCard title="Lunch" img={trial.lunch.img} theme={theme}>
              {!hasCreatedCategory("lunch") && (
                <div className="w-[210%] rounded-xl bg-white dark:bg-neutral-900 shadow p-5 border border-neutral-200/60 dark:border-neutral-800/60">
                  {/* Header with Image + Title */}
                  <div className="flex items-center gap-3 mb-4">
                    {trialImages.lunch ? (
                      <img
                        src={URL.createObjectURL(trialImages.lunch)}
                        alt="Preview"
                        className="w-12 h-12 rounded-full object-cover border shadow-sm"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
                    )}

                    <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                      Lunch
                    </h2>
                  </div>

                  {/* Upload Section */}
                  <label className="text-sm text-neutral-600 dark:text-neutral-300">
                    Upload Option Image
                  </label>

                  <div className="flex items-center gap-3 mt-1">
                    <input
                      type="file"
                      accept="image/*"
                      className="text-sm file:px-3 file:py-1 file:border file:rounded-md file:bg-neutral-100 dark:file:bg-neutral-800 file:border-neutral-300 dark:file:border-neutral-700 file:text-neutral-700 dark:file:text-neutral-300 cursor-pointer"
                      onChange={(e) =>
                        handleTrialImage("lunch", e.target.files[0])
                      }
                    />
                  </div>

                  {/* Prices */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <PriceInput
                      label="Veg Price"
                      value={trial.lunch.veg}
                      theme={theme}
                      onChange={(v) =>
                        setTrial({
                          ...trial,
                          lunch: { ...trial.lunch, veg: v },
                        })
                      }
                    />

                    <PriceInput
                      label="Non-Veg Price"
                      value={trial.lunch.nonveg}
                      theme={theme}
                      onChange={(v) =>
                        setTrial({
                          ...trial,
                          lunch: { ...trial.lunch, nonveg: v },
                        })
                      }
                    />
                  </div>
                </div>
              )}

              {/* Render Lunch Items */}
              <div className="space-y-3 mt-4 flex flex-col w-[400px]">
                {createdTrial
                  .filter((it) => it.category === "lunch")
                  .map((it) => {
                    const id = trialItemId(it);
                    const editing = !!editingTrial[id];

                    return (
                      <div
                        key={id}
                        className="mt-4 p-3  border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-xl shadow-sm"
                      >
                        {!editing ? (
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold">{it.name}</p>
                              <span className="text-[10px] text-neutral-500">
                                {it.type}
                              </span>
                            </div>

                            <div className="flex gap-2">
                              <button
                                className="px-3 py-1 text-xs rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
                                onClick={() => startEditTrial(it)}
                              >
                                Edit
                              </button>
                              <button
                                className="px-3 py-1 text-xs rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
                                onClick={() => handleDeleteTrial(id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={editTrialData[id]?.name || it.name}
                              onChange={(e) =>
                                setEditTrialData((s) => ({
                                  ...s,
                                  [id]: { ...s[id], name: e.target.value },
                                }))
                              }
                              className="px-3 py-2 text-sm rounded-lg border dark:border-neutral-700 bg-white dark:bg-neutral-800"
                            />
                            <input
                              type="number"
                              min={0}
                              value={editTrialData[id]?.price || it.price}
                              onChange={(e) =>
                                setEditTrialData((s) => ({
                                  ...s,
                                  [id]: {
                                    ...s[id],
                                    price: Number(e.target.value),
                                  },
                                }))
                              }
                              className="px-3 py-2 text-sm rounded-lg border dark:border-neutral-700 bg-white dark:bg-neutral-800"
                            />

                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                setEditTrialImage((s) => ({
                                  ...s,
                                  [id]: e.target.files[0],
                                }))
                              }
                              className="text-xs"
                            />

                            <div className="flex gap-2">
                              <button
                                className="px-3 py-2 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition"
                                onClick={() => saveEditedTrial(id)}
                              >
                                Save
                              </button>
                              <button
                                className="px-3 py-2 text-xs rounded-lg bg-gray-300 dark:bg-neutral-700 text-black dark:text-white transition"
                                onClick={() => cancelEditTrial(id)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </MealCard>

            {/* DINNER CARD - Same Styling */}
            <MealCard title="Dinner" img={trial.dinner.img} theme={theme}>
              {!hasCreatedCategory("dinner") && (
                <div className="w-[210%] rounded-xl bg-white dark:bg-neutral-900 shadow p-5 border border-neutral-200/60 dark:border-neutral-800/60">
                  {/* Header with Image + Title */}
                  <div className="flex items-center gap-3 mb-4">
                    {trialImages.dinner ? (
                      <img
                        src={URL.createObjectURL(trialImages.dinner)}
                        alt="Preview"
                        className="w-12 h-12 rounded-full object-cover border shadow-sm"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
                    )}

                    <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                      Dinner
                    </h2>
                  </div>

                  {/* Upload Section */}
                  <label className="text-sm text-neutral-600 dark:text-neutral-300">
                    Upload Option Image
                  </label>

                  <div className="flex items-center gap-3 mt-1">
                    <input
                      type="file"
                      accept="image/*"
                      className="text-sm file:px-3 file:py-1 file:border file:rounded-md file:bg-neutral-100 dark:file:bg-neutral-800 file:border-neutral-300 dark:file:border-neutral-700 file:text-neutral-700 dark:file:text-neutral-300 cursor-pointer"
                      onChange={(e) =>
                        handleTrialImage("dinner", e.target.files[0])
                      }
                    />
                  </div>

                  {/* Prices */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <PriceInput
                      label="Veg Price"
                      value={trial.dinner.veg}
                      theme={theme}
                      onChange={(v) =>
                        setTrial({
                          ...trial,
                          dinner: { ...trial.dinner, veg: v },
                        })
                      }
                    />

                    <PriceInput
                      label="Non-Veg Price"
                      value={trial.dinner.nonveg}
                      theme={theme}
                      onChange={(v) =>
                        setTrial({
                          ...trial,
                          dinner: { ...trial.dinner, nonveg: v },
                        })
                      }
                    />
                  </div>
                </div>
              )}

              {/* Render Dinner Items */}
              {/* (Same layout as above mapping) */}
              <div className="space-y-3 mt-4 flex flex-col w-[400px]">
                {createdTrial
                  .filter((it) => it.category === "dinner")
                  .map((it) => {
                    // Same mapping component as Lunch (reuse)
                    const id = trialItemId(it);
                    const editing = !!editingTrial[id];

                    return (
                      <div
                        key={id}
                        className="mt-4 p-3 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-xl shadow-sm"
                      >
                        {!editing ? (
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold">{it.name}</p>
                              <span className="text-[10px] text-neutral-500">
                                {it.type}
                              </span>
                            </div>

                            <div className="flex gap-2">
                              <button
                                className="px-3 py-1 text-xs rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
                                onClick={() => startEditTrial(it)}
                              >
                                Edit
                              </button>
                              <button
                                className="px-3 py-1 text-xs rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
                                onClick={() => handleDeleteTrial(id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={editTrialData[id]?.name || it.name}
                              onChange={(e) =>
                                setEditTrialData((s) => ({
                                  ...s,
                                  [id]: { ...s[id], name: e.target.value },
                                }))
                              }
                              className="px-3 py-2 rounded-lg border text-sm dark:border-neutral-700 bg-white dark:bg-neutral-800"
                            />
                            <input
                              type="number"
                              min={0}
                              value={editTrialData[id]?.price || it.price}
                              onChange={(e) =>
                                setEditTrialData((s) => ({
                                  ...s,
                                  [id]: {
                                    ...s[id],
                                    price: Number(e.target.value),
                                  },
                                }))
                              }
                              className="px-3 py-2 rounded-lg border text-sm dark:border-neutral-700 bg-white dark:bg-neutral-800"
                            />

                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                setEditTrialImage((s) => ({
                                  ...s,
                                  [id]: e.target.files[0],
                                }))
                              }
                              className="text-xs"
                            />

                            <div className="flex gap-2">
                              <button
                                className="px-3 py-2 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition"
                                onClick={() => saveEditedTrial(id)}
                              >
                                Save
                              </button>
                              <button
                                className="px-3 py-2 text-xs rounded-lg bg-gray-300 dark:bg-neutral-700 text-black dark:text-white transition"
                                onClick={() => cancelEditTrial(id)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </MealCard>
          </div>
        </div>
        <div className="mt-4 flex  justify-end items-center gap-3">
          {error && <div className="text-sm text-red-500">{error}</div>}
          <button
            onClick={saveTrial}
            disabled={savingTrial || hasCreatedTrial}
            className={`px-4 py-2 rounded text-white ${
              savingTrial || hasCreatedTrial
                ? "bg-gray-400"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {savingTrial
              ? "Saving..."
              : hasCreatedTrial
              ? "Trial Meals Already Created"
              : "Save Trial Prices"}
          </button>
        </div>
      </div>

      <div
        className={`${
          theme === "dark"
            ? "bg-neutral-800 border-neutral-700"
            : "bg-white border"
        } rounded-xl p-4 border`}
      >
        <h3 className="text-lg font-semibold mb-4">Monthly Meal Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MealCard
            title="Breakfast Only"
            img={monthly.breakfastOnly.img}
            theme={theme}
          >
            {createdMonthly.breakfastOnly &&
            editingMonthlyKey !== "breakfastOnly" ? (
              // show created summary when present and not editing
              <div className=" rounded border bg-white dark:bg-neutral-800">
                <div className="font-medium">
                  {createdMonthly.breakfastOnly.name}
                </div>
                <div className="text-xs text-neutral-500">
                  Meals:{" "}
                  {(createdMonthly.breakfastOnly.mealsIncluded || []).join(
                    ", "
                  )}
                </div>
                <div className="mt-2 text-sm">
                  Veg: ₹{createdMonthly.breakfastOnly.price?.veg ?? "-"} •
                  Non-Veg: ₹
                  {createdMonthly.breakfastOnly.price?.nonVeg ??
                    createdMonthly.breakfastOnly.price?.nonveg ??
                    "-"}
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => startEditMonthly("breakfastOnly")}
                    className="px-3 py-1 rounded bg-yellow-600 text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteMonthly("breakfastOnly")}
                    className="px-3 py-1 rounded bg-red-600 text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              // show inputs (either creating or editing)
              <>
                <div className="mb-3">
                  <label className="block text-sm">Image (optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleMonthlyImage("breakfastOnly", e.target.files[0])
                    }
                    className="mt-1"
                  />
                  {monthlyImages.breakfastOnly && (
                    <img
                      src={URL.createObjectURL(monthlyImages.breakfastOnly)}
                      alt="preview"
                      className="w-20 h-20 rounded mt-2 object-cover"
                    />
                  )}
                </div>
                <PriceInput
                  label="Veg Price"
                  value={monthly.breakfastOnly.veg}
                  theme={theme}
                  onChange={(v) =>
                    setMonthly({
                      ...monthly,
                      breakfastOnly: { ...monthly.breakfastOnly, veg: v },
                    })
                  }
                />
                <PriceInput
                  label="Non-Veg Price"
                  value={monthly.breakfastOnly.nonveg}
                  theme={theme}
                  onChange={(v) =>
                    setMonthly({
                      ...monthly,
                      breakfastOnly: { ...monthly.breakfastOnly, nonveg: v },
                    })
                  }
                />
                {createdMonthly.breakfastOnly &&
                  editingMonthlyKey === "breakfastOnly" && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => {
                          handleUpdateMonthly("breakfastOnly");
                          setEditingMonthlyKey(null);
                        }}
                        className="px-3 py-1 rounded bg-emerald-600 text-white"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => cancelEditMonthly("breakfastOnly")}
                        className="px-3 py-1 rounded bg-gray-300 text-black"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
              </>
            )}
          </MealCard>

          <div
            className={`${
              theme === "dark"
                ? "bg-neutral-800 border-neutral-700"
                : "bg-white border"
            } rounded-xl p-4 border`}
          >
            <h4 className="text-lg font-semibold mb-2">
              1 Meal ({monthly.twoMealsLorD.label})
            </h4>
            {createdMonthly.twoMealsLorD &&
            editingMonthlyKey !== "twoMealsLorD" ? (
              <div className="p-3 rounded border bg-white dark:bg-neutral-800">
                <div className="font-medium">
                  {createdMonthly.twoMealsLorD.name}
                </div>
                <div className="text-xs text-neutral-500">
                  Meals:{" "}
                  {(createdMonthly.twoMealsLorD.mealsIncluded || []).join(", ")}
                </div>
                <div className="mt-2 text-sm">
                  Veg: ₹{createdMonthly.twoMealsLorD.price?.veg ?? "-"} •
                  Non-Veg: ₹
                  {createdMonthly.twoMealsLorD.price?.nonVeg ??
                    "-"}
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => startEditMonthly("twoMealsLorD")}
                    className="px-3 py-1 rounded bg-yellow-600 text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteMonthly("twoMealsLorD")}
                    className="px-3 py-1 rounded bg-red-600 text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-3 ">
                  <label className="block text-sm">Image (optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleMonthlyImage("twoMealsLorD", e.target.files[0])
                    }
                    className="mt-1"
                  />
                  {monthlyImages.twoMealsLorD && (
                    <img
                      src={URL.createObjectURL(monthlyImages.twoMealsLorD)}
                      alt="preview"
                      className="w-20 h-20 rounded mt-2 object-cover"
                    />
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <PriceInput
                    label="Veg Price"
                    value={monthly.twoMealsLorD.veg}
                    theme={theme}
                    onChange={(v) =>
                      setMonthly({
                        ...monthly,
                        twoMealsLorD: { ...monthly.twoMealsLorD, veg: v },
                      })
                    }
                  />
                  <PriceInput
                    label="Non-Veg Price"
                    value={monthly.twoMealsLorD.nonveg}
                    theme={theme}
                    onChange={(v) =>
                      setMonthly({
                        ...monthly,
                        twoMealsLorD: { ...monthly.twoMealsLorD, nonveg: v },
                      })
                    }
                  />
                </div>
                {createdMonthly.twoMealsLorD &&
                  editingMonthlyKey === "twoMealsLorD" && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => {
                          handleUpdateMonthly("twoMealsLorD");
                          setEditingMonthlyKey(null);
                        }}
                        className="px-3 py-1 rounded bg-emerald-600 text-white"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => cancelEditMonthly("twoMealsLorD")}
                        className="px-3 py-1 rounded bg-gray-300 text-black"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
              </>
            )}
          </div>

          <div
            className={`${
              theme === "dark"
                ? "bg-neutral-800 border-neutral-700"
                : "bg-white border"
            } rounded-xl p-4 border`}
          >
            <h4 className="text-lg font-semibold mb-2">
              2 Meals ({monthly.twoMealsBLD.label})
            </h4>
            {createdMonthly.twoMealsBLD &&
            editingMonthlyKey !== "twoMealsBLD" ? (
              <div className="p-3 rounded border bg-white dark:bg-neutral-800">
                <div className="font-medium">
                  {createdMonthly.twoMealsBLD.name}
                </div>
                <div className="text-xs text-neutral-500">
                  Meals:{" "}
                  {(createdMonthly.twoMealsBLD.mealsIncluded || []).join(", ")}
                </div>
                <div className="mt-2 text-sm">
                  Veg: ₹{createdMonthly.twoMealsBLD.price?.veg ?? "-"} •
                  Non-Veg: ₹
                  {createdMonthly.twoMealsBLD.price?.nonVeg ??
                    createdMonthly.twoMealsBLD.price?.nonveg ??
                    "-"}
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => startEditMonthly("twoMealsBLD")}
                    className="px-3 py-1 rounded bg-yellow-600 text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteMonthly("twoMealsBLD")}
                    className="px-3 py-1 rounded bg-red-600 text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-3">
                  <label className="block text-sm">Image (optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleMonthlyImage("twoMealsBLD", e.target.files[0])
                    }
                    className="mt-1"
                  />
                  {monthlyImages.twoMealsBLD && (
                    <img
                      src={URL.createObjectURL(monthlyImages.twoMealsBLD)}
                      alt="preview"
                      className="w-20 h-20 rounded mt-2 object-cover"
                    />
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <PriceInput
                    label="Veg Price"
                    value={monthly.twoMealsBLD.veg}
                    theme={theme}
                    onChange={(v) =>
                      setMonthly({
                        ...monthly,
                        twoMealsBLD: { ...monthly.twoMealsBLD, veg: v },
                      })
                    }
                  />
                  <PriceInput
                    label="Non-Veg Price"
                    value={monthly.twoMealsBLD.nonveg}
                    theme={theme}
                    onChange={(v) =>
                      setMonthly({
                        ...monthly,
                        twoMealsBLD: { ...monthly.twoMealsBLD, nonveg: v },
                      })
                    }
                  />
                </div>
                {createdMonthly.twoMealsBLD &&
                  editingMonthlyKey === "twoMealsBLD" && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => {
                          handleUpdateMonthly("twoMealsBLD");
                          setEditingMonthlyKey(null);
                        }}
                        className="px-3 py-1 rounded bg-emerald-600 text-white"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => cancelEditMonthly("twoMealsBLD")}
                        className="px-3 py-1 rounded bg-gray-300 text-black"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
              </>
            )}
          </div>

          <div
            className={`${
              theme === "dark"
                ? "bg-neutral-800 border-neutral-700"
                : "bg-white border"
            } rounded-xl p-4 border`}
          >
            <h4 className="text-lg font-semibold mb-2">
              2 Meals ({monthly.twoMealsLandD.label})
            </h4>
            {createdMonthly.twoMealsLandD &&
            editingMonthlyKey !== "twoMealsLandD" ? (
              <div className="p-3 rounded border bg-white dark:bg-neutral-800">
                <div className="font-medium">
                  {createdMonthly.twoMealsLandD.name}
                </div>
                <div className="text-xs text-neutral-500">
                  Meals:{" "}
                  {(createdMonthly.twoMealsLandD.mealsIncluded || []).join(
                    ", "
                  )}
                </div>
                <div className="mt-2 text-sm">
                  Veg: ₹{createdMonthly.twoMealsLandD.price?.veg ?? "-"} •
                  Non-Veg: ₹
                  {createdMonthly.twoMealsLandD.price?.nonVeg ??
                    createdMonthly.twoMealsLandD.price?.nonveg ??
                    "-"}
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => startEditMonthly("twoMealsLandD")}
                    className="px-3 py-1 rounded bg-yellow-600 text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteMonthly("twoMealsLandD")}
                    className="px-3 py-1 rounded bg-red-600 text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-3">
                  <label className="block text-sm">Image (optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleMonthlyImage("twoMealsLandD", e.target.files[0])
                    }
                    className="mt-1"
                  />
                  {monthlyImages.twoMealsLandD && (
                    <img
                      src={URL.createObjectURL(monthlyImages.twoMealsLandD)}
                      alt="preview"
                      className="w-20 h-20 rounded mt-2 object-cover"
                    />
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <PriceInput
                    label="Veg Price"
                    value={monthly.twoMealsLandD.veg}
                    theme={theme}
                    onChange={(v) =>
                      setMonthly({
                        ...monthly,
                        twoMealsLandD: { ...monthly.twoMealsLandD, veg: v },
                      })
                    }
                  />
                  <PriceInput
                    label="Non-Veg Price"
                    value={monthly.twoMealsLandD.nonveg}
                    theme={theme}
                    onChange={(v) =>
                      setMonthly({
                        ...monthly,
                        twoMealsLandD: { ...monthly.twoMealsLandD, nonveg: v },
                      })
                    }
                  />
                </div>
                {createdMonthly.twoMealsLandD &&
                  editingMonthlyKey === "twoMealsLandD" && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => {
                          handleUpdateMonthly("twoMealsLandD");
                          setEditingMonthlyKey(null);
                        }}
                        className="px-3 py-1 rounded bg-emerald-600 text-white"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => cancelEditMonthly("twoMealsLandD")}
                        className="px-3 py-1 rounded bg-gray-300 text-black"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
              </>
            )}
          </div>

          <div
            className={`${
              theme === "dark"
                ? "bg-neutral-800 border-neutral-700"
                : "bg-white border"
            } rounded-xl p-4 border`}
          >
            <h4 className="text-lg font-semibold mb-2">3 Meals a Day</h4>
            {createdMonthly.threeMeals && editingMonthlyKey !== "threeMeals" ? (
              <div className="p-3 rounded border bg-white dark:bg-neutral-800">
                <div className="font-medium">
                  {createdMonthly.threeMeals.name}
                </div>
                <div className="text-xs text-neutral-500">
                  Meals:{" "}
                  {(createdMonthly.threeMeals.mealsIncluded || []).join(", ")}
                </div>
                <div className="mt-2 text-sm">
                  Veg: ₹{createdMonthly.threeMeals.price?.veg ?? "-"} • Non-Veg:
                  ₹
                  {createdMonthly.threeMeals.price?.nonVeg ??
                    createdMonthly.threeMeals.price?.nonveg ??
                    "-"}
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => startEditMonthly("threeMeals")}
                    className="px-3 py-1 rounded bg-yellow-600 text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteMonthly("threeMeals")}
                    className="px-3 py-1 rounded bg-red-600 text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-3">
                  <label className="block text-sm">Image (optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleMonthlyImage("threeMeals", e.target.files[0])
                    }
                    className="mt-1"
                  />
                  {monthlyImages.threeMeals && (
                    <img
                      src={URL.createObjectURL(monthlyImages.threeMeals)}
                      alt="preview"
                      className="w-20 h-20 rounded mt-2 object-cover"
                    />
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <PriceInput
                    label="Veg Price"
                    value={monthly.threeMeals.veg}
                    theme={theme}
                    onChange={(v) =>
                      setMonthly({
                        ...monthly,
                        threeMeals: { ...monthly.threeMeals, veg: v },
                      })
                    }
                  />
                  <PriceInput
                    label="Non-Veg Price"
                    value={monthly.threeMeals.nonveg}
                    theme={theme}
                    onChange={(v) =>
                      setMonthly({
                        ...monthly,
                        threeMeals: { ...monthly.threeMeals, nonveg: v },
                      })
                    }
                  />
                </div>
                {createdMonthly.threeMeals &&
                  editingMonthlyKey === "threeMeals" && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => {
                          handleUpdateMonthly("threeMeals");
                          setEditingMonthlyKey(null);
                        }}
                        className="px-3 py-1 rounded bg-emerald-600 text-white"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => cancelEditMonthly("threeMeals")}
                        className="px-3 py-1 rounded bg-gray-300 text-black"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
              </>
            )}
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={saveMonthly}
            disabled={savingMonthly || hasCreatedMonthly}
            className={`px-4 py-2 rounded text-white ${
              savingMonthly || hasCreatedMonthly
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {savingMonthly
              ? "Saving..."
              : hasCreatedMonthly
              ? "Monthly Meals Already Created"
              : "Save Monthly Prices"}
          </button>
        </div>
      </div>
    </div>
  );
}
