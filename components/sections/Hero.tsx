"use client";

export default function Hero() {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-28 md:pt-36">
      <div className="max-w-2xl">
        <div className="text-sm text-white/55">Tushar Mishra</div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
          3D portfolio
          <span className="block text-white/70">Built for clarity, speed, and impact.</span>
        </h1>

        <p className="mt-6 text-base leading-relaxed text-white/65 md:text-lg">
          Software Engineer with a strong backend + cloud foundation. I build production-grade systems
          with clean UX and reliability-first engineering.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="#projects"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black hover:opacity-90"
          >
            View Projects
          </a>

          <a
            href="#contact"
            className="rounded-full border border-white/14 bg-white/6 px-5 py-2.5 text-sm text-white/80 hover:bg-white/10"
          >
            Contact
          </a>

          <a
            href="#experience"
            className="rounded-full border border-white/14 bg-white/6 px-5 py-2.5 text-sm text-white/80 hover:bg-white/10"
          >
            Experience
          </a>
        </div>

        <div className="mt-10 flex flex-wrap gap-2 text-xs text-white/55">
          <span className="rounded-full border border-white/12 bg-white/5 px-3 py-1">F-1 OPT</span>
          <span className="rounded-full border border-white/12 bg-white/5 px-3 py-1">AWS • Cloud-native</span>
          <span className="rounded-full border border-white/12 bg-white/5 px-3 py-1">Backend • Systems</span>
        </div>
      </div>
    </div>
  );
}
