"use client";

import { useEffect, useMemo, useState } from "react";

type NavSection = { id: string; label: string };

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export default function Navbar({ sections }: { sections: NavSection[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "home");
  const ids = useMemo(() => sections.map((s) => s.id), [sections]);

  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

        if (visible?.target?.id) setActive(visible.target.id);
      },
      { root: null, rootMargin: "-25% 0px -60% 0px", threshold: [0.05, 0.1, 0.2] }
    );

    for (const el of els) io.observe(el);
    return () => io.disconnect();
  }, [ids]);

  function goTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="sticky top-0 z-20 w-full">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <button
          onClick={() => goTo("home")}
          className="text-sm font-medium tracking-tight text-white/90 hover:text-white"
        >
          TM
        </button>

        <nav className="hidden gap-1 rounded-full border border-white/10 bg-black/40 px-2 py-2 backdrop-blur-md sm:flex">
          {sections.map((s) => {
            const isActive = s.id === active;
            return (
              <button
                key={s.id}
                onClick={() => goTo(s.id)}
                className={[
                  "rounded-full px-3 py-1.5 text-xs transition",
                  isActive ? "bg-white/12 text-white" : "text-white/70 hover:text-white",
                ].join(" ")}
              >
                {s.label}
              </button>
            );
          })}
        </nav>

        <button
          onClick={() => goTo("contact")}
          className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/90 hover:bg-white/10"
        >
          Contact
        </button>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}
