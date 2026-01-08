"use client";
import { useEffect, useState } from "react";
import { Button } from "../Component/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImage from "../../../public/download.jpeg";
import { getAboutSection } from "../api/admin";
import Link from "next/link";

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const parallaxOffset = scrollY * 0.5;

  const [headerImageUrl, setHeaderImageUrl] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchHeaderImage() {
      try {
        const res = await getAboutSection();
        // console.log("getAboutSection (hero) response:", res);
        if (!mounted) return;

        // response shape: { success: true, data: { headerImage: 'url', about: '...' } }
        const header =
          res && typeof res === "object"
            ? res.data?.headerImage ?? res.headerImage
            : null;
        if (header) setHeaderImageUrl(header);
      } catch (err) {
        // keep default image if API fails
        // eslint-disable-next-line no-console
        console.error("getAboutSection (hero) error:", err);
      }
    }

    fetchHeaderImage();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Parallax Image */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          transform: `translateY(${parallaxOffset}px)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        <img
          src={headerImageUrl || heroImage.src}
          alt="Fresh healthy meals"
          className="w-full h-full object-cover scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl w-full">
          {/* Badge */}
          <div
            className={`flex justify-center mb-6 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="glass-effect px-4 py-2 rounded-full flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium text-white">
                Fuel your life Style
              </span>
            </div>
          </div>

          {/* Main Title */}
          <h1
            className={`text-center transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4 drop-shadow-2xl">
              FittBox Balanced Meal
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className={`text-center text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 drop-shadow-lg transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            Fresh, nutritious, and delicious meals crafted by expert chefs &
            nutrionist. Directly delivered to your doorstep
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "800ms" }}
          >
            <Link href="/Menu">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 group"
              >
                Order Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link href="/Menu">
              <Button
                size="lg"
                variant="outline"
                className="glass-effect border-2 border-white text-white px-8 py-6 text-lg font-semibold rounded-xl hover:bg-white hover:text-foreground transition-all duration-300 hover:scale-105"
              >
                View Menu
              </Button>
            </Link>
          </div>

          {/* Stats */}
          {/* <div
            className={`mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "1000ms" }}
          >
            {[
              { number: "500+", label: "Healthy Recipes" },
              { number: "10k+", label: "Happy Customers" },
              { number: "100%", label: "Organic Ingredients" },
            ].map((stat, index) => (
              <div
                key={index}
                className="glass-effect p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-300"
              >
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-sm sm:text-base text-white/80">
                  {stat.label}
                </div>
              </div>
            ))}
          </div> */}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: "1200ms" }}
      >
        <div className="flex flex-col items-center gap-2 animate-bounce">
          {/* <span className="text-white/70 text-sm">Scroll to explore</span> */}
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/70 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
