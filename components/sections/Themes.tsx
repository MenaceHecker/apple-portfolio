export default function Themes() {
  const items = [
    { title: "Reliability", desc: "SLO-first thinking, error budgets, graceful failure." },
    { title: "Observability", desc: "Metrics, traces, logs — dashboards that answer real questions." },
    { title: "Performance", desc: "Fast by default. Measure, then optimize." },
    { title: "Security", desc: "Least privilege, secure defaults, practical hardening." },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">Engineering themes</h2>
      <p className="mt-2 max-w-2xl text-sm text-white/60">
        A small set of principles I try to apply across every system.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {items.map((x) => (
          <div
            key={x.title}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <div className="text-sm font-medium">{x.title}</div>
            <div className="mt-2 text-sm text-white/60">{x.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
