"use client";

const GROUPS = [
  {
    title: "Programming",
    items: ["Java", "Python", "JavaScript", "TypeScript", "SQL", "C/C++"],
  },
  {
    title: "Backend & Systems",
    items: [
      "Spring Boot",
      "Node.js",
      "REST APIs",
      "GraphQL",
      "Microservices",
      "Async processing",
    ],
  },
  {
    title: "Cloud & Infrastructure",
    items: [
      "AWS (Lambda, EC2)",
      "Docker",
      "Kubernetes",
      "Serverless architectures",
      "CI/CD",
    ],
  },
  {
    title: "Observability & Reliability",
    items: [
      "Prometheus",
      "Grafana",
      "Elasticsearch",
      "Kibana",
      "Logging & alerting",
    ],
  },
  {
    title: "Databases",
    items: [
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Redis",
      "Schema design",
      "Indexing",
    ],
  },
  {
    title: "Security & Tooling",
    items: [
      "JWT",
      "OAuth 2.0",
      "Secure API design",
      "Git & GitHub",
      "Agile/Scrum",
    ],
  },
];

export default function Skills() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Technical skills
        </h2>
        <p className="mt-4 text-white/65">
          A practical, production-focused toolset built through real systems.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {GROUPS.map((g) => (
          <div
            key={g.title}
            className="rounded-3xl border border-white/10 bg-white/5 p-6"
          >
            <div className="text-sm font-medium text-white/85">{g.title}</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {g.items.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs text-white/70"
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
