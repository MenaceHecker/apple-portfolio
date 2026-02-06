"use client";

const THEMES = [
  {
    title: "Reliability at scale",
    desc: "Designing systems with monitoring, health checks, retries, and failover as first-class concerns.",
  },
  {
    title: "Cloud-native by default",
    desc: "Event-driven, containerized, and serverless architectures built for elasticity and cost efficiency.",
  },
  {
    title: "Operational visibility",
    desc: "Strong observability using Prometheus, Grafana, Elasticsearch, and Kibana to reduce MTTR.",
  },
  {
    title: "Clean internal tooling",
    desc: "Internal platforms that reduce manual work, improve reliability, and scale across teams.",
  },
];

export default function Themes() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Engineering principles
        </h2>
        <p className="mt-4 text-white/65">
          The ideas that guide how I design, build, and maintain production systems.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {THEMES.map((t) => (
          <div
            key={t.title}
            className="rounded-3xl border border-white/10 bg-white/5 p-6"
          >
            <div className="text-base font-medium tracking-tight">{t.title}</div>
            <div className="mt-2 text-sm leading-relaxed text-white/65">
              {t.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
