'use client';

import { motion, MotionValue, useTransform } from 'framer-motion';

interface ScrollytellingProps {
  scrollProgress: MotionValue<number>;
}

export default function Scrollytelling({ scrollProgress }: ScrollytellingProps) {
  // BEAT 5: CTA + OVERVIEW + FEATURES (0.82 - 1.00)
  const ctaOpacity = useTransform(scrollProgress, [0.82, 0.85, 1.0], [0, 1, 1]);
  const ctaY = useTransform(scrollProgress, [0.82, 1.0], [30, 0]);

  // Scroll to Explore indicator (0 - 0.10)
  const scrollIndOpacity = useTransform(scrollProgress, [0, 0.05, 0.10], [1, 1, 0]);

  return (
    <div className="relative -mt-[100vh] w-full h-[300vh] pointer-events-none z-20">

      {/* Scroll indicator */}
      <div className="sticky top-[85vh] w-full flex justify-center h-0 pointer-events-none">
        <motion.div
          style={{ opacity: scrollIndOpacity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-white/50 text-xs lowercase tracking-[0.2em]">Scroll to Explore</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>
      </div>

      {/* BEATS 1-2: Empty placeholders (animation only, no text) */}
      <div className="h-[100vh]" />
      <div className="h-[100vh]" />

      {/* BEAT 5: CTA + OVERVIEW + FEATURES (82-100%) */}
      <div className="h-[100vh] w-full flex items-center justify-center sticky top-0">
        <motion.div
          style={{ opacity: ctaOpacity, y: ctaY }}
          className="w-full max-w-[1400px] px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-[1fr_1.3fr_1fr] gap-12 lg:gap-20 pointer-events-auto items-center"
        >
          {/* LEFT: Overview */}
          <div className="text-left">
            <h3 className="text-3xl font-bold mb-6 text-[#4455ff] tracking-tight">Overview</h3>
            <ul className="space-y-3.5 text-base text-white/70 leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="text-[#4455ff] mt-1">•</span>
                <span>Algorithmic team matching</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#4455ff] mt-1">•</span>
                <span>60% skills, 25% rating, 15% availability</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#4455ff] mt-1">•</span>
                <span>Transparent scoring system</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#4455ff] mt-1">•</span>
                <span>Smart penalty detection</span>
              </li>
            </ul>
          </div>

          {/* CENTER: CTA */}
          <div className="text-center flex flex-col items-center justify-center lg:py-8">
            <h2 className="text-5xl lg:text-7xl font-extrabold mb-5 text-white uppercase tracking-tight leading-tight">
              Find Your<br />Team.
            </h2>
            <p className="text-lg lg:text-xl text-white/60 mb-10 tracking-wide">Initiate Your Project Odyssey.</p>
            <a href="/login.html" className="group relative px-10 py-4 rounded-full bg-[#e8294a] text-white font-semibold text-base tracking-wide overflow-hidden shadow-[0_0_40px_rgba(232,41,74,0.5)] hover:shadow-[0_0_70px_rgba(232,41,74,0.7)] transition-all hover:scale-105 active:scale-95 duration-300 inline-block">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10 flex items-center gap-2.5">
                Join TeamFinder
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </a>
          </div>

          {/* RIGHT: Features */}
          <div className="text-right">
            <h3 className="text-3xl font-bold mb-6 text-[#cc1144] tracking-tight">Features</h3>
            <ul className="space-y-3.5 text-base text-white/70 leading-relaxed">
              <li className="flex items-start gap-3 justify-end">
                <span>Verified skill ratings</span>
                <span className="text-[#cc1144] mt-1">•</span>
              </li>
              <li className="flex items-start gap-3 justify-end">
                <span>Real-time matching</span>
                <span className="text-[#cc1144] mt-1">•</span>
              </li>
              <li className="flex items-start gap-3 justify-end">
                <span>Project collaboration</span>
                <span className="text-[#cc1144] mt-1">•</span>
              </li>
              <li className="flex items-start gap-3 justify-end">
                <span>Exam validation system</span>
                <span className="text-[#cc1144] mt-1">•</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
