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

// ---------- particle config (stable across renders) ----------
const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: 4 + ((i * 19) % 92),
  size: 1.2 + (i % 4) * 0.8,
  duration: 5 + (i % 5) * 2.2,
  delay: (i * 0.38) % 7,
  opacity: 0.18 + (i % 5) * 0.065,
}));

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

  // once-per-session guard — clears on unload so every reload shows the splash
  useEffect(() => {
    if (!showOncePerSession) return;
    const key = "tm_splash_seen";
    try {
      if (sessionStorage.getItem(key) === "1") {
        setHidden(true);
        onDone();
      } else {
        sessionStorage.setItem(key, "1");
      }
    } catch { /* ignore */ }

    // Clear the flag when the page unloads so reloads always show the splash
    const clearOnUnload = () => {
      try { sessionStorage.removeItem(key); } catch { /* ignore */ }
    };
    window.addEventListener("beforeunload", clearOnUnload);
    return () => window.removeEventListener("beforeunload", clearOnUnload);
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
        @keyframes tm-float-up {
          0%   { transform: translateY(0) scale(1);   opacity: 0; }
          10%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: translateY(-120vh) scale(0.6); opacity: 0; }
        }
        @keyframes tm-aurora-1 {
          0%,100% { transform: translate(0%, 0%)   scale(1);    }
          33%      { transform: translate(6%, -8%)  scale(1.08); }
          66%      { transform: translate(-4%, 5%)  scale(0.95); }
        }
        @keyframes tm-aurora-2 {
          0%,100% { transform: translate(0%, 0%)   scale(1);    }
          40%      { transform: translate(-7%, 6%)  scale(1.06); }
          70%      { transform: translate(5%, -4%)  scale(0.97); }
        }
        @keyframes tm-halo-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes tm-breathe {
          0%,100% { transform: scale(1);    }
          50%     { transform: scale(1.035); }
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
        @keyframes tm-ping-dot {
          0%,100% { opacity: 1; transform: scale(1); }
          50%     { opacity: 0.4; transform: scale(1.5); }
        }
      `}</style>

      {/* ── Aurora background blobs ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div style={{
          position: "absolute",
          top: "-10%", left: "5%",
          width: "55vmax", height: "55vmax",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(120,80,255,0.18) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "tm-aurora-1 12s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute",
          bottom: "-15%", right: "0%",
          width: "50vmax", height: "50vmax",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,200,230,0.14) 0%, transparent 70%)",
          filter: "blur(70px)",
          animation: "tm-aurora-2 14s ease-in-out infinite",
        }} />
        {/* subtle top-centre highlight */}
        <div style={{
          position: "absolute",
          top: "0", left: "50%",
          transform: "translateX(-50%)",
          width: "60vmax", height: "32vmax",
          background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.055) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        {/* vignette */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.72) 100%)",
          transition: "opacity 700ms",
          opacity: exiting ? 0 : 1,
        }} />
        {/* film grain */}
        <div style={{
          position: "absolute", inset: "-50%",
          width: "200%", height: "200%",
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          opacity: 0.055,
          mixBlendMode: "overlay",
          animation: "tm-grain-drift 0.18s steps(1) infinite",
        }} />
      </div>

      {/* ── Floating particles ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            style={{
              position: "absolute",
              bottom: 0,
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: "50%",
              background: "#fff",
              opacity: p.opacity,
              animation: `tm-float-up ${p.duration}s ease-in ${p.delay}s infinite`,
            }}
          />
        ))}
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
        {/* ── Orb ── */}
        <div style={{ position: "relative", width: 180, height: 180 }}>
          {/* Halo spin ring */}
          {ready && (
            <div style={{
              position: "absolute",
              inset: -12,
              borderRadius: "50%",
              background: "conic-gradient(from 0deg, transparent 0deg, rgba(160,100,255,0.0) 200deg, rgba(160,100,255,0.55) 280deg, rgba(80,220,255,0.6) 320deg, transparent 360deg)",
              animation: "tm-halo-spin 3s linear infinite",
              filter: "blur(1.5px)",
            }} />
          )}
          {/* Outer glow */}
          <div style={{
            position: "absolute",
            inset: -4,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(160,80,255,0.28) 0%, rgba(0,200,255,0.16) 55%, transparent 80%)",
            filter: "blur(14px)",
          }} />
          {/* The orb itself – breathing */}
          <div style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "radial-gradient(circle at 38% 36%, rgba(255,255,255,0.82) 0%, rgba(200,160,255,0.55) 30%, rgba(80,180,255,0.35) 60%, rgba(30,30,50,0.7) 100%)",
            boxShadow: "0 0 60px rgba(160,80,255,0.45), 0 0 120px rgba(80,220,255,0.22), inset 0 0 30px rgba(255,255,255,0.1)",
            animation: "tm-breathe 3.4s ease-in-out infinite",
          }} />
          {/* Specular glint */}
          {ready && (
            <div style={{
              position: "absolute",
              top: "12%", left: "20%",
              width: "38%", height: "24%",
              borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(255,255,255,0.65) 0%, transparent 70%)",
              filter: "blur(4px)",
              transform: "rotate(-20deg)",
            }} />
          )}
          {/* Ping dot */}
          <div style={{
            position: "absolute",
            top: "14%", right: "18%",
            width: 7, height: 7,
            borderRadius: "50%",
            background: "rgba(120,220,255,0.9)",
            boxShadow: "0 0 10px rgba(80,220,255,0.8)",
            animation: "tm-ping-dot 1.8s ease-in-out infinite",
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
                    textShadow: "0 0 28px rgba(200,160,255,0.5)",
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
                background: "linear-gradient(90deg, transparent 20%, rgba(255,255,255,0.2) 50%, transparent 80%)",
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
          background: "rgba(255,255,255,0.1)",
          overflow: "hidden",
          position: "relative",
        }}>
          {/* fill */}
          <div style={{
            height: "100%",
            background: "linear-gradient(90deg, rgba(160,80,255,0.8), rgba(80,200,255,0.9))",
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
