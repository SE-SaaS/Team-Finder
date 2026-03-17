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
    <main className="relative bg-black w-full min-h-screen selection:bg-[#e8294a]/30">
      {/* REMOVED: Static background and dark overlay layers to prevent canvas conflict */}

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
            <div className="hidden md:flex items-center gap-4 text-xs text-white/50">
              <span>Overview</span>
              <span>•</span>
              <span>Features</span>
            </div>
          </div>

          <div>
            <a href="/login.html" className="bg-[#e8294a] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#ff3b5d] hover:shadow-[0_0_15px_rgba(232,41,74,0.5)] transition-all duration-300 inline-block">
              Join TeamFinder
            </a>
          </div>
        </div>
      </nav>

      {/* MAIN SCROLL CONTAINER - 400vh for scroll distance */}
      <div ref={containerRef} className="relative w-full h-[400vh] z-10">
        
        {/* LAYER 3: Sticky Canvas and Scrollytelling overlay */}
        <div className="sticky top-0 h-[100vh] w-full">
          <TeamFinderCanvas scrollProgress={scrollYProgress} />
          <Scrollytelling scrollProgress={scrollYProgress} />
        </div>

      </div>

    </main>
  );
}
