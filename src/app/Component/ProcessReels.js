"use client";

import React, { useRef, useState } from "react";

const reelsData = [
  {
    id: 1,
    title: "Fresh Ingredient Selection",
    desc: "How we choose organic veggies and protein.",
    videoUrl: "/video1.mp4",
    tag: "GOALS",
    tagColor: "bg-purple-600",
    rotation: "-rotate-[3deg]",
  },
  {
    id: 2,
    title: "Hygiene & Kitchen Standards",
    desc: "Our chefs maintaining extreme safety rules.",
    videoUrl: "/video2.mp4",
    tag: "TASTE",
    tagColor: "bg-blue-600",
    rotation: "rotate-[2.5deg]",
  },
  {
    id: 3,
    title: "Precision Macro Portioning",
    desc: "Every meal weighed exactly to match your goals.",
    videoUrl: "/video3.mp4",
    tag: "TIME",
    tagColor: "bg-amber-500",
    rotation: "-rotate-[2deg]",
  },
  {
    id: 4,
    title: "Sleek Delivery Packaging",
    desc: "Leakproof hot-packing delivered straight to your door.",
    videoUrl: "/videos/process4.mp4",
    tag: "PREP",
    tagColor: "bg-red-600",
    rotation: "rotate-[3.5deg]",
  },
];

export default function ProcessReels() {
  const [playingId, setPlayingId] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = useRef({});

  const handlePlayToggle = (id) => {
    const video = videoRefs.current[id];
    if (!video) return;

    if (playingId === id) {
      video.pause();
      setPlayingId(null);
    } else {
      // Pause others
      Object.keys(videoRefs.current).forEach((key) => {
        if (Number(key) !== id && videoRefs.current[key]) {
          videoRefs.current[key].pause();
        }
      });
      video.play().catch((err) => console.log("Auto-play blocked:", err));
      setPlayingId(id);
    }
  };

  const handleMouseEnter = (id) => {
    const video = videoRefs.current[id];
    if (video) {
      video.play().catch((err) => console.log("Hover-play blocked:", err));
      setPlayingId(id);
    }
  };

  const handleMouseLeave = (id) => {
    const video = videoRefs.current[id];
    if (video) {
      video.pause();
      if (playingId === id) {
        setPlayingId(null);
      }
    }
  };

  return (
    <section className="relative w-full bg-white pt-20 pb-4 overflow-visible">
      {/* Centered Heading (Above the wave background) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20">
        <span className="text-amber-500 font-extrabold text-xs sm:text-sm uppercase tracking-widest">
          Real Customers. Real Results.
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-black mt-2 tracking-tight">
          Meals Delivered to 60,000+ Customers
        </h2>
        <p className="text-neutral-500 text-sm md:text-base mt-2">
          Hear it straight from our community...
        </p>
      </div>

      {/* Blue Wave Banner Band (Centered flex layout with overflow-visible) */}
      <div className="relative w-full bg-orange-600 h-[220px] mt-36 mb-36 flex items-center justify-center overflow-visible z-10">
        {/* Top Wave SVG Path */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform translate-y-[-99%] z-10">
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="relative block w-full h-[60px] text-orange-600 fill-current"
          >
            <path d="M0,32L120,42.7C240,53,480,75,720,74.7C960,75,1200,53,1320,42.7L1440,32L1440,120L1320,120C1200,120,960,120,720,120C480,120,240,120,120,120L0,120Z"></path>
          </svg>
        </div>

        {/* Bottom Wave SVG Path */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform translate-y-[99%] z-10">
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="relative block w-full h-[60px] text-orange-600 fill-current rotate-180"
          >
            <path d="M0,32L120,42.7C240,53,480,75,720,74.7C960,75,1200,53,1320,42.7L1440,32L1440,120L1320,120C1200,120,960,120,720,120C480,120,240,120,120,120L0,120Z"></path>
          </svg>
        </div>

        {/* Reels Grid (Rendered inside the flow to prevent overlap issues and allow proper layout spacing) */}
        <div className="relative z-20 w-full max-w-6xl mx-auto px-6 overflow-visible">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 justify-center">
            {reelsData.map((reel) => {
              const isCurrentPlaying = playingId === reel.id;

              return (
                <div
                  key={reel.id}
                  className={`group relative aspect-[9/16] w-full bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:rotate-0 hover:scale-105 hover:-translate-y-3 cursor-pointer ${reel.rotation}`}
                  onMouseEnter={() => handleMouseEnter(reel.id)}
                  onMouseLeave={() => handleMouseLeave(reel.id)}
                  onClick={() => handlePlayToggle(reel.id)}
                  style={{
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
                  }}
                >
                  {/* Status Category Tag (Top Left) */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className={`text-[10px] font-extrabold text-white px-3 py-1.5 rounded-md shadow-sm tracking-wider ${reel.tagColor}`}>
                      {reel.tag}
                    </span>
                  </div>

                  {/* Video Element (Borderless) */}
                  <video
                    ref={(el) => (videoRefs.current[reel.id] = el)}
                    src={reel.videoUrl}
                    loop
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-cover transition-transform duration-75 group-hover:scale-[1.02]"
                  />

                  {/* Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />

                  {/* Sound/Mute Toggle Indicator (Top Right) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMuted(!isMuted);
                    }}
                    className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition active:scale-95"
                  >
                    {isMuted ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    )}
                  </button>

                  {/* Play/Pause Overlay Icon (Center) */}
                  <div
                    className={`absolute inset-0 flex items-center justify-center pointer-events-none z-10 transition-all duration-300 ${
                      isCurrentPlaying ? "opacity-0 scale-150" : "opacity-100 scale-100"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-white/30 border border-white/40 backdrop-blur-sm flex items-center justify-center text-white shadow-lg transition duration-300">
                      <svg className="w-5 h-5 fill-current translate-x-0.5" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Caption & Info (Bottom) */}
                  <div className="absolute inset-x-0 bottom-0 p-4 z-10 text-white flex flex-col justify-end">
                    <h3 className="font-bold text-sm tracking-tight truncate">
                      {reel.title}
                    </h3>
                    <p className="text-[11px] text-neutral-200 mt-0.5 leading-relaxed line-clamp-2">
                      {reel.desc}
                    </p>

                    {/* Progress bar */}
                    <div className="w-full bg-white/20 h-[3px] rounded-full overflow-hidden mt-3">
                      <div
                        className={`bg-red-600 h-full rounded-full transition-all duration-300 ${
                          isCurrentPlaying ? "w-full" : "w-0"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
