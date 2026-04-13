"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  onDone: () => void;
  durationMs?: number;
  showOncePerSession?: boolean;
};

// ---------- helpers ----------
const NAME = "Tushar Mishra";
const SUBTITLE = "Software Engineer";

function splitLetters(text: string) {
  return text.split("").map((char, i) => ({
    char,
    key: `${char}-${i}`,
    delay: i * 0.045,
  }));
}

// ---------- circuit grid config ----------
const GRID_COLS = 28;
const GRID_ROWS = 16;
const GRID_DOTS = Array.from({ length: GRID_COLS * GRID_ROWS }, (_, i) => {
  const col = i % GRID_COLS;
  const row = Math.floor(i / GRID_COLS);
  // distance from centre for pulse timing
  const cx = GRID_COLS / 2;
  const cy = GRID_ROWS / 2;
  const dist = Math.sqrt((col - cx) ** 2 + (row - cy) ** 2);
  return { id: i, col, row, dist };
});

// ---------- circuit trace paths ----------
const TRACES = [
  { id: 0, x1: 15, y1: 25, x2: 42, y2: 25, delay: 0.2, dur: 1.4 },
  { id: 1, x1: 42, y1: 25, x2: 42, y2: 48, delay: 0.5, dur: 1.0 },
  { id: 2, x1: 42, y1: 48, x2: 68, y2: 48, delay: 0.9, dur: 1.2 },
  { id: 3, x1: 58, y1: 20, x2: 85, y2: 20, delay: 0.3, dur: 1.6 },
  { id: 4, x1: 85, y1: 20, x2: 85, y2: 55, delay: 0.8, dur: 1.1 },
  { id: 5, x1: 10, y1: 65, x2: 35, y2: 65, delay: 1.0, dur: 1.3 },
  { id: 6, x1: 35, y1: 65, x2: 35, y2: 82, delay: 1.3, dur: 0.9 },
  { id: 7, x1: 35, y1: 82, x2: 60, y2: 82, delay: 1.6, dur: 1.1 },
  { id: 8, x1: 65, y1: 58, x2: 90, y2: 58, delay: 0.6, dur: 1.5 },
  { id: 9, x1: 20, y1: 40, x2: 20, y2: 75, delay: 1.1, dur: 1.2 },
  { id: 10, x1: 72, y1: 35, x2: 72, y2: 70, delay: 0.4, dur: 1.4 },
  { id: 11, x1: 50, y1: 10, x2: 50, y2: 38, delay: 0.7, dur: 1.0 },
];

// ---------- seeded PRNG (deterministic for SSR) ----------
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- scrolling code columns ----------
const CODE_COLS = (() => {
  const rng = mulberry32(42);
  return Array.from({ length: 8 }, (_, i) => {
    const chars = Array.from({ length: 24 }, () => {
      const r = rng();
      if (r < 0.4) return Math.floor(rng() * 2).toString();
      if (r < 0.7) return "0123456789ABCDEF"[Math.floor(rng() * 16)];
      return ["fn", "let", "=>", "0x", "::", "//", "{}"][Math.floor(rng() * 7)];
    }).join(" ");
    return {
      id: i,
      left: 6 + i * 12.5,
      chars,
      duration: 12 + (i % 4) * 3,
      delay: (i * 0.6) % 5,
      opacity: 0.025 + (i % 3) * 0.01,
    };
  });
})();

