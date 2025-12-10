import axios from "axios";
const api = process.env.NEXT_PUBLIC_API_URL;

export const getTrialMeals = async (token) => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    // console.log("[Meals.js] getTrialMeals -> token:", token);
    // console.log("[Meals.js] getTrialMeals -> headers:", headers);
    const response = await axios.get(`${api}/api/all`, { headers });
    // console.log("[Meals.js] TrialMeals API Response:", response.data);
    return response.data.data; // expect backend to return list of trial meals
  } catch (error) {
    const fieldErrors = error?.response?.data?.errors;
    const message =
      fieldErrors && Array.isArray(fieldErrors) && fieldErrors.length
        ? fieldErrors
            .map((e) => e?.msg || "")
            .filter(Boolean)
            .join("\n")
        : error?.response?.data?.message || error?.message;
    throw new Error(message);
  }
};

export const getMonthlyMeals = async (token) => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    // console.log("[Meals.js] getMonthlyMeals -> token:", token);
    // console.log("[Meals.js] getMonthlyMeals -> headers:", headers);
    const response = await axios.get(`${api}/api/monthly`, { headers });
    // console.log("[Meals.js] monthly API Response:", response.data);
    return response.data.meals; // expect backend to return list of monthly meals
  } catch (error) {
    const fieldErrors = error?.response?.data?.errors;
    const message =
      fieldErrors && Array.isArray(fieldErrors) && fieldErrors.length
        ? fieldErrors
            .map((e) => e?.msg || "")
            .filter(Boolean)
            .join("\n")
        : error?.response?.data?.message || error?.message;
    throw new Error(message);
  }
};
