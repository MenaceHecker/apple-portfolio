"use client";

export default function Hero() {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-28 md:pt-36">
      <div className="max-w-2xl">
        <div className="text-sm text-white/55">Tushar Mishra</div>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
          Software Engineer.
          <span className="block text-white/70">
            Backend systems, cloud platforms, and reliability.
          </span>
        </h1>

        <p className="mt-6 text-base leading-relaxed text-white/65 md:text-lg">
          Software Engineer with experience building
          cloud-native, event-driven systems and internal platforms at scale.
          Strong background in distributed systems, observability, and
          reliability engineering.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="#projects"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black hover:opacity-90"
          >
            View Projects
          </a>

          <a
            href="#experience"
            className="rounded-full border border-white/14 bg-white/6 px-5 py-2.5 text-sm text-white/80 hover:bg-white/10"
          >
            Experience
          </a>

          <a
            href="#contact"
            className="rounded-full border border-white/14 bg-white/6 px-5 py-2.5 text-sm text-white/80 hover:bg-white/10"
          >
            Contact
          </a>
        </div>

        <div className="mt-10 flex flex-wrap gap-2 text-xs text-white/55">
          <span className="rounded-full border border-white/12 bg-white/5 px-3 py-1">
            B.S. Computer Science — GPA 3.67
          </span>
          <span className="rounded-full border border-white/12 bg-white/5 px-3 py-1">
            Platform & Backend Engineering
          </span>
          <span className="rounded-full border border-white/12 bg-white/5 px-3 py-1">
            AWS • Kubernetes • Observability
          </span>
        </div>
      </div>
    </div>
  );
}
