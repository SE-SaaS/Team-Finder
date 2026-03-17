'use client';

import { motion, MotionValue, useTransform } from 'framer-motion';

interface ScrollytellingProps {
  scrollProgress: MotionValue<number>;
}

export default function Scrollytelling({ scrollProgress }: ScrollytellingProps) {
  // BEAT 1: HERO (0 - 0.15)
  const heroOpacity = useTransform(scrollProgress, [0, 0.03, 0.13, 0.15], [0, 1, 1, 0]);
  const heroY = useTransform(scrollProgress, [0, 0.15], [0, -50]);

  // BEAT 2: FEATURE REVEAL (0.15 - 0.40)
  const featureOpacity = useTransform(scrollProgress, [0.15, 0.175, 0.38, 0.40], [0, 1, 1, 0]);
  const featureY = useTransform(scrollProgress, [0.15, 0.40], [30, -30]);

  // BEAT 3: TEAM FORMATION (0.40 - 0.65)
  const teamOpacity = useTransform(scrollProgress, [0.40, 0.425, 0.63, 0.65], [0, 1, 1, 0]);
  const teamY = useTransform(scrollProgress, [0.40, 0.65], [30, -30]);

  // BEAT 4: COMPATIBILITY (0.65 - 0.85)
  const compatOpacity = useTransform(scrollProgress, [0.65, 0.67, 0.83, 0.85], [0, 1, 1, 0]);
  const compatY = useTransform(scrollProgress, [0.65, 0.85], [30, -30]);

  // BEAT 5: REASSEMBLY & CTA (0.85 - 1.00)
  const ctaOpacity = useTransform(scrollProgress, [0.85, 0.87, 1.0], [0, 1, 1]);
  const ctaY = useTransform(scrollProgress, [0.85, 1.0], [30, 0]);

  // Scroll to Explore indicator (0 - 0.10)
  const scrollIndOpacity = useTransform(scrollProgress, [0, 0.05, 0.10], [1, 1, 0]);

  return (
    <div className="absolute top-0 left-0 w-full h-[400vh] pointer-events-none z-20">
      
      {/* Scroll indicator sticky element - visible only at top */}
      <div className="sticky top-[85vh] w-full flex justify-center h-0 pointer-events-none">
        <motion.div 
          style={{ opacity: scrollIndOpacity }} 
          className="flex flex-col items-center gap-2"
        >
          <span className="text-white/50 text-xs lowercase tracking-[0.2em]">Scroll to Explore</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>
      </div>

      {/* BEAT 1: HERO (0-20%) */}
      <div className="h-[100vh] w-full flex items-center justify-center sticky top-0">
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="text-center max-w-3xl relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full" />
          <h1 className="text-7xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#0a1eff] to-[#e8294a] pb-2">
            TeamFinder.
          </h1>
          <p className="text-3xl text-blue-100/90 tracking-tight drop-shadow-lg">
            Find Your Perfect Team.
          </p>
        </motion.div>
      </div>

      {/* BEAT 2: ALGORITHMIC PRECISION (15-40%) */}
      <div className="h-[100vh] w-full flex items-center justify-start sticky top-0 px-8 lg:px-24">
        <motion.div
          style={{ opacity: featureOpacity, y: featureY }}
          className="max-w-2xl relative text-left"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#0a1eff]/20 blur-[100px] rounded-full" />
          <h2 className="text-5xl font-bold tracking-tight mb-6 text-blue-200/90 drop-shadow-[0_0_15px_rgba(10,30,255,0.3)] uppercase">
            Algorithmic Precision
          </h2>
          <p className="text-xl text-white/70 mb-6 leading-relaxed">
            Three-factor matching: <span className="text-blue-300 font-semibold">Skills (60%)</span>, <span className="text-blue-300 font-semibold">Ratings (25%)</span>, <span className="text-blue-300 font-semibold">Availability (15%)</span>
          </p>
          <div className="space-y-3 text-white/60">
            <div className="flex items-start gap-3">
              <span className="text-blue-400 text-xl">•</span>
              <span>Cosine similarity across 38 IT skills</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-400 text-xl">•</span>
              <span>Transparent score breakdowns</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-400 text-xl">•</span>
              <span>Penalty system for low-rated members</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* BEAT 3: VERIFIED SKILLS (40-65%) */}
      <div className="h-[100vh] w-full flex items-center justify-end sticky top-0 px-8 lg:px-24">
        <motion.div
          style={{ opacity: teamOpacity, y: teamY }}
          className="max-w-2xl text-right relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#e8294a]/20 blur-[100px] rounded-full" />
          <h2 className="text-5xl font-bold tracking-tight mb-6 text-red-200/90 drop-shadow-[0_0_15px_rgba(232,41,74,0.3)] uppercase">
            Verified Skill Ratings
          </h2>
          <p className="text-xl text-white/70 mb-6 leading-relaxed">
            Self-report your abilities, then validate with optional exams
          </p>
          <div className="space-y-3 text-white/60">
            <div className="flex items-start gap-3 justify-end">
              <span>Rate yourself 1-5 stars per skill</span>
              <span className="text-red-400 text-xl">•</span>
            </div>
            <div className="flex items-start gap-3 justify-end">
              <span>Take verification exams to boost credibility</span>
              <span className="text-red-400 text-xl">•</span>
            </div>
            <div className="flex items-start gap-3 justify-end">
              <span>See exactly which skills match project needs</span>
              <span className="text-red-400 text-xl">•</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* BEAT 4: AVAILABILITY MATCHING (65-85%) */}
      <div className="h-[100vh] w-full flex items-center justify-center sticky top-0 px-8 lg:px-24">
        <motion.div
          style={{ opacity: compatOpacity, y: compatY }}
          className="max-w-2xl text-center relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-[#0a1eff]/20 to-[#e8294a]/20 blur-[120px] rounded-full" />
          <h2 className="text-5xl font-bold tracking-tight mb-6 text-white/90 drop-shadow-lg uppercase">
            Availability Matching
          </h2>
          <p className="text-xl text-white/70 mb-8 leading-relaxed">
            Filter by schedule compatibility
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap text-white/80">
            <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-full">Full-time</span>
            <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-full">Flexible</span>
            <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-full">Evenings</span>
            <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-full">Weekends</span>
          </div>
        </motion.div>
      </div>

      {/* BEAT 5: CTA (85-100%) */}
      <div className="h-[100vh] w-full flex items-center justify-center sticky top-0">
        <motion.div 
          style={{ opacity: ctaOpacity, y: ctaY }}
          className="text-center w-full max-w-2xl px-6 relative pointer-events-auto"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-[#0a1eff]/20 to-[#e8294a]/20 blur-[120px] rounded-full" />
          <h2 className="text-6xl font-bold tracking-tight mb-4 text-white uppercase mt-12">Find Your Team.</h2>
          <p className="text-2xl text-blue-200/80 mb-12">Initiate Your Project Odyssey.</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="/login.html" className="group relative px-8 py-4 rounded-full bg-[#e8294a] text-white font-semibold tracking-wide overflow-hidden shadow-[0_0_40px_rgba(232,41,74,0.4)] hover:shadow-[0_0_60px_rgba(232,41,74,0.6)] transition-all hover:scale-105 active:scale-95 duration-300 inline-block">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10 flex items-center gap-2">
                Join TeamFinder
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </a>
          </div>
        </motion.div>

      </div>

    </div>
  );
}
