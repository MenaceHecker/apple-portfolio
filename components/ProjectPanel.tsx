"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSceneState, ProjectId } from "@/components/SceneState";

const PROJECTS: Record<ProjectId, { title: string; subtitle: string; bullets: string[]; stack: string[] }> = {
  nexus: {
    title: "Nexus",
    subtitle: "Distributed observability stack",
    bullets: ["SLO dashboards + error budgets", "Prometheus/Grafana pipeline", "Logs + root-cause workflows"],
    stack: ["Python", "Prometheus", "Grafana", "ELK", "PostgreSQL"],
  },
  inboxiq: {
    title: "InboxIQ",
    subtitle: "Intelligent email organizer",
    bullets: ["Unified inbox workflows", "Provider integrations", "Search-first UX"],
    stack: ["Next.js", "TypeScript", "Prisma", "Auth", "Search"],
  },
  pulseforge: {
    title: "PulseForge",
    subtitle: "Event-driven backend platform for reliable async processing",
    bullets: [
      "Asynchronous event ingestion and processing",
      "Retry logic, idempotency, and failure handling",
      "JWT-based auth with role-based access control",
    ],
    stack: ["Java", "Spring Boot", "PostgreSQL", "JWT", "Async"],
  },
};

export default function ProjectPanel() {
  const { activeProject, setActiveProject, panelFrom, setPanelFrom } = useSceneState();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const [animating, setAnimating] = useState(false);

  const isOpen = !!activeProject;
  const p = useMemo(() => (activeProject ? PROJECTS[activeProject] : null), [activeProject]);

  const playOpen = async () => {
    const el = panelRef.current;
    if (!el || !panelFrom) return;

    await new Promise((r) => requestAnimationFrame(() => r(null)));

    const to = el.getBoundingClientRect();
    const from = panelFrom;

    const fromCx = from.left + from.width / 2;
    const fromCy = from.top + from.height / 2;
    const toCx = to.left + to.width / 2;
    const toCy = to.top + to.height / 2;

    const dx = fromCx - toCx;
    const dy = fromCy - toCy;

    const sx = from.width / to.width;
    const sy = from.height / to.height;

    el.style.transformOrigin = "center";
    el.style.willChange = "transform, opacity, filter";
    el.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
    el.style.opacity = "0.95";
    el.style.filter = "blur(0px)";

    el.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, opacity: 0.95 },
        { transform: "translate(0px, 0px) scale(1, 1)", opacity: 1 },
      ],
      { duration: 520, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "forwards" }
    );

    // clearing the origin once opened so future resizes don’t use stale rect
    setPanelFrom(null);
  };

  const playClose = async () => {
    const el = panelRef.current;
    if (!el || !activeProject) {
      setActiveProject(null);
      return;
    }

    // finding the card again by data-project so it closes back to the real place
    const btn = document.querySelector(`[data-project="${activeProject}"]`) as HTMLElement | null;
    if (!btn) {
      setActiveProject(null);
      return;
    }

    const from = btn.getBoundingClientRect();
    const to = el.getBoundingClientRect();

    const fromCx = from.left + from.width / 2;
    const fromCy = from.top + from.height / 2;
    const toCx = to.left + to.width / 2;
    const toCy = to.top + to.height / 2;

    const dx = fromCx - toCx;
    const dy = fromCy - toCy;

    const sx = from.width / to.width;
    const sy = from.height / to.height;

    setAnimating(true);

    const anim = el.animate(
      [
        { transform: "translate(0px, 0px) scale(1, 1)", opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, opacity: 0.0 },
      ],
      { duration: 420, easing: "cubic-bezier(0.2, 0.9, 0.2, 1)", fill: "forwards" }
    );

    await anim.finished.catch(() => {});
    setAnimating(false);
    setActiveProject(null);
  };

  useEffect(() => {
    if (!isOpen) return;

    closeBtnRef.current?.focus();

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") void playClose();
    };

    window.addEventListener("keydown", onKey);
    void playOpen();

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };

  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 transition ${
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!isOpen}
    >
      {/* scrim */}
      <div
        className={`absolute inset-0 transition duration-300 ${isOpen ? "bg-black/45" : "bg-black/0"}`}
        onClick={() => void playClose()}
      />

      {/* sheet wrapper */}
      <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-3xl px-4 pb-6">
        <div
          ref={panelRef}
          className="rounded-3xl border border-white/12 bg-white/8 backdrop-blur-xl shadow-[0_30px_120px_rgba(0,0,0,0.55)]"
        >
          <div className="flex items-start justify-between gap-4 px-6 pt-6">
            <div>
              <div className="text-xl font-semibold tracking-tight">{p?.title}</div>
              <div className="mt-1 text-sm text-white/65">{p?.subtitle}</div>
            </div>

            <button
              ref={closeBtnRef}
              onClick={() => void playClose()}
              disabled={animating}
              className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-sm text-white/80 hover:bg-white/12 disabled:opacity-60"
            >
              Close
            </button>
          </div>

          <div className="px-6 pb-6 pt-5">
            <div className="text-sm font-medium text-white/85">Highlights</div>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              {p?.bullets.map((b) => (
                <li key={b} className="leading-relaxed">
                  <span className="mr-2 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-white/60" />
                  {b}
                </li>
              ))}
            </ul>

            <div className="mt-6 text-sm font-medium text-white/85">Stack</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {p?.stack.map((s) => (
                <span key={s} className="rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs text-white/75">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-3 h-1.5 w-20 rounded-full bg-white/20" />
      </div>
    </div>
  );
}
