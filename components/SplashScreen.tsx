"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  onDone: () => void;
  durationMs?: number;
  showOncePerSession?: boolean;
};

export default function SplashScreen({
  onDone,
  durationMs = 2000,
  showOncePerSession = true,
}: Props) {
  const [phase, setPhase] = useState<"in" | "out">("in");
  const [hidden, setHidden] = useState(false);

  const reduceMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);
}

