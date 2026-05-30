'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { Rajdhani, Russo_One, Share_Tech_Mono, Exo_2 } from 'next/font/google';

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rajdhani',
  display: 'swap',
});
const russoOne = Russo_One({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-russo',
  display: 'swap',
});
const shareTechMono = Share_Tech_Mono({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-mono',
  display: 'swap',
});
const exo2 = Exo_2({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-exo',
  display: 'swap',
});

const NODE_COUNT = 80;
const CONNECT_D  = 155;
const CONNECT_D2 = CONNECT_D * CONNECT_D;
const TARGET_FPS = 60;
const FRAME_MS   = 1000 / TARGET_FPS;

const LANDING_CSS = `
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;}
:root{
  --bg:#060608;
  --primary:#e8294a;
  --primary-glow:rgba(232,41,74,0.35);
  --primary-soft:rgba(232,41,74,0.08);
  --blue:#4455ff;
  --secondary:#7b6bb5;
  --text:#eae8f2;
  --text-dim:rgba(255,255,255,0.55);
  --text-muted:rgba(255,255,255,0.25);
  --border:rgba(255,255,255,0.06);
}
body{background:var(--bg);color:var(--text);overflow-x:hidden;-webkit-font-smoothing:antialiased;}
.page{position:relative;z-index:2;font-family:var(--font-exo),sans-serif;}

#bg-canvas{position:fixed;inset:0;z-index:0;width:100%;height:100%;pointer-events:none;transition:none;}
.star-field{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;}
.star{position:absolute;border-radius:50%;animation:twinkle var(--d,3s) ease-in-out infinite;animation-delay:var(--delay,0s);}
@keyframes twinkle{0%,100%{opacity:var(--min-op,.2);}50%{opacity:var(--max-op,.8);}}
.grain{position:fixed;inset:0;z-index:1;pointer-events:none;opacity:.022;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size:256px;}

nav{
  position:fixed;top:0;left:0;right:0;z-index:100;
  padding:0 48px;height:70px;
  display:flex;align-items:center;justify-content:space-between;
  background:transparent;backdrop-filter:blur(0px);
  border-bottom:1px solid transparent;
  transition:background .4s,border-color .4s,backdrop-filter .4s;
}
nav.scrolled{background:rgba(6,6,8,.78);backdrop-filter:blur(20px) saturate(1.3);border-bottom-color:var(--border);}
.nav-logo{
  font-family:var(--font-rajdhani),sans-serif;font-weight:700;font-size:1.35rem;
  letter-spacing:3px;text-transform:uppercase;color:var(--text);
  opacity:0;transform:translateY(-6px);
  transition:opacity .45s,transform .45s;
}
.nav-logo span{color:var(--primary);}
.nav-logo.visible{opacity:1;transform:translateY(0);}
.btn-join{
  font-family:var(--font-rajdhani),sans-serif;font-weight:600;font-size:.8rem;
  letter-spacing:2px;text-transform:uppercase;
  background:var(--primary);color:#fff;
  padding:10px 28px;border-radius:100px;border:none;cursor:pointer;
  text-decoration:none;display:inline-flex;align-items:center;gap:8px;
  box-shadow:0 4px 24px rgba(232,41,74,.25);
  transition:background .3s,box-shadow .3s,transform .3s,opacity .45s;
}
.btn-join:hover{background:#ff3358;box-shadow:0 6px 36px rgba(232,41,74,.4);transform:translateY(-1px);}
.btn-join.hidden{opacity:0;pointer-events:none;transform:translateY(-6px);}
.btn-join svg,.btn-cta svg{transition:transform .3s;}
.btn-join:hover svg{transform:translateX(3px);}

.zone1{height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;}
.zone1-content{display:flex;flex-direction:column;align-items:center;gap:18px;text-align:center;will-change:opacity,transform;}

.cx-logo{
  font-family:var(--font-russo),sans-serif;
  font-size:clamp(2.8rem,8vw,5.8rem);
  letter-spacing:0;color:#eae8f2;line-height:1;
  display:inline-flex;align-items:center;gap:.13em;
  animation:logoPulse 3.5s ease-in-out infinite;
}
.cx-logo .cx-o{color:#e8294a;animation:oGlow 3s ease-in-out infinite;}
.cx-logo .cx-svg{overflow:visible;flex-shrink:0;height:.88em;margin-left:.05em;filter:drop-shadow(0 0 5px rgba(0,0,0,1));}
@keyframes logoPulse{
  0%,100%{filter:drop-shadow(0 0 22px rgba(232,41,74,.28)) drop-shadow(0 0 44px rgba(74,95,173,.14));}
  50%    {filter:drop-shadow(0 0 38px rgba(232,41,74,.5))  drop-shadow(0 0 72px rgba(74,95,173,.26));}
}
@keyframes oGlow{
  0%,100%{text-shadow:0 0 8px rgba(232,41,74,.9),0 0 22px rgba(232,41,74,.5);}
  50%    {text-shadow:0 0 16px rgba(232,41,74,1),0 0 42px rgba(232,41,74,.75),0 0 72px rgba(232,41,74,.3);}
}
.cx-tagline{font-family:var(--font-mono),monospace;font-size:.7rem;letter-spacing:7px;text-transform:uppercase;color:rgba(255,255,255,.28);}
.cx-bridge{margin-top:8px;display:flex;flex-direction:column;align-items:center;gap:6px;}
.cx-bridge-line{width:1px;height:32px;background:linear-gradient(to bottom,transparent,rgba(232,41,74,.3),transparent);}
.cx-bridge-text{font-family:var(--font-mono),monospace;font-size:.58rem;letter-spacing:5px;text-transform:uppercase;color:rgba(255,255,255,.2);}
.cx-bridge-product{font-family:var(--font-rajdhani),sans-serif;font-weight:700;font-size:1.1rem;letter-spacing:4px;text-transform:uppercase;color:rgba(255,255,255,.55);}
.cx-bridge-product span{color:var(--primary);}

.scroll-hint{position:absolute;bottom:32px;display:flex;flex-direction:column;align-items:center;gap:8px;animation:fadeIn 1s ease-out 1.2s both;}
.scroll-hint span{font-family:var(--font-mono),monospace;font-size:.62rem;color:var(--text-muted);letter-spacing:4px;text-transform:lowercase;}
.scroll-line{width:1px;height:40px;background:linear-gradient(to bottom,rgba(255,255,255,.35),transparent);animation:scrollDrop 2.2s ease-in-out infinite;}
@keyframes scrollDrop{0%{opacity:0;transform:scaleY(0);transform-origin:top;}40%{opacity:1;transform:scaleY(1);}70%{opacity:1;}100%{opacity:0;transform:translateY(20px);}}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}

.hero-section{
  min-height:100vh;display:grid;grid-template-columns:1fr 1.4fr 1fr;gap:48px;
  align-items:center;max-width:1400px;margin:0 auto;padding:0 48px 80px;
}
.col-left{text-align:left;}
.col-label{font-family:var(--font-rajdhani),sans-serif;font-weight:700;font-size:1.6rem;letter-spacing:1px;margin-bottom:28px;}
.col-left .col-label{color:var(--blue);}
.col-right .col-label{color:var(--primary);}
.feature-list{list-style:none;display:flex;flex-direction:column;gap:18px;}
.feature-list li{display:flex;align-items:flex-start;gap:12px;font-size:.95rem;color:var(--text-dim);line-height:1.55;}
.bullet-blue{color:var(--blue);flex-shrink:0;margin-top:2px;font-size:1.1rem;}
.bullet-red{color:var(--primary);flex-shrink:0;margin-top:2px;font-size:1.1rem;}
.col-right .feature-list li{justify-content:flex-end;text-align:right;}
.col-center{text-align:center;display:flex;flex-direction:column;align-items:center;}
.hero-headline{font-family:var(--font-rajdhani),sans-serif;font-size:clamp(3.8rem,6.5vw,7rem);font-weight:700;line-height:.92;letter-spacing:1px;text-transform:uppercase;margin-bottom:18px;}
.hero-headline .line-grad{display:block;background:linear-gradient(130deg,var(--primary) 0%,#c0288a 40%,var(--blue) 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 0 40px rgba(232,41,74,.3));}
.hero-sub{font-size:1.05rem;color:var(--text-dim);letter-spacing:.08em;margin-bottom:40px;}
.btn-cta{
  font-family:var(--font-rajdhani),sans-serif;font-weight:600;font-size:.88rem;
  letter-spacing:2.5px;text-transform:uppercase;
  background:var(--primary);color:#fff;
  padding:15px 44px;border-radius:100px;border:none;cursor:pointer;
  text-decoration:none;display:inline-flex;align-items:center;gap:10px;
  box-shadow:0 6px 36px rgba(232,41,74,.3),0 0 0 1px rgba(232,41,74,.15);
  transition:all .35s cubic-bezier(.16,1,.3,1);position:relative;overflow:hidden;
}
.btn-cta::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.12),transparent);opacity:0;transition:opacity .3s;}
.btn-cta:hover::before{opacity:1;}
.btn-cta:hover{box-shadow:0 10px 50px rgba(232,41,74,.45),0 0 0 1px rgba(232,41,74,.3);transform:translateY(-2px) scale(1.02);}
.btn-cta:hover svg{transform:translateX(4px);}
.hero-orb{position:absolute;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(232,41,74,.06) 0%,rgba(68,85,255,.04) 40%,transparent 70%);pointer-events:none;animation:orbPulse 6s ease-in-out infinite;transform:translate(-50%,-50%);left:50%;top:50%;}
@keyframes orbPulse{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.7;}50%{transform:translate(-50%,-50%) scale(1.15);opacity:1;}}
.section-divider{max-width:1100px;margin:0 auto;height:1px;background:linear-gradient(90deg,transparent,var(--border),rgba(232,41,74,.15),var(--border),transparent);}
.uni-section{padding:80px 48px;text-align:center;border-top:1px solid var(--border);}
.uni-eyebrow{font-family:var(--font-mono),monospace;font-size:.62rem;color:var(--text-muted);letter-spacing:5px;text-transform:uppercase;margin-bottom:40px;}
.uni-row{display:flex;gap:20px;justify-content:center;flex-wrap:wrap;}
.uni-chip{font-family:var(--font-rajdhani),sans-serif;font-weight:600;font-size:.78rem;letter-spacing:2px;text-transform:uppercase;padding:10px 24px;border-radius:100px;border:1px solid var(--border);background:rgba(255,255,255,.02);color:var(--text-dim);transition:all .3s;}
.uni-chip:hover{border-color:rgba(232,41,74,.25);color:var(--text);background:var(--primary-soft);}
footer{border-top:1px solid var(--border);padding:36px 48px;display:flex;justify-content:space-between;align-items:center;max-width:1400px;margin:0 auto;}
.footer-logo{font-family:var(--font-rajdhani),sans-serif;font-weight:700;font-size:1rem;letter-spacing:4px;text-transform:uppercase;color:var(--text-dim);}
.footer-logo span{color:var(--primary);}
.footer-tag{font-family:var(--font-mono),monospace;font-size:.6rem;color:var(--text-muted);letter-spacing:4px;text-transform:uppercase;}

@media(max-width:1024px){
  nav{padding:0 24px;}
  .hero-section{grid-template-columns:1fr;padding:80px 24px 60px;gap:48px;}
  .col-left,.col-right{display:none;}
  footer{padding:28px 24px;flex-direction:column;gap:12px;text-align:center;}
}
`;

