"use client";

import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import subscriptionApi from "../api/Subscribe";
import paymentApi from "../api/PaymentApi";
import { clearCart } from "../redux/slices/cartSlice";

export default function Checkout() {
  const cart = useSelector((state) => state.cart);
  const auth = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    bloodReport: null,
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  // Initialize name & email from auth
  useEffect(() => {
    if (auth.user) {
      setFormData((prev) => ({
        ...prev,
        name: auth.user.name || "",
        email: auth.user.email || "",
      }));
    }
  }, [auth.user]);

  // Protect route
  useEffect(() => {
    if (!auth.isAuthenticated || !auth.token) {
      toast.error("Please login to access checkout");
      router.replace("/");
      return;
    }
    if (cart.items.length === 0) {
      toast.error("Your cart is empty");
      router.replace("/cart");
    }
  }, [auth.isAuthenticated, auth.token, cart.items.length]);

  if (!auth.isAuthenticated || !auth.token || cart.items.length === 0) {
    return null;
  }

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setFormData({ ...formData, bloodReport: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // --------------------- 🔥 MAIN CHECKOUT LOGIC ---------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.group("🟦 CHECKOUT DEBUG LOGS");
    try {
      // -----------------------------
      // 1️⃣ Generate Correct planId
      // -----------------------------
      console.log("🛒 Cart Items:", cart.items);

      // let planId = cart.items[0].productId || null;

      // if (!planId) {
      //   const rawId = String(cart.items[0].id || "");
      //   if (rawId.includes("-")) {
      //     const maybe = rawId.split("-")[0];
      //     if (/^[a-fA-F0-9]{24}$/.test(maybe)) planId = maybe;
      //   }
      // }
      // if (!planId) planId = cart.items[0].id;
      // console.log("📌 Final Plan ID:", planId);
      const selectedItems = cart.items.map((item) => ({
        itemId: item._id || item.id.split("-")[0], // change kiya hay
        qty: item.quantity,
        price: item.price,
        name: item.name,
      }));

      console.log("📦 Selected Items Prepared:", selectedItems);

      // -----------------------------
      // 2️⃣ Prepare JSON Payload
      // -----------------------------
      const payloads = cart.items.map((item) => {
        const planType = item.planType;
        const isTrialMeal = item.planType === "TrialMeal";
        const durationDays = isTrialMeal ? item.days || 1 : 30;
        return {
          planType,
          plan: item._id || item.id.split("-")[0],
          deliveryAddress: formData.address,
          startDate: new Date().toISOString(),
          endDate: new Date(
            Date.now() +
              (planType === "MealPlan" ? 30 : 1) * 24 * 60 * 60 * 1000
          ),
          totalAmount: item.price * item.quantity,
          bloodReport: null,
        };
      });
      console.log("📦 Payload Sending:", payloads);
      console.log("🔑 Auth Token:", auth.token);
      // -----------------------------
      // 3️⃣ Create Subscription + Razorpay Order
      // -----------------------------
      let res;
      try {
        console.log("🚀 Calling API: createSubscription...");
        res = await subscriptionApi.createSubscription(
          { selectedItems: payloads },
          auth.token
        );
        console.log("📥 API Response:", res.data);
      } catch (err) {
        console.error("createSubscription failed:", err.message);
        toast.error(err.message || "Subscription creation failed");
        console.groupEnd();
        return;
      }

      console.log("createSubscription response:", res);
      const { order, subscriptions } = res.data;
      console.log("🧾 RZP Order:", order);
      console.log("📌 Subscription:", subscriptions);
      const subscription = subscriptions[0];

      // -----------------------------
      // 4️⃣ Load Razorpay Script
      // -----------------------------
      const loadRazorpay = () =>
        new Promise((resolve, reject) => {
          if (typeof window === "undefined")
            return reject(new Error("No window"));

          if (window.Razorpay) return resolve(window.Razorpay);

          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.async = true;
          script.onload = () => resolve(window.Razorpay);
          script.onerror = () =>
            reject(new Error("Razorpay SDK failed to load"));
          document.body.appendChild(script);
        });

      await loadRazorpay();

      // -----------------------------
      // 5️⃣ Razorpay Options
      // -----------------------------
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: order.amount,
        currency: "INR",
        name: "Fitbox",
        description: "Subscription Payment",
        order_id: order.id,

        handler: async function (response) {
          try {
            // 1️⃣ Verify Sub Payment
            let subVerify, payHistory;

            try {
              subVerify = await subscriptionApi.subverifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                subscriptionId: subscription?._id,
              });
            } catch (err) {
              console.error("Subscription verify failed:", err.message);
              toast.error(err.message || "Subscription verification failed");
              return;
            }

            // 2️⃣ Save Payment Record
            try {
              payHistory = await paymentApi.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: order.amount,
                subscriptionId: subscription?._id,
                userId: auth.user._id,
              });
            } catch (err) {
              console.error("Payment history save failed:", err.message);
              toast.error(err.message || "Saving payment history failed");
              return;
            }
            console.log("🔐 Subscription Verify:", subVerify.data);
            console.log("📚 Payment History Save:", payHistory.data);

            if (subVerify.data.success && payHistory.data.success) {
              try {
                // Persist last payment / bill details so the success page can display them
                const last = {
                  order,
                  subscription,
                  payloads,
                  subVerify: subVerify.data || subVerify,
                  payHistory: payHistory.data || payHistory,
                };
                if (typeof window !== "undefined")
                  localStorage.setItem("lastPayment", JSON.stringify(last));
              } catch (e) {
                console.warn("Could not save lastPayment to localStorage", e);
              }

              // Redirect user immediately to success page
              toast.success("Payment Success!");
              router.push("/success");

              // Clear cart in background (do not block redirect)
              try {
                // schedule after navigation to avoid blocking
                setTimeout(() => {
                  try {
                    dispatch(clearCart());
                  } catch (err) {
                    console.warn("Could not clear cart after payment", err);
                  }
                }, 200);
              } catch (e) {
                console.warn("Background cart clear failed", e);
              }
            } else {
              toast.error("Payment Verification Failed");
            }
          } catch (err) {
            console.log(err);
            toast.error("Payment verify failed");
          }
        },

        prefill: {
          name: formData.name,
          email: formData.email,
        },
        theme: {
          color: "#2563eb",
        },
      };

      console.log("⚙ Razorpay Options:", options);
      console.log("🟢 Opening Razorpay Checkout...");
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.log(err);
      toast.error("Checkout failed");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT SIDE */}
        <div className="lg:w-2/3">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* SHIPPING */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    readOnly
                    className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    readOnly
                    value={formData.email}
                    className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    required
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>

            {/* PAYMENT (UI only – Razorpay handle karega) */}
            {/* <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">
                Payment Information (Card Dummy UI)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label>Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label>Expiry (MM/YY)</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label>CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    maxLength="4"
                    value={formData.cvv}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div> */}

            {/* PLACE ORDER */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              Pay ₹{cart.totalAmount.toFixed(2)}
            </button>
          </form>
        </div>

        {/* RIGHT SIDE SUMMARY */}
        <div className="lg:w-1/3">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between py-2">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}

            <div className="border-t mt-4 pt-4 flex justify-between font-bold">
              <span>Total</span>
              <span>₹{cart.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
