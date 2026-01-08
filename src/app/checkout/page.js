"use client";

import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import subscriptionApi from "../api/Subscribe";
import paymentApi from "../api/PaymentApi";
import { clearCart } from "../redux/slices/cartSlice";
import {updateUserProfile} from "../api/auth";

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
    postalcode: "",
    bloodReport: null,
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  // Upload modal state: show immediately when page loads
  const [showUploadModal, setShowUploadModal] = useState(true);
  const [reportFile, setReportFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isAddressSaved, setIsAddressSaved] = useState(false);
const [savingAddress, setSavingAddress] = useState(false);


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

  // ensure modal shows when component mounts (explicit)
  useEffect(() => {
    setShowUploadModal(true);
  }, []);

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



  // Handlers for the upload modal
  const handleReportChange = (e) => {
    const f = e.target.files && e.target.files[0];
    setReportFile(f || null);
  };

  const handleSkipUpload = () => {
    setShowUploadModal(false);
  };

  const handleUploadReport = async () => {
    if (!reportFile) {
      toast.error("Please select a file or click Skip");
      return;
    }
    setUploading(true);
    const fd = new FormData();
    // key name 'bloodReport' is used for debugging in the api
    fd.append("bloodReport", reportFile);
    try {
      const res = await subscriptionApi.uplodeBloodReport(fd, auth.token);
      toast.success(res?.data?.message || "Report uploaded successfully");
      // optionally save returned URL into formData for later use
      try {
        if (res?.data?.fileUrl) {
          setFormData((prev) => ({ ...prev, bloodReport: res.data.fileUrl }));
        } else {
          setFormData((prev) => ({ ...prev, bloodReport: reportFile }));
        }
      } catch (e) {
        // ignore
      }
      setShowUploadModal(false);
    } catch (err) {
      const msg = err?.message || "Upload failed";
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveAddress = async () => {
  if (!formData.address || !formData.city || !formData.postalcode) {
    toast.error("Please fill complete address");
    return;
  }

  try {
    setSavingAddress(true);

   
    

    await updateUserProfile( auth.token,{
       address: formData.address,
        city: formData.city,
        postalcode: formData.postalcode,

    });

    toast.success("Address saved successfully");
    setIsAddressSaved(true); // 🔥 enable pay button
  } catch (err) {
    toast.error(err?.message || "Failed to save address");
  } finally {
    setSavingAddress(false);
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
        const payload = {
          planType,
          plan: item._id || item.id.split("-")[0],
          deliveryAddress: formData.address,
          startDate: new Date().toISOString(),
          endDate: new Date(
            Date.now() + durationDays * 24 * 60 * 60 * 1000
          ),
          totalAmount: item.totalPrice || (item.price * item.quantity * (isTrialMeal ? durationDays : 1)),
          bloodReport: null,
        };
        
        // Add days field for TrialMeal (required by backend)
        if (isTrialMeal) {
          payload.days = durationDays;
        }
        
        return payload;
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
        name: "Fittbox",
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
    <>
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          {/* modal container - clicking backdrop does nothing */}
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">
              Upload Latest Blood Report
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Please upload your latest blood report. You can skip and upload
              later, but uploading now helps us personalize your meals.
            </p>

            <div className="mb-4">
              <input
                type="file"
                accept="application/pdf,image/*"
                onChange={handleReportChange}
                className="w-full"
              />
              {reportFile && (
                <p className="mt-2 text-sm text-gray-700">
                  Selected: {reportFile.name}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleSkipUpload}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700"
              >
                Skip
              </button>
              <button
                type="button"
                onClick={handleUploadReport}
                disabled={uploading}
                className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-60"
              >
                {uploading ? "Uploading..." : "Upload & Continue"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-12">
            Complete Your Order
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* LEFT SIDE - Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Shipping Information Card */}
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                  <div className="flex items-center mb-8">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 ml-4">
                      Shipping Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        readOnly
                        className="w-full px-5 py-4 bg-gray-100 border border-gray-300 rounded-xl cursor-not-allowed text-gray-700 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        readOnly
                        value={formData.email}
                        className="w-full px-5 py-4 bg-gray-100 border border-gray-300 rounded-xl cursor-not-allowed text-gray-700 font-medium"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Delivery Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="123 Main St, Apt 4B"
                        className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Mumbai"
                        className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="postalcode"
                        required
                        value={formData.postalcode}
                        onChange={handleChange}
                        placeholder="400001"
                        className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Pay Button */}
                <div className="flex gap-5">
                  {/* //save details button */}
                <button
  type="button"
  onClick={handleSaveAddress}
  disabled={savingAddress}
  className="w-full bg-gray-800 text-white font-bold text-lg py-4 rounded-xl disabled:opacity-50"
>
  {savingAddress ? "Saving Address..." : "Save Address"}
</button>
                <button
                  type="submit"
                 disabled={!isAddressSaved}
  className={`w-full font-bold text-xl py-5 rounded-2xl transition duration-300 shadow-2xl flex items-center justify-center gap-3
    ${
      isAddressSaved
        ? "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
        : "bg-gray-300 cursor-not-allowed"
    }
  `}
                >
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v5m-3 0h6M5 11l1.5-3h11l1.5 3m-12 0h10a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4a2 2 0 012-2z"
                    />
                  </svg>
                  Pay ₹{cart.totalAmount.toFixed(2)}
                </button>
                </div>

                <p className="text-center text-sm text-gray-500 mt-6">
                  Secured by 256-bit SSL • No hidden charges • Fresh meals
                  delivered
                </p>
                
              </form>
            </div>

            {/* RIGHT SIDE - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-2xl p-8 sticky top-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  Order Summary
                </h2>

                <div className="space-y-5">
                  {cart.items.map((item) => {
                    const isTrialMeal = item.planType === "TrialMeal";
                    const qty = isTrialMeal ? item.quantity || 1 : 1;
                    const days = isTrialMeal ? item.days || 1 : 30;
                    const displayText = isTrialMeal
                      ? `${item.name} × ${qty} (${days} day${
                          days > 1 ? "s" : ""
                        })`
                      : `${item.name}`;

                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0"
                      >
                        <div>
                          <p className="font-semibold text-gray-800">
                            {displayText}
                          </p>
                          {isTrialMeal && (
                            <p className="text-xs text-blue-600 font-medium mt-1">
                              Trial Plan
                            </p>
                          )}
                        </div>
                        <span className="font-bold text-lg text-gray-900">
                          ₹{(item.price * qty).toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 pt-8 border-t-4 border-blue-100">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-gray-800">
                      Total
                    </span>
                    <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
                      ₹{cart.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-center gap-2 text-green-600 font-medium">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Free Delivery • 100% Fresh • Cancel Anytime
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
