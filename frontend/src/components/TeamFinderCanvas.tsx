'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, MotionValue, useSpring, useTransform } from 'framer-motion';

interface TeamFinderCanvasProps {
  scrollProgress: MotionValue<number>;
}

export default function TeamFinderCanvas({ scrollProgress }: TeamFinderCanvasProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [duration, setDuration] = useState(0);
  const [loadProgress, setLoadProgress] = useState(0);

  const springProgress = useSpring(scrollProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001,
  });

  const canvasOpacity = useTransform(scrollProgress, [0.80, 0.82], [1, 0]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleProgress = () => {
      if (video.buffered.length > 0 && video.duration > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const pct = Math.round((bufferedEnd / video.duration) * 100);
        setLoadProgress(pct);
      }
    };

    const handleCanPlayThrough = () => {
      setLoadProgress(100);
      setDuration(video.duration);
      setIsReady(true);
    };

    if (video.readyState >= 4) {
      handleCanPlayThrough();
    } else {
      video.addEventListener('progress', handleProgress);
      video.addEventListener('canplaythrough', handleCanPlayThrough);
    }

    return () => {
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
    };
  }, []);

  useEffect(() => {
    if (!isReady || duration === 0) return;

    let animationFrameId = 0;
    let lastTime = -1;

    const renderLoop = () => {
      const video = videoRef.current;
      if (video) {
        const target = Math.max(
          0,
          Math.min(duration - 0.01, springProgress.get() * duration)
        );
        if (Math.abs(target - lastTime) > 0.01) {
          video.currentTime = target;
          lastTime = target;
        }
      }
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isReady, duration, springProgress]);

  return (
    <motion.div
      style={{ opacity: canvasOpacity }}
      className="w-full h-full overflow-hidden flex items-center justify-center pointer-events-none bg-black"
    >
      {!isReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-50 transition-opacity duration-500">
          <div className="text-sm tracking-widest font-mono mb-4 text-blue-200 uppercase">
            Initializing Artifact
          </div>
          <div className="w-64 h-[2px] bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#0a1eff] to-[#e8294a] transition-all duration-300 ease-out"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
          <div className="text-white/30 text-xs mt-3 font-mono">
            {loadProgress}%
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        src="/sequence.mp4"
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover absolute inset-0 mix-blend-screen"
      />
    </motion.div>
  );
}
