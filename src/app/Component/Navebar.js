"use client";

import { useEffect, useRef, useState } from "react";
import { FiUser, FiShoppingCart, FiLogOut } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { usePathname } from "next/navigation";
import { useModal } from "./ModalContext";
import { registerUser, loginUser } from "../api/auth";
import { setAuth, logout } from "../store/authSlice";
import toast, { Toaster } from "react-hot-toast";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [meOpen, setMeOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const meRef = useRef(null);
  const pathname = usePathname();
  const cartItems = useSelector((state) => state.cart.totalQuantity);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isScrolled, setIsScrolled] = useState(false);

  // helper to determine active link (handles nested routes)
  const isActive = (href) => {
    if (!pathname) return false;
    const p = pathname.toLowerCase();
    const h = href.toLowerCase();
    if (h === "/") return p === "/";
    return p.startsWith(h);
  };

  // close 'Me' when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (meRef.current && !meRef.current.contains(e.target)) {
        setMeOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setMeOpen(false);
  }, [pathname]);

  // lock scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
  }, [mobileOpen]);

  const modal = useModal();

  function AuthForm({ mode }) {
    const [localLoading, setLocalLoading] = useState(false);
    const [localError, setLocalError] = useState("");

    const [reg, setReg] = useState({
      name: "",
      email: "",
      phone: "",
      password: "",
    });
    const [login, setLogin] = useState({ email: "", password: "" });

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
      } catch (err) {
        const msg = err?.message || "";
        setLocalError(msg);
        toast.error(msg);
      } finally {
        setLocalLoading(false);
      }
    };

    return (
      <div className="w-full max-w-md">
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
            <div className="flex items-center justify-end gap-2 ">
              <button
                type="submit"
                disabled={localLoading}
                className="px-7 py-3 bg-blue-500 text-white rounded text-sm font-medium hover:bg-green-700 disabled:opacity-60"
              >
                {localLoading ? "Signing up..." : "Sign up"}
              </button>
            </div>
            <div className="flex items-center gap-3 my-2">
              <span className="flex-1 h-px bg-gray-200"></span>
              <span className="text-sm text-gray-500">or</span>
              <span className="flex-1 h-px bg-gray-200"></span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined")
                  window.location.href = "/api/auth/google";
              }}
              className="w-full flex items-center justify-center gap-2 py-2 rounded bg-white hover:bg-gray-50"
            >
              <FcGoogle className="w-5 h-5" />
              <span className="text-sm">Continue with Google</span>
            </button>
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
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <input
                required
                name="password"
                type="password"
                value={login.password}
                onChange={(e) =>
                  setLogin({ ...login, password: e.target.value })
                }
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
            <div className="flex items-center gap-3 my-2">
              <span className="flex-1 h-px bg-gray-200"></span>
              <span className="text-sm text-gray-500">or</span>
              <span className="flex-1 h-px bg-gray-200"></span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined")
                  window.location.href = "/api/auth/google";
              }}
              className="w-full flex items-center justify-center gap-2 py-2 rounded bg-white hover:bg-gray-50"
            >
              <FcGoogle className="w-5 h-5" />
              <span className="text-sm">Continue with Google</span>
            </button>
          </form>
        )}
      </div>
    );
  }

  function openAuth(type) {
    modal.openModal(<AuthForm mode={type} />);
  }
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <Toaster position="top-right" reverseOrder={false} />
      <nav className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-1"
          onClick={() => setMobileOpen(false)}
        >
          <img
            src="/logo.png"
            alt="FittBox Logo"
            className="w-40 h-40 mb-3 rounded-md object-cover"
          />
          {/* <p className="text-xl font-bold text-gray-900">FittBox</p> */}
        </Link>

        {/* Mobile controls: cart left of hamburger (md:hidden) */}
        <div className="md:hidden flex items-center space-x-3">
          <Link
            href="/cart"
            className="relative"
            onClick={() => setMobileOpen(false)}
            aria-label="Cart"
          >
            <FiShoppingCart className="w-6 h-6 text-gray-800" />
            {cartItems > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItems}
              </span>
            )}
          </Link>

          {/* Hamburger */}
          <button
            className="flex flex-col justify-center space-y-1.5 focus:outline-none"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`h-0.5 w-6 bg-gray-900 transition-all ${
                mobileOpen ? "rotate-45 translate-y-[6px]" : ""
              }`}
            />
            <span
              className={`h-0.5 w-6 bg-gray-900 transition-all ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-0.5 w-6 bg-gray-900 transition-all ${
                mobileOpen ? "-rotate-45 -translate-y-[6px]" : ""
              }`}
            />
          </button>
        </div>

        {/* desktop cart will be rendered inside the nav links (see below) */}

        {/* Links */}
        <ul
          className={`${
            mobileOpen
              ? "fixed top-16 left-0 right-0 bg-white flex flex-col items-start p-4 gap-2 border-t border-gray-100"
              : "hidden"
          } md:flex md:static md:flex-row md:items-center md:gap-3`}
        >
          <li>
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg hover:bg-gray-100 w-full block ${
                isActive("/")
                  ? "text-red-500 font-bold"
                  : "text-gray-800 font-bold"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>
            <span
              className={`block h-0.5 bg-red-500 mt-1 transition-all ${
                isActive("/") ? "w-full" : "w-0"
              }`}
            />
          </li>
          <li>
            <Link
              href="/Menu"
              className={`px-3 py-2 rounded-lg hover:bg-gray-100 w-full block ${
                isActive("/Menu")
                  ? "text-red-500 font-bold"
                  : "text-gray-800 font-bold"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              Menu
            </Link>
            <span
              className={`block h-0.5 bg-red-500 mt-1 transition-all ${
                isActive("/Menu") ? "w-full" : "w-0"
              }`}
            />
          </li>
          <li>
            <Link
              href="/Nutrition"
              className={`px-3 py-2 rounded-lg hover:bg-gray-100 w-full block ${
                isActive("/Nutrition")
                  ? "text-red-500 font-bold"
                  : "text-gray-800 font-semibold"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              Nutrition
            </Link>
            <span
              className={`block h-0.5 bg-red-500 mt-1 transition-all ${
                isActive("/Nutrition") ? "w-full" : "w-0"
              }`}
            />
          </li>
          <li>
            <Link
              href="/Contact"
              className={`px-3 py-2 rounded-lg hover:bg-gray-100 w-full block ${
                isActive("/Contact")
                  ? "text-red-500 font-bold"
                  : "text-gray-800 font-semibold"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              Contact
            </Link>
            <span
              className={`block h-0.5 bg-red-500 mt-1 transition-all ${
                isActive("/Contact") ? "w-full" : "w-0"
              }`}
            />
          </li>

          {/* Desktop cart placed to the right of Contact (visible md+) */}
          <li className="hidden md:block">
            <Link
              href="/cart"
              className={`px-3 py-2 rounded-lg hover:bg-gray-100 block relative ${
                isActive("/cart")
                  ? "text-red-500 font-bold"
                  : "text-gray-800 font-semibold"
              }`}
              onClick={() => setMobileOpen(false)}
              aria-label="Cart"
            >
              <FiShoppingCart className="w-5 h-5" />
              {cartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems}
                </span>
              )}
            </Link>
            <span
              className={`block h-0.5 bg-red-500 mt-1 transition-all ${
                isActive("/cart") ? "w-full" : "w-0"
              }`}
            />
          </li>

          {/* Desktop: 'Me' dropdown only on md+ */}
          <li className="relative w-full md:w-auto hidden md:block" ref={meRef}>
            <button
              className="flex items-center gap-2 justify-between md:justify-start w-full md:w-auto px-3 py-2 rounded-lg text-gray-800 font-semibold hover:bg-gray-100"
              aria-label="Account"
              onClick={() => setMeOpen(!meOpen)}
            >
              {/* Profile icon (desktop) */}
              <FiUser className="w-5 h-5 " aria-hidden="true" />
              <span className="sr-only">Account</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-4 h-4 ml-1 transition-transform animate-bounce ${
                  meOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown menu (desktop only) */}
            {meOpen && (
              <ul className="absolute right-0 top-13 bg-white border border-gray-500  shadow-lg w-100 py-5 animate-fade-in">
                {!isAuthenticated ? (
                  <>
                    <li>
                      <button
                        className="w-full text-center block px-4 py-2 text-gray-800 hover:bg-gray-50"
                        onClick={() => {
                          setMeOpen(false);
                          setMobileOpen(false);
                          openAuth("register");
                        }}
                      >
                        Register
                      </button>
                    </li>
                    <li>
                      <button
                        className="w-full text-center block px-4 py-2 text-gray-800 hover:bg-gray-50"
                        onClick={() => {
                          setMeOpen(false);
                          setMobileOpen(false);
                          openAuth("login");
                        }}
                      >
                        Login
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        href="/Profile"
                        className="w-full text-center block px-4 py-2 text-gray-800 hover:bg-gray-50"
                        onClick={() => {
                          setMeOpen(false);
                          setMobileOpen(false);
                        }}
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        className="w-full text-center block px-4 py-2 text-gray-800 hover:bg-gray-50"
                        onClick={() => {
                          dispatch(logout());
                          setMeOpen(false);
                          toast.success("Logged out successfully");
                        }}
                      >
                        Logout
                      </button>
                    </li>
                  </>
                )}
                <li>
                  <Link
                    href="/Dashboard/Admin"
                    className="block px-4 py-2 border text-center rounded-3xl bg-red-400 text-white hover:bg-green-400"
                    onClick={() => {
                      setMeOpen(false);
                      setMobileOpen(false);
                    }}
                  >
                    Subscribe
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Mobile-only: replace dropdown with plain links inside mobile menu */}
          {!isAuthenticated ? (
            <>
              <li className="md:hidden">
                <button
                  className="px-3 py-2 rounded-lg text-gray-800 font-semibold hover:bg-gray-100 w-full block text-left"
                  onClick={() => {
                    setMobileOpen(false);
                    openAuth("register");
                  }}
                >
                  Register
                </button>
              </li>
              <li className="md:hidden">
                <button
                  className="px-3 py-2 rounded-lg text-gray-800 font-semibold hover:bg-gray-100 w-full block text-left"
                  onClick={() => {
                    setMobileOpen(false);
                    openAuth("login");
                  }}
                >
                  Login
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="md:hidden">
                <Link
                  href="/Profile"
                  className="px-3 py-2 rounded-lg text-gray-800 font-semibold hover:bg-gray-100 w-full block text-left"
                  onClick={() => setMobileOpen(false)}
                >
                  Profile
                </Link>
              </li>
              <li className="md:hidden">
                <button
                  className="px-3 py-2 rounded-lg text-gray-800 font-semibold hover:bg-gray-100 w-full block text-left"
                  onClick={() => {
                    dispatch(logout());
                    setMobileOpen(false);
                    toast.success("Logged out successfully");
                  }}
                >
                  Logout
                </button>
              </li>
            </>
          )}
          <li className="md:hidden">
            <Link
              href="/Menu"
              className="px-3 py-2 border rounded-3xl bg-red-400 text-white w-full block text-center hover:bg-green-400"
              onClick={() => setMobileOpen(false)}
            >
              Subscribe
            </Link>
          </li>
        </ul>

        {/* Overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </nav>
    </header>
  );
}
