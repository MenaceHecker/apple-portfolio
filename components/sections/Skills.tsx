export default function Skills() {
  const groups = [
    { name: "Languages", items: ["Python", "TypeScript", "Java", "SQL"] },
    { name: "Cloud", items: ["AWS (Lambda, S3, IAM)", "Docker", "Kubernetes (learning)"] },
    { name: "Observability", items: ["Prometheus", "Grafana", "ELK", "SLOs"] },
    { name: "Web", items: ["Next.js", "React", "Prisma", "PostgreSQL"] },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">Skills</h2>
      <p className="mt-2 max-w-2xl text-sm text-white/60">
        No bars. No fluff. Just the stuff I actually use.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {groups.map((g) => (
          <div key={g.name} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm font-medium">{g.name}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {g.items.map((x) => (
                <span
                  key={x}
                  className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[12px] text-white/70"
                >
                  {x}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
