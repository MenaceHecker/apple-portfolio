"use client";

const GROUPS = [
  {
    title: "Programming",
    items: ["Java", "Python", "TypeScript", "JavaScript", "SQL", "C/C++"],
  },
  {
    title: "Backend & Systems",
    items: ["Spring Boot", "Node.js", "REST APIs", "Microservices", "Async processing"],
  },
  {
    title: "Cloud & Infrastructure",
    items: ["AWS", "Docker", "Kubernetes", "CI/CD", "Serverless"],
  },
  {
    title: "Observability & Reliability",
    items: ["Prometheus", "Grafana", "Elasticsearch", "Kibana", "Alerting"],
  },
  {
    title: "Databases",
    items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Schema design", "Indexing"],
  },
  {
    title: "Security & Tooling",
    items: ["JWT", "OAuth 2.0", "Secure API design", "Git/GitHub", "Agile/Scrum"],
  },
];

export default function Skills() {
  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Technical skills
        </h2>
        <p className="mt-4 text-white/70">
          A production-focused toolset built through real systems and shipped projects.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {GROUPS.map((g) => (
          <div
            key={g.title}
            className="rounded-3xl border border-white/10 bg-white/5 p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-medium text-white/85">{g.title}</div>
              <span className="h-1.5 w-1.5 rounded-full bg-white/35" />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {g.items.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs text-white/65"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
