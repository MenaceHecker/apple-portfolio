"use client";

import { useEffect, useRef } from "react";
import { useSceneState } from "@/components/SceneState";

const PROJECTS = {
  nexus: {
    title: "Nexus",
    summary: "Distributed observability stack with SLO-based monitoring.",
    bullets: [
      "SLO dashboards and error budgets",
      "Prometheus + Grafana metrics pipeline",
      "Log aggregation and root-cause analysis",
    ],
    stack: ["Python", "Prometheus", "Grafana", "ELK", "Postgres"],
  },

  inboxiq: {
    title: "InboxIQ",
    summary: "Email organizer with Gmail/Outlook integrations.",
    bullets: [
      "Unified inbox categorization",
      "OAuth-based provider integrations",
      "Search-first, productivity-focused UX",
    ],
    stack: ["Next.js", "TypeScript", "Prisma", "AWS"],
  },

  pulseforge: {
    title: "PulseForge",
    summary: "Event-driven backend platform for reliable async processing.",
    bullets: [
      "Asynchronous event ingestion and processing",
      "Retry logic, idempotency, and failure handling",
      "JWT-based auth with role-based access control",
    ],
    stack: ["Java", "Spring Boot", "PostgreSQL", "JWT", "Async"],
  },
} as const;

export default function ProjectPanel() {
  const { activeProject, setActiveProject } = useSceneState();

  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!activeProject) return;

    closeBtnRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveProject(null);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeProject, setActiveProject]);

  if (!activeProject) return null;

  const p = PROJECTS[activeProject];

  return (
    <div className="fixed inset-0 z-30">
      {/* Backdrop */}
      <button
        aria-label="Close panel"
        onClick={() => setActiveProject(null)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Panel */}
      <aside className="absolute right-0 top-0 h-full w-full max-w-md border-l border-white/10 bg-black/80 p-6 backdrop-blur-xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{p.title}</h3>
            <p className="mt-2 text-sm text-white/60">{p.summary}</p>
          </div>

          <button
            ref={closeBtnRef}
            onClick={() => setActiveProject(null)}
            className="rounded-full border border-white/10 px-3 py-1 text-xs hover:bg-white/10"
          >
            Close
          </button>
        </div>

        <ul className="mt-6 space-y-2 text-sm text-white/70">
          {p.bullets.map((b) => (
            <li key={b}>• {b}</li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-2">
          {p.stack.map((s) => (
            <span
              key={s}
              className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70"
            >
              {s}
            </span>
          ))}
        </div>
      </aside>
    </div>
  );
}
