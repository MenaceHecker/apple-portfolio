"use client";

import { useEffect, useRef } from "react";
import { useSceneState, ProjectId } from "@/components/SceneState";

const PROJECTS: Record<ProjectId, { title: string; subtitle: string; bullets: string[]; stack: string[] }> = {
  nexus: {
    title: "Nexus",
    subtitle: "Distributed observability stack",
    bullets: [
      "SLO-based monitoring with alerts and error budgets",
      "Metrics + logs pipeline with dashboards and drill-downs",
      "Failure simulation to validate resilience",
    ],
    stack: ["Python", "Flask", "Prometheus", "Grafana", "ELK", "PostgreSQL"],
  },
  inboxiq: {
    title: "InboxIQ",
    subtitle: "Intelligent email organizer",
    bullets: [
      "Gmail/Outlook sync with smart categorization",
      "Search + labeling workflows for high-volume inboxes",
      "Auth-first architecture with clean UX flows",
    ],
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
  const { activeProject, setActiveProject } = useSceneState();
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const isOpen = !!activeProject;
  const p = activeProject ? PROJECTS[activeProject] : null;

  useEffect(() => {
    if (!isOpen) return;

    // focus + esc close
    closeBtnRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveProject(null);
    };

    // lock scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, setActiveProject]);

  return (
    <div
      className={`fixed inset-0 z-50 transition ${
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!isOpen}
    >
      {/* scrim */}
      <div
        className={`absolute inset-0 transition duration-300 ${
          isOpen ? "bg-black/45" : "bg-black/0"
        }`}
        onClick={() => setActiveProject(null)}
      />

      {/* sheet */}
      <div
        className={`absolute bottom-0 left-0 right-0 mx-auto max-w-3xl px-4 pb-6 transition duration-500 ${
          isOpen ? "translate-y-0" : "translate-y-8"
        }`}
      >
        <div className="rounded-3xl border border-white/12 bg-white/8 backdrop-blur-xl shadow-[0_30px_120px_rgba(0,0,0,0.55)]">
          <div className="flex items-start justify-between gap-4 px-6 pt-6">
            <div>
              <div className="text-xl font-semibold tracking-tight">{p?.title}</div>
              <div className="mt-1 text-sm text-white/65">{p?.subtitle}</div>
            </div>

            <button
              ref={closeBtnRef}
              onClick={() => setActiveProject(null)}
              className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-sm text-white/80 hover:bg-white/12"
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
                <span
                  key={s}
                  className="rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs text-white/75"
                >
                  {s}
                </span>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <button className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black hover:opacity-90">
                View GitHub
              </button>
              <button className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/80 hover:bg-white/12">
                View Live Demo
              </button>
            </div>
          </div>
        </div>

        {/* home indicator */}
        <div className="mx-auto mt-3 h-1.5 w-20 rounded-full bg-white/20" />
      </div>
    </div>
  );
}
