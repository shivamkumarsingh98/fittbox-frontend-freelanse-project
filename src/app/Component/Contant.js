import React from "react";
import Image from "next/image";

function Contant() {
  return (
    <div className="w-full bg-white">
      {/* Top Section - Heading and Subheading */}
      <div className="text-center py-12 px-4 md:py-16">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4 md:mb-6 leading-tight px-4">
          From Salads, High Protein bowl, Acai bowls To Smoothies...
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-black max-w-4xl mx-auto px-4">
          Fresh, zesty, and bursting with crunch—our sprout salad is a flavor
          explosion in every bite!
        </p>
      </div>

      {/* Food Categories Section */}
      <div className="relative max-w-6xl mx-auto px-4">
        {/* Black Background Section */}
        <div className="relative mt-[-40px] px-6 py-12 md:px-12 md:py-16 overflow-hidden">
          {/* Tilted black background */}
          <div className="absolute inset-0 bg-black rounded-[2rem] transform -skew-y-3 origin-top-left"></div>

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
                    className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
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
                <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                  At <span className="font-bold text-black">Fitbos</span>, we
                  believe good food should be both nourishing and exciting. Born
                  in the heart of India, our café is dedicated to serving
                  vibrant, handcrafted salads, protein bowls, and smoothies made
                  fresh every single day.
                </p>

                <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                  Whether you're walking in for a power-packed lunch or
                  subscribing to our weekly plans, every bowl reflects our
                  passion for clean ingredients, balanced meals, and feel-good
                  flavours. We're also available on{" "}
                  <span className="font-bold text-black">Swiggy</span>,{" "}
                  <span className="font-bold text-black">Zomato</span>, and{" "}
                  <span className="font-bold text-black">WhatsApp</span>, making
                  healthy eating effortless.
                </p>

                <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                  We're not just a salad café – we're a daily ritual for those
                  who choose freshness, simplicity, and real taste.
                </p>

                <div className="pt-4">
                  <button className="border-2 border-black bg-white text-black px-8 py-3 text-base md:text-lg font-semibold hover:bg-black hover:text-white transition-colors duration-300">
                    READ MORE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Diet Meal Plans Section */}
      <div className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-black mb-20">
            Dite Meal Plans
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Fat Loss Card */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative group">
              <div className="text-center">
                <div className="relative mb-8">
                  <div className="w-44 h-44 mx-auto rounded-full overflow-hidden bg-white shadow-md group cursor-pointer relative">
                    <Image
                      src="/hero2.jpg"
                      alt="Fat Loss Meal"
                      width={176}
                      height={176}
                      className="w-full h-full object-cover rounded-full group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 ease-in-out"
                    />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-black mb-4">Fat Loss</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-8">
                  Ready to transform your body and achieve your weight goals?
                  Our specially curated, macro specific meals are exactly what
                  you need to shed those unwanted pounds.
                </p>

                <button className="w-full bg-green-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-green-600 hover:scale-105 transition-all duration-300 shadow-md">
                  GET STARTED
                </button>
              </div>
            </div>

            {/* Muscle Building Card */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative group">
              <div className="text-center">
                <div className="relative mb-8">
                  <div className="w-44 h-44 mx-auto rounded-full overflow-hidden bg-white shadow-md group cursor-pointer relative">
                    <Image
                      src="/hero3.jpg"
                      alt="Muscle Building Meal"
                      width={176}
                      height={176}
                      className="w-full h-full object-cover rounded-full group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 ease-in-out"
                    />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-black mb-4">
                  Muscle Building
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-8">
                  Ready to bulk up and show off those gains? Our specially
                  curated meals have got you covered. A high-protein and
                  fiber-rich meal is all you need after a pumped workout.
                </p>

                <button className="w-full bg-green-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-green-600 hover:scale-105 transition-all duration-300 shadow-md">
                  GET STARTED
                </button>
              </div>
            </div>

            {/* Balanced Nourishment Card */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative group">
              <div className="text-center">
                <div className="relative mb-8">
                  <div className="w-44 h-44 mx-auto rounded-full overflow-hidden bg-white shadow-md group cursor-pointer relative">
                    <Image
                      src="/hero4.jpg"
                      alt="Balanced Nourishment Meal"
                      width={176}
                      height={176}
                      className="w-full h-full object-cover rounded-full group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 ease-in-out"
                    />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-black mb-4">
                  Balanced Nourishment
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-8">
                  Looking to nourish your body and maintain a healthy diet? Our
                  macro-balanced meal has got you covered. Delicious, convenient
                  meals delivered to you every day.
                </p>

                <button className="w-full bg-green-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-green-600 hover:scale-105 transition-all duration-300 shadow-md">
                  GET STARTED
                </button>
              </div>
            </div>

            {/* Bring Your Own Chart Card */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative group">
              <div className="text-center">
                <div className="relative mb-8">
                  <div className="w-44 h-44 mx-auto rounded-full overflow-hidden bg-white shadow-md group cursor-pointer relative">
                    <Image
                      src="/hero5.jpg"
                      alt="Bring Your Own Chart"
                      width={176}
                      height={176}
                      className="w-full h-full object-cover rounded-full group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 ease-in-out"
                    />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-black mb-4">
                  Bring Your Own Chart
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-8">
                  Finding it challenging to stick to your nutritionist's or
                  trainer's recommended meal? Bring your chart to us, and our
                  team of chefs will take care of the rest.
                </p>

                <button className="w-full bg-green-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-green-600 hover:scale-105 transition-all duration-300 shadow-md">
                  GET STARTED
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 md:py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-12">
            Why Choose Fitbos?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Fresh Ingredients</h3>
              <p className="text-gray-600">
                We use only the freshest, locally sourced ingredients for all
                our meals.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Quick Delivery</h3>
              <p className="text-gray-600">
                Get your healthy meals delivered fresh to your doorstep within
                30 minutes.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">💪</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Nutrition Focused</h3>
              <p className="text-gray-600">
                Every meal is carefully crafted to provide optimal nutrition and
                taste.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-12">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg border">
              <div className="flex items-center mb-4">
                <Image
                  src="/hero6.jpg"
                  alt="Customer"
                  width={50}
                  height={50}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-3">
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-gray-500 text-sm">⭐⭐⭐⭐⭐</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Amazing fresh salads! The quality is outstanding and delivery
                is always on time."
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg border">
              <div className="flex items-center mb-4">
                <Image
                  src="/hero7.jpg"
                  alt="Customer"
                  width={50}
                  height={50}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-3">
                  <h4 className="font-semibold">Mike Chen</h4>
                  <p className="text-gray-500 text-sm">⭐⭐⭐⭐⭐</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Perfect for my fitness goals. High protein bowls are exactly
                what I needed!"
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg border">
              <div className="flex items-center mb-4">
                <Image
                  src="/hero8.jpg"
                  alt="Customer"
                  width={50}
                  height={50}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-3">
                  <h4 className="font-semibold">Emma Davis</h4>
                  <p className="text-gray-500 text-sm">⭐⭐⭐⭐⭐</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Love the variety! Acai bowls and smoothies are my daily
                breakfast now."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 md:py-20 px-4 bg-black text-white">
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
      </div>
    </div>
  );
}

export default Contant;
