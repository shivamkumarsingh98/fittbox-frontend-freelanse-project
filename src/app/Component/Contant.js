"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { testimonials } from "../Data";
import { getAboutSection } from "../api/admin";

function Contant() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [aboutData, setAboutData] = useState(null);

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
        console.error("getAboutSection error:", err);
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
          className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4 md:mb-6 leading-tight px-4 transform transition-all duration-700 ease-out ${
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
      <div className="py-16 md:py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-12">
            About Us
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Image Section */}
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-yellow-400 border-dashed overflow-hidden bg-white p-4 shadow-lg animate-pulse">
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

            {/* Text Section */}
            <div className="w-full md:w-1/2">
              <div className="space-y-6">
                {aboutData ? (
                  // If API returned data, try to render it.
                  typeof aboutData === "string" ? (
                    <>
                      {aboutData.split("\n\n").map((para, idx) => (
                        <p
                          key={idx}
                          className="text-gray-700 text-base md:text-lg leading-relaxed"
                        >
                          {para}
                        </p>
                      ))}
                    </>
                  ) : Array.isArray(aboutData) ? (
                    aboutData.map((txt, i) => (
                      <p
                        key={i}
                        className="text-gray-700 text-base md:text-lg leading-relaxed"
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
                            className="text-gray-700 text-base md:text-lg leading-relaxed"
                          >
                            {para}
                          </p>
                        ))}
                    </>
                  ) : (
                    // Fallback: stringify small objects sensibly
                    <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                      {JSON.stringify(aboutData)}
                    </p>
                  )
                ) : (
                  // Existing static content as fallback
                  <>
                    <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                      At <span className="font-bold text-black">Fittbox</span>,
                      we believe good food should be both nourishing and
                      exciting. Born in the heart of India, our café is
                      dedicated to serving vibrant, handcrafted salads, protein
                      bowls, and smoothies made fresh every single day.
                    </p>

                    <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                      Whether you're walking in for a power-packed lunch or
                      subscribing to our weekly plans, every bowl reflects our
                      passion for clean ingredients, balanced meals, and
                      feel-good flavours. We're also available on{" "}
                      <span className="font-bold text-black">Swiggy</span>,{" "}
                      <span className="font-bold text-black">Zomato</span>, and{" "}
                      <span className="font-bold text-black">WhatsApp</span>,
                      making healthy eating effortless.
                    </p>

                    <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                      We're not just a salad café – we're a daily ritual for
                      those who choose freshness, simplicity, and real taste.
                    </p>

                    <div className="pt-4">
                      <button className="border-2 border-black bg-white text-black px-8 py-3 text-base md:text-lg font-semibold hover:bg-black hover:text-white transition-colors duration-300">
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
      <div className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <span className="inline-block bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-sm font-medium">
              Meal Plans
            </span>

            <h2 className="mt-6 text-4xl md:text-5xl font-serif font-extrabold text-black leading-tight">
              Diet Plans for Every Goal
            </h2>

            <p className="mt-4 text-gray-500 max-w-3xl mx-auto">
              Choose a plan that fits your lifestyle and let us handle the
              nutrition
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
            {/* Fat Loss Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 h-full flex flex-col">
              <div className="flex-1 flex flex-col items-center text-center">
                <div className="w-28 h-28 rounded-full overflow-hidden border-8 border-gray-100 bg-white mb-6 flex items-center justify-center">
                  <Image
                    src="/hero2.jpg"
                    alt="Fat Loss Meal"
                    width={140}
                    height={140}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                <h3 className="text-lg font-semibold text-black mb-2">
                  Fat Loss
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Ready to transform your body? Our macro-specific meals help
                  you shed unwanted pounds while staying energized.
                </p>

                <div className="mt-auto w-full">
                  <button className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full font-semibold hover:bg-emerald-600 transition">
                    Get Started
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Muscle Building Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 h-full flex flex-col">
              <div className="flex-1 flex flex-col items-center text-center">
                <div className="w-28 h-28 rounded-full overflow-hidden border-8 border-gray-100 bg-white mb-6 flex items-center justify-center">
                  <Image
                    src="/hero3.jpg"
                    alt="Muscle Building Meal"
                    width={140}
                    height={140}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                <h3 className="text-lg font-semibold text-black mb-2">
                  Muscle Building
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Bulk up with high-protein, fiber-rich meals perfect for
                  post-workout recovery.
                </p>

                <div className="mt-auto w-full">
                  <button className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full font-semibold hover:bg-emerald-600 transition">
                    Get Started
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Balanced Nourishment Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 h-full flex flex-col">
              <div className="flex-1 flex flex-col items-center text-center">
                <div className="w-28 h-28 rounded-full overflow-hidden border-8 border-gray-100 bg-white mb-6 flex items-center justify-center">
                  <Image
                    src="/hero4.jpg"
                    alt="Balanced Nourishment Meal"
                    width={140}
                    height={140}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                <h3 className="text-lg font-semibold text-black mb-2">
                  Balanced Nourishment
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Maintain a healthy lifestyle with our macro-balanced meals —
                  delicious, convenient, delivered daily.
                </p>

                <div className="mt-auto w-full">
                  <button className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full font-semibold hover:bg-emerald-600 transition">
                    Get Started
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Custom Diet Plan Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 h-full flex flex-col">
              <div className="flex-1 flex flex-col items-center text-center">
                <div className="w-28 h-28 rounded-full overflow-hidden border-8 border-gray-100 bg-white mb-6 flex items-center justify-center">
                  <Image
                    src="/hero5.jpg"
                    alt="Custom Diet Plan"
                    width={140}
                    height={140}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                <h3 className="text-lg font-semibold text-black mb-2">
                  Custom Diet Plan
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Bring your nutritionist's chart to us, and our chefs will
                  create a personalized meal plan for you.
                </p>

                <div className="mt-auto w-full">
                  <button className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full font-semibold hover:bg-emerald-600 transition">
                    Get Started
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
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
      <section className="py-16 md:py-20 px-4 bg-white overflow-hidden">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <span className="inline-block bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-sm font-medium">
            Testimonials
          </span>

          <h2 className="mt-6 text-4xl md:text-6xl font-serif font-extrabold text-black leading-tight">
            What Our Customers Say
          </h2>

          <p className="mt-4 text-gray-500 max-w-3xl mx-auto">
            Join thousands of happy customers who've made Fittbox their daily
            health partner
          </p>
        </div>

        {/* Infinite Scroll Container */}
        <div className="relative w-full overflow-hidden">
          <div
            id="scroll-track"
            className="inline-flex hover:pause-animation py-6"
          >
            {[...testimonials, ...testimonials].map((item, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 mx-3 w-80 flex-shrink-0 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center mb-3">
                    {/* <Image
                      src={item.image}
                      alt={item.name}
                      width={56}
                      height={56}
                      className="w-14 h-14 rounded-full object-cover"
                    /> */}
                    <div className=" text-left">
                      <h4 className="font-semibold text-gray-900 text-lg">
                        {item.name}
                      </h4>
                      <p className="text-yellow-500 text-sm mt-1">
                        {item.rating}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    "{item.text}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <div className="py-16 md:py-20 px-4 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Healthy Journey?
          </h2>
          <p className="text-lg md:text-xl mb-8 text-gray-300">
            Join thousands of satisfied customers who have transformed their
            eating habits with Fitbos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-black px-8 py-4 text-lg font-semibold hover:bg-gray-100 transition-colors duration-300">
              Order Now
            </button>
            <button className="border-2 border-white text-white px-8 py-4 text-lg font-semibold hover:bg-white hover:text-black transition-colors duration-300">
              View Menu
            </button>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default Contant;
