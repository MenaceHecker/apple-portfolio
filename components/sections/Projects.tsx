"use client";

import { useSceneState } from "@/components/SceneState";

export default function Projects() {
  const { setActiveProject } = useSceneState();

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">Projects</h2>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <button
          onClick={() => setActiveProject("nexus")}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left hover:bg-white/10"
        >
          <div className="font-medium">Nexus</div>
          <div className="mt-2 text-sm text-white/60">
            Distributed observability stack
          </div>
        </button>

        <button
          onClick={() => setActiveProject("inboxiq")}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left hover:bg-white/10"
        >
          <div className="font-medium">InboxIQ</div>
          <div className="mt-2 text-sm text-white/60">
            Intelligent email organizer
          </div>
        </button>

        <button
          onClick={() => setActiveProject("pulseforge")}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left hover:bg-white/10"
        >
          <div className="font-medium">PulseForge</div>
          <div className="mt-2 text-sm text-white/60">
            Event-driven backend platform
          </div>
        </button>
      </div>
    </div>
  );
}
