'use client';

import { useMemo } from 'react';
import { useBackgroundTheme, BgTheme } from '@/contexts/BackgroundThemeContext';

// ── Theme → gradient config ────────────────────────────────────────────────
const themes: Record<BgTheme, React.CSSProperties> = {
  red: {
    backgroundColor: '#0a0a0f',
    backgroundImage: `
      radial-gradient(ellipse at top right,    #6b000080 0%, transparent 50%),
      radial-gradient(ellipse at bottom left,  #6b000080 0%, transparent 50%),
      radial-gradient(ellipse at top left,     #3d000060 0%, transparent 40%),
      radial-gradient(ellipse at bottom right, #3d000060 0%, transparent 40%),
      radial-gradient(ellipse at center,       #2a000030 0%, transparent 70%),
      radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)
    `,
    backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 40px 40px',
  },

  blue: {
    backgroundColor: '#0a0a0f',
    backgroundImage: `
      radial-gradient(ellipse at top right,    #00006b80 0%, transparent 50%),
      radial-gradient(ellipse at bottom left,  #00006b80 0%, transparent 50%),
      radial-gradient(ellipse at top left,     #00003d60 0%, transparent 40%),
      radial-gradient(ellipse at bottom right, #00003d60 0%, transparent 40%),
      radial-gradient(ellipse at center,       #00002a30 0%, transparent 70%),
      radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)
    `,
    backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 40px 40px',
  },

  // Mix: red bleeds from top-right / bottom-left, blue from top-left / bottom-right
  mix: {
    backgroundColor: '#0a0a0f',
    backgroundImage: `
      radial-gradient(ellipse at top right,    #6b000080 0%, transparent 55%),
      radial-gradient(ellipse at bottom left,  #6b000080 0%, transparent 55%),
      radial-gradient(ellipse at top left,     #00006b80 0%, transparent 55%),
      radial-gradient(ellipse at bottom right, #00006b80 0%, transparent 55%),
      radial-gradient(ellipse at center,       #1a001a20 0%, transparent 70%),
      radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)
    `,
    backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 40px 40px',
  },
};

// ── Component ──────────────────────────────────────────────────────────────
export default function BackgroundCanvas() {
  const { theme } = useBackgroundTheme();
  const style = useMemo(() => themes[theme], [theme]);

  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden transition-all duration-700"
      style={style}
    />
  );
}