export default function Home() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const starsRef   = useRef<HTMLDivElement>(null);
  const navRef     = useRef<HTMLElement>(null);
  const navLogoRef = useRef<HTMLDivElement>(null);
  const btnJoinRef = useRef<HTMLAnchorElement>(null);
  const zone1Ref   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas  = canvasRef.current;
    const sf      = starsRef.current;
    const mainNav = navRef.current;
    const navLogo = navLogoRef.current;
    const btnJoin = btnJoinRef.current;
    const z1      = zone1Ref.current;
    if (!canvas || !sf || !mainNav || !navLogo || !btnJoin || !z1) return;

    const ctx = canvas.getContext('2d')!;
    let W = 0, H = 0;

    // ── Stars ──────────────────────────────────────────────────────────────
    for (let i = 0; i < 160; i++) {
      const s = document.createElement('div');
      s.className = 'star';
      const isRed = Math.random() < 0.3;
      const sz = Math.random() * 1.8 + 0.4;
      s.style.cssText =
        `left:${Math.random()*100}%;top:${Math.random()*100}%;` +
        `width:${sz}px;height:${sz}px;` +
        `background:${isRed ? 'rgba(232,80,100,' : 'rgba(120,140,255,'}${(Math.random()*.5+.3).toFixed(2)});` +
        `--d:${(Math.random()*4+2).toFixed(1)}s;--delay:${(Math.random()*6).toFixed(1)}s;` +
        `--min-op:${(Math.random()*.15+.05).toFixed(2)};--max-op:${(Math.random()*.5+.4).toFixed(2)};`;
      sf.appendChild(s);
    }

    // ── Canvas resize ───────────────────────────────────────────────────────
    function resize() {
      W = canvas!.width  = window.innerWidth;
      H = canvas!.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // ── Box-Muller gaussian ─────────────────────────────────────────────────
    function gauss() {
      const u = 1 - Math.random(), v = 1 - Math.random();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    }

    // ── Node ────────────────────────────────────────────────────────────────
    class Node {
      x = 0; y = 0; vx = 0; vy = 0; r = 0; ph = 0; ps = 0; ba = 0;
      cr = 0; cg = 0; cb = 0;
      constructor() { this.reset(); }
      reset() {
        this.x  = Math.max(0, Math.min(W, W * 0.5 + gauss() * W * 0.28));
        this.y  = Math.max(0, Math.min(H, H * 0.5 + gauss() * H * 0.28));
        this.vx = (Math.random() - 0.5) * 0.38;
        this.vy = (Math.random() - 0.5) * 0.38;
        this.r  = 1.4 + Math.random() * 2;
        this.ph = Math.random() * Math.PI * 2;
        this.ps = 0.018 + Math.random() * 0.028;
        this.ba = 0.45 + Math.random() * 0.5;
        const c = Math.random();
        if      (c < 0.40) { this.cr=232; this.cg=41;  this.cb=74;  }
        else if (c < 0.75) { this.cr=74;  this.cg=95;  this.cb=173; }
        else               { this.cr=123; this.cg=107; this.cb=181; }
      }
      update() {
        const pullX = (W * 0.5 - this.x) * 0.00018;
        const pullY = (H * 0.5 - this.y) * 0.00018;
        this.vx += pullX; this.vy += pullY;
        const spd = Math.sqrt(this.vx*this.vx + this.vy*this.vy);
        if (spd > 0.65) { this.vx *= 0.65/spd; this.vy *= 0.65/spd; }
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > W) this.vx *= -1;
        if (this.y < 0 || this.y > H) this.vy *= -1;
        this.ph += this.ps;
      }
      draw() {
        const a = this.ba * (0.65 + 0.35 * Math.sin(this.ph));
        ctx.beginPath(); ctx.arc(this.x, this.y, this.r * 4, 0, Math.PI*2);
        ctx.fillStyle = `rgba(${this.cr},${this.cg},${this.cb},${(a * 0.10).toFixed(3)})`; ctx.fill();
        ctx.beginPath(); ctx.arc(this.x, this.y, this.r * 2, 0, Math.PI*2);
        ctx.fillStyle = `rgba(${this.cr},${this.cg},${this.cb},${(a * 0.28).toFixed(3)})`; ctx.fill();
        ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(${this.cr},${this.cg},${this.cb},${a.toFixed(3)})`; ctx.fill();
      }
    }

    // ── Pulse ───────────────────────────────────────────────────────────────
    class Pulse {
      a: Node; b: Node; t = 0; spd: number;
      cr: number; cg: number; cb: number;
      constructor(a: Node, b: Node) {
        this.a = a; this.b = b;
        const d = Math.hypot(b.x - a.x, b.y - a.y) || 1;
        this.spd = 2.4 / d;
        this.cr = a.cr; this.cg = a.cg; this.cb = a.cb;
      }
      step() { this.t += this.spd * 0.016 * 60 * 0.028; }
      draw() {
        if (this.t >= 1) return;
        const x = this.a.x + (this.b.x - this.a.x) * this.t;
        const y = this.a.y + (this.b.y - this.a.y) * this.t;
        ctx.beginPath(); ctx.arc(x, y, 5.5, 0, Math.PI*2);
        ctx.fillStyle = `rgba(${this.cr},${this.cg},${this.cb},.1)`; ctx.fill();
        ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI*2);
        ctx.fillStyle = `rgba(${this.cr},${this.cg},${this.cb},.9)`; ctx.fill();
      }
      get done() { return this.t >= 1; }
    }

    const nodes: Node[] = Array.from({ length: NODE_COUNT }, () => new Node());
    let pulses: Pulse[] = [];
    let pTimer = 0;

    function trySpawnPulse() {
      const n1 = nodes[Math.floor(Math.random() * nodes.length)];
      const nb = nodes.filter(n => n !== n1 && Math.hypot(n.x-n1.x, n.y-n1.y) < CONNECT_D);
      if (nb.length) pulses.push(new Pulse(n1, nb[Math.floor(Math.random() * nb.length)]));
    }

    // ── Spatial-grid connection draw (O(n) bucket check, no sqrt for cull) ─
    function tryDrawLine(a: Node, b: Node) {
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const d2 = dx * dx + dy * dy;
      if (d2 >= CONNECT_D2) return;
      const alpha = (1 - Math.sqrt(d2) / CONNECT_D) * 0.30;
      const r  = ((a.cr + b.cr) / 2) | 0;
      const g  = ((a.cg + b.cg) / 2) | 0;
      const bl = ((a.cb + b.cb) / 2) | 0;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = `rgba(${r},${g},${bl},${alpha.toFixed(3)})`;
      ctx.stroke();
    }

    function drawConnections() {
      const cellSize = CONNECT_D;
      const cols = Math.ceil(W / cellSize) + 1;

      const grid = new Map<number, Node[]>();
      for (const node of nodes) {
        const col = Math.floor(node.x / cellSize);
        const row = Math.floor(node.y / cellSize);
        const key = row * cols + col;
        const cell = grid.get(key);
        if (cell) cell.push(node);
        else grid.set(key, [node]);
      }

      ctx.lineWidth = 0.55;

      for (const [key, cellNodes] of grid) {
        const col = key % cols;
        const row = Math.floor(key / cols);

        // Same-cell pairs (i < j avoids double-draw)
        for (let i = 0; i < cellNodes.length; i++) {
          for (let j = i + 1; j < cellNodes.length; j++) {
            tryDrawLine(cellNodes[i], cellNodes[j]);
          }
        }

        // Forward-only neighbors: covers every adjacent pair exactly once
        const neighbors: [number, number][] = [
          [col + 1, row - 1],
          [col + 1, row    ],
          [col + 1, row + 1],
          [col,     row + 1],
        ];
        for (const [nc, nr] of neighbors) {
          const neighborNodes = grid.get(nr * cols + nc);
          if (!neighborNodes) continue;
          for (const a of cellNodes) {
            for (const b of neighborNodes) {
              tryDrawLine(a, b);
            }
          }
        }
      }
    }

    // ── Sine columns ────────────────────────────────────────────────────────
    function drawColumns(t: number) {
      const NUM_COLS = 11;
      for (let c = 0; c < NUM_COLS; c++) {
        const base = (c / (NUM_COLS - 1)) * W;
        const ph   = c * 0.58;
        const ci   = c % 3;
        let r: number, g: number, b: number;
        if      (ci === 0) { r=232; g=41;  b=74;  }
        else if (ci === 1) { r=74;  g=95;  b=173; }
        else               { r=123; g=107; b=181; }
        ctx.beginPath();
        for (let y = 0; y <= H; y += 3) {
          const x = base
            + Math.sin(y * 0.0085 + t * 0.44 + ph)       * 36
            + Math.sin(y * 0.0050 + t * 0.27 + ph * 1.4) * 17;
          y === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${r},${g},${b},0.055)`;
        ctx.lineWidth   = 1;
        ctx.stroke();
      }
    }

    // ── Render loop (60 fps cap) ────────────────────────────────────────────
    let wt = 0;
    let lastTime = 0;
    let rafId = 0;

    function frame(timestamp: number) {
      rafId = requestAnimationFrame(frame);
      if (timestamp - lastTime < FRAME_MS) return;
      lastTime = timestamp;

      ctx.fillStyle = 'rgba(6,6,8,0.17)';
      ctx.fillRect(0, 0, W, H);

      drawColumns(wt);
      drawConnections();

      for (const n of nodes) { n.update(); n.draw(); }

      pTimer++;
      if (pTimer % 7 === 0) trySpawnPulse();
      pulses = pulses.filter(p => !p.done);
      for (const p of pulses) { p.step(); p.draw(); }

      const vg = ctx.createRadialGradient(W*.5, H*.5, H*.22, W*.5, H*.5, H*.88);
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, 'rgba(6,6,8,.72)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);

      wt += 0.016;
    }

    rafId = requestAnimationFrame(frame);

    // ── Scroll transitions ──────────────────────────────────────────────────
    function onScroll() {
      const sy = window.scrollY;
      const VH = window.innerHeight;

      canvas!.style.opacity = String(Math.max(0, 1 - sy / (VH * 0.75)));

      const progress = Math.min(1, sy / (VH * 0.62));
      z1!.style.opacity   = String(1 - progress);
      z1!.style.transform = `translateY(${-progress * 38}px)`;

      sy > 30
        ? mainNav!.classList.add('scrolled')
        : mainNav!.classList.remove('scrolled');

      if (sy > VH * 0.44) {
        btnJoin!.classList.add('hidden');
        navLogo!.classList.add('visible');
      } else {
        btnJoin!.classList.remove('hidden');
        navLogo!.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ── Scroll-reveal on uni chips ──────────────────────────────────────────
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).style.opacity   = '1';
          (e.target as HTMLElement).style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.uni-chip').forEach(el => {
      (el as HTMLElement).style.opacity    = '0';
      (el as HTMLElement).style.transform  = 'translateY(20px)';
      (el as HTMLElement).style.transition = 'opacity .6s ease-out, transform .6s ease-out';
      io.observe(el);
    });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
    };
  }, []);

  const fontVars = [
    rajdhani.variable,
    russoOne.variable,
    shareTechMono.variable,
    exo2.variable,
  ].join(' ');

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: LANDING_CSS }} />

      <div className="star-field" ref={starsRef} />
      <canvas id="bg-canvas" ref={canvasRef} />
      <div className="grain" />

      <div className={`page ${fontVars}`}>

        <nav id="main-nav" ref={navRef as React.RefObject<HTMLElement>}>
          <div className="nav-logo" ref={navLogoRef}>
            Team<span>Finder</span>
          </div>
          <Link
            href="/auth/login"
            className="btn-join"
            ref={btnJoinRef as React.RefObject<HTMLAnchorElement>}
          >
            Join TeamFinder
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
            </svg>
          </Link>
        </nav>

        <section className="zone1">
          <div className="zone1-content" ref={zone1Ref}>
            <div className="cx-logo">
              <span>C</span>
              <svg className="cx-svg" viewBox="0 0 48 58">
                <g fill="#eae8f2">
                  <rect x="0" y="8" width="9" height="41"/>
                  <rect x="0" y="27" width="14" height="4"/>
                  <rect x="28" y="27" width="15" height="4"/>
                  <polygon points="34,8 37,8 38,10 41,11 43,13 43,49 34,49"/>
                  <polygon points="43,13 41,9 78,2"/>
                  <polygon points="42,12 40,8 70,-5"/>
                  <polygon points="44,12 40,8 65,-9"/>
                  <polygon points="43,12 39,8 61,-10"/>
                  <polygon points="43,11 39,9 55,-12"/>
                  <polygon points="44,11 40,9 49,-11"/>
                  <polygon points="44,10 40,10 44,-10"/>
                  <polygon points="44,9 41,9 42,-8"/>
                </g>
              </svg>
              <span>Λ</span>
              <span className="cx-o">O</span>
              <span>S</span>
              <span style={{ marginLeft: '0.24em' }}>X</span>
            </div>
            <div className="cx-tagline">Create · Code · Conquer</div>
            <div className="cx-bridge">
              <div className="cx-bridge-line" />
              <div className="cx-bridge-text">Presenting</div>
              <div className="cx-bridge-product">Team<span>Finder</span></div>
            </div>
          </div>
          <div className="scroll-hint">
            <span>scroll to explore</span>
            <div className="scroll-line" />
          </div>
        </section>

        <section className="hero-section">
          <div className="col-left">
            <div className="col-label">Overview</div>
            <ul className="feature-list">
              <li><span className="bullet-blue">•</span><span>Algorithmic team matching</span></li>
              <li><span className="bullet-blue">•</span><span>60% skills, 25% rating, 15% availability</span></li>
              <li><span className="bullet-blue">•</span><span>Transparent scoring system</span></li>
              <li><span className="bullet-blue">•</span><span>Smart penalty detection</span></li>
            </ul>
          </div>
          <div className="col-center" style={{ position: 'relative' }}>
            <div className="hero-orb" />
            <h1 className="hero-headline">
              Find Your<br />
              <span className="line-grad">Team.</span>
            </h1>
            <p className="hero-sub">Initiate Your Project Odyssey.</p>
            <Link href="/auth/login" className="btn-cta">
              Join TeamFinder
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </Link>
          </div>
          <div className="col-right">
            <div className="col-label" style={{ textAlign: 'right' }}>Features</div>
            <ul className="feature-list">
              <li><span>Verified skill ratings</span><span className="bullet-red">•</span></li>
              <li><span>Real-time matching</span><span className="bullet-red">•</span></li>
              <li><span>Project collaboration</span><span className="bullet-red">•</span></li>
              <li><span>Exam validation system</span><span className="bullet-red">•</span></li>
            </ul>
          </div>
        </section>

        <div className="section-divider" />

        <div className="uni-section">
          <div className="uni-eyebrow">Verified Campus Networks</div>
          <div className="uni-row">
            <div className="uni-chip">University of Jordan — @ju.edu.jo</div>
            <div className="uni-chip">Hashemite University — @hu.edu.jo</div>
          </div>
        </div>

        <footer>
          <div className="footer-logo">Team<span>Finder</span></div>
          <div className="footer-tag">Create. Code. Conquer.</div>
        </footer>

      </div>
    </>
  );
}
