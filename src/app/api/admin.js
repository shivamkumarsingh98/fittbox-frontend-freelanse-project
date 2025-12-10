import axios from "axios";
const api = process.env.NEXT_PUBLIC_API_URL;

const getHeaders = (token) => {
  let t = token;
  if (!t && typeof window !== "undefined") {
    try {
      t = localStorage.getItem("adminToken");
    } catch (e) {
      // ignore
    }
  }
  const headers = t ? { Authorization: `Bearer ${t}` } : {};
  // console.log("[admin.js] getHeaders -> tokenUsed:", t);
  return headers;
};

export const adminLogin = async (credentials) => {
  try {
    const response = await axios.post(`${api}/api/admin/login`, credentials);
    return response.data; // expect backend message/admin/token
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

export const getallUsers = async (token) => {
  try {
    const headers = getHeaders(token);
    console.log("[admin.js] getallUsers -> token param:", token);
    console.log("[admin.js] getallUsers -> headers:", headers);
    const response = await axios.get(`${api}/api/admin/users`, { headers });
    return response.data; // expect backend to return list of users
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

export const getAnalytics = async (token) => {
  try {
    const headers = getHeaders(token);
    console.log("[admin.js] getAnalytics -> token param:", token);
    console.log("[admin.js] getAnalytics -> headers:", headers);
    const response = await axios.get(`${api}/api/admin/analytics`, { headers });
    return response.data; // expect backend to return analytics data
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

export const TrialMealCreation = async (mealData, token) => {
  try {
    const headers = getHeaders(token);
    console.log(
      "[admin.js] TrialMealCreation -> url:",
      `${api}/api/createtrialmeal`
    );
    console.log("[admin.js] TrialMealCreation -> token param:", token);
    console.log("[admin.js] TrialMealCreation -> headers:", headers);
    console.log("[admin.js] TrialMealCreation -> payload:", mealData);
    const response = await axios.post(`${api}/api/createtrialmeal`, mealData, {
      headers,
    });
    return response.data; // expect backend to return created meal data
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

export const getAllTrialMeals = async (token) => {
  try {
    const headers = getHeaders(token);
    console.log("[admin.js] getAllTrialMeals -> headers:", headers);
    const response = await axios.get(`${api}/api/all`, { headers });
    return response.data;
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

export const createTrialMeal = async (mealData, imageFile, token) => {
  try {
    const headers = getHeaders(token);
    const url = `${api}/api/createtrialmeal`;
    console.log("[admin.js] createTrialMeal -> url:", url);
    console.log("[admin.js] createTrialMeal -> headers:", headers);

    if (imageFile) {
      const fd = new FormData();
      Object.keys(mealData || {}).forEach((k) => {
        const v = mealData[k];
        if (v !== undefined && v !== null) fd.append(k, v);
      });
      fd.append("image", imageFile);
      const res = await axios.post(url, fd, { headers });
      return res.data;
    }

    const res = await axios.post(url, mealData, { headers });
    return res.data;
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

export const updateTrialMeal = async (id, mealData, imageFile, token) => {
  try {
    const headers = getHeaders(token);
    const url = `${api}/api/${id}`;
    console.log("[admin.js] updateTrialMeal -> url:", url);
    console.log("[admin.js] updateTrialMeal -> headers:", headers);

    if (imageFile) {
      const fd = new FormData();
      Object.keys(mealData || {}).forEach((k) => {
        const v = mealData[k];
        if (v !== undefined && v !== null) fd.append(k, v);
      });
      fd.append("image", imageFile);
      const res = await axios.put(url, fd, { headers });
      return res.data;
    }

    const res = await axios.put(url, mealData, { headers });
    return res.data;
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

export const deleteTrialMeal = async (id, token) => {
  try {
    const headers = getHeaders(token);
    const url = `${api}/api/${id}`;
    console.log("[admin.js] deleteTrialMeal -> url:", url);
    console.log("[admin.js] deleteTrialMeal -> headers:", headers);
    const res = await axios.delete(url, { headers });
    return res.data;
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

export const MonthlyMealCreation = async (mealData, token) => {
  try {
    const headers = getHeaders(token);
    console.log(
      "[admin.js] MonthlyMealCreation -> url:",
      `${api}/api/createMonthlyMeal`
    );
    console.log("[admin.js] MonthlyMealCreation -> token param:", token);
    console.log("[admin.js] MonthlyMealCreation -> headers:", headers);
    console.log("[admin.js] MonthlyMealCreation -> payload:", mealData);
    const response = await axios.post(
      `${api}/api/createMonthlyMeal`,
      mealData,
      { headers }
    );
    return response.data; // expect backend to return created meal data
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

export const createMonthlyMeal = async (mealData, imageFile, token) => {
  try {
    const headers = getHeaders(token);
    const url = `${api}/api/createMonthlyMeal`;
    console.log("[admin.js] createMonthlyMeal -> url:", url);
    console.log("[admin.js] createMonthlyMeal -> headers:", headers);

    if (imageFile) {
      const fd = new FormData();
      Object.keys(mealData || {}).forEach((k) => {
        const v = mealData[k];
        if (v !== undefined && v !== null) fd.append(k, v);
      });
      fd.append("image", imageFile);
      const res = await axios.post(url, fd, { headers });
      return res.data;
    }

    const res = await axios.post(url, mealData, { headers });
    return res.data;
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

export const updateMonthlyMeal = async (id, mealData, imageFile, token) => {
  try {
    const headers = getHeaders(token);
    const url = `${api}/api/${id}`;
    console.log("[admin.js] updateMonthlyMeal -> url:", url);
    console.log("[admin.js] updateMonthlyMeal -> headers:", headers);

    if (imageFile) {
      const fd = new FormData();
      Object.keys(mealData || {}).forEach((k) => {
        const v = mealData[k];
        if (v !== undefined && v !== null) fd.append(k, v);
      });
      fd.append("image", imageFile);
      const res = await axios.put(url, fd, { headers });
      return res.data;
    }

    const res = await axios.put(url, mealData, { headers });
    return res.data;
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

export const deleteMonthlyMeal = async (id, token) => {
  try {
    const headers = getHeaders(token);
    const url = `${api}/api/${id}`;
    console.log("[admin.js] deleteMonthlyMeal -> url:", url);
    console.log("[admin.js] deleteMonthlyMeal -> headers:", headers);
    const res = await axios.delete(url, { headers });
    return res.data;
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

// other apis

// Nutrition
export const getNutrition = async (token) => {
  try {
    const headers = getHeaders(token);
    const response = await axios.get(`${api}/api/site/nutrition`, { headers });
    return response.data;
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

export const createNutrition = async (nutritionData, imageFile, token) => {
  try {
    const headers = getHeaders(token);
    const url = `${api}/api/site/nutrition`;

    if (imageFile) {
      const fd = new FormData();
      Object.keys(nutritionData || {}).forEach((k) => {
        const v = nutritionData[k];
        if (v !== undefined && v !== null) fd.append(k, v);
      });
      fd.append("image", imageFile);
      const res = await axios.post(url, fd, { headers });
      return res.data;
    }

    const res = await axios.post(url, nutritionData, { headers });
    return res.data;
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

export const updateNutrition = async (nutritionData, imageFile, token) => {
  try {
    const headers = getHeaders(token);
    const url = `${api}/api/site/nutrition`;

    if (imageFile) {
      const fd = new FormData();
      Object.keys(nutritionData || {}).forEach((k) => {
        const v = nutritionData[k];
        if (v !== undefined && v !== null) fd.append(k, v);
      });
      fd.append("image", imageFile);
      const res = await axios.put(url, fd, { headers });
      return res.data;
    }

    const res = await axios.put(url, nutritionData, { headers });
    return res.data;
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

export const deleteNutrition = async (token) => {
  try {
    const headers = getHeaders(token);
    const url = `${api}/api/site/nutrition`;
    const res = await axios.delete(url, { headers });
    return res.data;
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

export const createNutritionOrder = async (orderData) => {
  try {
    const url = `${api}/api/site/nutrition/create-order`;
    const res = await axios.post(url, orderData);
    return res.data;
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

export const verifyNutritionPayment = async (verificationData) => {
  try {
    const url = `${api}/api/site/nutrition/verify`;
    const res = await axios.post(url, verificationData);
    return res.data;
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
export const checkNutritionStatus = async (userId) => {
  const url = `${api}/api/site/nutrition/payment-status/${userId}`;
  const res = await axios.get(url);
  return res.data;
};

// Contact
export const getContact = async (token) => {
  try {
    const headers = getHeaders(token);
    const response = await axios.get(`${api}/api/site/contact`, { headers });
    return response.data;
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

export const createContact = async (contactData, imageFile, token) => {
  try {
    const headers = getHeaders(token);
    const url = `${api}/api/site/contact`;

    if (imageFile) {
      const fd = new FormData();
      Object.keys(contactData || {}).forEach((k) => {
        const v = contactData[k];
        if (v !== undefined && v !== null) fd.append(k, v);
      });
      fd.append("image", imageFile);
      const res = await axios.post(url, fd, { headers });
      return res.data;
    }

    const res = await axios.post(url, contactData, { headers });
    return res.data;
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

export const updateContact = async (contactData, imageFile, token) => {
  try {
    const headers = getHeaders(token);
    const url = `${api}/api/site/contact`;

    if (imageFile) {
      const fd = new FormData();
      Object.keys(contactData || {}).forEach((k) => {
        const v = contactData[k];
        if (v !== undefined && v !== null) fd.append(k, v);
      });
      fd.append("image", imageFile);
      const res = await axios.put(url, fd, { headers });
      return res.data;
    }

    const res = await axios.put(url, contactData, { headers });
    return res.data;
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

export const deleteContact = async (token) => {
  try {
    const headers = getHeaders(token);
    const url = `${api}/api/site/contact`;
    const res = await axios.delete(url, { headers });
    return res.data;
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

// Hero section APIs (separate endpoints under landing)
export const getHeroSection = async (token) => {
  try {
    const headers = getHeaders(token);
    const response = await axios.get(`${api}/api/site/landing`, { headers });
    return response.data;
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

export const createHeroSectionImage = async (imageFile, token) => {
  try {
    const headers = getHeaders(token);
    const url = `${api}/api/site/landing`;
    if (!imageFile) throw new Error("imageFile is required");
    const fd = new FormData();
    fd.append("image", imageFile);
    const res = await axios.post(url, fd, { headers });
    return res.data;
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

export const updateHeroSectionImage = async (imageFile, token) => {
  try {
    const headers = getHeaders(token);
    const url = `${api}/api/site/landing`;
    if (!imageFile) throw new Error("imageFile is required");
    const fd = new FormData();
    fd.append("image", imageFile);
    const res = await axios.put(url, fd, { headers });
    return res.data;
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

export const deleteHeroSectionImage = async (token) => {
  try {
    const headers = getHeaders(token);
    const url = `${api}/api/site/landing`;
    const res = await axios.delete(url, { headers });
    return res.data;
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

// About section APIs (text + optional image)
export const getAboutSection = async (token) => {
  try {
    const headers = getHeaders(token);
    const response = await axios.get(`${api}/api/site/landing`, { headers });
    return response.data;
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

export const createAboutSection = async (aboutData, imageFile, token) => {
  try {
    const headers = getHeaders(token);
    const url = `${api}/api/site/landing`;

    if (imageFile) {
      const fd = new FormData();
      Object.keys(aboutData || {}).forEach((k) => {
        const v = aboutData[k];
        if (v !== undefined && v !== null) fd.append(k, v);
      });
      fd.append("image", imageFile);
      const res = await axios.post(url, fd, { headers });
      return res.data;
    }

    const res = await axios.post(url, aboutData, { headers });
    return res.data;
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

export const updateAboutSection = async (aboutData, imageFile, token) => {
  try {
    const headers = getHeaders(token);
    const url = `${api}/api/site/landing`;

    if (imageFile) {
      const fd = new FormData();
      Object.keys(aboutData || {}).forEach((k) => {
        const v = aboutData[k];
        if (v !== undefined && v !== null) fd.append(k, v);
      });
      fd.append("image", imageFile);
      const res = await axios.put(url, fd, { headers });
      return res.data;
    }

    const res = await axios.put(url, aboutData, { headers });
    return res.data;
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

export const deleteAboutSection = async (token) => {
  try {
    const headers = getHeaders(token);
    const url = `${api}/api/site/landing`;
    const res = await axios.delete(url, { headers });
    return res.data;
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

// Messages
export const getAllMessages = async (token) => {
  try {
    const headers = getHeaders(token);
    const response = await axios.get(`${api}/api/admin/contact`, { headers });
    return response.data; // expect backend to return list of messages
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
export const deleteMessage = async (id, token) => {
  try {
    if (!id) throw new Error("id is required");
    const headers = getHeaders(token);
    const url = `${api}/api/admin/contact/${id}`;
    const res = await axios.delete(url, { headers });
    return res.data;
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
export const createMessage = async (messageData) => {
  try {
    const url = `${api}/api/admin/contact`;
    const res = await axios.post(url, messageData);
    return res.data;
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
