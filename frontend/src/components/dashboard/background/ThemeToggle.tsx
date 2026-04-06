'use client';

import { useBackgroundTheme, BgTheme } from '@/contexts/BackgroundThemeContext';

// ── Config per theme ───────────────────────────────────────────────────────
const config: Record<BgTheme, { label: string; icon: React.ReactNode; next: string }> = {
  red: {
    label: 'Red',
    next: '→ Blue',
    icon: (
      <span className="flex gap-0.5">
        <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
      </span>
    ),
  },
  blue: {
    label: 'Blue',
    next: '→ Mix',
    icon: (
      <span className="flex gap-0.5">
        <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
      </span>
    ),
  },
  mix: {
    label: 'Mix',
    next: '→ Red',
    icon: (
      <span className="flex gap-0.5">
        <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
        <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
      </span>
    ),
  },
};

// ── Component ──────────────────────────────────────────────────────────────
export default function ThemeToggle() {
  const { theme, cycle } = useBackgroundTheme();
  const { label, icon, next } = config[theme];

  return (
    <button
      onClick={cycle}
      title={`Background: ${label}. Click for ${next}`}
      className="flex items-center gap-2 border border-[#30363d] hover:border-[#8b949e] rounded-md px-2.5 py-1.5 text-xs text-[#8b949e] hover:text-[#f0f6fc] transition-all bg-[#0d1117]"
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
