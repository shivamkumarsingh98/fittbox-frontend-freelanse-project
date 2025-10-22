"use client";

import { useEffect, useRef, useState } from "react";
import { FiUser } from "react-icons/fi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useModal } from "./ModalContext";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [meOpen, setMeOpen] = useState(false);
  const meRef = useRef(null);
  const pathname = usePathname();

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
      <div>
        <h2 className="text-xl font-semibold mb-3">
          {type === "register" ? "Register" : "Login"}
        </h2>
        <form className="space-y-3">
          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Email"
          />
          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Password"
            type="password"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded bg-green-500 text-white"
              onClick={() => modal.closeModal()}
            >
              {type === "register" ? "Create account" : "Sign in"}
            </button>
          </div>
        </form>
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

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col justify-center space-y-1.5 focus:outline-none"
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
              className="px-3 py-2 rounded-lg text-gray-800 font-bold hover:bg-gray-100 w-full block"
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/Menu"
              className="px-3 py-2 rounded-lg text-gray-800 font-bold hover:bg-gray-100 w-full block"
              onClick={() => setMobileOpen(false)}
            >
              Menu
            </Link>
          </li>
          <li>
            <Link
              href="/Nutrition"
              className="px-3 py-2 rounded-lg text-gray-800 font-semibold hover:bg-gray-100 w-full block"
              onClick={() => setMobileOpen(false)}
            >
              Nutrition
            </Link>
          </li>
          <li>
            <Link
              href="/Contact"
              className="px-3 py-2 rounded-lg text-gray-800 font-semibold hover:bg-gray-100 w-full block"
              onClick={() => setMobileOpen(false)}
            >
              Contact
            </Link>
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
