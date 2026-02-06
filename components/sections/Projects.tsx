"use client";

import { useSceneState } from "@/components/SceneState";

export default function Projects() {
  const { setActiveProject, setHoverProject } = useSceneState();

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">Projects</h2>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <button
  onClick={() => setActiveProject("nexus")}
  onMouseEnter={() => setHoverProject("nexus")}
  onMouseLeave={() => {
    setTimeout(() => setHoverProject(null), 80);
  }}
  className="
    rounded-2xl
    border border-white/10
    bg-white/5
    p-6
    text-left
    transition
    duration-300
    ease-out
    hover:bg-white/10
    hover:-translate-y-0.5
    hover:scale-[1.01]
    active:scale-[0.985]
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-white/20
  "
>
  <div className="font-medium">Nexus</div>
  <div className="mt-2 text-sm text-white/60">
    Distributed Observability Stack
  </div>
</button>


        <button
  onClick={() => setActiveProject("inboxiq")}
  onMouseEnter={() => setHoverProject("inboxiq")}
  onMouseLeave={() => {
    setTimeout(() => setHoverProject(null), 80);
  }}
  className="
    rounded-2xl
    border border-white/10
    bg-white/5
    p-6
    text-left
    transition
    duration-300
    ease-out
    hover:bg-white/10
    hover:-translate-y-0.5
    hover:scale-[1.01]
    active:scale-[0.985]
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-white/20
  "
>
  <div className="font-medium">InboxIQ</div>
  <div className="mt-2 text-sm text-white/60">
    Intelligent Email Organizer
  </div>
</button>


        <button
  onClick={() => setActiveProject("pulseforge")}
  onMouseEnter={() => setHoverProject("pulseforge")}
  onMouseLeave={() => {
    setTimeout(() => setHoverProject(null), 80);
  }}
  className="
    rounded-2xl
    border border-white/10
    bg-white/5
    p-6
    text-left
    transition
    duration-300
    ease-out
    hover:bg-white/10
    hover:-translate-y-0.5
    hover:scale-[1.01]
    active:scale-[0.985]
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-white/20
  "
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
