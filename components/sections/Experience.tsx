"use client";

const EXPERIENCE = [
  {
    role: "IT Engineer",
    org: "Georgia Institute of Technology",
    time: "Aug 2025 — Present",
    tags: ["Platform automation", "Internal tooling", "Reliability", "Systems"],
  },
  {
    role: "Software Engineer Intern",
    org: "CRST International",
    time: "Jun 2024 — Aug 2024",
    tags: ["Cloud services", "Microservices", "Observability", "Kubernetes"],
  },
  {
    role: "Lead Undergraduate Research Assistant",
    org: "LSDIS Lab — University of Georgia",
    time: "Jan 2024 — May 2024",
    tags: ["ML systems", "Graph models", "AWS serverless", "Data engineering"],
  },
];

export default function Experience() {
  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Experience
        </h2>
        <p className="mt-4 text-white/70">
          Selected roles across platform engineering, cloud systems, and research.
        </p>
      </div>

      <div className="mt-10 space-y-3">
        {EXPERIENCE.map((e) => (
          <div
            key={`${e.role}-${e.org}`}
            className="rounded-3xl border border-white/10 bg-white/5 p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-base font-medium tracking-tight">
                  {e.role}
                </div>
                <div className="mt-1 text-sm text-white/65">{e.org}</div>
              </div>

              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/55">
                {e.time}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {e.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs text-white/65"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
