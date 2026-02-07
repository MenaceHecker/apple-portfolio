"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  onDone: () => void;
  durationMs?: number; // total time before exit starts
  showOncePerSession?: boolean;
};

export default function SplashScreen({
  onDone,
  durationMs = 3000,
  showOncePerSession = true,
}: Props) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");
  const [hidden, setHidden] = useState(false);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(t);
  }, []);


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
      // ignore
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (hidden) return;

    if (reduceMotion) {
      const t = window.setTimeout(() => {
        setHidden(true);
        onDone();
      }, 450);
      return () => window.clearTimeout(t);
    }

    const tEnter = window.setTimeout(() => setPhase("hold"), 520);
    const tExit = window.setTimeout(() => setPhase("exit"), durationMs);
    const tDone = window.setTimeout(() => {
      setHidden(true);
      onDone();
    }, durationMs + 650);

    return () => {
      window.clearTimeout(tEnter);
      window.clearTimeout(tExit);
      window.clearTimeout(tDone);
    };
  }, [durationMs, hidden, onDone, reduceMotion]);

  if (hidden) return null;

  const exiting = phase === "exit";

  return (
    <div
      className={[
        "fixed inset-0 z-[60] grid place-items-center bg-black",
        "transition-opacity duration-700",
        exiting ? "opacity-0" : "opacity-100",
      ].join(" ")}
      aria-label="Loading"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.14),transparent_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.08),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black" />
        <div className="tm-grain absolute inset-0 opacity-[0.22]" />
        <div className={`tm-vignette absolute inset-0 ${exiting ? "opacity-0" : "opacity-100"} transition-opacity duration-700`} />
      </div>

      <div
        className={[
          "relative flex flex-col items-center",
          "transition-all duration-700 ease-out",
          exiting ? "scale-[0.985]" : "scale-100",
        ].join(" ")}
      >
        <div className="relative h-[160px] w-[160px] md:h-[200px] md:w-[200px]">
          <div className="tm-orb2 absolute inset-0 rounded-full" />
          <div className="tm-orbGlow2 absolute inset-0 rounded-full" />
          <div className={`absolute inset-0 rounded-full ${ready ? "tm-glint" : ""}`} />
        </div>

        <div className="mt-9 text-center">
          <div className="relative overflow-hidden">
            <div
              className={[
                "text-[22px] md:text-[24px] font-semibold tracking-tight text-white/92",
                "transition-transform duration-700 ease-out",
                phase === "enter" ? "translate-y-6" : "translate-y-0",
                exiting ? "translate-y-1" : "",
              ].join(" ")}
            >
              Tushar Mishra
            </div>

            <div className={`tm-textShine pointer-events-none absolute inset-0 ${ready ? "" : "opacity-0"}`} />
          </div>

          <div className="mt-2 overflow-hidden">
            <div
              className={[
                "text-xs md:text-sm text-white/55 tracking-[0.22em] uppercase",
                "transition-transform duration-700 ease-out delay-75",
                phase === "enter" ? "translate-y-5" : "translate-y-0",
                exiting ? "translate-y-1" : "",
              ].join(" ")}
            >
              Software Engineer
            </div>
          </div>
        </div>

        <div className="mt-10 h-[2px] w-[220px] overflow-hidden rounded-full bg-white/10">
          <div className={`h-full w-full ${ready ? "tm-progress" : ""}`} />
        </div>
      </div>
    </div>
  );
}
