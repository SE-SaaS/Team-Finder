'use client';

import { useEffect, useRef, useState } from 'react';
import { MotionValue, useSpring, useTransform } from 'framer-motion';

interface TeamFinderCanvasProps {
  scrollProgress: MotionValue<number>;
}

export default function TeamFinderCanvas({ scrollProgress }: TeamFinderCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadedImages, setLoadedImages] = useState<HTMLImageElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Device-optimized frame count
  // Mobile: 30 frames, Desktop: 60 frames (matches standard 60fps)
  const [FRAME_COUNT] = useState(() => {
    if (typeof window === 'undefined') return 60; // SSR: default to 60

    const isMobile = window.innerWidth < 768;
    return isMobile ? 30 : 60;
  });

  // useSpring — stiffness: 80, damping: 20, restDelta: 0.001
  const springProgress = useSpring(scrollProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001,
  });

  // Map 0 -> 1.0 progress to 0 -> 239 frames
  const frameIndex = useTransform(springProgress, [0, 1.0], [0, FRAME_COUNT - 1]);

  useEffect(() => {
    // Preload ALL frames before ANY animation starts
    let loadedCount = 0;
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new window.Image();

      const fileNumber = String(i + 1).padStart(3, '0');
      img.src = `/sequence/ezgif-frame-${fileNumber}.jpg`;

      const handleLoad = () => {
        loadedCount++;
        images[i] = img;
        setProgress(Math.round((loadedCount / FRAME_COUNT) * 100));

        if (loadedCount === FRAME_COUNT) {
          setLoadedImages(images);
          setIsLoading(false);
          // Initial render of first frame once loaded
          renderCanvas(images, 0);
        }
      };

      const handleError = () => {
        console.error(`Failed to load frame ${fileNumber}`);
        // Still increment count to prevent hanging
        loadedCount++;
        setProgress(Math.round((loadedCount / FRAME_COUNT) * 100));

        if (loadedCount === FRAME_COUNT) {
          setLoadedImages(images);
          setIsLoading(false);
          renderCanvas(images, 0);
        }
      };

      img.onload = handleLoad;
      img.onerror = handleError;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderCanvas = (imagesList: HTMLImageElement[], currentFrame: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const image = imagesList[Math.min(currentFrame, FRAME_COUNT - 1)];
    if (!image) return;

    // Use display dimensions for drawing
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    // Fill with black to prevent any transparency background bleeds
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, displayWidth, displayHeight);

    // Contain fit logic
    const hRatio = displayWidth / image.width;
    const vRatio = displayHeight / image.height;
    const ratio = Math.min(hRatio, vRatio);

    // Scale down a bit to ensure it doesn't touch the immediate edges
    const finalRatio = ratio * 0.9;

    const centerShift_x = (displayWidth - image.width * finalRatio) / 2;
    const centerShift_y = (displayHeight - image.height * finalRatio) / 2;

    ctx.drawImage(
      image,
      0,
      0,
      image.width,
      image.height,
      centerShift_x,
      centerShift_y,
      image.width * finalRatio,
      image.height * finalRatio
    );
  };

  useEffect(() => {
    if (isLoading || loadedImages.length === 0) return;

    let animationFrameId: number;
    let lastRenderedFrame = -1;

    // 60fps locked via requestAnimationFrame
    const renderLoop = () => {
      // Clamp the frame index so it doesn't exceed bounds
      const rawFrame = frameIndex.get();
      const currentFrame = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(rawFrame)));
      
      // Optimization: Only redraw if the frame actually changed
      if (currentFrame !== lastRenderedFrame) {
        renderCanvas(loadedImages, currentFrame);
        lastRenderedFrame = currentFrame;
      }
      
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isLoading, loadedImages, frameIndex]);

  useEffect(() => {
    // Canvas resolution setup
    const handleResize = () => {
      if (canvasRef.current) {
        const dpr = window.devicePixelRatio || 1;
        const displayWidth = window.innerWidth;
        const displayHeight = window.innerHeight;

        // Set actual canvas size with DPI scaling
        canvasRef.current.width = displayWidth * dpr;
        canvasRef.current.height = displayHeight * dpr;

        // Set display size via CSS
        canvasRef.current.style.width = displayWidth + 'px';
        canvasRef.current.style.height = displayHeight + 'px';

        // Scale context to match DPI
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.scale(dpr, dpr);
        }

        // Re-render with current frame
        if (!isLoading && loadedImages.length > 0) {
          renderCanvas(loadedImages, Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(frameIndex.get()))));
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isLoading, loadedImages, frameIndex]);

  return (
    <div className="w-full h-[100vh] sticky top-0 overflow-hidden flex items-center justify-center pointer-events-none z-10 bg-black">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-50 transition-opacity duration-500">
          <div className="text-white text-sm tracking-widest font-mono mb-4 text-blue-200 uppercase">
            Initializing Artifact
          </div>
          <div className="w-64 h-[2px] bg-white/10 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#0a1eff] to-[#e8294a] transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-white/30 text-xs mt-3 font-mono">
            {progress}%
          </div>
        </div>
      )}
      
      {/* Background Sequence Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full absolute inset-0 mix-blend-screen"
      />
    </div>
  );
}
