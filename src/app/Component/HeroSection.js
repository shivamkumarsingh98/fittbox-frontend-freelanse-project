import React from "react";
import Image from "next/image";
import Link from "next/link";

function HeroSection() {
  return (
    <div className="w-full h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="/hero4.jpg"
        alt="Healthy Salad Background"
        fill
        className="object-cover"
        priority
        unoptimized
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30 z-10"></div>

      {/* Text Content */}
      <div className="absolute top-[20%] sm:top-[25%] left-[5%] sm:left-[8%] text-white z-20 max-w-[90%] sm:max-w-[80%] md:max-w-[70%]">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold drop-shadow-lg leading-tight mb-4">
          FittBox Diet Food
        </h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 drop-shadow-md leading-relaxed">
          Fresh, healthy, and delicious meals delivered to your doorstep
        </p>
        <div className="mt-6 sm:mt-8">
          <button className="bg-white text-black px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300 mr-4">
            Order Now
          </button>
          <Link href="/Menu">
            <button className="border-2 border-white text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-semibold rounded-lg hover:bg-white hover:text-black transition-colors duration-300">
              View Menu
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
