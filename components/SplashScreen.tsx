"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  onDone: () => void;
  durationMs?: number;
  showOncePerSession?: boolean;
};

export default function SplashScreen({
  onDone,
  durationMs = 1400,
  showOncePerSession = true,
}: Props) {
  const [phase, setPhase] = useState<"in" | "out">("in");
  const [hidden, setHidden] = useState(false);

  const reduceMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

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
    } catch {
      // ignore sessionStorage errors
    }
  }, []);

  useEffect(() => {
    if (hidden) return;

    if (reduceMotion) {
      const t = window.setTimeout(() => {
        setHidden(true);
        onDone();
      }, 250);
      return () => window.clearTimeout(t);
    }

    const t1 = window.setTimeout(() => setPhase("out"), durationMs);
    const t2 = window.setTimeout(() => {
      setHidden(true);
      onDone();
    }, durationMs + 420);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [durationMs, hidden, onDone, reduceMotion]);

  if (hidden) return null;

  return (
    <div
      className={[
        "fixed inset-0 z-[60] grid place-items-center bg-black",
        "transition-opacity duration-500",
        phase === "out" ? "opacity-0" : "opacity-100",
      ].join(" ")}
      aria-label="Loading"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black" />
        <div className="tm-grain absolute inset-0 opacity-[0.22]" />
      </div>

      <div
        className={[
          "relative flex flex-col items-center",
          "transition-transform duration-700",
          phase === "out" ? "scale-[0.98]" : "scale-100",
        ].join(" ")}
      >
        <div className="relative h-[140px] w-[140px] md:h-[170px] md:w-[170px]">
          <div className="tm-orb absolute inset-0 rounded-full" />
          <div className="tm-orbGlow absolute inset-0 rounded-full" />
        </div>

        <div className="mt-8 text-center">
          <div className="overflow-hidden">
            <div
              className={[
                "text-[20px] md:text-[22px] font-semibold tracking-tight text-white/90",
                "transition-transform duration-700 ease-out",
                phase === "out" ? "translate-y-2" : "translate-y-0",
              ].join(" ")}
            >
              Tushar Mishra
            </div>
          </div>

          <div className="mt-2 overflow-hidden">
            <div
              className={[
                "text-xs md:text-sm text-white/55 tracking-[0.18em] uppercase",
                "transition-transform duration-700 ease-out delay-75",
                phase === "out" ? "translate-y-2" : "translate-y-0",
              ].join(" ")}
            >
              Software Engineer
            </div>
          </div>
        </div>

        {/* Thin loading line */}
        <div className="mt-10 h-[2px] w-[180px] overflow-hidden rounded-full bg-white/10">
          <div className="tm-bar h-full w-1/2 rounded-full bg-white/45" />
        </div>
      </div>
    </div>
  );
}
