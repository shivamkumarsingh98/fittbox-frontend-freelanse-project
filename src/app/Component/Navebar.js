"use client";

import { useEffect, useRef, useState } from "react";
import { FiUser, FiShoppingCart } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { useModal } from "./ModalContext";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [meOpen, setMeOpen] = useState(false);
  const meRef = useRef(null);
  const pathname = usePathname();
  const cartItems = useSelector((state) => state.cart.totalQuantity);

  // helper to determine active link (case-insensitive)
  const isActive = (href) => {
    if (!pathname) return false;
    try {
      return pathname.toLowerCase() === href.toLowerCase();
    } catch (e) {
      return false;
    }
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

  function openAuth(type) {
    modal.openModal(
      <div className="w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          {type === "register" ? "Create an account" : "Welcome back"}
        </h2>

        {type === "register" ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // TODO: wire registration API
              modal.closeModal();
            }}
            className="space-y-3"
          >
            <div>
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                required
                name="name"
                className="w-full border-none bg-gray-200 px-3 py-2 rounded mt-1"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Mobile number
              </label>
              <input
                required
                name="mobile"
                type="tel"
                className="w-full border-none bg-gray-200 px-3 py-2 rounded mt-1"
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                required
                name="location"
                className="w-full border-none bg-gray-200 px-3 py-2 rounded mt-1"
                placeholder="City, State"
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
                className="w-full border-none bg-gray-200 px-3 py-2 rounded mt-1"
                placeholder="Create a password"
              />
            </div>

            <div className="flex items-center justify-end gap-2 ">
              <button
                type="submit"
                className="px-7 py-3 bg-red-400 text-white rounded text-sm font-medium hover:bg-green-700"
              >
                Sign up
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
              <span className="text-sm"></span>
            </button>
          </form>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // TODO: wire login API
              modal.closeModal();
            }}
            className="space-y-3"
          >
            <div>
              <label className="text-sm font-medium text-gray-700">
                Mobile number
              </label>
              <input
                required
                name="mobile"
                type="tel"
                className="w-full border-none bg-gray-200 px-3 py-2 rounded mt-1"
                placeholder="+91 98765 43200"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <a href="#" className="text-sm text-red-400 hover:underline">
                  Forgot password?
                </a>
              </div>
              <input
                required
                name="password"
                type="password"
                className="w-full border-none bg-gray-200  px-3 py-2 rounded mt-1"
                placeholder="Your password"
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-red-400 text-white rounded text-sm font-medium hover:bg-green-700"
              >
                Sign in
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
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
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
              Meal Plans
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
              <ul className="absolute right-0 top-13 rounded-2xl bg-white border border-gray-200  shadow-xl w-50 py-5 animate-fade-in">
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
                <li>
                  <Link
                    href="/Menu"
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
