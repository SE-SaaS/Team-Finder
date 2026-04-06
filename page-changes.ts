// ─────────────────────────────────────────────────────────────────
// CHANGES TO page.tsx  (3 spots only, nothing else touches)
// ─────────────────────────────────────────────────────────────────

// ── 1. ADD these imports at the top ──────────────────────────────
import BackgroundCanvas from '@/components/background/BackgroundCanvas';
import ThemeToggle      from '@/components/background/ThemeToggle';
import { BackgroundThemeProvider } from '@/contexts/BackgroundThemeContext';

// ── 2. DELETE the hardcoded bgStyle const entirely ───────────────
// (the ~12-line bgStyle object — BackgroundCanvas owns it now)

// ── 3. Wrap the returned JSX + add BackgroundCanvas + ThemeToggle ─

// BEFORE (loading state return):
return (
  <div className="min-h-screen bg-transparent flex items-center justify-center relative">
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <div className="absolute inset-0" style={bgStyle} />   // ← DELETE THIS DIV
    </div>
    ...
  </div>
);

// AFTER (loading state return):
return (
  <BackgroundThemeProvider>
    <BackgroundCanvas />
    <div className="min-h-screen bg-transparent flex items-center justify-center relative">
      ...
    </div>
  </BackgroundThemeProvider>
);


// BEFORE (main return):
return (
  <div className="min-h-screen bg-transparent text-[#c9d1d9] relative">
    {/* Background */}
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <div className="absolute inset-0" style={bgStyle} />   // ← DELETE THESE 3 LINES
    </div>
    ...
    {/* Inside the <header> nav, add ThemeToggle next to the "New" button: */}
    <div className="ml-auto flex items-center gap-3">
      <ThemeToggle />   {/* ← ADD HERE */}
      <Link href="/projects/create" ...>New</Link>
      <button onClick={handleSignOut} ...>...</button>
    </div>
  </div>
);

// AFTER (main return — wrap everything):
return (
  <BackgroundThemeProvider>
    <BackgroundCanvas />
    <div className="min-h-screen bg-transparent text-[#c9d1d9] relative">
      ...
    </div>
  </BackgroundThemeProvider>
);


// ─────────────────────────────────────────────────────────────────
// FILE STRUCTURE RESULT
// ─────────────────────────────────────────────────────────────────
//
// contexts/
//   BackgroundThemeContext.tsx   ← state + cycle()
//
// components/background/
//   BackgroundCanvas.tsx         ← renders the gradient div
//   ThemeToggle.tsx              ← the button in the nav
//
// app/dashboard/
//   page.tsx                     ← 3 small edits above, nothing else
