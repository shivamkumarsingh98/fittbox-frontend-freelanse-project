"use client";

import { useEffect, useRef, useState } from "react";
import { FiUser, FiShoppingCart, FiLogOut } from "react-icons/fi";
import { MdOutlineShoppingBag } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { useModal } from "./ModalContext";
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

  const router = useRouter();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-lg shadow-md border-b border-gray-200 py-1"
          : "bg-white border-b border-gray-100 py-2"
      }`}
    >
      <Toaster position="top-right" reverseOrder={false} />
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
          onClick={() => setMobileOpen(false)}
        >
          <div className="group-hover:scale-105 transition-transform flex items-center h-10 md:h-12">
            <img
              src="/logo.png"
              alt="FittBox Logo"
              className="w-auto h-full object-contain scale-[2.5] ml-4 origin-left"
            />
          </div>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8">
          {[
            { name: "Home", path: "/" },
            { name: "Menu", path: "/Menu" },
            { name: "Nutrition", path: "/Nutrition" },
            { name: "Contact", path: "/Contact" },
          ].map((link) => (
            <li key={link.name}>
              <Link
                href={link.path}
                className={`relative py-2 text-[16px] font-extrabold transition-colors duration-200 ${
                  isActive(link.path)
                    ? "text-red-600"
                    : "text-gray-800 hover:text-red-500"
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute left-0 -bottom-1 w-full h-[3px] bg-red-600 rounded-full" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Cart */}
          <Link
            href="/cart"
            className="relative p-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all"
            aria-label="Cart"
          >
            <MdOutlineShoppingBag className="w-6 h-6" />
            {cartItems > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white transform translate-x-1/4 -translate-y-1/4">
                {cartItems}
              </span>
            )}
          </Link>

          {/* User Dropdown */}
          <div className="relative" ref={meRef}>
            <button
              className="flex items-center justify-center p-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all"
              aria-label="Account"
              onClick={() => setMeOpen(!meOpen)}
            >
              <FiUser className="w-6 h-6" />
            </button>

            {meOpen && (
              <ul className="absolute right-0 top-full mt-3 w-56 bg-white border border-gray-100 shadow-xl rounded-2xl py-3 animate-fade-in z-50 overflow-hidden ring-1 ring-black/5">
                {!isAuthenticated ? (
                  <>
                    <li className="px-3 pb-1">
                      <Link
                        href="/login"
                        className="w-full flex items-center justify-center px-4 py-2.5 bg-emerald-50 text-emerald-700 font-bold rounded-xl hover:bg-emerald-100 transition-colors"
                        onClick={() => setMeOpen(false)}
                      >
                        Login
                      </Link>
                    </li>
                    <li className="px-3 pt-1 border-b border-gray-50 pb-3 mb-2">
                      <Link
                        href="/register"
                        className="w-full flex items-center justify-center px-4 py-2.5 text-gray-600 font-semibold hover:text-emerald-600 rounded-xl hover:bg-gray-50 transition-colors"
                        onClick={() => setMeOpen(false)}
                      >
                        Register
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="px-2">
                      <Link
                        href="/Profile"
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 font-medium hover:text-emerald-600 rounded-xl hover:bg-gray-50 transition-colors"
                        onClick={() => setMeOpen(false)}
                      >
                        <FiUser className="w-4 h-4" />
                        Profile
                      </Link>
                    </li>
                    <li className="px-2 border-b border-gray-50 pb-2 mb-2">
                      <button
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 font-medium rounded-xl hover:bg-red-50 transition-colors"
                        onClick={() => {
                          dispatch(logout());
                          setMeOpen(false);
                          toast.success("Logged out successfully");
                        }}
                      >
                        <FiLogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </li>
                  </>
                )}
                <li className="px-3 pt-2">
                  <Link
                    href="/Menu"
                    className="flex justify-center px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-bold uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all"
                    onClick={() => setMeOpen(false)}
                  >
                    Subscribe
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-3">
          <Link
            href="/cart"
            className="relative p-2 text-gray-700 hover:text-emerald-600 transition"
            onClick={() => setMobileOpen(false)}
            aria-label="Cart"
          >
            <MdOutlineShoppingBag className="w-6 h-6" />
            {cartItems > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white transform translate-x-1/4 -translate-y-1/4">
                {cartItems}
              </span>
            )}
          </Link>

          <button
            className="p-2 text-gray-700 hover:text-emerald-600 focus:outline-none"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 flex flex-col items-end gap-1.5">
              <span
                className={`h-0.5 bg-current transition-all duration-300 ${
                  mobileOpen ? "w-6 rotate-45 translate-y-2" : "w-6"
                }`}
              />
              <span
                className={`h-0.5 bg-current transition-all duration-300 ${
                  mobileOpen ? "opacity-0" : "w-4"
                }`}
              />
              <span
                className={`h-0.5 bg-current transition-all duration-300 ${
                  mobileOpen ? "w-6 -rotate-45 -translate-y-2" : "w-5"
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl overflow-hidden animate-fade-in">
          <ul className="flex flex-col py-4 px-6 gap-2">
            {[
              { name: "Home", path: "/" },
              { name: "Menu", path: "/Menu" },
              { name: "Nutrition", path: "/Nutrition" },
              { name: "Contact", path: "/Contact" },
            ].map((link) => (
              <li key={link.name}>
                <Link
                  href={link.path}
                  className={`block px-4 py-3 rounded-xl font-semibold transition-colors ${
                    isActive(link.path)
                      ? "bg-emerald-50 text-emerald-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}

            <div className="h-px bg-gray-100 my-2"></div>

            {!isAuthenticated ? (
              <div className="flex gap-3 mt-2">
                <Link
                  href="/login"
                  className="flex-1 text-center py-3 rounded-xl font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex-1 text-center py-3 rounded-xl font-bold bg-gray-900 text-white hover:bg-gray-800 transition"
                  onClick={() => setMobileOpen(false)}
                >
                  Register
                </Link>
              </div>
            ) : (
              <>
                <li>
                  <Link
                    href="/Profile"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition"
                    onClick={() => setMobileOpen(false)}
                  >
                    <FiUser className="w-5 h-5" /> Profile
                  </Link>
                </li>
                <li>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-red-600 hover:bg-red-50 transition"
                    onClick={() => {
                      dispatch(logout());
                      setMobileOpen(false);
                      toast.success("Logged out successfully");
                    }}
                  >
                    <FiLogOut className="w-5 h-5" /> Logout
                  </button>
                </li>
              </>
            )}
            
            <li className="mt-4">
              <Link
                href="/Menu"
                className="block text-center py-3.5 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md transition"
                onClick={() => setMobileOpen(false)}
              >
                Subscribe Now
              </Link>
            </li>
          </ul>
        </div>
      )}
      
      {/* Backdrop for mobile menu */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 top-[72px] bg-black/20 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </header>
  );
}
