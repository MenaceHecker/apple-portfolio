"use client";

import { useSceneState } from "@/components/SceneState";

export default function Projects() {
  const { setActiveProject, setHoverProject } = useSceneState();

  const leave = () => setTimeout(() => setHoverProject(null), 80);

  const card =
    "rounded-2xl border border-white/10 bg-white/5 p-6 text-left " +
    "transition duration-300 ease-out hover:bg-white/10 hover:-translate-y-0.5 " +
    "hover:scale-[1.01] active:scale-[0.985] focus-visible:outline-none " +
    "focus-visible:ring-2 focus-visible:ring-white/20";

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">Projects</h2>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <button
          type="button"
          data-project="nexus"
          onClick={() => setActiveProject("nexus")}
          onMouseEnter={() => setHoverProject("nexus")}
          onMouseLeave={leave}
          className={card}
        >
          <div className="font-medium">Nexus</div>
          <div className="mt-2 text-sm text-white/60">
            Distributed observability stack
          </div>
        </button>

        <button
          type="button"
          data-project="inboxiq"
          onClick={() => setActiveProject("inboxiq")}
          onMouseEnter={() => setHoverProject("inboxiq")}
          onMouseLeave={leave}
          className={card}
        >
          <div className="font-medium">InboxIQ</div>
          <div className="mt-2 text-sm text-white/60">
            Intelligent email organizer
          </div>
        </button>

        <button
          type="button"
          data-project="pulseforge"
          onClick={() => setActiveProject("pulseforge")}
          onMouseEnter={() => setHoverProject("pulseforge")}
          onMouseLeave={leave}
          className={card}
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
