"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <nav className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => setMobileOpen(false)}
        >
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-pink-600 shadow-md"></span>
          <span className="text-xl font-bold text-gray-900">FittBox</span>
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
              className="px-3 py-2 rounded-lg text-gray-800 font-semibold hover:bg-gray-100 w-full block"
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/Menu"
              className="px-3 py-2 rounded-lg text-gray-800 font-semibold hover:bg-gray-100 w-full block"
              onClick={() => setMobileOpen(false)}
            >
              Menu
            </Link>
          </li>
          <li>
            <Link
              href="/nutrition"
              className="px-3 py-2 rounded-lg text-gray-800 font-semibold hover:bg-gray-100 w-full block"
              onClick={() => setMobileOpen(false)}
            >
              Nutrition
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="px-3 py-2 rounded-lg text-gray-800 font-semibold hover:bg-gray-100 w-full block"
              onClick={() => setMobileOpen(false)}
            >
              Contact
            </Link>
          </li>

          {/* Me dropdown */}
          <li className="relative w-full md:w-auto" ref={meRef}>
            <button
              className="flex items-center justify-between md:justify-start w-full md:w-auto px-3 py-2 rounded-lg text-gray-800 font-semibold hover:bg-gray-100"
              onClick={() => setMeOpen(!meOpen)}
            >
              Me
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-4 h-4 ml-1 transition-transform ${
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

            {/* Dropdown menu */}
            {meOpen && (
              <ul className="absolute md:right-0 top-10 bg-white border border-gray-100 rounded-lg shadow-lg w-40 py-2 animate-fade-in">
                <li>
                  <Link
                    href="/login"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-50"
                    onClick={() => {
                      setMeOpen(false);
                      setMobileOpen(false);
                    }}
                  >
                    Login
                  </Link>
                </li>
              </ul>
            )}
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
