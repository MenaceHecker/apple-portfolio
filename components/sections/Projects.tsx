export default function Projects() {
  const projects = [
    {
      name: "Nexus",
      oneLiner: "Distributed observability stack with SLO-based monitoring.",
      tags: ["Python", "Prometheus", "Grafana", "ELK", "Postgres"],
    },
    {
      name: "InboxIQ",
      oneLiner: "Email organizer with smart triage + Gmail/Outlook integration.",
      tags: ["Next.js", "Prisma", "AWS", "Elastic"],
    },
    {
      name: "PulseForge",
      oneLiner: "Event-driven backend platform built with Spring Boot",
      tags: ["Java", "Spring Boot", "AWS"],
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">Projects</h2>
      <p className="mt-2 max-w-2xl text-sm text-white/60">
        A curated set of work I’d happily defend in an interview.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {projects.map((p) => (
          <div
            key={p.name}
            className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/7"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">{p.name}</div>
              <div className="text-xs text-white/40 group-hover:text-white/60">
                Open →
              </div>
            </div>

            <div className="mt-2 text-sm text-white/60">{p.oneLiner}</div>

            <div className="mt-4 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[11px] text-white/70"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-xs text-white/40">
        Next: project click will trigger the 3D “exploded architecture” view.
      </div>
    </div>
  );
}