export default function SplashScreen({
  onDone,
  durationMs = 3400,
  showOncePerSession = true,
}: Props) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");
  const [hidden, setHidden] = useState(false);
  const [ready, setReady] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [barShine, setBarShine] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const reduceMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  // once-per-session guard
  useEffect(() => {
    if (!showOncePerSession) return;
    try {
      const key = "tm_splash_seen";
      if (sessionStorage.getItem(key) === "1") {
        setHidden(true);
        onDone();
      } else {
        sessionStorage.setItem(key, "1");
      }
    } catch { /* ignore */ }
    // eslint-disable-next-line
  }, []);

  // paint-frame trigger
  useEffect(() => {
    const t = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(t);
  }, []);

  // phase timer
  useEffect(() => {
    if (hidden) return;

    if (reduceMotion) {
      const t = window.setTimeout(() => { setHidden(true); onDone(); }, 450);
      return () => window.clearTimeout(t);
    }

    const tEnter = window.setTimeout(() => setPhase("hold"), 600);
    const tShine = window.setTimeout(() => setBarShine(true), 600 + 2000);
    const tExit = window.setTimeout(() => setPhase("exit"), durationMs);
    const tDone = window.setTimeout(() => { setHidden(true); onDone(); }, durationMs + 700);

    return () => {
      window.clearTimeout(tEnter);
      window.clearTimeout(tShine);
      window.clearTimeout(tExit);
      window.clearTimeout(tDone);
    };
  }, [durationMs, hidden, onDone, reduceMotion]);

  // mouse parallax
  useEffect(() => {
    if (reduceMotion) return;
    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const rx = ((e.clientY - cy) / cy) * -6;
      const ry = ((e.clientX - cx) / cx) * 6;
      setTilt({ x: rx, y: ry });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [reduceMotion]);

  if (hidden) return null;

  const exiting = phase === "exit";
  const nameLetters = splitLetters(NAME);
  const subtitleLetters = splitLetters(SUBTITLE);

  return (
    <div
      ref={containerRef}
      className={[
        "fixed inset-0 z-[60] grid place-items-center",
        "transition-opacity duration-700",
        exiting ? "opacity-0" : "opacity-100",
      ].join(" ")}
      aria-label="Loading"
      style={{ background: "#000" }}
    >
      {/* ── Inline keyframes ── */}
      <style>{`
        @keyframes tm-grid-pulse {
          0%   { opacity: 0.08; transform: scale(1); }
          50%  { opacity: 0.35; transform: scale(1.8); }
          100% { opacity: 0.08; transform: scale(1); }
        }
        @keyframes tm-trace-draw {
          0%   { stroke-dashoffset: 200; opacity: 0; }
          10%  { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0.6; }
        }
        @keyframes tm-trace-glow {
          0%,100% { filter: drop-shadow(0 0 2px rgba(10,132,255,0.3)); }
          50%     { filter: drop-shadow(0 0 8px rgba(10,132,255,0.7)); }
        }
        @keyframes tm-lid-open {
          0%   { transform: perspective(600px) rotateX(-80deg); opacity: 0; }
          40%  { opacity: 1; }
          100% { transform: perspective(600px) rotateX(0deg);   opacity: 1; }
        }
        @keyframes tm-screen-glow {
          0%   { opacity: 0; }
          60%  { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes tm-logo-pulse {
          0%,100% { opacity: 0.7; filter: drop-shadow(0 0 6px rgba(10,132,255,0.4)); }
          50%     { opacity: 1;   filter: drop-shadow(0 0 16px rgba(10,132,255,0.8)); }
        }
        @keyframes tm-scan-line {
          0%   { top: -2px; opacity: 0; }
          5%   { opacity: 0.6; }
          95%  { opacity: 0.6; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes tm-code-scroll {
          0%   { transform: translateY(100vh); }
          100% { transform: translateY(-100%); }
        }
        @keyframes tm-node-ping {
          0%   { r: 1.5; opacity: 0.8; }
          100% { r: 6;   opacity: 0; }
        }
        @keyframes tm-letter-in {
          0%   { opacity: 0; transform: translateY(18px) scale(0.88); }
          100% { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes tm-letter-exit {
          0%   { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-6px); }
        }
        @keyframes tm-bar-fill {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @keyframes tm-bar-shine {
          0%   { left: -60%; }
          100% { left: 110%; }
        }
        @keyframes tm-grain-drift {
          0%,100% { transform: translate(0,0); }
          20%     { transform: translate(-1px, 1px); }
          40%     { transform: translate(1px, -1px); }
          60%     { transform: translate(-1px, -1px); }
          80%     { transform: translate(1px, 1px); }
        }
        @keyframes tm-breathe-subtle {
          0%,100% { opacity: 0.12; }
          50%     { opacity: 0.22; }
        }
      `}</style>

      {/* ── Circuit dot grid ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg
          viewBox={`0 0 ${GRID_COLS * 10} ${GRID_ROWS * 10}`}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
          preserveAspectRatio="xMidYMid slice"
        >
          {GRID_DOTS.map((dot) => (
            <circle
              key={dot.id}
              cx={dot.col * 10 + 5}
              cy={dot.row * 10 + 5}
              r="0.7"
              fill="rgba(10,132,255,0.15)"
              style={{
                animation: ready
                  ? `tm-grid-pulse 3.5s ease-in-out ${dot.dist * 0.12}s infinite`
                  : undefined,
                transformOrigin: `${dot.col * 10 + 5}px ${dot.row * 10 + 5}px`,
              }}
            />
          ))}
        </svg>
      </div>

      {/* ── Circuit trace lines ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg
          viewBox="0 0 100 100"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
          preserveAspectRatio="none"
        >
          {TRACES.map((t) => (
            <g key={t.id}>
              <line
                x1={t.x1} y1={t.y1}
                x2={t.x2} y2={t.y2}
                stroke="rgba(10,132,255,0.4)"
                strokeWidth="0.12"
                strokeDasharray="200"
                style={{
                  animation: ready
                    ? `tm-trace-draw ${t.dur}s ease-out ${t.delay}s both, tm-trace-glow 2s ease-in-out ${t.delay + t.dur}s infinite`
                    : undefined,
                }}
              />
              {/* node dot at start */}
              <circle cx={t.x1} cy={t.y1} r="0.4" fill="rgba(10,132,255,0.6)" />
              {/* node dot at end */}
              <circle cx={t.x2} cy={t.y2} r="0.4" fill="rgba(10,132,255,0.6)" />
              {/* ping at junction */}
              {ready && (
                <circle
                  cx={t.x2} cy={t.y2}
                  r="1.5"
                  fill="none"
                  stroke="rgba(10,132,255,0.5)"
                  strokeWidth="0.15"
                  style={{
                    animation: `tm-node-ping 2s ease-out ${t.delay + t.dur * 0.7}s infinite`,
                  }}
                />
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* ── Scrolling code columns ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {CODE_COLS.map((c) => (
          <div
            key={c.id}
            style={{
              position: "absolute",
              left: `${c.left}%`,
              top: 0,
              width: "8%",
              height: "100%",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                fontFamily: "'SF Mono', 'Fira Code', 'Courier New', monospace",
                fontSize: "9px",
                lineHeight: "1.6",
                color: "rgba(10,132,255,0.9)",
                opacity: c.opacity,
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
                animation: ready
                  ? `tm-code-scroll ${c.duration}s linear ${c.delay}s infinite`
                  : undefined,
              }}
            >
              {c.chars}
            </div>
          </div>
        ))}
      </div>

      {/* ── Scan line ── */}
      {ready && (
        <div
          className="pointer-events-none absolute inset-x-0"
          style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent 5%, rgba(10,132,255,0.5) 30%, rgba(10,132,255,0.7) 50%, rgba(10,132,255,0.5) 70%, transparent 95%)",
            boxShadow: "0 0 12px rgba(10,132,255,0.4), 0 0 30px rgba(10,132,255,0.15)",
            animation: "tm-scan-line 2.8s ease-in-out 0.3s 1 both",
          }}
        />
      )}

      {/* ── Ambient glow (replaces aurora blobs) ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* top-left tech glow */}
        <div style={{
          position: "absolute",
          top: "-8%", left: "8%",
          width: "45vmax", height: "45vmax",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(10,132,255,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "tm-breathe-subtle 6s ease-in-out infinite",
        }} />
        {/* bottom-right accent */}
        <div style={{
          position: "absolute",
          bottom: "-12%", right: "5%",
          width: "40vmax", height: "40vmax",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(10,132,255,0.06) 0%, transparent 70%)",
          filter: "blur(70px)",
          animation: "tm-breathe-subtle 8s ease-in-out 2s infinite",
        }} />
        {/* vignette */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.78) 100%)",
          transition: "opacity 700ms",
          opacity: exiting ? 0 : 1,
        }} />
        {/* film grain */}
        <div style={{
          position: "absolute", inset: "-50%",
          width: "200%", height: "200%",
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          opacity: 0.045,
          mixBlendMode: "overlay",
          animation: "tm-grain-drift 0.18s steps(1) infinite",
        }} />
      </div>

      {/* ── Centre content ── */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transition: exiting
            ? "transform 700ms ease-in, opacity 700ms"
            : "transform 0.12s ease-out",
          transform: exiting
            ? "scale(0.97)"
            : `perspective(700px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          opacity: exiting ? 0 : 1,
        }}
      >
        {/* ── MacBook Pro wireframe ── */}
        <div style={{ position: "relative", width: 220, height: 160 }}>
          <svg
            viewBox="0 0 220 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              width: "100%",
              height: "100%",
              overflow: "visible",
            }}
          >
            {/* Screen lid – animated open */}
            <g style={{
              transformOrigin: "110px 130px",
              animation: ready ? "tm-lid-open 1.2s cubic-bezier(0.22,1,0.36,1) 0.2s both" : undefined,
            }}>
              {/* Screen bezel */}
              <rect
                x="20" y="8"
                width="180" height="118"
                rx="6"
                stroke="rgba(200,200,210,0.35)"
                strokeWidth="1.2"
                fill="rgba(10,12,18,0.95)"
              />
              {/* Inner screen area */}
              <rect
                x="28" y="14"
                width="164" height="106"
                rx="3"
                fill="rgba(10,132,255,0.03)"
                stroke="rgba(10,132,255,0.12)"
                strokeWidth="0.5"
              />
              {/* Screen glow */}
              <rect
                x="28" y="14"
                width="164" height="106"
                rx="3"
                fill="url(#screenGlow)"
                style={{
                  animation: ready ? "tm-screen-glow 1.8s ease-out 0.5s both" : undefined,
                }}
              />
              {/* Camera notch */}
              <rect
                x="101" y="8"
                width="18" height="5"
                rx="2.5"
                fill="rgba(10,12,18,0.95)"
                stroke="rgba(200,200,210,0.2)"
                strokeWidth="0.5"
              />
              {/* Camera dot */}
              <circle cx="110" cy="11" r="1.2" fill="rgba(80,200,120,0.5)" />

              {/* ── Apple logo on screen ── */}
              <g transform="translate(97, 48) scale(0.5)" style={{
                animation: ready ? "tm-logo-pulse 2.8s ease-in-out 1.2s infinite" : undefined,
              }}>
                {/* Simplified Apple logo path */}
                <path
                  d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.81-1.31.05-2.31-1.32-3.15-2.55C4.23 16.81 2.96 12.2 4.79 9.14c.9-1.52 2.51-2.48 4.26-2.51 1.29-.02 2.52.87 3.31.87.79 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83l-.25.25z M15.5 4.15c.68-.83 1.14-1.98 1.01-3.15-0.98.04-2.16.65-2.87 1.48-.63.73-1.18 1.91-1.03 3.03 1.09.08 2.2-.55 2.89-1.36z"
                  fill="rgba(10,132,255,0.8)"
                  stroke="none"
                />
              </g>

              {/* Mini terminal lines on screen */}
              {[0, 1, 2, 3, 4].map((i) => (
                <rect
                  key={i}
                  x={36}
                  y={72 + i * 8}
                  width={40 + ((i * 17) % 80)}
                  height="1.5"
                  rx="0.75"
                  fill={`rgba(10,132,255,${0.06 + i * 0.02})`}
                  style={{
                    animation: ready ? `tm-screen-glow ${1.6 + i * 0.2}s ease-out ${0.8 + i * 0.15}s both` : undefined,
                  }}
                />
              ))}
            </g>

            {/* Base body */}
            <path
              d="M10 130 L210 130 L215 140 Q215 145 210 145 L10 145 Q5 145 5 140 Z"
              stroke="rgba(200,200,210,0.3)"
              strokeWidth="0.8"
              fill="rgba(30,30,38,0.6)"
            />
            {/* Trackpad indent */}
            <rect
              x="80" y="132"
              width="60" height="8"
              rx="2"
              stroke="rgba(200,200,210,0.12)"
              strokeWidth="0.4"
              fill="none"
            />
            {/* Hinge line */}
            <line
              x1="15" y1="130"
              x2="205" y2="130"
              stroke="rgba(200,200,210,0.15)"
              strokeWidth="0.3"
            />

            {/* Gradient defs */}
            <defs>
              <radialGradient id="screenGlow" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="rgba(10,132,255,0.12)" />
                <stop offset="50%" stopColor="rgba(10,132,255,0.04)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
          </svg>

          {/* External glow behind MacBook */}
          <div style={{
            position: "absolute",
            inset: -20,
            borderRadius: "20%",
            background: "radial-gradient(ellipse at 50% 40%, rgba(10,132,255,0.12) 0%, transparent 65%)",
            filter: "blur(20px)",
            zIndex: -1,
          }} />
        </div>

        {/* ── Name: staggered letters ── */}
        <div style={{ marginTop: 36, textAlign: "center" }}>
          <div style={{ position: "relative", overflow: "visible" }}>
            <div
              aria-label={NAME}
              style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: "0 0",
              }}
            >
              {nameLetters.map(({ char, key, delay }) => (
                <span
                  key={key}
                  style={{
                    display: "inline-block",
                    fontSize: "clamp(20px, 3.5vw, 26px)",
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    color: "rgba(255,255,255,0.93)",
                    textShadow: "0 0 28px rgba(10,132,255,0.5)",
                    whiteSpace: char === " " ? "pre" : undefined,
                    animation: ready
                      ? exiting
                        ? `tm-letter-exit 0.4s ease-in ${delay * 0.3}s both`
                        : `tm-letter-in 0.55s cubic-bezier(0.22,1,0.36,1) ${delay}s both`
                      : undefined,
                    opacity: ready ? undefined : 0,
                  }}
                >
                  {char}
                </span>
              ))}
            </div>

            {/* Text shimmer overlay */}
            {ready && (
              <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(90deg, transparent 20%, rgba(10,132,255,0.15) 50%, transparent 80%)",
                backgroundSize: "200% 100%",
                animation: "tm-bar-shine 2.6s ease-in-out 0.7s infinite",
                pointerEvents: "none",
                mixBlendMode: "overlay",
              }} />
            )}
          </div>

          {/* ── Subtitle: staggered letters ── */}
          <div style={{ marginTop: 10, overflow: "hidden" }}>
            <div
              aria-label={SUBTITLE}
              style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {subtitleLetters.map(({ char, key, delay }) => (
                <span
                  key={key}
                  style={{
                    display: "inline-block",
                    fontSize: "clamp(10px, 1.5vw, 13px)",
                    color: "rgba(255,255,255,0.52)",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    whiteSpace: char === " " ? "pre" : undefined,
                    animation: ready
                      ? `tm-letter-in 0.5s cubic-bezier(0.22,1,0.36,1) ${0.25 + delay * 0.9}s both`
                      : undefined,
                    opacity: ready ? undefined : 0,
                  }}
                >
                  {char}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Progress bar ── */}
        <div style={{
          marginTop: 40,
          width: 224,
          height: 2,
          borderRadius: 9999,
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
          position: "relative",
        }}>
          {/* fill */}
          <div style={{
            height: "100%",
            background: "linear-gradient(90deg, rgba(180,190,200,0.6), rgba(10,132,255,0.9))",
            borderRadius: 9999,
            animation: ready ? `tm-bar-fill ${durationMs - 600}ms cubic-bezier(0.4,0,0.2,1) 0.3s both` : undefined,
            width: ready ? undefined : "0%",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* shine on bar */}
            {barShine && (
              <div style={{
                position: "absolute",
                top: 0, bottom: 0,
                width: "50%",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)",
                animation: "tm-bar-shine 0.6s ease-out 0s 1 both",
              }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
