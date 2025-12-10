import axios from "axios";
const api = process.env.NEXT_PUBLIC_API_URL;

const paymentApi = {
  // 1️⃣ Create Razorpay Order
  createOrder: async (amount) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    // Debug logs: show token and headers for createOrder
    try {
      console.debug("[paymentApi] createOrder - token:", token);
      console.debug("[paymentApi] createOrder - headers:", headers);
      console.debug("[paymentApi] createOrder - amount:", amount);
    } catch (e) {
      // ignore debug errors in SSR
    }

    try {
      return await axios.post(
        `${api}/api/payments/create-order`,
        { amount },
        { headers }
      );
    } catch (err) {
      const serverMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error?.description ||
        err.message;
      console.error("[paymentApi] createOrder error:", err?.response || err);
      throw new Error(serverMessage);
    }
  },

  // 2️⃣ Verify Payment
  verifyPayment: async (data) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    try {
      console.debug("[paymentApi] verifyPayment - token:", token);
      console.debug("[paymentApi] verifyPayment - headers:", headers);
    } catch (e) {}

    try {
      return await axios.post(`${api}/api/payments/verify`, data, { headers });
    } catch (err) {
      const serverMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error?.description ||
        err.message;
      console.error("[paymentApi] verifyPayment error:", err?.response || err);
      throw new Error(serverMessage);
    }
  },

  // 3️⃣ Get Payment History
  getPaymentHistory: async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    try {
      console.debug("[paymentApi] getPaymentHistory - token:", token);
      console.debug("[paymentApi] getPaymentHistory - headers:", headers);
    } catch (e) {}

    try {
      return await axios.get(`${api}/api/payments/history`, { headers });
    } catch (err) {
      const serverMessage = err?.response?.data?.message || err?.message;
      console.error(
        "[paymentApi] getPaymentHistory error:",
        err?.response || err
      );
      throw new Error(serverMessage);
    }
  },
};

export default paymentApi;
