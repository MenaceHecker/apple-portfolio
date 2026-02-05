export default function Experience() {
  const roles = [
    {
      title: "Software Engineer (Platform Automation)",
      org: "Georgia Tech",
      time: "Aug 2025 — Present",
      points: [
        "Automation services to provision and manage lab environments at scale.",
        "Internal tooling integrating identity/auth + system configuration.",
        "Monitoring + service health checks for reliability.",
      ],
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">Experience</h2>
      <div className="mt-10 space-y-4">
        {roles.map((r) => (
          <div key={r.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <div className="text-sm font-medium">{r.title}</div>
                <div className="mt-1 text-sm text-white/60">{r.org}</div>
              </div>
              <div className="text-xs text-white/40">{r.time}</div>
            </div>

            <ul className="mt-4 space-y-2 text-sm text-white/60">
              {r.points.map((x) => (
                <li key={x} className="leading-relaxed">
                  {x}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
