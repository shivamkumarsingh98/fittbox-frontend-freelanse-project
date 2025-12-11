import axios from "axios";
const api = process.env.NEXT_PUBLIC_API_URL;

const subscriptionApi = {
  // 1️⃣ Create Subscription (with file upload)
  // Accept optional token param (prefer passed token over localStorage)

  uplodeBloodReport: async (formData, explicitToken = null) => {
    const token =
      explicitToken ||
      (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    const finalToken = explicitToken || token;
    console.log("FINAL TOKEN SENDING TO BACKEND:", finalToken);

    if (!finalToken) {
      console.error("❌ No token found! User must login.");
    }
    console.group("🔍 DEBUG: uplodeBloodReport Request");
    console.log("➡️ URL:", `${api}/api/subscriptions/upload-bloodreport`);
    console.log("➡️ Method: POST");
    console.log("➡️ Token (finalToken):", finalToken);
    // When sending FormData do NOT set Content-Type so the browser
    // can add the correct multipart boundary header automatically.
    const headers = {
      Authorization: `Bearer ${finalToken}`,
    };
    console.log("➡️ Headers Sent:", headers);
    console.log("➡️ FormData Values:");
    for (let pair of formData.entries()) {
      console.log("   ", pair[0], ":", pair[1]);
    }
    console.groupEnd();
    // Do not set explicit Content-Type for FormData; browser will add the correct boundary
    try {
      return await axios.post(
        `${api}/api/subscriptions/upload-bloodreport`,
        formData,
        { headers }
      );
    } catch (err) {
      const serverMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error?.description ||
        err.message;
      console.error(
        "[subscriptionApi] uplodeBloodReport error:",
        err?.response || err
      );
      throw new Error(serverMessage);
    }
  },

  createSubscription: async (formData, explicitToken = null) => {
    const token =
      explicitToken ||
      (typeof window !== "undefined" ? localStorage.getItem("token") : null);

    const finalToken = explicitToken || token;
    console.log("FINAL TOKEN SENDING TO BACKEND:", finalToken);

    if (!finalToken) {
      console.error("❌ No token found! User must login.");
    }
    console.group("🔍 DEBUG: createSubscription Request");
    console.log("➡️ URL:", `${api}/api/subscriptions/create-subscription`);
    console.log("➡️ Method: POST");
    console.log("➡️ Token (finalToken):", finalToken);
    const headers = {
      Authorization: `Bearer ${explicitToken || token}`,
      "Content-Type": "application/json",
    };
    console.log("➡️ Headers Sent:", headers);

    console.groupEnd();
    // Debug logs: show whether token is present and what headers will be sent
    try {
      console.debug("[subscriptionApi] createSubscription - token:", token);
      console.debug("[subscriptionApi] createSubscription - headers:", headers);
      if (typeof FormData !== "undefined" && formData instanceof FormData) {
        try {
          console.debug(
            "[subscriptionApi] createSubscription - formData.planId:",
            formData.get("planId")
          );
        } catch (e) {
          console.debug(
            "[subscriptionApi] createSubscription - formData preview failed",
            e
          );
        }
      }
    } catch (e) {
      // swallow debug errors in non-browser environments
    }
    // Do not set explicit Content-Type for FormData; browser will add the correct boundary
    try {
      return await axios.post(
        `${api}/api/subscriptions/create-subscription`,
        JSON.stringify(formData),
        { headers }
      );
    } catch (err) {
      const serverMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error?.description ||
        err.message;
      console.error(
        "[subscriptionApi] createSubscription error:",
        err?.response || err
      );
      throw new Error(serverMessage);
    }
  },

  // 2️⃣ Verify Payment
  // 2️⃣ Verify Subscription Payment
  subverifyPayment: async (data, explicitToken = null) => {
    const localToken =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const finalToken = explicitToken || localToken;
    console.log("➡️ Token (finalToken):", finalToken);

    const headers = {
      Authorization: `Bearer ${finalToken}`,
    };
    console.log("➡️ Headers Sent:", headers);

    console.log("[subscriptionApi] subverifyPayment - token:", finalToken);
    console.log("[subscriptionApi] subverifyPayment - headers:", headers);

    try {
      return await axios.post(`${api}/api/subscriptions/verify-payment`, data, {
        headers,
      });
    } catch (err) {
      const serverMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error?.description ||
        err.message;

      console.error(
        "[subscriptionApi] subverifyPayment error:",
        err?.response || err
      );

      throw new Error(serverMessage);
    }
  },

  // 3️⃣ Get User Subscriptions
  getUserSubscriptions: async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    try {
      return await axios.get(`${api}/api/subscriptions`, { headers });
    } catch (err) {
      const serverMessage = err?.response?.data?.message || err?.message;
      throw new Error(serverMessage);
    }
  },

  // 4️⃣ Cancel Subscription
  cancelSubscription: async (id) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    // Fixed endpoint order to match backend: /api/subscriptions/:id/cancel
    try {
      return await axios.put(
        `${api}/api/subscriptions/${id}/cancel`,
        {},
        { headers }
      );
    } catch (err) {
      const serverMessage = err?.response?.data?.message || err?.message;
      throw new Error(serverMessage);
    }
  },
};

export default subscriptionApi;
