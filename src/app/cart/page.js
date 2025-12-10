"use client";

import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateCartItem } from "../redux/slices/cartSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useModal } from "../Component/ModalContext";
import { loginUser, registerUser } from "../api/auth";
import { setAuth } from "../store/authSlice";
import toast from "react-hot-toast";
import { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";

function AuthForm({ mode, onSuccess }) {
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState("");
  const [reg, setReg] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [login, setLogin] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const modal = useModal();

  const submitRegister = async (ev) => {
    ev.preventDefault();
    setLocalError("");
    setLocalLoading(true);
    try {
      const response = await registerUser({
        name: reg.name,
        email: reg.email,
        phone: reg.phone,
        password: reg.password,
      });
      dispatch(setAuth({ user: response.user, token: response.token }));
      const msg = response?.message;
      if (msg) toast.success(msg);
      modal.closeModal();
      if (onSuccess) onSuccess();
    } catch (err) {
      const msg = err?.message || "";
      setLocalError(msg);
      toast.error(msg);
    } finally {
      setLocalLoading(false);
    }
  };

  const submitLogin = async (ev) => {
    ev.preventDefault();
    setLocalError("");
    setLocalLoading(true);
    try {
      const response = await loginUser({
        email: login.email,
        password: login.password,
      });
      dispatch(setAuth({ user: response.user, token: response.token }));
      const msg = response?.message;
      if (msg) toast.success(msg);
      modal.closeModal();
      if (onSuccess) onSuccess();
    } catch (err) {
      const msg = err?.message || "";
      setLocalError(msg);
      toast.error(msg);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900">
        {mode === "register" ? "Create an account" : "Welcome back"}
      </h2>
      {localError && (
        <div className="mb-3 text-sm text-red-600">{localError}</div>
      )}
      {mode === "register" ? (
        <form onSubmit={submitRegister} className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700">Name</label>
            <input
              required
              name="name"
              value={reg.name}
              onChange={(e) => setReg({ ...reg, name: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2 rounded mt-1"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              required
              name="email"
              type="email"
              value={reg.email}
              onChange={(e) => setReg({ ...reg, email: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2 rounded mt-1"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Phone</label>
            <input
              required
              name="phone"
              type="tel"
              value={reg.phone}
              onChange={(e) => setReg({ ...reg, phone: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2 rounded mt-1"
              placeholder="+91 98765 43210"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              required
              name="password"
              type="password"
              value={reg.password}
              onChange={(e) => setReg({ ...reg, password: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2 rounded mt-1"
              placeholder="Create a password"
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              type="submit"
              disabled={localLoading}
              className="px-7 py-3 bg-blue-500 text-white rounded text-sm font-medium hover:bg-green-700 disabled:opacity-60"
            >
              {localLoading ? "Signing up..." : "Sign up"}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={submitLogin} className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              required
              name="email"
              type="email"
              value={login.email}
              onChange={(e) => setLogin({ ...login, email: e.target.value })}
              className="w-full border px-3 py-2 rounded mt-1"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              required
              name="password"
              type="password"
              value={login.password}
              onChange={(e) => setLogin({ ...login, password: e.target.value })}
              className="w-full border px-3 py-2 rounded mt-1"
              placeholder="Your password"
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <button
              type="submit"
              disabled={localLoading}
              className="px-4 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 disabled:opacity-60"
            >
              {localLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function Page() {
  const cart = useSelector((state) => state.cart);
  const auth = useSelector((state) => state.auth);
  const router = useRouter();
  const modal = useModal();
  const dispatch = useDispatch();

  const openAuthModal = (mode) => {
    modal.openModal(
      <div className="w-full max-w-md mx-auto">
        <AuthForm
          mode={mode}
          onSuccess={() => {
            // After successful login, redirect to checkout
            router.push("/checkout");
          }}
        />
        <div className="mt-4 text-center text-sm">
          {mode === "login" ? (
            <button
              onClick={() => {
                modal.closeModal();
                setTimeout(() => openAuthModal("register"), 200);
              }}
              className="text-blue-600 hover:text-blue-800"
            >
              Don't have an account? Register
            </button>
          ) : (
            <button
              onClick={() => {
                modal.closeModal();
                setTimeout(() => openAuthModal("login"), 200);
              }}
              className="text-blue-600 hover:text-blue-800"
            >
              Already have an account? Login
            </button>
          )}
        </div>
      </div>
    );
  };

  const handleCheckout = () => {
    // Check if user is authenticated
    if (!auth.isAuthenticated || !auth.token) {
      // User not authenticated, show login modal
      toast.error("Please login to proceed to checkout");
      openAuthModal("login");
      return;
    }
    // User is authenticated, proceed to checkout
    router.push("/checkout");
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link href="/Menu" className="text-blue-600 hover:text-blue-800">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          {cart.items.map((item) => {
            const isTrialMeal = item.planType === "TrialMeal";
            const durationDays = isTrialMeal ? item.days ?? 1 : 30;
            const quantity = isTrialMeal ? item.quantity ?? 1 : 1;
            const itemTotal = isTrialMeal
              ? item.price * quantity * durationDays
              : item.price;
            console.log("🛒 Cart Item Debug:", {
              id: item.id,
              name: item.name,
              type: item.type,
              category: item.category,
              planType: item.planType,
              price: item.price,
              quantity: item.quantity,
              days: item.days,
              itemTotal,
            });
            return (
              <div
                key={item.id}
                className="flex items-center gap-4 border-b py-4"
              >
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{item.category}</h2>
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <h4 className="text-xl font-semibold">{item.type}</h4>
                  <p className="text-gray-600">₹{item.price}</p>

                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {isTrialMeal && (
                      <>
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-600">
                            Days (1–3):
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="3"
                            value={durationDays}
                            onChange={(e) => {
                              const daysValue = parseInt(e.target.value);
                              if (
                                !isNaN(daysValue) &&
                                daysValue >= 1 &&
                                daysValue <= 3
                              ) {
                                dispatch(
                                  updateCartItem({
                                    id: item.id,
                                    days: daysValue,
                                  })
                                );
                              }
                            }}
                            className="w-16 px-2 py-1 border rounded text-sm"
                          />
                        </div>

                        {/* <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-600">
                            Quantity:
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={quantity}
                            onChange={(e) => {
                              const qty = parseInt(e.target.value);
                              if (!isNaN(qty) && qty >= 1 && qty <= 10) {
                                dispatch(
                                  updateCartItem({ id: item.id, quantity: qty })
                                );
                              }
                            }}
                            className="w-16 px-2 py-1 border rounded text-sm"
                          />
                        </div> */}
                      </>
                    )}

                    <button
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      <RiDeleteBin6Line />
                    </button>
                  </div>
                </div>

                <div className="text-xl font-bold">₹{itemTotal.toFixed(2)}</div>
              </div>
            );
          })}
        </div>
        <div className="lg:w-1/3">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cart.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{cart.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
