"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setAuth } from "../store/authSlice";
import { registerUser } from "../api/auth";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";

export default function Register() {
  const [reg, setReg] = useState({ name: "", email: "", phone: "", password: "" });
  const [localLoading, setLocalLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const submitRegister = async (ev) => {
    ev.preventDefault();
    setLocalLoading(true);
    try {
      const response = await registerUser({
        name: reg.name,
        email: reg.email,
        phone: reg.phone,
        password: reg.password,
      });
      dispatch(setAuth({ user: response.user, token: response.token }));
      const msg = response?.message || "Registration successful";
      toast.success(msg);
      router.push("/");
    } catch (err) {
      const msg = err?.message || "Registration failed";
      toast.error(msg);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden flex bg-white">
      {/* Left side - Image */}
      <div className="hidden lg:flex w-1/2 bg-emerald-50 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-emerald-600/10 z-10"></div>
        <Image
          src="/hero4.jpg"
          alt="Fresh Ingredients"
          fill
          className="object-cover"
        />
        <div className="z-20 relative p-10 text-center bg-black/40 backdrop-blur-sm rounded-2xl mx-8 shadow-2xl border border-white/20">
          <h2 className="text-3xl font-extrabold text-white mb-3 drop-shadow-md">
            Start Your Journey!
          </h2>
          <p className="text-emerald-50 text-base font-medium max-w-md mx-auto drop-shadow-sm">
            Join FittBox today and take the first step towards a healthier, happier you with our customized meal plans.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-10 relative overflow-y-auto">
        <Link href="/" className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-emerald-600 transition bg-gray-50 hover:bg-emerald-50 px-3 py-1.5 rounded-full shadow-sm">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Home
        </Link>
        <div className="w-full max-w-sm space-y-6 animate-fade-in mt-6">
          <div className="text-center">
            <Link href="/" className="inline-block mb-3 hover:opacity-80 transition">
              <Image src="/logo.png" alt="FittBox Logo" width={80} height={80} className="rounded-xl mx-auto object-cover shadow-sm" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Create an account
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-emerald-600 hover:text-emerald-500 transition underline-offset-4 hover:underline">
                Sign in here
              </Link>
            </p>
          </div>

          <div className="flex justify-center mt-4">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined")
                  window.location.href = "/api/auth/google";
              }}
              className="flex items-center justify-center p-3 border border-gray-300 rounded-full bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition shadow-sm hover:shadow-md"
              title="Sign up with Google"
            >
              <FcGoogle className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-400 font-medium uppercase">Or email</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <form className="mt-6 space-y-5" onSubmit={submitRegister}>
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  value={reg.name}
                  onChange={(e) => setReg({ ...reg, name: e.target.value })}
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm transition shadow-sm"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  value={reg.email}
                  onChange={(e) => setReg({ ...reg, email: e.target.value })}
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm transition shadow-sm"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  name="phone"
                  type="tel"
                  required
                  value={reg.phone}
                  onChange={(e) => setReg({ ...reg, phone: e.target.value })}
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm transition shadow-sm"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  value={reg.password}
                  onChange={(e) => setReg({ ...reg, password: e.target.value })}
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm transition shadow-sm"
                  placeholder="Create a strong password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={localLoading}
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all shadow-lg hover:shadow-emerald-600/30 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {localLoading ? "Creating account..." : "Create Account"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
