"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { testimonials } from "../Data";
import { getAboutSection, createMessage } from "../api/admin";
import { useModal } from "./ModalContext";
import toast from "react-hot-toast";

// Jane Plan style custom diet inquiry modal
function CustomDietModal() {
  const modal = useModal();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    inquiry: "general",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      await createMessage({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        inquiry: form.inquiry,
      });
      toast.success("Your inquiry has been submitted! Our nutritionist will contact you shortly.");
      modal.closeModal();
    } catch (err) {
      toast.error(err?.message || "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-slate-100 max-h-[90vh] md:max-h-[85vh] overflow-y-auto">
      {/* Left Column: Promo Banner */}
      <div className="md:w-1/2 bg-gradient-to-br from-emerald-600 to-green-700 p-8 md:p-12 text-white flex flex-col justify-between relative min-h-[320px] md:min-h-none">
        {/* Background Decorative Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:18px_18px]"></div>
        
        <div className="relative z-10">
          {/* Badge */}
          <div className="inline-block bg-red-500 text-white text-xs font-black uppercase tracking-widest px-4.5 py-1.5 rounded-full shadow-md mb-6 animate-bounce">
            ★ CUSTOM DIET SPECIAL
          </div>
          
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-4">
            Unlock your custom plan!
          </h2>
          
          <p className="text-white/90 text-sm md:text-base mb-6 max-w-[35ch] leading-relaxed">
            Bring your nutritionist's chart or let our specialists design the perfect transformation plan.
          </p>

          {/* Bullet points */}
          <ul className="space-y-3.5 text-sm font-semibold">
            <li className="flex items-center gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold shadow-sm">✓</span>
              Lose weight & gain energy naturally
            </li>
            <li className="flex items-center gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold shadow-sm">✓</span>
              100% personalized meal selection
            </li>
            <li className="flex items-center gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold shadow-sm">✓</span>
              Direct nutritionist advice & follow-ups
            </li>
          </ul>
        </div>

        <div className="relative z-10 text-xs text-white/50 mt-10">
          © FittBox Nutrition Services. Get fit the right way.
        </div>
      </div>

      {/* Right Column: Inquiry Form */}
      <div className="md:w-1/2 p-8 md:p-12 relative flex flex-col justify-center bg-[#f8fafc]">
        {/* Close Button */}
        <button
          onClick={modal.closeModal}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 text-xl font-bold bg-slate-200/50 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition"
        >
          ✕
        </button>

        <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-6">
          Personalized Diet Consultation
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition font-medium"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="9876543210"
                required
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition font-medium"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Inquiry Type</label>
              <select
                name="inquiry"
                value={form.inquiry}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition font-medium"
              >
                <option value="general">General Inquiry</option>
                <option value="nutrition">Nutrition Consultation</option>
                <option value="billing">Billing Support</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Your Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us about your fitness targets, food choices or nutritionist instructions..."
              rows={3}
              required
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition resize-none font-medium"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-5 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white rounded-xl font-extrabold text-sm tracking-wider uppercase transition shadow-md disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Contant() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [aboutData, setAboutData] = useState(null);
  const modal = useModal();

  const handleOpenCustomDietModal = () => {
    modal.openModal(<CustomDietModal />, "max-w-3xl w-[96%] p-0 max-h-[90vh]");
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    async function fetchAbout() {
      try {
        const res = await getAboutSection();
        if (!mounted) return;

        // Prefer only the `about` field from the API response: res.data.about
        const aboutFromResponse =
          (res && typeof res === "object" && res.data && res.data.about) ||
          (res && typeof res === "object" && res.about) ||
          (typeof res === "string" ? res : null);

        if (aboutFromResponse) {
          setAboutData(aboutFromResponse);
        }
      } catch (err) {
        // If API fails, keep aboutData null so UI falls back to existing text
        // eslint-disable-next-line no-console
        // console.error("getAboutSection error:", err);
      }
    }

    fetchAbout();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="w-full bg-white">
      {/* Top Section - Heading and Subheading */}
      <div className="text-center py-12 px-4 md:py-16">
        <h1
          ref={sectionRef}
          className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-black mb-4 md:mb-6 leading-tight px-4 transform transition-all duration-700 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          High Protein bowl
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-black max-w-4xl mx-auto px-4">
          Fresh, zesty, and bursting with crunch—our sprout salad is a flavor
          explosion in every bite!
        </p>
      </div>

      {/* Food Categories Section */}
      <div className="relative max-w-5xl mx-auto px-4">
        {/* Black Background Section */}
        <div className="relative mt-[-40px] px-6 py-12 md:px-12 md:py-16 overflow-hidden">
          {/* Tilted black background */}
          <div className="absolute inset-0 bg-black rounded-[2rem] transform -skew-y-4 origin-top-right"></div>

          {/* Food Category Cards */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 md:gap-14 justify-items-center">
            {[
              { src: "/hero2.jpg", label: "Salads" },
              { src: "/hero3.jpg", label: "Acai bowls" },
              { src: "/hero4.jpg", label: "High Protein Bowl" },
              { src: "/hero5.jpg", label: "Smoothie Bowl" },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center group">
                {/* Image Circle */}
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-yellow-400 bg-white">
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-yellow-400 rotate-12 group-hover:rotate-0 transition-all duration-300"></div>
                  <img
                    src={item.src}
                    alt={item.label}
                    className="w-full hover:animate-spin h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Label */}
                <p className="mt-4 text-white text-base md:text-lg font-semibold text-center group-hover:text-yellow-400 transition-colors duration-300">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Menu Button */}
      <div className="text-center mt-8 md:mt-12 px-4">
        <button className="border-2 border-black bg-white text-black px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold hover:bg-black hover:text-white transition-colors duration-300">
          WEEKLY MENU
        </button>
      </div>
      {/* About Section */}
      <div className="relative w-full bg-[#008751] py-28 overflow-visible mt-28 mb-16">
        {/* Top Wave SVG Path */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform translate-y-[-99%] z-10">
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="relative block w-full h-[90px] text-[#008751] fill-current"
          >
            <path d="M0,60 C320,130 720,-10 1080,60 C1260,95 1380,85 1440,60 L1440,120 L0,120 Z"></path>
          </svg>
        </div>

        {/* Bottom Wave SVG Path */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform translate-y-[99%] z-10">
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="relative block w-full h-[90px] text-[#008751] fill-current rotate-180"
          >
            <path d="M0,60 C320,130 720,-10 1080,60 C1260,95 1380,85 1440,60 L1440,120 L0,120 Z"></path>
          </svg>
        </div>

        {/* Red Decorative Dot (Left Side) */}
        <div className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-red-500 border-2 border-white/50 shadow-md hidden lg:block animate-pulse"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <h2 className="text-3xl md:text-5xl font-extrabold text-center text-white mb-16 tracking-tight">
            About Us
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
            {/* Image Section */}
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-yellow-400 border-dashed overflow-hidden bg-white p-4 shadow-2xl animate-pulse">
                  <Image
                    src="https://meandsalads.in/wp-content/uploads/2025/07/salad-web.webp"
                    alt="About Us - Fresh Salads"
                    width={320}
                    height={320}
                    className="w-full h-full object-cover rounded-full"
                    unoptimized
                  />
                </div>
                {/* Subtle shake animation */}
                <div
                  className="absolute inset-0 rounded-full border-4 border-yellow-400 border-dashed animate-bounce"
                  style={{
                    animationDuration: "3s",
                    animationIterationCount: "infinite",
                  }}
                ></div>
              </div>
            </div>

            {/* Text Section (Upgraded contrast for green bg) */}
            <div className="w-full md:w-1/2 text-white">
              <div className="space-y-6">
                {aboutData ? (
                  // If API returned data, try to render it.
                  typeof aboutData === "string" ? (
                    <>
                      {aboutData.split("\n\n").map((para, idx) => (
                        <p
                          key={idx}
                          className="text-emerald-50/95 text-base md:text-lg leading-relaxed font-medium"
                        >
                          {para}
                        </p>
                      ))}
                    </>
                  ) : Array.isArray(aboutData) ? (
                    aboutData.map((txt, i) => (
                      <p
                        key={i}
                        className="text-emerald-50/95 text-base md:text-lg leading-relaxed font-medium"
                      >
                        {txt}
                      </p>
                    ))
                  ) : typeof aboutData === "object" &&
                    (aboutData.content ||
                      aboutData.description ||
                      aboutData.text ||
                      aboutData.body) ? (
                    // render common object fields
                    <>
                      {(
                        (aboutData.content ??
                          aboutData.description ??
                          aboutData.text ??
                          aboutData.body) ||
                        ""
                      )
                        .toString()
                        .split("\n\n")
                        .map((para, idx) => (
                          <p
                            key={idx}
                            className="text-emerald-50/95 text-base md:text-lg leading-relaxed font-medium"
                          >
                            {para}
                          </p>
                        ))}
                    </>
                  ) : (
                    // Fallback: stringify small objects sensibly
                    <p className="text-emerald-50/95 text-base md:text-lg leading-relaxed font-medium">
                      {JSON.stringify(aboutData)}
                    </p>
                  )
                ) : (
                  // Existing static content as fallback
                  <>
                    <p className="text-emerald-50/95 text-base md:text-lg leading-relaxed font-medium">
                      At <span className="font-extrabold text-white">Fittbox</span>,
                      we believe good food should be both nourishing and
                      exciting. Born in the heart of India, our café is
                      dedicated to serving vibrant, handcrafted salads, protein
                      bowls, and smoothies made fresh every single day.
                    </p>

                    <p className="text-emerald-50/95 text-base md:text-lg leading-relaxed font-medium">
                      Whether you're walking in for a power-packed lunch or
                      subscribing to our weekly plans, every bowl reflects our
                      passion for clean ingredients, balanced meals, and
                      feel-good flavours. We're also available on{" "}
                      <span className="font-extrabold text-white">Swiggy</span>,{" "}
                      <span className="font-extrabold text-white">Zomato</span>, and{" "}
                      <span className="font-extrabold text-white">WhatsApp</span>,
                      making healthy eating effortless.
                    </p>

                    <p className="text-emerald-50/95 text-base md:text-lg leading-relaxed font-medium">
                      We're not just a salad café – we're a daily ritual for
                      those who choose freshness, simplicity, and real taste.
                    </p>

                    <div className="pt-4">
                      <button className="border-2 border-white bg-white text-[#008751] px-8 py-3 text-base md:text-lg font-bold rounded-xl hover:bg-transparent hover:text-white transition duration-300 shadow-md">
                        READ MORE
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {/* <div className="py-16 md:py-20 px-4  text-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Healthy Journey?
          </h2>
          <image
            src="/fittbox2.png"
            alt="Fitbos Logo"
            width={200}
            height={50}
            className="text-lg md:text-xl mb-8 text-gray-300"
          />
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-black px-8 py-4 text-lg font-semibold hover:bg-gray-100 transition-colors duration-300">
              Order Now
            </button>
            <button className="border-2 border-white text-black px-8 py-4 text-lg font-semibold hover:bg-white hover:text-black transition-colors duration-300">
              View Menu
            </button>
          </div>
        </div>
      </div> */}

      {/* Diet Meal Plans Section */}
      <div className="py-20 px-4 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <span className="inline-block bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-sm font-semibold tracking-wide">
              Meal Plans
            </span>

            <h2 className="mt-4 text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
              Diet Plans for Every Goal
            </h2>

            <p className="mt-4 text-slate-500 max-w-2xl mx-auto text-base">
              Choose a plan that fits your lifestyle and let us handle the nutrition. Delicious, chef-prepared meals delivered fresh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
            {/* Fat Loss Card */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-100/80 h-full flex flex-col group">
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src="/hero2.jpg"
                  alt="Fat Loss Meal"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col items-center text-center">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Fat Loss
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  Ready to transform your body? Our macro-specific meals help
                  you shed unwanted pounds while staying energized.
                </p>

                <div className="mt-auto w-full pt-2">
                  <Link
                    href="/plans/fat-loss"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full font-black uppercase tracking-wider shadow-md hover:shadow-emerald-500/30 hover:scale-[1.04] hover:shadow-lg active:scale-95 transition-all duration-300 text-xs"
                  >
                    Get Started
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Muscle Building Card */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-100/80 h-full flex flex-col group">
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src="/hero3.jpg"
                  alt="Muscle Building Meal"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col items-center text-center">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Muscle Building
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  Bulk up with high-protein, fiber-rich meals perfect for
                  post-workout recovery.
                </p>

                <div className="mt-auto w-full pt-2">
                  <Link
                    href="/plans/muscle-building"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full font-black uppercase tracking-wider shadow-md hover:shadow-emerald-500/30 hover:scale-[1.04] hover:shadow-lg active:scale-95 transition-all duration-300 text-xs"
                  >
                    Get Started
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Balanced Nourishment Card */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-100/80 h-full flex flex-col group">
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src="/hero4.jpg"
                  alt="Balanced Nourishment Meal"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col items-center text-center">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Balanced Nourishment
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  Maintain a healthy lifestyle with our macro-balanced meals —
                  delicious, convenient, delivered daily.
                </p>

                <div className="mt-auto w-full pt-2">
                  <Link
                    href="/plans/balanced-nourishment"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full font-black uppercase tracking-wider shadow-md hover:shadow-emerald-500/30 hover:scale-[1.04] hover:shadow-lg active:scale-95 transition-all duration-300 text-xs"
                  >
                    Get Started
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Custom Diet Plan Card */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-100/80 h-full flex flex-col group">
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src="/hero5.jpg"
                  alt="Custom Diet Plan"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col items-center text-center">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Custom Diet Plan
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  Bring your nutritionist's chart to us, and our chefs will
                  create a personalized meal plan for you.
                </p>

                <div className="mt-auto w-full pt-2">
                  <button
                    onClick={handleOpenCustomDietModal}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full font-black uppercase tracking-wider shadow-md hover:shadow-emerald-500/30 hover:scale-[1.04] hover:shadow-lg active:scale-95 transition-all cursor-pointer text-xs"
                  >
                    Get Started
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-white overflow-hidden">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <span className="inline-block bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-sm font-semibold tracking-wide">
            Testimonials
          </span>

          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
            What Our Customers Say
          </h2>

          <p className="mt-4 text-slate-500 max-w-2xl mx-auto">
            Join thousands of happy customers who've made Fittbox their daily health partner
          </p>
        </div>

        {/* Infinite Scroll Container */}
        <div className="relative w-full overflow-hidden">
          <div
            id="scroll-track"
            className="inline-flex hover:pause-animation py-4"
          >
            {[...testimonials, ...testimonials].map((item, index) => {
              const firstLetter = item.name ? item.name.charAt(0).toUpperCase() : "U";
              return (
                <div
                  key={index}
                  className="bg-white border border-slate-100 shadow-sm hover:shadow-md rounded-2xl 
                             p-6 mx-3 w-80 h-56 flex-shrink-0 
                             flex flex-col justify-between transition-all"
                >
                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-between">
                    {/* Text with clamp */}
                    <p className="text-slate-700 text-base leading-relaxed line-clamp-3 italic mb-4 font-medium">
                      {item.text}
                    </p>

                    <div className="flex items-center">
                      {/* Avatar Circle */}
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-sm mr-3 shadow-inner">
                        {firstLetter}
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-slate-950 text-sm truncate w-48">
                          {item.name}
                        </h4>
                        <p className="text-yellow-500 text-xs mt-0.5">
                          {item.rating}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contant;
