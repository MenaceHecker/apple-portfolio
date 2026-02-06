"use client";

const THEMES = [
  {
    title: "Reliability first",
    desc: "SLOs, monitoring, failure modes, and predictable behavior under load.",
  },
  {
    title: "Simple interfaces",
    desc: "Minimal UI. Clear information hierarchy. Zero clutter.",
  },
  {
    title: "Fast feedback loops",
    desc: "Instrumented systems, tight iteration, and strong developer ergonomics.",
  },
  {
    title: "Security-minded",
    desc: "Least privilege, auditability, and practical defense-in-depth.",
  },
];

export default function Themes() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Design themes</h2>
        <p className="mt-4 text-white/65">
          The rules I use to ship work that’s production-ready, readable, and memorable.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {THEMES.map((t) => (
          <div
            key={t.title}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
          >
            <div className="text-base font-medium tracking-tight">{t.title}</div>
            <div className="mt-2 text-sm leading-relaxed text-white/65">{t.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
