"use client";

import { useSceneState } from "@/components/SceneState";

const PRIMARY_PROJECTS = [
  {
    id: "nexus",
    title: "Nexus",
    subtitle: "Distributed observability stack",
  },
  {
    id: "inboxiq",
    title: "InboxIQ",
    subtitle: "Intelligent email organizer",
  },
  {
    id: "pulseforge",
    title: "PulseForge",
    subtitle: "Event-driven backend platform",
  },
] as const;

const SECONDARY_PROJECTS = [
  {
    title: "Mini ML Platform",
    stack: "Python · FastAPI · MLflow · scikit-learn",
    desc:
      "End-to-end ML platform with API-driven training and production inference. MLflow-backed experiment tracking reduced iteration time by ~60% and enabled versioned model rollouts with no-code redeployment.",
  },
  {
    title: "Procuroid",
    stack:
      "Python · Flask · GCP · Google ADK · Supabase · TypeScript · Twilio · ElevenLabs",
    desc:
      "Autonomous multi-agent procurement platform that reduced sourcing cycles by ~90% and accelerated quotation workflows by 10×. Honorable Mention at AI ATL 2025 (Best Use of Google Cloud).",
  },
  {
    title: "movieIt (iOS)",
    stack: "Swift · iOS · MVVM · REST APIs",
    desc:
      "Native iOS movie booking app built with MVVM architecture, reducing feature development time by ~30% through modular UI design while supporting real-time listings, trailers, and bookings.",
  },
  {
    title: "Crumb",
    stack: "React Native · TypeScript · Expo · Supabase · REST APIs",
    desc:
      "Cross-platform social media app serving 500+ users with sub-second real-time feeds, NFC-based friend adding, and 95% push-notification delivery reliability.",
  },
];

export default function Projects() {
  const { setActiveProject, setHoverProject } = useSceneState();

  return (
    <div className="mx-auto max-w-6xl px-6">
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
        Projects
      </h2>
      <p className="mt-4 max-w-2xl text-white/65">
        Selected work across distributed systems, machine learning platforms,
        cloud-native backends, and mobile applications.
      </p>

      {/* Primary / 3D-linked projects */}
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {PRIMARY_PROJECTS.map((p) => (
          <button
            key={p.id}
            onClick={() => setActiveProject(p.id)}
            onMouseEnter={() => setHoverProject(p.id)}
            onMouseLeave={() => setHoverProject(null)}
            className="group rounded-2xl border border-white/10 bg-white/5 p-6 text-left transition hover:bg-white/10"
          >
            <div className="font-medium tracking-tight">{p.title}</div>
            <div className="mt-2 text-sm text-white/60">{p.subtitle}</div>

            <div className="mt-4 text-xs text-white/40 opacity-0 transition group-hover:opacity-100">
              View system
            </div>
          </button>
        ))}
      </div>

      {/* Secondary projects */}
      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {SECONDARY_PROJECTS.map((p) => (
          <div
            key={p.title}
            className="rounded-2xl border border-white/10 bg-white/3 p-6"
          >
            <div className="text-base font-medium tracking-tight">
              {p.title}
            </div>
            <div className="mt-1 text-xs text-white/50">{p.stack}</div>
            <p className="mt-3 text-sm text-white/65 leading-relaxed">
              {p.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
