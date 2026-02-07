"use client";

import { useSceneState } from "@/components/SceneState";
import type { ProjectId } from "@/components/SceneState";

const PROJECTS: {
  id: ProjectId;
  title: string;
  subtitle: string;
  stack: string;
  github: string;
}[] = [
  {
    id: "nexus",
    title: "Nexus",
    subtitle: "Distributed observability stack",
    stack: "Python · Prometheus · Grafana · ELK · Postgres",
    github: "https://github.com/MenaceHecker/nexus",
  },
  {
    id: "inboxiq",
    title: "InboxIQ",
    subtitle: "Intelligent email organizer",
    stack: "Next.js · TypeScript · Prisma · AWS",
    github: "https://github.com/MenaceHecker/inboxiq",
  },
  {
    id: "pulseforge",
    title: "PulseForge",
    subtitle: "Event-driven backend platform",
    stack: "Java · Spring Boot · PostgreSQL · JWT · Async",
    github: "https://github.com/MenaceHecker/pulseforge",
  },
  {
    id: "mini-ml-platform",
    title: "Mini ML Platform",
    subtitle: "End-to-end training + inference with MLflow registry",
    stack: "Python · FastAPI · MLflow · scikit-learn",
    github: "https://github.com/MenaceHecker/mini-ml-platform",
  },
  {
    id: "procuroid",
    title: "Procuroid",
    subtitle: "Autonomous multi-agent procurement platform (AI ATL 2025 HM)",
    stack: "Python · Flask · GCP · Supabase · Twilio · ElevenLabs",
    github: "https://github.com/MenaceHecker/procuroid",
  },
  {
    id: "movieit",
    title: "movieIt (iOS)",
    subtitle: "Swift MVVM movie booking experience",
    stack: "Swift · iOS · MVVM · REST APIs",
    github: "https://github.com/MenaceHecker/movieIt",
  },
  {
    id: "crumb",
    title: "Crumb",
    subtitle: "Realtime social app with NFC-based friend adding",
    stack: "React Native · TypeScript · Expo · Supabase",
    github: "https://github.com/MenaceHecker/crumb",
  },
];

export default function Projects() {
  const { setActiveProject, setHoverProject, setPanelFrom } = useSceneState();

  const leave = () => setTimeout(() => setHoverProject(null), 80);

  const open = (id: ProjectId) => (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setPanelFrom({ left: r.left, top: r.top, width: r.width, height: r.height });
    setActiveProject(id);
  };

  return (
    <div className="mx-auto max-w-6xl px-6">
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Projects</h2>
      <p className="mt-4 max-w-2xl text-white/65">
        Click any project to see its system visualization. GitHub links are on each card.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {PROJECTS.map((p) => (
          <button
            key={p.id}
            type="button"
            data-project={p.id}
            onClick={open(p.id)}
            className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 text-left transition hover:bg-white/10 hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.985]"
          >
            <div className="font-medium tracking-tight">{p.title}</div>
            <div className="mt-2 text-sm text-white/60">{p.subtitle}</div>
            <div className="mt-5 text-xs text-white/45">{p.stack}</div>

            <div className="mt-5 flex items-center gap-3 text-xs text-white/40 opacity-0 transition group-hover:opacity-100">
              <span>View system</span>
              <a
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white"
                onClick={(e) => e.stopPropagation()}
              >
                GitHub
              </a>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
