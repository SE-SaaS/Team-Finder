'use client';

import { useRef, useState, useEffect } from 'react';
import { useScroll } from 'framer-motion';
import TeamFinderCanvas from '@/components/TeamFinderCanvas';
import Scrollytelling from '@/components/Scrollytelling';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Check scroll position for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="relative w-full min-h-screen selection:bg-[#e8294a]/30">
      {/* CSS Starfield Background */}
      <div className="fixed inset-0 -z-10 bg-black overflow-hidden">
        <div className="stars stars-blue"></div>
        <div className="stars stars-red"></div>
      </div>

      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] border-b ${
          isScrolled
            ? 'bg-black/75 backdrop-blur-md py-4 border-white/10 shadow-lg'
            : 'bg-transparent py-6 border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-white font-medium tracking-tight text-xl">TeamFinder</span>
          </div>

          <div>
            <a href="/auth/login" className="bg-[#e8294a] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#ff3b5d] hover:shadow-[0_0_15px_rgba(232,41,74,0.5)] transition-all duration-300 inline-block">
              Join TeamFinder
            </a>
          </div>
        </div>
      </nav>

      {/* MAIN SCROLL CONTAINER - 300vh for scroll distance */}
      <div ref={containerRef} className="relative w-full h-[300vh]">

        {/* LAYER 1: Canvas - sticky background that stays in view */}
        <div className="sticky top-0 h-screen w-full z-10">
          <TeamFinderCanvas scrollProgress={scrollYProgress} />
        </div>

        {/* LAYER 2: Scrollytelling text - overlaid on top, scrolls naturally */}
        <Scrollytelling scrollProgress={scrollYProgress} />

      </div>

    </main>
  );
}
