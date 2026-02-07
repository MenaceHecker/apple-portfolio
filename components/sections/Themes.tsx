"use client";

const THEMES = [
  {
    title: "Reliability at scale",
    desc: "Monitoring, retries, graceful degradation, and failure isolation built in from day one.",
    chips: ["SLOs", "Error budgets", "Resilience"],
  },
  {
    title: "Cloud-native by default",
    desc: "Event-driven and container-first systems designed for elasticity, cost, and clean ops.",
    chips: ["AWS", "Kubernetes", "Serverless"],
  },
  {
    title: "Operational visibility",
    desc: "Metrics, logs, and traces that reduce MTTR and make systems understandable under pressure.",
    chips: ["Prometheus", "Grafana", "ELK"],
  },
  {
    title: "Clean internal tooling",
    desc: "Internal platforms that remove toil, standardize workflows, and scale across teams.",
    chips: ["Automation", "DX", "Platform"],
  },
];

export default function Themes() {
  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Engineering principles
        </h2>
        <p className="mt-4 text-white/70">
          The ideas that guide how I design, build, and maintain production systems.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {THEMES.map((t) => (
          <div
            key={t.title}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/7"
          >
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-white/55" />
              <div>
                <div className="text-base font-medium tracking-tight">
                  {t.title}
                </div>
                <div className="mt-2 text-sm leading-relaxed text-white/70">
                  {t.desc}
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {t.chips.map((c) => (
                    <span
                      key={c}
                      className="rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs text-white/60"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
