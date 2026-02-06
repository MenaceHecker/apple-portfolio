"use client";

import { useEffect, useMemo, useRef } from "react";
import { useSceneState } from "@/components/SceneState";
import type { ProjectId } from "@/components/SceneState";

type ProjectInfo = {
  title: string;
  subtitle: string;
  bullets: string[];
  stack: string[];
  github: string;
};

const PROJECTS: Record<ProjectId, ProjectInfo> = {
  nexus: {
    title: "Nexus",
    subtitle: "Distributed observability stack with SLO-driven monitoring.",
    bullets: [
      "SLO dashboards and error budgets to prioritize reliability work.",
      "Prometheus + Grafana metrics pipeline with alerting foundations.",
      "Log aggregation workflow designed for fast root-cause analysis.",
    ],
    stack: ["Python", "Prometheus", "Grafana", "ELK", "Postgres"],
    github: "https://github.com/MenaceHecker/nexus",
  },

  inboxiq: {
    title: "InboxIQ",
    subtitle: "Email organizer with Gmail/Outlook integrations.",
    bullets: [
      "Unified inbox categorization with search-first UX.",
      "OAuth-based provider integrations for secure access.",
      "Productivity-focused flows designed for speed and clarity.",
    ],
    stack: ["Next.js", "TypeScript", "Prisma", "AWS"],
    github: "https://github.com/MenaceHecker/inboxiq",
  },

  pulseforge: {
    title: "PulseForge",
    subtitle: "Event-driven backend platform for reliable async processing.",
    bullets: [
      "Asynchronous event ingestion and background processing pipeline.",
      "Retry logic, idempotency, and failure handling for resilience.",
      "JWT-based auth with role-based access control.",
    ],
    stack: ["Java", "Spring Boot", "PostgreSQL", "JWT", "Async"],
    github: "https://github.com/MenaceHecker/pulseforge",
  },

  "mini-ml-platform": {
    title: "Mini ML Platform",
    subtitle: "API-driven training + inference with MLflow tracking/registry.",
    bullets: [
      "API-driven training and production inference workflows.",
      "MLflow-based tracking + registry for versioned model rollouts.",
      "Built for fast iteration with reproducible experiments.",
    ],
    stack: ["Python", "FastAPI", "MLflow", "scikit-learn"],
    github: "https://github.com/MenaceHecker/mini-ml-platform",
  },

  procuroid: {
    title: "Procuroid",
    subtitle: "Autonomous procurement platform (AI ATL 2025 Honorable Mention).",
    bullets: [
      "Multi-agent workflow to compress sourcing and quotation cycles.",
      "Cloud-first orchestration with real-time communication hooks.",
      "Designed for extensibility: tools, agents, and integrations.",
    ],
    stack: ["Python", "Flask", "GCP", "Supabase", "TypeScript", "Twilio", "ElevenLabs"],
    github: "https://github.com/MenaceHecker/procuroid",
  },

  movieit: {
    title: "movieIt (iOS)",
    subtitle: "Swift MVVM app for real-time listings, trailers, and bookings.",
    bullets: [
      "MVVM architecture for clean separation and faster iteration.",
      "Real-time listings + trailers with API-driven screens.",
      "Modular UI structure to keep features easy to extend.",
    ],
    stack: ["Swift", "iOS", "MVVM", "REST APIs"],
    github: "https://github.com/MenaceHecker/movieIt",
  },

  crumb: {
    title: "Crumb",
    subtitle: "Cross-platform social app with realtime feeds + NFC add.",
    bullets: [
      "Realtime feed experience designed for sub-second updates.",
      "NFC-based friend adding flow for in-person onboarding.",
      "Push notification pipeline designed for high delivery reliability.",
    ],
    stack: ["React Native", "TypeScript", "Expo", "Supabase", "REST APIs"],
    github: "https://github.com/MenaceHecker/crumb",
  },
};

export default function ProjectPanel() {
  const { activeProject, setActiveProject } = useSceneState();

  // ✅ Hooks must always run: never put hooks after an early return
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const p = useMemo(() => {
    if (!activeProject) return null;
    return PROJECTS[activeProject];
  }, [activeProject]);

  useEffect(() => {
    if (!activeProject) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveProject(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeProject, setActiveProject]);

  useEffect(() => {
    if (!activeProject) return;
    closeBtnRef.current?.focus();
  }, [activeProject]);

  if (!activeProject || !p) return null;

  return (
    <div className="fixed inset-0 z-30 pointer-events-auto">
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-md"
        onClick={() => setActiveProject(null)}
      />

      <div className="absolute inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center">
        <div className="mx-auto w-full md:max-w-2xl">
          <div className="rounded-t-3xl md:rounded-3xl border border-white/10 bg-zinc-950/80 p-6 md:p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xl font-semibold tracking-tight">{p.title}</div>
                <div className="mt-1 text-sm text-white/60">{p.subtitle}</div>
              </div>

              <button
                ref={closeBtnRef}
                onClick={() => setActiveProject(null)}
                className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-xs text-white/50">Highlights</div>
                <ul className="mt-3 space-y-2 text-sm text-white/75">
                  {p.bullets.map((b) => (
                    <li key={b}>
                      <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-white/60" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-xs text-white/50">Stack</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs text-white/70"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <a
                  href={p.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
                >
                  GitHub →
                </a>
              </div>
            </div>

            <div className="mt-6 text-xs text-white/45">
              Tip: press <span className="text-white/70">Esc</span> to close.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
